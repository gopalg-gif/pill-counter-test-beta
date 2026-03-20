import React, { useState } from 'react';
import ArUcoMarker from './Calibration/ArUcoMarker';

interface CalibrationViewProps {
  onComplete: () => void;
}

const CalibrationView: React.FC<CalibrationViewProps> = ({ onComplete }) => {
  const [status, setStatus] = useState<string>('Ready to Calibrate');
  const [isCalibrating, setIsCalibrating] = useState(false);

  const startCalibration = async () => {
    setIsCalibrating(true);
    setStatus('Detecting markers via camera...');

    const markers = [
      { id: 0, x: 0, y: 0 },
      { id: 1, x: 1920, y: 0 },
      { id: 2, x: 1920, y: 1080 * 0.8 },
      { id: 3, x: 0, y: 1080 * 0.8 },
    ];

    try {
      const response = await fetch('http://localhost:8000/calibrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markers }),
      });
      const data = await response.json();

      if (data.status === 'success') {
        setStatus('Calibration Successful!');
        setTimeout(onComplete, 1500);
      } else {
        setStatus(`Error: ${data.message}`);
      }
    } catch (e) {
      setStatus('Could not connect to AI Backend');
    } finally {
      setIsCalibrating(false);
    }
  };

  return (
    <div className="relative w-full h-[80vh] bg-black/80 flex flex-col items-center justify-center text-white p-10">
      <ArUcoMarker id={0} className="absolute top-4 left-4 border-2 border-dashed border-white" />
      <ArUcoMarker id={1} className="absolute top-4 right-4 border-2 border-dashed border-white" />
      <ArUcoMarker id={2} className="absolute bottom-4 right-4 border-2 border-dashed border-white" />
      <ArUcoMarker id={3} className="absolute bottom-4 left-4 border-2 border-dashed border-white" />

      <div className="text-center z-10 max-w-lg bg-gray-900/90 p-8 rounded-xl border-2 border-blue-500">
        <h2 className="text-3xl font-bold mb-4">Screen-Tray Calibration</h2>
        <p className="mb-6 opacity-80">
          Ensure the tray is empty and the camera can see all 4 markers in the corners.
        </p>
        <div className="mb-8 text-xl font-mono text-blue-400">{status}</div>
        <button
          onClick={startCalibration}
          disabled={isCalibrating}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-8 py-4 rounded-full font-bold text-xl transition-all"
        >
          {isCalibrating ? 'Calibrating...' : 'START CALIBRATION'}
        </button>
      </div>
    </div>
  );
};

export default CalibrationView;
