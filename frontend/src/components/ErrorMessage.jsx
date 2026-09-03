import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message = 'Something went wrong.', onRetry, className = '' }) => {
  return (
    <div
      className={`p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
        <AlertCircle size={24} />
      </div>
      <p className="text-slate-200 font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors shadow-lg shadow-rose-900/20"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
