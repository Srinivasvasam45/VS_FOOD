import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock } from 'lucide-react';
import { formatDistance } from '../utils/formatters';

const RestaurantCard = ({ partner }) => {
  const cuisines = Array.isArray(partner.cuisine)
    ? partner.cuisine.join(' • ')
    : partner.cuisine || 'Multi-Cuisine';

  return (
    <Link
      to={`/restaurant/${partner.username || partner._id}`}
      className="group rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 block"
    >
      {/* Cover / Profile Banner */}
      <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
        <img
          src={
            partner.coverImage ||
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80'
          }
          alt={partner.restaurantName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 flex items-center gap-1 text-xs font-bold text-amber-400">
          <Star size={13} className="fill-amber-400" />
          <span>{partner.rating || 4.5}</span>
          <span className="text-slate-400 font-normal">({partner.totalReviews || 0})</span>
        </div>

        {/* Distance Badge */}
        {partner.distanceKm !== null && partner.distanceKm !== undefined && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 flex items-center gap-1 text-xs font-semibold text-slate-200">
            <MapPin size={12} className="text-brand-500" />
            <span>{formatDistance(partner.distanceKm)}</span>
          </div>
        )}

        {/* Restaurant Avatar */}
        <div className="absolute -bottom-2 left-4">
          <img
            src={
              partner.profileImage ||
              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80'
            }
            alt={partner.restaurantName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-900 shadow-xl"
          />
        </div>
      </div>

      {/* Body Info */}
      <div className="pt-5 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-bold text-white group-hover:text-brand-400 transition-colors truncate">
            {partner.restaurantName}
          </h3>
        </div>

        <p className="text-xs text-brand-400 font-medium truncate mt-0.5">{cuisines}</p>

        <p className="text-xs text-slate-400 line-clamp-2 mt-2 min-h-[32px]">
          {partner.description || 'Delightful specialties, fresh ingredients, and exceptional culinary craft.'}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="truncate max-w-[180px] flex items-center gap-1">
            <MapPin size={12} className="text-slate-500 shrink-0" />
            {partner.city || 'Hyderabad'}
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <Clock size={12} className="text-slate-500 shrink-0" />
            {partner.openingHours || 'Open Now'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
