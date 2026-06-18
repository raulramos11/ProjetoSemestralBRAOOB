import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', label = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg',
  };

  return (
    <div className="loading-spinner-container" role="status" aria-live="polite">
      <div className={`spinner ${sizeClasses[size]}`} aria-hidden="true" />
      {label && <span className="spinner-label">{label}</span>}
    </div>
  );
};

export default LoadingSpinner;