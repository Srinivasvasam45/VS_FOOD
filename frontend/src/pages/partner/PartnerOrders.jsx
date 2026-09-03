import React, { useState, useEffect } from 'react';
import {
  ReceiptText,
  Clock,
  CheckCircle2,
  ChefHat,
  Truck,
  XCircle,
  MapPin,
  Phone,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatCurrency, formatDate, getOrderStatusBadge } from '../../utils/formatters';
import LoadingSpinner from '../../components/LoadingSpinner';

const statuses = [
  { id: 'all', label: 'All Orders' },
  { id: 'pending', label: 'Pending' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'outForDelivery', label: 'Out for Delivery' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

const PartnerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getPartnerOrders(
        selectedStatus === 'all' ? '' : selectedStatus
      );
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch restaurant orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await orderService.updateOrderStatus(orderId, newStatus);
      if (res.success && res.data) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.data : o))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ReceiptText size={24} className="text-amber-400" />
            <span>Manage Kitchen Orders</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Accept incoming orders, update kitchen preparation stages, and dispatch meals
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors self-start sm:self-auto"
          title="Refresh orders"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {statuses.map((st) => (
          <button
            key={st.id}
            onClick={() => setSelectedStatus(st.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedStatus === st.id
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-24 flex justify-center">
          <LoadingSpinner size="lg" message="Loading restaurant orders..." />
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3 max-w-md mx-auto my-12">
          <ReceiptText size={40} className="mx-auto text-slate-600" />
          <h3 className="text-lg font-bold text-white">No Orders Found</h3>
          <p className="text-xs text-slate-400">
            {selectedStatus === 'all'
              ? 'No incoming orders yet.'
              : `No orders currently in '${selectedStatus}' state.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const badge = getOrderStatusBadge(order.orderStatus);
            const isUpdating = updatingId === order._id;

            return (
              <div
                key={order._id}
                className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4"
              >
                {/* Top Info Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-white">
                      #{order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-sm font-black text-emerald-400">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Items & Customer Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Items list */}
                  <div className="md:col-span-7 space-y-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Order Items
                    </span>
                    <div className="space-y-1.5 divide-y divide-slate-800/60">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="pt-1.5 first:pt-0 flex items-center justify-between text-xs"
                        >
                          <span className="text-white font-medium">
                            <span className="text-amber-400 font-bold mr-1.5">
                              {item.quantity}x
                            </span>
                            {item.name}
                          </span>
                          <span className="text-slate-300 font-semibold">
                            {formatCurrency(item.subtotal)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer details */}
                  <div className="md:col-span-5 p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-slate-300 block">
                      Customer & Delivery Address
                    </span>
                    <p className="text-slate-200 font-semibold">
                      {order.deliveryAddress?.name}
                    </p>
                    <p className="text-slate-400 flex items-center gap-1.5">
                      <Phone size={12} className="text-amber-400" />
                      <span>{order.deliveryAddress?.phone}</span>
                    </p>
                    <p className="text-slate-400 flex items-start gap-1.5">
                      <MapPin size={12} className="text-brand-500 shrink-0 mt-0.5" />
                      <span>
                        {order.deliveryAddress?.address}, {order.deliveryAddress?.city} -{' '}
                        {order.deliveryAddress?.pincode}
                      </span>
                    </p>
                    <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
                      <span>Payment: {order.paymentMethod}</span>
                      <span className="capitalize font-bold text-amber-300">
                        Status: {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Action Buttons (Pipeline transitions) */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
                  <div className="text-xs text-slate-500">
                    Order state pipeline transition
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {order.orderStatus === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'accepted')}
                          disabled={isUpdating}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all"
                        >
                          Accept Order
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                          disabled={isUpdating}
                          className="px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 text-xs font-bold transition-all"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {order.orderStatus === 'accepted' && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'preparing')}
                        disabled={isUpdating}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <ChefHat size={14} />
                        <span>Start Preparing</span>
                      </button>
                    )}

                    {order.orderStatus === 'preparing' && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'outForDelivery')}
                        disabled={isUpdating}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <Truck size={14} />
                        <span>Send Out for Delivery</span>
                      </button>
                    )}

                    {order.orderStatus === 'outForDelivery' && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'delivered')}
                        disabled={isUpdating}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <CheckCircle2 size={14} />
                        <span>Mark Delivered</span>
                      </button>
                    )}

                    {['delivered', 'cancelled'].includes(order.orderStatus) && (
                      <span className="text-xs text-slate-500 font-semibold italic">
                        Order Completed
                      </span>
                    )}
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
