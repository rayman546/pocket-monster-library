
import React from 'react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = "Loading" }) => {
  return (
    <div className="flex flex-col items-center justify-center h-60 w-full">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary/20"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
      </div>
      <p className="text-muted-foreground">
        {message}
        <span className="loading-dot ml-1"></span>
        <span className="loading-dot ml-1"></span>
        <span className="loading-dot ml-1"></span>
      </p>
    </div>
  );
};

export default LoadingState;
