import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Loading delicious reels...', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-14 h-14 border-4',
    xl: 'w-18 h-18 border-4',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="relative flex items-center justify-center">
        {/* Ambient Ring Glow */}
        <div className="absolute inset-0 rounded-full bg-neon-rose/30 blur-xl animate-pulse" />
        <div
          className={`${sizeClasses[size]} border-white/10 border-t-neon-rose border-r-neon-amber rounded-full animate-spin shadow-neon-rose`}
        />
      </div>
      {message && <p className="text-xs font-bold text-slate-300 animate-pulse tracking-wide">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-cosmic-950/85 backdrop-blur-xl z-50 flex items-center justify-center animate-fade-in">
        <div className="p-8 rounded-3xl glass-dock border border-white/15 shadow-glass-lg">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
