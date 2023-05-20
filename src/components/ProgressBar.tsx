import React from 'react';

interface ProgressBarProps {
  color: string;
  label: string;
  value: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ color, label, value }) => {
  const progressWidth = `${value}%`;

  return (
    <div className="mt-5 w-96">
      <span className="mr-2">{label}</span>
      <svg className="h-4 w-96 bg-gray-200 rounded mt-2">
        <rect
          fill={color}
          width={progressWidth}
          height="100%"
        />
      </svg>
    </div>
  );
};

export default ProgressBar;
