import React from 'react';

interface LoadingSpinnerProps {
  width?: string;  // Tailwind width class, e.g., "w-16"
  height?: string; // Tailwind height class, e.g., "h-16"
  color?: string;  // Tailwind border color class, e.g., "border-blue-500"
}

const Loader: React.FC<LoadingSpinnerProps> = ({
  width = 'w-16',
  height = 'h-16',
  color = 'border-blue-500',
}) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`${width} ${height} border-4 ${color} rounded-full border-t-transparent animate-spin`}
      ></div>
    </div>
  );
};

export default Loader;
