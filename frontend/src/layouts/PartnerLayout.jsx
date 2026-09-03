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
    <div className="min-h-screen flex bg-slate-950 text-slate-100 antialiased">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 p-5 shrink-0 justify-between">
        <div className="space-y-6">
          {/* Partner Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Store size={22} />
            </div>
            <div className="truncate">
              <h2 className="text-sm font-black text-white truncate">
                {partner?.restaurantName || 'Partner Portal'}
              </h2>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                Restaurant Hub
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive(item.path)
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-800 space-y-2">
          {partner?.username && (
            <Link
              to={`/restaurant/${partner.username}`}
              target="_blank"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-brand-400 hover:bg-slate-800 transition-colors"
            >
              <Store size={15} />
              <span>View Public Profile</span>
            </Link>
          )}

          <Link
            to="/"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Flame size={15} className="text-brand-500" />
            <span>Switch to Reels Feed</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <ArrowLeft size={16} />
            <span>Home</span>
          </Link>
          <span className="text-sm font-bold text-amber-400">Partner Portal</span>
          <Link to="/partner/dashboard" className="p-2 rounded-xl bg-slate-800 text-slate-300">
            <LayoutDashboard size={18} />
          </Link>
        </header>

        {/* Mobile Navigation Pills */}
        <div className="lg:hidden flex items-center gap-2 p-3 bg-slate-900/60 overflow-x-auto border-b border-slate-800 no-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 ${
                isActive(item.path)
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-800 text-slate-300'
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
