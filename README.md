# AI Pill Counter - Jetson Orin Pro (ARM64)

A next-generation industrial pill counting application designed for transparent tray systems, optimized for NVIDIA Jetson Orin.

## Features
- **AI-Powered Detection:** Real-time pill segmentation at 25+ FPS.
- **Anomaly Highlighting:**
  - **Yellow:** Highlights broken or inconsistent pills.
  - **Red:** Highlights pills that do not match the majority type (different color/shape).
- **Interactive Calibration:** Uses ArUco markers to map camera view to screen highlights.
- **Modes:** Quick Count, Standard Count (Target-based), and Integrated (Session-based).
- **Standalone API:** REST and WebSocket endpoints for external integration.

## Installation (Jetson Orin / Ubuntu ARM64)

### 1. Prerequisites
Ensure you have JetPack 5.x or 6.x installed with Node.js 18+ and Python 3.10+.

### 2. Backend Setup (Python)
- cd backend
- python3 -m venv venv
- source venv/bin/activate
- pip install -r requirements.txt
- # To run the backend separately:
- python3 main.py

### 3. Frontend Setup (Next.js + Electron)
- cd frontend
- npm install
- # For development:
- npm run dev
- # For Electron development:
- npm run electron-dev

### 4. Build for Production (ARM64)
To package the app as an ARM64 executable for the Jetson:
- cd frontend
- npm run build-arm64

The resulting executable will be in the 'frontend/dist' directory.

## Hardware Configuration
- **Camera:** Connect an industrial USB camera (UVC compatible).
- **Scanner:** Connect a USB bottle/barcode scanner.
- **Tray:** Place the transparent tray over the landscape display.
- **Calibration:** Launch the app and select "Calibrate" mode. Ensure the camera sees all 4 ArUco markers on the screen corners.

## Standalone API
- **WebSocket:** ws://localhost:8000/ws (Real-time detection stream)
- **Current Count:** GET http://localhost:8000/api/current_count
