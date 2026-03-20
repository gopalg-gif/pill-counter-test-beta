import React from 'react';

interface PillMarkerProps {
  x: number;
  y: number;
  w: number;
  h: number;
  status: 'normal' | 'yellow' | 'red';
  onClick?: () => void;
}

const PillMarker: React.FC<PillMarkerProps> = ({ x, y, w, h, status, onClick }) => {
  const borderColor = status === 'normal' ? 'border-green-400' : status === 'yellow' ? 'border-yellow-400' : 'border-red-500';
  const bgColor = status === 'normal' ? 'bg-green-400/20' : status === 'yellow' ? 'bg-yellow-400/30' : 'bg-red-500/30';

  return (
    <div
      className={`absolute border-4 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${borderColor} ${bgColor}`}
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
      }}
      onClick={onClick}
    >
      {status !== 'normal' && (
        <div className={`w-3 h-3 rounded-full ${status === 'yellow' ? 'bg-yellow-500' : 'bg-red-600'}`} />
      )}
    </div>
  );
};

export default PillMarker;
