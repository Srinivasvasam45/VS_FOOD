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
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      {/* Overlay Backdrop */}
      <div
        className="fixed inset-0"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative z-10 w-full max-w-md h-full bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Your Cart</h2>
              <p className="text-xs text-slate-400">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Restaurant Header */}
        {restaurant && items.length > 0 && (
          <div className="px-5 py-3 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <Store size={16} className="text-brand-400 shrink-0" />
              <span className="text-xs font-bold text-slate-200 truncate">
                {restaurant.restaurantName}
              </span>
            </div>
            <button
              onClick={clearCart}
              className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 shrink-0"
            >
              <Trash2 size={12} />
              <span>Clear Cart</span>
            </button>
          </div>
        )}

        {/* Items List / Empty State */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-800/60">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-800/80 flex items-center justify-center text-slate-500">
                <ShoppingBag size={32} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Your cart is empty</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
                  Explore hot food reels and add delicious items to get started!
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md shadow-brand-600/30"
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
                    className="w-16 h-16 rounded-2xl object-cover bg-slate-950 shrink-0 border border-slate-700"
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

                    <p className="text-xs font-black text-emerald-400">
                      {formatCurrency(food.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="inline-flex items-center rounded-xl bg-slate-800 border border-slate-700 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(food._id, item.quantity - 1)}
                          className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(food._id, item.quantity + 1)}
                          className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(food._id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={14} />
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
          <div className="p-5 border-t border-slate-800 bg-slate-900/90 space-y-3.5">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Item Subtotal</span>
                <span className="text-slate-200 font-semibold">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery Partner Fee</span>
                <span className="text-slate-200 font-semibold">
                  {formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black text-white">
                <span>To Pay</span>
                <span className="text-emerald-400 text-base">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-800/40 p-2 rounded-xl border border-slate-800">
              <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
              <span>Prices verified directly from live restaurant menu.</span>
            </div>

            <button
              onClick={handleCheckoutClick}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all active:scale-[0.98]"
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
