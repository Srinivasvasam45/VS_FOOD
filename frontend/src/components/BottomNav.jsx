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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 safe-bottom">
      <div className="flex items-center justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
            isActive('/') ? 'text-brand-500 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame size={20} className={isActive('/') ? 'fill-brand-500' : ''} />
          <span className="text-[10px]">Reels</span>
        </Link>

        <Link
          to="/explore"
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
            isActive('/explore') ? 'text-brand-500 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass size={20} />
          <span className="text-[10px]">Explore</span>
        </Link>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="relative flex flex-col items-center gap-1 p-2 rounded-xl text-slate-400 hover:text-slate-200"
        >
          <div className="relative">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-brand-600 text-white text-[9px] font-black flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Cart</span>
        </button>

        {isAuthenticated && (
          <Link
            to="/orders"
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
              isActive('/orders') ? 'text-brand-500 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ReceiptText size={20} />
            <span className="text-[10px]">Orders</span>
          </Link>
        )}

        {isFoodPartner ? (
          <Link
            to="/partner/dashboard"
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
              isActive('/partner/dashboard')
                ? 'text-amber-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="text-[10px]">Partner</span>
          </Link>
        ) : (
          <Link
            to={isAuthenticated ? '/profile' : '/login'}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
              isActive('/profile') || isActive('/login')
                ? 'text-brand-500 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User size={20} />
            <span className="text-[10px]">{isAuthenticated ? 'Profile' : 'Login'}</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default BottomNav;
