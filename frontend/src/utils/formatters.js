/**
 * Formats price in Indian Rupees (₹)
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats date string to friendly format
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Returns badge color classes for food type
 */
export const getFoodTypeBadge = (foodType) => {
  switch (foodType) {
    case 'veg':
      return {
        label: 'Pure Veg',
        border: 'border-emerald-500',
        dot: 'bg-emerald-500',
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
      };
    case 'nonVeg':
      return {
        label: 'Non-Veg',
        border: 'border-rose-600',
        dot: 'bg-rose-600',
        text: 'text-rose-400',
        bg: 'bg-rose-500/10',
      };
    case 'egg':
      return {
        label: 'Contains Egg',
        border: 'border-amber-500',
        dot: 'bg-amber-500',
        text: 'text-amber-400',
        bg: 'bg-amber-500/10',
      };
    default:
      return {
        label: foodType,
        border: 'border-slate-500',
        dot: 'bg-slate-400',
        text: 'text-slate-300',
        bg: 'bg-slate-500/10',
      };
  }
};

/**
 * Returns order status display styling and readable label
 */
export const getOrderStatusBadge = (status) => {
  switch (status) {
    case 'pending':
      return {
        label: 'Order Placed',
        bg: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
        stepIndex: 0,
      };
    case 'accepted':
      return {
        label: 'Order Accepted',
        bg: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
        stepIndex: 1,
      };
    case 'preparing':
      return {
        label: 'Kitchen Preparing',
        bg: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
        stepIndex: 2,
      };
    case 'outForDelivery':
      return {
        label: 'Out for Delivery',
        bg: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
        stepIndex: 3,
      };
    case 'delivered':
      return {
        label: 'Delivered',
        bg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
        stepIndex: 4,
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        bg: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
        stepIndex: -1,
      };
    default:
      return {
        label: status,
        bg: 'bg-slate-700 text-slate-200',
        stepIndex: 0,
      };
  }
};

export const formatDistance = (distanceKm) => {
  if (distanceKm === null || distanceKm === undefined || isNaN(distanceKm)) {
    return null;
  }
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
};

export const calculateHaversine = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
};

