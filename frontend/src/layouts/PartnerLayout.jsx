import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  PlusCircle,
  ReceiptText,
  Settings,
  Store,
  LogOut,
  Flame,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PartnerLayout = () => {
  const { user, partner, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', path: '/partner/dashboard', icon: LayoutDashboard },
    { label: 'Food Portfolio', path: '/partner/food', icon: Sparkles },
    { label: 'Add Food Reel', path: '/partner/add-food', icon: PlusCircle },
    { label: 'Manage Orders', path: '/partner/orders', icon: ReceiptText },
    { label: 'Restaurant Profile', path: '/partner/profile', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-cosmic-950 text-slate-100 antialiased relative overflow-x-hidden">
      {/* Ambient background glows for partner portal */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-neon-rose/10 blur-[130px]" />
      </div>

      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 glass-dock border-r border-white/10 p-6 shrink-0 justify-between relative z-10 m-3 rounded-3xl shadow-glass-lg">
        <div className="space-y-6">
          {/* Partner Brand */}
          <div className="flex items-center gap-3">
            <div className="p-0.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 shadow-neon-amber">
              <div className="w-10 h-10 rounded-2xl bg-cosmic-950 flex items-center justify-center text-amber-400">
                <Store size={20} />
              </div>
            </div>
            <div className="truncate">
              <h2 className="text-sm font-black text-white truncate">
                {partner?.restaurantName || 'Partner Portal'}
              </h2>
              <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block">
                Restaurant Hub
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black transition-all ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-neon-amber font-black scale-105'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-white/10 space-y-2">
          {partner?.username && (
            <Link
              to={`/restaurant/${partner.username}`}
              target="_blank"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-neon-rose glass-dock hover:border-white/20 transition-all shadow-glass"
            >
              <div className="flex items-center gap-2">
                <Store size={14} />
                <span>Public Page</span>
              </div>
              <ExternalLink size={12} />
            </Link>
          )}

          <Link
            to="/"
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
          >
            <Flame size={14} className="text-neon-rose" />
            <span>Reels Feed</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-400 hover:bg-rose-500/15 transition-colors text-left"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Mobile Header */}
        <header className="lg:hidden p-4 glass-dock border-b border-white/10 flex items-center justify-between mx-3 mt-3 rounded-2xl shadow-glass">
          <Link to="/" className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <ArrowLeft size={16} />
            <span>Home</span>
          </Link>
          <span className="text-xs font-black text-amber-400 uppercase tracking-wider">Partner Portal</span>
          <Link to="/partner/dashboard" className="p-2 rounded-xl glass-dock text-slate-300">
            <LayoutDashboard size={16} />
          </Link>
        </header>

        {/* Mobile Navigation Pills */}
        <div className="lg:hidden flex items-center gap-2 p-3 overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-black whitespace-nowrap shrink-0 transition-all ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-neon-amber'
                  : 'glass-pill text-slate-300'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PartnerLayout;
