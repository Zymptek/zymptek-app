import React from 'react';

export const Loading = ({ size = 'lg' }) => {

  const sizeClasses : any = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex justify-center items-center min-h-screen mt-0">
    <div 
      className={`${sizeClasses[size]} border-4 border-brand-200 border-t-transparent rounded-full animate-spin`}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  </div>
  );
};