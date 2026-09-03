import React from 'react';
import { Star, MapPin, Clock, Phone, Share2, Sparkles, Utensils } from 'lucide-react';
import { formatDistance } from '../utils/formatters';

const ProfileHeader = ({ partner, totalFoodCount = 0, activeTab, setActiveTab }) => {
  const cuisines = Array.isArray(partner.cuisine)
    ? partner.cuisine
    : partner.cuisine
    ? partner.cuisine.split(',').map((c) => c.trim())
    : ['Multi-Cuisine'];

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: partner.restaurantName,
          text: `Check out ${partner.restaurantName} on VS Food!`,
          url,
        });
      } catch (e) {}
    } else {
      await navigator.clipboard.writeText(url);
      alert('Restaurant link copied to clipboard!');
    }
  };

  return (
    <div className="w-full rounded-3xl bg-slate-900/80 border border-slate-800/80 overflow-hidden shadow-2xl mb-8">
      {/* Banner Cover Image */}
      <div className="relative h-48 sm:h-64 w-full bg-slate-950 overflow-hidden">
        <img
          src={
            partner.coverImage ||
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
          }
          alt={partner.restaurantName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-black/40" />

        <button
          onClick={handleShare}
          className="absolute top-4 right-4 p-2.5 rounded-full glass-action-btn text-white hover:bg-black/60 transition-colors shadow-lg"
          aria-label="Share Restaurant"
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* Main Profile Header info */}
      <div className="px-6 pb-6 pt-0 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
          {/* Avatar with Instagram-style Story Gradient Ring */}
          <div className="relative inline-block">
            <div className="p-1 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-2xl">
              <img
                src={
                  partner.profileImage ||
                  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80'
                }
                alt={partner.restaurantName}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-slate-900"
              />
            </div>
          </div>

          {/* Metrics bar */}
          <div className="flex items-center gap-6 self-start sm:self-auto py-2">
            <div className="text-center">
              <span className="block text-lg sm:text-xl font-black text-white">
                {totalFoodCount}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Reels & Dishes</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center">
              <span className="block text-lg sm:text-xl font-black text-amber-400 flex items-center justify-center gap-1">
                <Star size={16} className="fill-amber-400" />
                {partner.rating || 4.7}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {partner.totalReviews || 0} Reviews
              </span>
            </div>
            {partner.distanceKm !== null && partner.distanceKm !== undefined && (
              <>
                <div className="w-px h-8 bg-slate-800" />
                <div className="text-center">
                  <span className="block text-lg sm:text-xl font-black text-emerald-400 flex items-center justify-center gap-1">
                    <MapPin size={16} />
                    {partner.distanceKm} km
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Distance</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Restaurant Identity & Bio */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {partner.restaurantName}
              </h1>
            </div>
            <p className="text-xs text-brand-400 font-bold">@{partner.username}</p>
          </div>

          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            {partner.description || 'Authentic flavors, premium ingredients, and fresh preparation.'}
          </p>

          {/* Cuisine highlight pills */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {cuisines.map((c, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700/80"
              >
                {c}
              </span>
            ))}
          </div>

          {/* Details Row: Address, Hours, Phone */}
          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-brand-500 shrink-0" />
              <span className="truncate">{partner.address}, {partner.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-amber-400 shrink-0" />
              <span>{partner.openingHours || '10:00 AM - 11:00 PM'}</span>
            </div>
            {partner.phone && (
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-emerald-400 shrink-0" />
                <span>{partner.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Instagram Profile Navigation Tabs */}
        <div className="mt-8 border-t border-slate-800 flex items-center justify-center gap-8">
          <button
            onClick={() => setActiveTab('reels')}
            className={`flex items-center gap-2 py-3 px-4 border-t-2 text-sm font-bold transition-all ${
              activeTab === 'reels'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles size={16} />
            <span>Food Reels Grid</span>
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 py-3 px-4 border-t-2 text-sm font-bold transition-all ${
              activeTab === 'menu'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Utensils size={16} />
            <span>Full Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
