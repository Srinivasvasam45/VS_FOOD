import React from 'react';
import {
  Package,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Truck,
  ChefHat,
  Sparkles,
} from 'lucide-react';
import { formatCurrency, formatDate, getOrderStatusBadge } from '../utils/formatters';

const statusSteps = [
  { key: 'pending', label: 'Placed', icon: Package },
  { key: 'accepted', label: 'Accepted', icon: CheckCircle2 },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'outForDelivery', label: 'On the Way', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Sparkles },
];

const OrderCard = ({ order }) => {
  const statusInfo = getOrderStatusBadge(order.orderStatus);
  const partner = order.foodPartner || {};
  const isCancelled = order.orderStatus === 'cancelled';

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800/80 p-5 sm:p-6 shadow-xl space-y-5">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img
            src={
              partner.profileImage ||
              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80'
            }
            alt={partner.restaurantName}
            className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shrink-0"
          />
          <div>
            <h3 className="text-base font-bold text-white">
              {partner.restaurantName || 'Restaurant'}
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span className="font-mono text-slate-300">#{order.orderNumber}</span>
              <span>•</span>
              <span>{formatDate(order.createdAt)}</span>
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="self-start sm:self-auto">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusInfo.bg}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Live Status Progression Stepper (If not cancelled) */}
      {!isCancelled ? (
        <div className="py-2">
          <div className="grid grid-cols-5 gap-1 relative">
            {/* Background connection track */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-800 -z-0" />
            <div
              className="absolute top-4 left-6 h-0.5 bg-brand-500 transition-all duration-500 -z-0"
              style={{
                width: `${(Math.max(0, statusInfo.stepIndex) / 4) * 100}%`,
              }}
            />

            {statusSteps.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = statusInfo.stepIndex >= idx;
              const isCurrent = statusInfo.stepIndex === idx;

              return (
                <div key={step.key} className="flex flex-col items-center text-center z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-brand-600 text-white ring-4 ring-brand-500/20 shadow-lg shadow-brand-500/40 scale-110'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    <Icon size={14} />
                  </div>
                  <span
                    className={`text-[10px] mt-1.5 font-semibold leading-tight ${
                      isCurrent
                        ? 'text-brand-400 font-bold'
                        : isCompleted
                        ? 'text-slate-300'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>This order was cancelled.</span>
        </div>
      )}

      {/* Ordered Items List */}
      <div className="space-y-2 py-1">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Items Ordered
        </h4>
        <div className="space-y-2">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs text-slate-200 py-1"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-[10px] font-bold text-brand-400 shrink-0">
                  {item.quantity}x
                </span>
                <span className="truncate">{item.name}</span>
              </div>
              <span className="font-semibold text-white shrink-0 ml-2">
                {formatCurrency(item.subtotal)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Address & Bill Summary */}
      <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
        <div>
          <span className="font-semibold text-slate-300 block mb-1 flex items-center gap-1">
            <MapPin size={12} className="text-brand-500" />
            Delivery Address
          </span>
          <p className="line-clamp-2">
            {order.deliveryAddress?.address}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Recipient: {order.deliveryAddress?.name} ({order.deliveryAddress?.phone})
          </p>
        </div>

        <div className="sm:text-right space-y-1">
          <div className="flex justify-between sm:justify-end gap-3">
            <span>Payment:</span>
            <span className="text-slate-200 font-semibold">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between sm:justify-end gap-3 text-sm font-black text-white pt-1">
            <span>Total Paid:</span>
            <span className="text-emerald-400">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
