import React from 'react';
import { AlertTriangle, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ConflictModal = () => {
  const { conflictModal, resolveConflict } = useCart();

  if (!conflictModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cosmic-950/85 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl glass-card border border-amber-500/30 p-6 sm:p-8 shadow-glass-lg overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-neon-amber">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">Different Restaurant</h3>
            <p className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">Single Kitchen Cart Policy</p>
          </div>
        </div>

        <div className="space-y-3.5 mb-6">
          <p className="text-xs text-slate-300 leading-relaxed">
            Your cart currently contains dishes from{' '}
            <span className="font-bold text-amber-300">
              {conflictModal.currentRestaurant || 'another kitchen'}
            </span>
            .
          </p>
          <div className="p-4 rounded-2xl glass-dock border border-white/10 text-xs text-slate-300 leading-relaxed shadow-glass">
            Would you like to clear your current cart and start a new meal order from{' '}
            <span className="font-black text-neon-rose">
              {conflictModal.newRestaurant || 'this restaurant'}
            </span>
            ?
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => resolveConflict(false)}
            className="px-4 py-3.5 rounded-2xl glass-pill hover:border-white/20 text-slate-300 text-xs font-bold transition-all"
          >
            Keep Current
          </button>
          <button
            type="button"
            onClick={() => resolveConflict(true)}
            className="px-4 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-neon-rose text-white text-xs font-black flex items-center justify-center gap-2 shadow-neon-rose transition-all active:scale-95"
          >
            <Trash2 size={15} />
            <span>Clear & Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConflictModal;
