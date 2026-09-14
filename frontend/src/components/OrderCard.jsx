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
    <div className="rounded-3xl glass-card border border-white/15 p-5 sm:p-7 shadow-glass-lg space-y-6 relative overflow-hidden">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="p-0.5 rounded-2xl bg-gradient-to-tr from-brand-500 via-neon-rose to-amber-500">
            <img
              src={
                partner.profileImage ||
                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80'
              }
              alt={partner.restaurantName}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-cosmic-950"
            />
          </div>
          <div>
            <h3 className="text-base font-black text-white">
              {partner.restaurantName || 'Restaurant Kitchen'}
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="font-mono text-neon-rose font-bold">#{order.orderNumber}</span>
              <span>•</span>
              <span>{formatDate(order.createdAt)}</span>
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="self-start sm:self-auto">
          <span
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm ${statusInfo.bg}`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-ping" />
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Cyberpunk Live Status Progression Stepper */}
      {!isCancelled ? (
        <div className="py-3 px-2">
          <div className="grid grid-cols-5 gap-1 relative">
            {/* Background connection track */}
            <div className="absolute top-4 left-6 right-6 h-1 bg-white/10 -z-0 rounded-full" />
            
            {/* Animated Glowing Progress Beam */}
            <div
              className="absolute top-4 left-6 h-1 bg-gradient-to-r from-brand-500 via-neon-rose to-neon-emerald rounded-full transition-all duration-700 shadow-neon-rose -z-0"
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
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-tr from-brand-600 to-neon-rose text-white shadow-neon-rose scale-115 border border-white/40 ring-4 ring-brand-500/20'
                        : isCompleted
                        ? 'bg-emerald-500 text-slate-950 shadow-neon-emerald border border-emerald-400'
                        : 'glass-dock text-slate-500 border border-white/10'
                    }`}
                  >
                    <Icon size={15} />
                  </div>
                  <span
                    className={`text-[10px] mt-2 font-black leading-tight ${
                      isCurrent
                        ? 'text-neon-rose'
                        : isCompleted
                        ? 'text-slate-200'
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
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-400 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>This order was cancelled.</span>
        </div>
      )}

      {/* Ordered Items List */}
      <div className="space-y-2.5 py-1">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
          Ordered Dishes
        </h4>
        <div className="space-y-2">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs text-slate-200 p-2.5 rounded-2xl glass-dock border border-white/5"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="w-5 h-5 rounded-lg bg-neon-rose/20 text-neon-rose flex items-center justify-center text-[10px] font-black shrink-0 border border-neon-rose/30">
                  {item.quantity}x
                </span>
                <span className="truncate font-semibold">{item.name}</span>
              </div>
              <span className="font-black text-white shrink-0 ml-2">
                {formatCurrency(item.subtotal)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Address & Bill Summary */}
      <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400">
        <div>
          <span className="font-bold text-slate-300 block mb-1 flex items-center gap-1.5">
            <MapPin size={13} className="text-neon-rose" />
            Delivery Address
          </span>
          <p className="line-clamp-2 text-slate-300">
            {order.deliveryAddress?.address}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Recipient: {order.deliveryAddress?.name} ({order.deliveryAddress?.phone})
          </p>
        </div>

        <div className="sm:text-right space-y-1.5">
          <div className="flex justify-between sm:justify-end gap-3">
            <span>Payment:</span>
            <span className="text-slate-200 font-bold">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between sm:justify-end gap-3 text-sm font-black text-white pt-1">
            <span>Total Paid:</span>
            <span className="text-neon-emerald text-lg drop-shadow-[0_0_10px_rgba(0,245,155,0.4)]">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
