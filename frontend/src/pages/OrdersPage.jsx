import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ReceiptText, ShoppingBag, RefreshCw, Flame } from 'lucide-react';
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
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ReceiptText size={28} className="text-brand-500" />
            <span>My Orders</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your active meals and review past cravings
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          title="Refresh orders"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <LoadingSpinner size="lg" message="Loading your order history..." />
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <ShoppingBag size={32} />
          </div>
          <h3 className="text-lg font-bold text-white">No Orders Yet</h3>
          <p className="text-xs text-slate-400">
            You haven't placed any food orders yet. Start exploring delicious video reels!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-lg shadow-brand-600/30"
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
              <h2 className="text-sm font-bold text-brand-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                <span>Active Orders in Progress ({activeOrders.length})</span>
              </h2>
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            </div>
          )}

          {/* Past Orders */}
          {pastOrders.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                Past Orders ({pastOrders.length})
              </h2>
              <div className="space-y-4">
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
