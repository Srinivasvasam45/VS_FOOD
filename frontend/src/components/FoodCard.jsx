import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Check, Play, MapPin, Sparkles } from 'lucide-react';
import { formatCurrency, formatDistance, getFoodTypeBadge } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const FoodCard = ({ food, showRestaurant = true }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const foodTypeBadge = getFoodTypeBadge(food.foodType);
  const partner = food.foodPartner || {};

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsAdding(true);
    const result = await addToCart(food._id, 1);
    setIsAdding(false);

    if (result.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    }
  };

  return (
    <div className="group rounded-3xl glass-card glass-card-hover overflow-hidden shadow-glass flex flex-col justify-between border border-white/10 relative">
      {/* Media & Video Thumbnail Preview */}
      <div className="relative aspect-video sm:aspect-square w-full bg-cosmic-950 overflow-hidden">
        <img
          src={
            food.thumbnailUrl ||
            food.imageUrl ||
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
          }
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />

        {/* Dark subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-950/90 via-transparent to-black/30" />

        {/* Video Reel Badge */}
        {food.videoUrl && (
          <div className="absolute top-3 right-3 p-2 rounded-2xl glass-dock text-white border border-white/20 shadow-glass group-hover:scale-110 transition-transform">
            <Play size={12} className="fill-neon-rose text-neon-rose" />
          </div>
        )}

        {/* Glowing Veg/Non-veg Indicator */}
        <div
          className={`absolute top-3 left-3 w-4 h-4 rounded-md border ${foodTypeBadge.border} flex items-center justify-center p-0.5 glass-dock`}
          title={foodTypeBadge.label}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${foodTypeBadge.dot} shadow-[0_0_8px_currentColor]`} />
        </div>

        {/* Rating chip */}
        <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full glass-dock border border-white/15 flex items-center gap-1.5 text-[11px] font-black text-amber-400 shadow-glass">
          <Star size={11} className="fill-amber-400" />
          <span>{food.rating || 4.5}</span>
          <span className="text-slate-400 font-medium">({food.totalReviews || 0})</span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3">
        <div>
          {showRestaurant && partner.restaurantName && (
            <Link
              to={`/restaurant/${partner.username || partner._id}`}
              className="text-[11px] text-neon-rose hover:underline font-black truncate block mb-1 uppercase tracking-wider"
            >
              {partner.restaurantName}
            </Link>
          )}

          <h3 className="text-sm sm:text-base font-black text-white group-hover:text-neon-rose transition-colors line-clamp-1">
            {food.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1 min-h-[32px] leading-relaxed">
            {food.description || `Fresh and authentic ${food.category} specialty.`}
          </p>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Price</span>
            <span className="text-base sm:text-lg font-black text-neon-emerald drop-shadow-[0_0_10px_rgba(0,245,155,0.3)]">
              {formatCurrency(food.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding || justAdded || !food.isAvailable}
            className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
              justAdded
                ? 'bg-emerald-500 text-slate-950 shadow-neon-emerald'
                : !food.isAvailable
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-brand-600 to-neon-rose text-white shadow-neon-rose hover:opacity-95'
            }`}
          >
            {isAdding ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : justAdded ? (
              <>
                <Check size={14} />
                <span>Added</span>
              </>
            ) : !food.isAvailable ? (
              <span>Unavailable</span>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
