import cv2
import numpy as np
import asyncio
import json
from fastapi import FastAPI, WebSocket, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import time
from sklearn.cluster import DBSCAN
import threading

app = FastAPI()

class CalibrationPoint(BaseModel):
    id: int
    x: float
    y: float

class CalibrationRequest(BaseModel):
    markers: List[CalibrationPoint]

class PillDetector:
    def __init__(self):
        self.cap = None
        self.homography = None
        self.last_results = []
        self.is_calibrated = False
        self.latest_frame = None
        self.frame_lock = threading.Lock()
        self.is_running = False
        self.capture_thread = None

    def start_camera(self, index=0):
        self.cap = cv2.VideoCapture(index)
        if not self.cap.isOpened():
            print(f"Error: Could not open camera {index}.")
            return False
        self.is_running = True
        self.capture_thread = threading.Thread(target=self._capture_loop, daemon=True)
        self.capture_thread.start()
        return True

    def _capture_loop(self):
        while self.is_running:
            ret, frame = self.cap.read()
            if ret:
                with self.frame_lock:
                    self.latest_frame = frame.copy()
            else:
                time.sleep(0.1)

    def get_frame(self):
        with self.frame_lock:
            return self.latest_frame.copy() if self.latest_frame is not None else None

    def set_homography(self, src_pts, dst_pts):
        self.homography, _ = cv2.findHomography(np.array(src_pts), np.array(dst_pts))
        self.is_calibrated = True

    def transform_point(self, x, y):
        if self.homography is None:
            return x, y
        pt = np.array([[[x, y]]], dtype=np.float32)
        dst_pt = cv2.perspectiveTransform(pt, self.homography)
        return float(dst_pt[0][0][0]), float(dst_pt[0][0][1])

    def detect_aruco(self, frame):
        aruco_dict = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_50)
        parameters = cv2.aruco.DetectorParameters()
        detector = cv2.aruco.ArucoDetector(aruco_dict, parameters)
        corners, ids, rejected = detector.detectMarkers(frame)
        return corners, ids

    def process_frame(self, frame):
        if frame is None: return []
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (5, 5), 0)
        _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        kernel = np.ones((5,5), np.uint8)
        thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        detections = []
        features = []

        for i, cnt in enumerate(contours):
            area = cv2.contourArea(cnt)
            if area < 200: continue
            x, y, w, h = cv2.boundingRect(cnt)
            mask = np.zeros(gray.shape, np.uint8)
            cv2.drawContours(mask, [cnt], 0, 255, -1)
            mean_hsv = cv2.mean(hsv, mask=mask)[:3]
            perimeter = cv2.arcLength(cnt, True)
            circularity = (4 * np.pi * area) / (perimeter**2) if perimeter > 0 else 0
            aspect_ratio = float(w)/h if h > 0 else 0

            sx, sy = self.transform_point(x, y)
            sw, sh = self.transform_point(x + w, y + h)
            sw -= sx
            sh -= sy

            detections.append({
                "id": i,
                "bbox": [x, y, w, h],
                "screen_bbox": [sx, sy, sw, sh],
                "area": area,
                "color": mean_hsv,
                "circularity": circularity,
                "status": "normal"
            })
            features.append([
                mean_hsv[0]/180.0, mean_hsv[1]/255.0, mean_hsv[2]/255.0,
                circularity, aspect_ratio, np.log10(area)
            ])

        if not detections: return []

        if len(features) >= 3:
            features_array = np.array(features)
            db = DBSCAN(eps=0.15, min_samples=2).fit(features_array)
            labels = db.labels_
            unique_labels, counts = np.unique(labels[labels != -1], return_counts=True)
            if len(unique_labels) > 0:
                majority_label = unique_labels[np.argmax(counts)]
                majority_features = features_array[labels == majority_label]
                mean_area = np.mean(majority_features[:, 5])
                std_area = np.std(majority_features[:, 5])
                for i, label in enumerate(labels):
                    if label == majority_label:
                        if features_array[i, 5] < mean_area - 2 * std_area:
                            detections[i]["status"] = "yellow"
                        else:
                            detections[i]["status"] = "normal"
                    elif label == -1:
                        detections[i]["status"] = "red"
                    else:
                        detections[i]["status"] = "red"
        else:
            for d in detections: d["status"] = "normal"
        return detections

detector = PillDetector()

@app.on_event("startup")
async def startup_event():
    # Attempt to start camera on launch
    detector.start_camera(0)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            frame = detector.get_frame()
            if frame is None:
                await asyncio.sleep(0.1)
                continue
            results = detector.process_frame(frame)
            detector.last_results = results
            await websocket.send_json({
                "count": len(results),
                "pills": results,
                "is_calibrated": detector.is_calibrated,
                "timestamp": time.time()
            })
            await asyncio.sleep(0.04)
    except Exception as e:
        print(f"WS Error: {e}")
    finally:
        await websocket.close()

@app.post("/calibrate")
async def calibrate(req: CalibrationRequest):
    frame = detector.get_frame()
    if frame is None:
        raise HTTPException(status_code=503, detail="Camera not available")

    corners, ids = detector.detect_aruco(frame)
    if ids is None or len(ids) < 4:
        return {"status": "error", "message": f"Could not see enough markers. Found: {len(ids) if ids is not None else 0}"}

    src_pts = []
    dst_pts = []
    marker_map = {m.id: (m.x, m.y) for m in req.markers}
    for i, marker_id in enumerate(ids.flatten()):
        if marker_id in marker_map:
            center = np.mean(corners[i][0], axis=0)
            src_pts.append(center)
            dst_pts.append(marker_map[marker_id])

    if len(src_pts) >= 4:
        detector.set_homography(src_pts, dst_pts)
        return {"status": "success"}
    else:
        return {"status": "error", "message": "Calibration points mismatch"}

@app.get("/api/current_count")
async def get_current_count():
    return {"count": len(detector.last_results), "timestamp": time.time()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
