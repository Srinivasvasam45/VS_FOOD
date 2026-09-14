import React, { useState, useEffect } from 'react';
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
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';

const Navbar = () => {
  const { user, isAuthenticated, isFoodPartner, logout } = useAuth();
  const { itemCount, setIsDrawerOpen } = useCart();
  const { locationName, coords, isLocating, requestLocation } = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const routeLocation = useRouteLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => routeLocation.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 lg:px-8 pt-3 pb-2 transition-all duration-300">
      <div
        className={`max-w-7xl mx-auto rounded-3xl glass-dock transition-all duration-300 px-4 sm:px-6 h-16 flex items-center justify-between gap-4 ${
          scrolled ? 'shadow-glass-lg border-white/15 bg-cosmic-900/85' : 'border-white/10'
        }`}
      >
        {/* Brand Logo with Neon Flare */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative">
            {/* Ambient Logo Glow */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-brand-600 via-neon-rose to-neon-amber opacity-75 blur-md group-hover:opacity-100 transition duration-300 group-hover:scale-110" />
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cosmic-900 to-cosmic-800 border border-white/20 flex items-center justify-center text-white shadow-lg">
              <Flame size={22} className="text-neon-rose fill-neon-rose animate-pulse" />
            </div>
          </div>

          <div>
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
              VS<span className="text-neon-rose font-extrabold">FOOD</span>
              <span className="relative flex items-center">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider bg-gradient-to-r from-brand-600/30 to-neon-rose/30 text-neon-rose border border-brand-500/40 uppercase shadow-neon-rose">
                  REELS
                </span>
              </span>
            </span>
          </div>
        </Link>

        {/* Dynamic Location Chip */}
        <button
          onClick={requestLocation}
          className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl glass-pill text-xs font-medium text-slate-300 hover:text-white hover:border-brand-500/40 transition-all max-w-[210px] group shadow-inner"
          title="Click to refresh current GPS location"
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute w-2.5 h-2.5 rounded-full bg-neon-emerald opacity-75 animate-ping" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-neon-emerald" />
          </div>
          <MapPin size={13} className="text-neon-rose group-hover:scale-110 transition-transform shrink-0" />
          <span className="truncate">
            {isLocating ? 'Acquiring GPS...' : coords ? locationName : '📍 Set Location'}
          </span>
        </button>

        {/* Navigation items (Desktop) */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-cosmic-950/60 border border-white/5">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
              isActive('/')
                ? 'text-white bg-gradient-to-r from-brand-600/30 to-neon-rose/20 border border-brand-500/40 shadow-neon-rose'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Flame size={15} className={isActive('/') ? 'text-neon-rose fill-neon-rose' : ''} />
            <span>Reels Feed</span>
          </Link>

          <Link
            to="/explore"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
              isActive('/explore')
                ? 'text-white bg-gradient-to-r from-brand-600/30 to-neon-rose/20 border border-brand-500/40 shadow-neon-rose'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass size={15} className={isActive('/explore') ? 'text-neon-cyan' : ''} />
            <span>Explore</span>
          </Link>

          {isAuthenticated && (
            <Link
              to="/orders"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
                isActive('/orders')
                  ? 'text-white bg-gradient-to-r from-brand-600/30 to-neon-rose/20 border border-brand-500/40 shadow-neon-rose'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ReceiptText size={15} className={isActive('/orders') ? 'text-neon-amber' : ''} />
              <span>Orders</span>
            </Link>
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Cart button with floating badge */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative p-2.5 rounded-2xl glass-pill hover:border-neon-rose/50 text-slate-200 hover:text-white transition-all shadow-glass group active:scale-95"
            aria-label="View Cart"
          >
            <ShoppingBag size={19} className="group-hover:scale-110 group-hover:text-neon-rose transition-all" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-5 px-1.5 rounded-full bg-gradient-to-r from-brand-600 to-neon-rose text-white text-[10px] font-black flex items-center justify-center shadow-neon-rose animate-bounce">
                {itemCount}
              </span>
            )}
          </button>

          {/* Partner portal shortcut */}
          {isFoodPartner ? (
            <Link
              to="/partner/dashboard"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 hover:border-amber-400 text-xs font-bold transition-all shadow-neon-amber active:scale-95"
            >
              <LayoutDashboard size={14} className="text-amber-400" />
              <span>Partner Hub</span>
            </Link>
          ) : (
            <Link
              to="/register?role=foodPartner"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl glass-pill hover:border-brand-500/40 text-slate-300 hover:text-white text-xs font-semibold transition-all group"
            >
              <UtensilsCrossed size={14} className="text-brand-400 group-hover:rotate-12 transition-transform" />
              <span>For Restaurants</span>
            </Link>
          )}

          {/* Auth dropdown */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full glass-pill hover:border-white/30 transition-all active:scale-95"
              >
                <div className="p-0.5 rounded-full bg-gradient-to-tr from-brand-500 via-neon-rose to-amber-500">
                  <img
                    src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover border border-cosmic-950"
                  />
                </div>
                <ChevronDown size={13} className="text-slate-400 pr-1" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-60 rounded-3xl glass-dock shadow-glass-lg z-50 p-2.5 divide-y divide-white/10 animate-fade-in border border-white/15">
                    <div className="px-3.5 py-2.5">
                      <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                      <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase tracking-widest">
                        {user?.role}
                      </span>
                    </div>

                    <div className="py-1.5 space-y-1">
                      {isFoodPartner ? (
                        <>
                          <Link
                            to="/partner/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-bold text-amber-300 hover:bg-white/10 transition-colors"
                          >
                            <LayoutDashboard size={15} />
                            <span>Partner Dashboard</span>
                          </Link>
                          <Link
                            to="/partner/food"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <Sparkles size={15} />
                            <span>Manage Food Reels</span>
                          </Link>
                        </>
                      ) : (
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <User size={15} />
                          <span>My Account</span>
                        </Link>
                      )}

                      <Link
                        to="/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <ReceiptText size={15} />
                        <span>Order History</span>
                      </Link>
                    </div>

                    <div className="pt-1.5">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-rose-400 hover:bg-rose-500/15 transition-colors text-left"
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
                className="px-4 py-2 rounded-2xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="relative group px-4 py-2 rounded-2xl overflow-hidden shadow-neon-rose active:scale-95 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-600 via-rose-500 to-neon-rose group-hover:scale-105 transition-transform" />
                <span className="relative text-xs font-black text-white">Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
