import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, ArrowRight } from 'lucide-react';
import { formatDistance } from '../utils/formatters';

const RestaurantCard = ({ partner }) => {
  const cuisines = Array.isArray(partner.cuisine)
    ? partner.cuisine.join(' • ')
    : partner.cuisine || 'Multi-Cuisine';

  return (
    <Link
      to={`/restaurant/${partner.username || partner._id}`}
      className="group rounded-3xl glass-card glass-card-hover overflow-hidden shadow-glass flex flex-col justify-between border border-white/10 block relative"
    >
      {/* Cover / Profile Banner */}
      <div className="relative h-48 w-full bg-cosmic-950 overflow-hidden">
        <img
          src={
            partner.coverImage ||
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80'
          }
          alt={partner.restaurantName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-950 via-cosmic-950/40 to-black/20" />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full glass-dock border border-white/15 flex items-center gap-1.5 text-xs font-black text-amber-400 shadow-glass">
          <Star size={12} className="fill-amber-400" />
          <span>{partner.rating || 4.5}</span>
          <span className="text-slate-400 font-medium">({partner.totalReviews || 0})</span>
        </div>

        {/* Distance Badge */}
        {partner.distanceKm !== null && partner.distanceKm !== undefined && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass-dock border border-white/15 flex items-center gap-1.5 text-xs font-bold text-slate-200 shadow-glass">
            <MapPin size={12} className="text-neon-rose" />
            <span>{formatDistance(partner.distanceKm)}</span>
          </div>
        )}

        {/* Holographic Restaurant Avatar */}
        <div className="absolute -bottom-3 left-5">
          <div className="p-0.5 rounded-2xl bg-gradient-to-tr from-brand-600 via-neon-rose to-amber-500 shadow-glass-lg group-hover:scale-105 transition-transform">
            <img
              src={
                partner.profileImage ||
                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80'
              }
              alt={partner.restaurantName}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-cosmic-950"
            />
          </div>
        </div>
      </div>

      {/* Body Info */}
      <div className="pt-6 p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-black text-white group-hover:text-neon-rose transition-colors truncate">
              {partner.restaurantName}
            </h3>
          </div>

          <p className="text-xs text-neon-rose/90 font-bold truncate mt-0.5">{cuisines}</p>

          <p className="text-xs text-slate-400 line-clamp-2 mt-2 min-h-[32px] leading-relaxed">
            {partner.description || 'Delightful specialties, fresh ingredients, and exceptional culinary craft.'}
          </p>
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="truncate max-w-[170px] flex items-center gap-1.5">
            <MapPin size={13} className="text-slate-500 shrink-0" />
            <span className="truncate">{partner.city || 'Hyderabad'}</span>
          </span>
          <span className="flex items-center gap-1.5 shrink-0 text-slate-300 font-medium">
            <Clock size={13} className="text-neon-amber shrink-0" />
            <span>{partner.openingHours || 'Open Now'}</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
