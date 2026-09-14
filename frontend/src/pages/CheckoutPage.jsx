import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  User,
  ShieldCheck,
  CreditCard,
  Banknote,
  ArrowLeft,
  CheckCircle2,
  Store,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { formatCurrency, getFoodTypeBadge } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, restaurant, subtotal, deliveryFee, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: 'Hyderabad',
    pincode: '',
    paymentMethod: 'Cash on Delivery',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4 rounded-3xl glass-card border border-white/10 p-8 shadow-glass">
        <h2 className="text-xl font-black text-white">Your Cart is Empty</h2>
        <p className="text-xs text-slate-400">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-neon-rose text-white text-xs font-black shadow-neon-rose"
        >
          Explore Food Reels
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.pincode.trim()
    ) {
      setError('Please fill in all delivery address fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const orderPayload = {
        deliveryAddress: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
        },
        paymentMethod: formData.paymentMethod,
      };

      const res = await orderService.createOrder(orderPayload);

      if (res.success && res.data) {
        setOrderSuccess(res.data);
      } else {
        setError(res.message || 'Failed to place order.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error while placing order.');
    } finally {
      setLoading(false);
    }
  };

  // Order Confirmed Success Screen
  if (orderSuccess) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-center space-y-6 animate-fade-in">
        <div className="relative w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-neon-emerald mx-auto shadow-neon-emerald">
          <CheckCircle2 size={48} className="animate-bounce" />
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Order Placed Successfully! 🎉
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Your hot meal is now being prepared in the kitchen.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/15 text-left space-y-4 shadow-glass-lg">
          <div className="flex justify-between items-center text-xs pb-3 border-b border-white/10">
            <span className="text-slate-400">Order Reference</span>
            <span className="font-mono font-black text-white">
              #{orderSuccess.orderNumber}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs pb-3 border-b border-white/10">
            <span className="text-slate-400">Restaurant</span>
            <span className="font-black text-neon-rose">
              {orderSuccess.foodPartner?.restaurantName}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs pb-3 border-b border-white/10">
            <span className="text-slate-400">Payment Method</span>
            <span className="font-black text-neon-amber">
              {orderSuccess.paymentMethod} (Pending on Delivery)
            </span>
          </div>

          <div className="flex justify-between items-center text-sm font-black pt-1">
            <span className="text-white">Total Amount</span>
            <span className="text-neon-emerald text-xl drop-shadow-[0_0_10px_rgba(0,245,155,0.4)]">
              {formatCurrency(orderSuccess.totalAmount)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link
            to="/orders"
            className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-600 to-neon-rose hover:opacity-95 text-white text-xs font-black transition-all shadow-neon-rose"
          >
            Track Order Status
          </Link>
          <Link
            to="/"
            className="py-3.5 px-4 rounded-2xl glass-pill hover:border-white/20 text-slate-200 text-xs font-bold transition-all"
          >
            Back to Reels Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-black text-slate-400 hover:text-white mb-6 transition-colors glass-pill px-4 py-2 rounded-2xl border border-white/10"
      >
        <ArrowLeft size={16} />
        <span>Continue Browsing Food Reels</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Delivery Address & Payment Method */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/15 shadow-glass-lg space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-brand-600/20 text-neon-rose border border-brand-500/30 shadow-neon-rose">
                <MapPin size={20} />
              </div>
              <h2 className="text-lg font-black text-white tracking-tight">Delivery Address</h2>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-400">
                {error}
              </div>
            )}

            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-rose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-rose"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Complete Delivery Address *
                </label>
                <textarea
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Flat / House No., Building Name, Street / Landmark..."
                  className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-rose resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-rose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Pincode / Postal Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    placeholder="500034"
                    className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-rose"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Payment Method Selector */}
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/15 shadow-glass-lg space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-neon-emerald border border-emerald-500/30 shadow-neon-emerald">
                <Banknote size={20} />
              </div>
              <h2 className="text-lg font-black text-white tracking-tight">Payment Method</h2>
            </div>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-4 sm:p-5 rounded-2xl glass-dock border border-brand-500/60 shadow-neon-rose cursor-pointer">
                <div className="flex items-center gap-3.5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={formData.paymentMethod === 'Cash on Delivery'}
                    onChange={handleChange}
                    className="accent-neon-rose w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-black text-white block">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Pay safely at your doorstep with Cash or UPI
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-neon-emerald border border-emerald-500/30">
                  Active
                </span>
              </label>

              <label className="flex items-center justify-between p-4 sm:p-5 rounded-2xl glass-dock border border-white/5 opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-3.5">
                  <input type="radio" disabled className="accent-brand-500" />
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">
                      Online Payment (UPI, Cards, Netbanking)
                    </span>
                    <span className="text-[10px] text-slate-500">Coming soon in next update</span>
                  </div>
                </div>
                <CreditCard size={18} className="text-slate-500" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary: Cart Snapshot & Place Order Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/15 shadow-glass-lg space-y-5 sticky top-24">
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <h2 className="text-lg font-black text-white tracking-tight">Order Summary</h2>
              {restaurant && (
                <span className="text-xs text-neon-rose font-black truncate max-w-[160px]">
                  {restaurant.restaurantName}
                </span>
              )}
            </div>

            {/* Items */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-white/5">
              {items.map((item) => {
                const food = item.food || {};
                const badge = getFoodTypeBadge(food.foodType);

                return (
                  <div key={item._id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <div
                        className={`w-3 h-3 rounded-sm border ${badge.border} flex items-center justify-center p-0.5 shrink-0`}
                      >
                        <div className={`w-1 h-1 rounded-full ${badge.dot}`} />
                      </div>
                      <span className="font-bold text-slate-200 truncate">
                        {item.quantity}x {food.name}
                      </span>
                    </div>
                    <span className="font-black text-white shrink-0 ml-2">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bill Details */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-slate-200 font-bold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery Partner Fee</span>
                <span className="text-slate-200 font-bold">{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between text-base font-black text-white">
                <span>Grand Total</span>
                <span className="text-neon-emerald text-xl drop-shadow-[0_0_10px_rgba(0,245,155,0.4)]">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-rose-500 to-neon-rose hover:opacity-95 disabled:opacity-50 text-white text-xs font-black flex items-center justify-center gap-2 shadow-neon-rose transition-all active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Place Order • {formatCurrency(totalAmount)}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
