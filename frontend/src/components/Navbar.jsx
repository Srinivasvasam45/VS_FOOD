import React, { useState } from 'react';
import { Link, useNavigate, useLocation as useRouteLocation } from 'react-router-dom';
import {
  Flame,
  Compass,
  ShoppingBag,
  ReceiptText,
  User,
  LogOut,
  MapPin,
  ChevronDown,
  LayoutDashboard,
  UtensilsCrossed,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';

const Navbar = () => {
  const { user, isAuthenticated, isFoodPartner, logout } = useAuth();
  const { itemCount, setIsDrawerOpen } = useCart();
  const { locationName, coords, isLocating, requestLocation } = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const routeLocation = useRouteLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => routeLocation.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-brand-600/30 group-hover:scale-105 transition-transform duration-300">
            <Flame size={22} className="fill-white animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
              VS<span className="text-brand-500">FOOD</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30">
                REELS
              </span>
            </span>
          </div>
        </Link>

        {/* Location pill */}
        <button
          onClick={requestLocation}
          className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-600 transition-colors max-w-[220px]"
          title="Click to refresh current location"
        >
          <MapPin size={14} className="text-brand-500 shrink-0" />
          <span className="truncate">
            {isLocating ? 'Locating GPS...' : coords ? locationName : '📍 Location unavailable'}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-ping" />
        </button>

        {/* Navigation items (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            to="/"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              isActive('/')
                ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Flame size={17} />
            <span>Reels Feed</span>
          </Link>

          <Link
            to="/explore"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              isActive('/explore')
                ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass size={17} />
            <span>Explore</span>
          </Link>

          {isAuthenticated && (
            <Link
              to="/orders"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive('/orders')
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ReceiptText size={17} />
              <span>My Orders</span>
            </Link>
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Cart button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative p-2.5 rounded-2xl bg-slate-900 border border-slate-700/80 text-slate-200 hover:text-white hover:border-brand-500/50 transition-all shadow-md group"
            aria-label="View Cart"
          >
            <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-brand-600 text-white text-[11px] font-black flex items-center justify-center shadow-lg shadow-brand-600/50 animate-bounce">
                {itemCount}
              </span>
            )}
          </button>

          {/* Partner switch or portal button */}
          {isFoodPartner ? (
            <Link
              to="/partner/dashboard"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-bold transition-colors"
            >
              <LayoutDashboard size={15} />
              <span>Partner Portal</span>
            </Link>
          ) : (
            <Link
              to="/register?role=foodPartner"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              <UtensilsCrossed size={14} className="text-brand-400" />
              <span>Add Restaurant</span>
            </Link>
          )}

          {/* Auth dropdown */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full bg-slate-900 border border-slate-700/80 hover:border-slate-600 transition-colors"
              >
                <img
                  src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-600"
                />
                <ChevronDown size={14} className="text-slate-400 pr-1" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700/90 shadow-2xl z-50 p-2 py-2.5 divide-y divide-slate-800 animate-fade-in">
                    <div className="px-3 py-2">
                      <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider">
                        {user?.role}
                      </span>
                    </div>

                    <div className="py-1">
                      {isFoodPartner ? (
                        <>
                          <Link
                            to="/partner/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 hover:bg-slate-800 transition-colors"
                          >
                            <LayoutDashboard size={15} />
                            <span>Partner Dashboard</span>
                          </Link>
                          <Link
                            to="/partner/food"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                          >
                            <Sparkles size={15} />
                            <span>Manage Food Reels</span>
                          </Link>
                        </>
                      ) : (
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                          <User size={15} />
                          <span>My Profile</span>
                        </Link>
                      )}

                      <Link
                        to="/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <ReceiptText size={15} />
                        <span>Order History</span>
                      </Link>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
