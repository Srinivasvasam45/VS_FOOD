import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, Compass, ShoppingBag, ReceiptText, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const BottomNav = () => {
  const location = useLocation();
  const { isAuthenticated, isFoodPartner } = useAuth();
  const { itemCount, setIsDrawerOpen } = useCart();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-3 left-4 right-4 z-40">
      <div className="rounded-3xl glass-dock px-3 py-2 shadow-glass-lg border border-white/15 flex items-center justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
            isActive('/')
              ? 'text-neon-rose font-black scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`relative ${isActive('/') ? 'p-1.5 rounded-xl bg-neon-rose/15' : ''}`}>
            <Flame size={19} className={isActive('/') ? 'fill-neon-rose' : ''} />
          </div>
          <span className="text-[10px]">Reels</span>
        </Link>

        <Link
          to="/explore"
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
            isActive('/explore')
              ? 'text-neon-cyan font-black scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`relative ${isActive('/explore') ? 'p-1.5 rounded-xl bg-neon-cyan/15' : ''}`}>
            <Compass size={19} />
          </div>
          <span className="text-[10px]">Explore</span>
        </Link>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="relative flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-400 hover:text-slate-200"
        >
          <div className="relative">
            <ShoppingBag size={19} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-gradient-to-r from-brand-600 to-neon-rose text-white text-[9px] font-black flex items-center justify-center shadow-neon-rose">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Cart</span>
        </button>

        {isAuthenticated && (
          <Link
            to="/orders"
            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
              isActive('/orders')
                ? 'text-neon-amber font-black scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`relative ${isActive('/orders') ? 'p-1.5 rounded-xl bg-neon-amber/15' : ''}`}>
              <ReceiptText size={19} />
            </div>
            <span className="text-[10px]">Orders</span>
          </Link>
        )}

        {isFoodPartner ? (
          <Link
            to="/partner/dashboard"
            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
              isActive('/partner/dashboard')
                ? 'text-amber-400 font-black scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`relative ${isActive('/partner/dashboard') ? 'p-1.5 rounded-xl bg-amber-500/20' : ''}`}>
              <LayoutDashboard size={19} />
            </div>
            <span className="text-[10px]">Partner</span>
          </Link>
        ) : (
          <Link
            to={isAuthenticated ? '/profile' : '/login'}
            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
              isActive('/profile') || isActive('/login')
                ? 'text-neon-rose font-black scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`relative ${isActive('/profile') || isActive('/login') ? 'p-1.5 rounded-xl bg-neon-rose/15' : ''}`}>
              <User size={19} />
            </div>
            <span className="text-[10px]">{isAuthenticated ? 'Profile' : 'Login'}</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default BottomNav;
