import React, { useState, useEffect } from 'react';
import {
  ReceiptText,
  Clock,
  CheckCircle2,
  ChefHat,
  Truck,
  AlertCircle,
  RefreshCw,
  MapPin,
  Phone,
  Sparkles,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatCurrency, formatDate, getOrderStatusBadge } from '../../utils/formatters';
import LoadingSpinner from '../../components/LoadingSpinner';

const PartnerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getPartnerOrders();
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to load partner orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await orderService.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, orderStatus: newStatus } : o
          )
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders =
    filterStatus === 'all'
      ? orders
      : orders.filter((o) => o.orderStatus === filterStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ReceiptText size={24} className="text-amber-400" />
            <span>Kitchen Order Fulfillment</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Accept incoming orders and transition dishes through kitchen prep to dispatch
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-3 rounded-2xl glass-action-btn text-slate-300 hover:text-white transition-all shadow-glass self-start sm:self-auto"
          title="Refresh orders"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: 'All Orders' },
          { id: 'pending', label: '⏳ Pending' },
          { id: 'accepted', label: '✅ Accepted' },
          { id: 'preparing', label: '👨‍🍳 Preparing' },
          { id: 'outForDelivery', label: '🛵 On the Way' },
          { id: 'delivered', label: '🎉 Delivered' },
          { id: 'cancelled', label: '❌ Cancelled' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${
              filterStatus === tab.id
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-neon-amber font-black scale-105'
                : 'glass-pill text-slate-300 hover:border-white/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-24 flex justify-center">
          <LoadingSpinner size="lg" message="Loading kitchen orders..." />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 rounded-3xl glass-card border border-white/10 text-center space-y-3 max-w-md mx-auto my-12 shadow-glass">
          <ReceiptText size={36} className="mx-auto text-slate-600" />
          <h3 className="text-base font-black text-white">No Orders Found</h3>
          <p className="text-xs text-slate-400">
            No orders match the current status filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const badge = getOrderStatusBadge(order.orderStatus);

            return (
              <div
                key={order._id}
                className="p-6 rounded-3xl glass-card border border-white/10 shadow-glass space-y-5"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black text-amber-400">
                      #{order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-black self-start sm:self-auto ${badge.bg}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Customer Info & Ordered Items */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left: Customer Delivery Details */}
                  <div className="md:col-span-4 space-y-2 text-xs">
                    <span className="font-black text-slate-300 uppercase tracking-wider block text-[10px]">
                      Customer Details
                    </span>
                    <p className="font-bold text-white text-sm">
                      {order.deliveryAddress?.name}
                    </p>
                    <p className="text-slate-300 flex items-center gap-1.5">
                      <Phone size={13} className="text-neon-emerald" />
                      <span>{order.deliveryAddress?.phone}</span>
                    </p>
                    <p className="text-slate-400 flex items-start gap-1.5 mt-1">
                      <MapPin size={13} className="text-neon-rose shrink-0 mt-0.5" />
                      <span>
                        {order.deliveryAddress?.address}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
                      </span>
                    </p>
                  </div>

                  {/* Center: Dishes List */}
                  <div className="md:col-span-5 space-y-2">
                    <span className="font-black text-slate-300 uppercase tracking-wider block text-[10px]">
                      Items ({order.items.length})
                    </span>
                    <div className="space-y-1.5">
                      {order.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs p-2 rounded-xl glass-dock border border-white/5"
                        >
                          <span className="text-slate-200 font-semibold truncate">
                            {it.quantity}x {it.name}
                          </span>
                          <span className="font-bold text-white shrink-0 ml-2">
                            {formatCurrency(it.subtotal)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Bill & Action Pipeline */}
                  <div className="md:col-span-3 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="font-black text-slate-400 uppercase tracking-wider block text-[10px]">
                        Grand Total
                      </span>
                      <span className="text-xl font-black text-neon-emerald">
                        {formatCurrency(order.totalAmount)}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {order.paymentMethod}
                      </p>
                    </div>

                    {/* Action Step Transitions */}
                    <div className="space-y-1.5">
                      {order.orderStatus === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(order._id, 'accepted')}
                          disabled={updatingId === order._id}
                          className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-colors"
                        >
                          Accept Order
                        </button>
                      )}

                      {order.orderStatus === 'accepted' && (
                        <button
                          onClick={() => handleStatusChange(order._id, 'preparing')}
                          disabled={updatingId === order._id}
                          className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ChefHat size={14} />
                          <span>Start Kitchen Prep</span>
                        </button>
                      )}

                      {order.orderStatus === 'preparing' && (
                        <button
                          onClick={() => handleStatusChange(order._id, 'outForDelivery')}
                          disabled={updatingId === order._id}
                          className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Truck size={14} />
                          <span>Dispatch for Delivery</span>
                        </button>
                      )}

                      {order.orderStatus === 'outForDelivery' && (
                        <button
                          onClick={() => handleStatusChange(order._id, 'delivered')}
                          disabled={updatingId === order._id}
                          className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-colors flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 size={14} />
                          <span>Mark as Delivered</span>
                        </button>
                      )}

                      {!['delivered', 'cancelled'].includes(order.orderStatus) && (
                        <button
                          onClick={() => handleStatusChange(order._id, 'cancelled')}
                          disabled={updatingId === order._id}
                          className="w-full py-1.5 px-3 rounded-xl text-rose-400 hover:bg-rose-500/10 text-[11px] font-bold transition-colors"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PartnerOrders;
