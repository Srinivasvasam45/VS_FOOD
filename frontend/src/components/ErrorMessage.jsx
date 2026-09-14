import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl glass-card border border-rose-500/30 text-center space-y-4 shadow-glass-lg animate-fade-in max-w-md mx-auto relative overflow-hidden">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-neon-rose">
        <AlertCircle size={28} />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-black text-white tracking-tight">System Notice</h3>
        <p className="text-xs text-rose-300/90 leading-relaxed">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/30 transition-all active:scale-95"
        >
          <RefreshCw size={14} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
