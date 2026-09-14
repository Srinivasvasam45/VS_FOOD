import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ReceiptText, ShoppingBag, RefreshCw, Flame, Sparkles } from 'lucide-react';
import { orderService } from '../services/orderService';
import OrderCard from '../components/OrderCard';
import LoadingSpinner from '../components/LoadingSpinner';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getUserOrders();
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const activeOrders = orders.filter(
    (o) => !['delivered', 'cancelled'].includes(o.orderStatus)
  );
  const pastOrders = orders.filter((o) =>
    ['delivered', 'cancelled'].includes(o.orderStatus)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <ReceiptText size={28} className="text-neon-rose" />
            <span>My Orders</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your live meal preparations and revisit past orders
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-3 rounded-2xl glass-action-btn text-slate-300 hover:text-white transition-all shadow-glass hover:scale-105 active:scale-95"
          title="Refresh orders"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <LoadingSpinner size="lg" message="Retrieving your orders..." />
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center space-y-4 rounded-3xl glass-card border border-white/10 p-8 max-w-md mx-auto shadow-glass">
          <div className="w-16 h-16 rounded-3xl glass-dock flex items-center justify-center text-slate-500 mx-auto border border-white/10 shadow-glass">
            <ShoppingBag size={32} />
          </div>
          <h3 className="text-lg font-black text-white">No Orders Yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            You haven't placed any food orders yet. Start discovering delicious video reels right now!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-neon-rose text-white text-xs font-black transition-all shadow-neon-rose active:scale-95"
          >
            <Flame size={16} />
            <span>Discover Food Reels</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Orders */}
          {activeOrders.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-black text-neon-rose uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-rose animate-ping" />
                <span>Active Orders in Progress ({activeOrders.length})</span>
              </h2>
              <div className="space-y-5">
                {activeOrders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            </div>
          )}

          {/* Past Orders */}
          {pastOrders.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Past Completed Orders ({pastOrders.length})
              </h2>
              <div className="space-y-5">
                {pastOrders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
