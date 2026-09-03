import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Star,
  PlusCircle,
  ReceiptText,
  Store,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { partnerService } from '../../services/partnerService';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate, getOrderStatusBadge } from '../../utils/formatters';
import LoadingSpinner from '../../components/LoadingSpinner';

const PartnerDashboard = () => {
  const { partner } = useAuth();
  const [stats, setStats] = useState({
    totalFoods: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    rating: 4.5,
    totalReviews: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [profileRes, ordersRes] = await Promise.all([
          partnerService.getCurrentPartnerProfile(),
          orderService.getPartnerOrders(),
        ]);

        if (profileRes.success && profileRes.data?.stats) {
          setStats(profileRes.data.stats);
        }

        if (ordersRes.success && ordersRes.data) {
          setRecentOrders(ordersRes.data.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingSpinner size="lg" message="Loading your partner dashboard metrics..." />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Food Items',
      value: stats.totalFoods,
      icon: Sparkles,
      color: 'from-blue-600 to-indigo-600',
      textColor: 'text-blue-400',
      link: '/partner/food',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-400',
      link: '/partner/orders',
    },
    {
      title: 'Pending Fulfillment',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'from-rose-600 to-pink-600',
      textColor: 'text-rose-400',
      link: '/partner/orders?status=pending',
    },
    {
      title: 'Completed Orders',
      value: stats.completedOrders,
      icon: CheckCircle2,
      color: 'from-emerald-600 to-teal-600',
      textColor: 'text-emerald-400',
      link: '/partner/orders?status=delivered',
    },
    {
      title: 'Restaurant Rating',
      value: `⭐ ${stats.rating || 4.5}`,
      subtext: `from ${stats.totalReviews || 0} reviews`,
      icon: Star,
      color: 'from-yellow-500 to-amber-600',
      textColor: 'text-yellow-400',
      link: '/partner/profile',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Restaurant Partner Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Welcome, {partner?.restaurantName || 'Food Partner'}!
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Manage your food reels, track live customer orders, update menus, and monitor your restaurant performance.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/partner/add-food"
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
          >
            <PlusCircle size={16} />
            <span>Upload New Food Reel</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              to={stat.link}
              className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">{stat.title}</span>
                <div className={`p-2 rounded-xl bg-slate-800 ${stat.textColor}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tight">
                  {stat.value}
                </span>
                {stat.subtext && (
                  <p className="text-[10px] text-slate-400 mt-0.5">{stat.subtext}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <ReceiptText size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Recent Orders</h2>
              <p className="text-xs text-slate-400">Latest orders placed at your kitchen</p>
            </div>
          </div>

          <Link
            to="/partner/orders"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No incoming orders yet. Your food reels are active in the feed!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Placed</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentOrders.map((order) => {
                  const badge = getOrderStatusBadge(order.orderStatus);
                  return (
                    <tr key={order._id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-mono font-bold text-white">
                        #{order.orderNumber}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {order.deliveryAddress?.name || 'Customer'}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {order.items.length} {order.items.length === 1 ? 'dish' : 'dishes'}
                      </td>
                      <td className="py-3 px-3 font-black text-emerald-400">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          to="/partner/orders"
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerDashboard;
