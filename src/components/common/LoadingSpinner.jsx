import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '', text = '' }) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: 'spinner',
    lg: 'spinner-lg'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={sizeClasses[size]}></div>
      {text && <span className="ml-2 text-sm text-gray-600">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
