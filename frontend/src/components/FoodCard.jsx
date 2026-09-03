import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Check, Play, MapPin } from 'lucide-react';
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
    <div className="group rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      {/* Media & Video Thumbnail Preview */}
      <div className="relative aspect-video sm:aspect-square w-full bg-slate-950 overflow-hidden">
        <img
          src={
            food.thumbnailUrl ||
            food.imageUrl ||
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
          }
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Video Reel Badge */}
        {food.videoUrl && (
          <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
            <Play size={12} className="fill-white" />
          </div>
        )}

        {/* Veg/Non-veg Indicator */}
        <div
          className={`absolute top-3 left-3 w-4 h-4 rounded-sm border ${foodTypeBadge.border} flex items-center justify-center p-0.5 bg-black/70 backdrop-blur-sm`}
          title={foodTypeBadge.label}
        >
          <div className={`w-2 h-2 rounded-full ${foodTypeBadge.dot}`} />
        </div>

        {/* Rating chip */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 flex items-center gap-1 text-[11px] font-bold text-amber-400">
          <Star size={12} className="fill-amber-400" />
          <span>{food.rating || 4.5}</span>
          <span className="text-slate-400 font-normal">({food.totalReviews || 0})</span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          {showRestaurant && partner.restaurantName && (
            <Link
              to={`/restaurant/${partner.username || partner._id}`}
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold truncate block mb-1"
            >
              {partner.restaurantName}
            </Link>
          )}

          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
            {food.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1 min-h-[32px]">
            {food.description || `Fresh and authentic ${food.category} preparation.`}
          </p>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <span className="text-base sm:text-lg font-black text-emerald-400">
            {formatCurrency(food.price)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isAdding || justAdded || !food.isAvailable}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              justAdded
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : !food.isAvailable
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/30 active:scale-95'
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
