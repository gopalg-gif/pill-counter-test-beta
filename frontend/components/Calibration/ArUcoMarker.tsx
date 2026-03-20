import React from 'react';

interface ArUcoMarkerProps {
  id: number;
  size?: number;
  className?: string;
}

const ArUcoMarker: React.FC<ArUcoMarkerProps> = ({ id, size = 100, className }) => {
  // Hardcoded patterns for DICT_4X4_50 (IDs 0-3)
  // 1 = Black, 0 = White. Each is a 6x6 grid including the black border.
  const markers: { [key: number]: number[][] } = {
    0: [
      [1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 1, 1],
      [1, 1, 0, 0, 1, 1],
      [1, 1, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1],
    ],
    1: [
      [1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 1, 1],
      [1, 0, 1, 1, 0, 1],
      [1, 1, 1, 0, 1, 1],
      [1, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1],
    ],
    2: [
      [1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 1],
      [1, 0, 1, 0, 0, 1],
      [1, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
    ],
    3: [
      [1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 1, 1],
      [1, 0, 1, 1, 1, 1],
      [1, 0, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
    ],
  };

  const pattern = markers[id] || markers[0];

  return (
    <div className={`bg-white p-2 flex flex-col items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <div className="grid grid-cols-6 w-full h-full bg-black border-2 border-black">
        {pattern.flat().map((bit, i) => (
          <div key={i} className={`w-full h-full ${bit === 1 ? 'bg-black' : 'bg-white'}`} />
        ))}
      </div>
      <div className="text-[10px] font-bold text-black mt-1">ID {id}</div>
    </div>
  );
};

export default ArUcoMarker;
