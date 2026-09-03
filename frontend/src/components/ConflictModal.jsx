import React from 'react';
import { AlertTriangle, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ConflictModal = () => {
  const { conflictModal, resolveConflict } = useCart();

  if (!conflictModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Different Restaurant</h3>
            <p className="text-xs text-slate-400">Single Restaurant Policy</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-slate-300 leading-relaxed">
            Your cart already contains items from{' '}
            <span className="font-semibold text-amber-300">
              {conflictModal.currentRestaurant || 'another restaurant'}
            </span>
            .
          </p>
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            Would you like to clear your current cart and add this delicious item from{' '}
            <span className="font-semibold text-brand-400">
              {conflictModal.newRestaurant || 'this restaurant'}
            </span>
            ?
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => resolveConflict(false)}
            className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
          >
            Keep Current Cart
          </button>
          <button
            type="button"
            onClick={() => resolveConflict(true)}
            className="px-4 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-colors"
          >
            <Trash2 size={16} />
            <span>Clear & Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConflictModal;
