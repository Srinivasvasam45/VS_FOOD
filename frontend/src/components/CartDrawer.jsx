import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Store,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency, getFoodTypeBadge } from '../utils/formatters';

const CartDrawer = () => {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    items,
    restaurant,
    subtotal,
    deliveryFee,
    totalAmount,
    updateQuantity,
    removeItem,
    clearCart,
    loading,
  } = useCart();

  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleCheckoutClick = () => {
    setIsDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-cosmic-950/80 backdrop-blur-md animate-fade-in">
      {/* Overlay Backdrop */}
      <div
        className="fixed inset-0"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative z-10 w-full max-w-md h-full glass-dock border-l border-white/15 flex flex-col shadow-glass-lg overflow-hidden bg-cosmic-900/95">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-600/20 text-neon-rose border border-brand-500/30 shadow-neon-rose">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">Your Cart</h2>
              <p className="text-[11px] text-slate-400">
                {items.length} {items.length === 1 ? 'dish selected' : 'dishes selected'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 rounded-full glass-action-btn text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Restaurant Header Banner */}
        {restaurant && items.length > 0 && (
          <div className="px-5 py-3 bg-cosmic-950/60 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <Store size={15} className="text-neon-rose shrink-0" />
              <span className="text-xs font-black text-slate-200 truncate">
                {restaurant.restaurantName}
              </span>
            </div>
            <button
              onClick={clearCart}
              className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 shrink-0"
            >
              <Trash2 size={12} />
              <span>Clear Cart</span>
            </button>
          </div>
        )}

        {/* Items List / Empty State */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-white/5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl glass-dock flex items-center justify-center text-slate-500 border border-white/10 shadow-glass">
                <ShoppingBag size={32} />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Your cart is empty</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[220px] leading-relaxed">
                  Explore hot food reels and add delicious items to get started!
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-neon-rose text-white text-xs font-black transition-all shadow-neon-rose active:scale-95"
              >
                Discover Food Reels
              </button>
            </div>
          ) : (
            items.map((item) => {
              const food = item.food || {};
              const badge = getFoodTypeBadge(food.foodType);

              return (
                <div key={item._id} className="pt-4 first:pt-0 flex gap-3.5 items-center">
                  {/* Thumbnail */}
                  <img
                    src={
                      food.thumbnailUrl ||
                      food.imageUrl ||
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'
                    }
                    alt={food.name}
                    className="w-16 h-16 rounded-2xl object-cover bg-cosmic-950 shrink-0 border border-white/10 shadow-sm"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div
                        className={`w-3 h-3 rounded-sm border ${badge.border} flex items-center justify-center p-0.5`}
                      >
                        <div className={`w-1 h-1 rounded-full ${badge.dot}`} />
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">{food.name}</h4>
                    </div>

                    <p className="text-xs font-black text-neon-emerald">
                      {formatCurrency(food.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="inline-flex items-center rounded-xl glass-dock border border-white/10 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(food._id, item.quantity - 1)}
                          className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="px-2.5 text-xs font-black text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(food._id, item.quantity + 1)}
                          className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(food._id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-white">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Checkout Summary */}
        {items.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-white/10 bg-cosmic-950/80 space-y-4 shadow-glass-lg">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Item Subtotal</span>
                <span className="text-slate-200 font-bold">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery Partner Fee</span>
                <span className="text-slate-200 font-bold">
                  {formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-black text-white">
                <span>To Pay</span>
                <span className="text-neon-emerald text-lg drop-shadow-[0_0_10px_rgba(0,245,155,0.4)]">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-300 glass-dock p-2.5 rounded-2xl border border-white/10">
              <ShieldCheck size={14} className="text-neon-emerald shrink-0" />
              <span>Prices verified directly with real-time restaurant menu.</span>
            </div>

            <button
              onClick={handleCheckoutClick}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-rose-500 to-neon-rose hover:opacity-95 text-white text-xs font-black flex items-center justify-center gap-2 shadow-neon-rose transition-all active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
