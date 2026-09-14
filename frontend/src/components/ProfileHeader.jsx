import React from 'react';
import { Star, MapPin, Clock, Phone, Share2, Sparkles, Utensils, CheckCircle2 } from 'lucide-react';
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
          text: `Check out ${partner.restaurantName} on VS Food Reels!`,
          url,
        });
      } catch (e) {}
    } else {
      await navigator.clipboard.writeText(url);
      alert('Restaurant link copied to clipboard!');
    }
  };

  return (
    <div className="w-full rounded-3xl glass-card border border-white/15 overflow-hidden shadow-glass-lg mb-8 relative">
      {/* Banner Cover Image with Holographic Flare */}
      <div className="relative h-52 sm:h-72 w-full bg-cosmic-950 overflow-hidden">
        <img
          src={
            partner.coverImage ||
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
          }
          alt={partner.restaurantName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-950 via-cosmic-950/40 to-black/30" />

        <button
          onClick={handleShare}
          className="absolute top-4 right-4 p-3 rounded-full glass-action-btn text-white shadow-glass hover:scale-110 active:scale-95 transition-all"
          aria-label="Share Restaurant"
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* Main Profile Info Section */}
      <div className="px-6 sm:px-8 pb-6 pt-0 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 -mt-16 sm:-mt-20 mb-6">
          {/* Avatar with Instagram-style Holographic Glowing Ring */}
          <div className="relative inline-block group">
            <div className="p-1 rounded-3xl bg-gradient-to-tr from-amber-500 via-neon-rose to-neon-indigo shadow-glass-lg group-hover:scale-105 transition-transform duration-500">
              <img
                src={
                  partner.profileImage ||
                  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80'
                }
                alt={partner.restaurantName}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-cosmic-950"
              />
            </div>
            <span className="absolute bottom-1 right-1 p-1 rounded-full bg-neon-emerald ring-2 ring-cosmic-950" title="Verified Partner">
              <CheckCircle2 size={14} className="text-cosmic-950 stroke-[3]" />
            </span>
          </div>

          {/* Metrics bar */}
          <div className="flex items-center gap-4 sm:gap-6 p-2 rounded-2xl glass-dock border border-white/10 self-start sm:self-auto shadow-glass">
            <div className="text-center px-2">
              <span className="block text-lg sm:text-xl font-black text-white">
                {totalFoodCount}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reels</span>
            </div>
            <div className="w-px h-7 bg-white/10" />
            <div className="text-center px-2">
              <span className="block text-lg sm:text-xl font-black text-amber-400 flex items-center justify-center gap-1">
                <Star size={15} className="fill-amber-400" />
                {partner.rating || 4.7}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {partner.totalReviews || 0} Reviews
              </span>
            </div>
            {partner.distanceKm !== null && partner.distanceKm !== undefined && (
              <>
                <div className="w-px h-7 bg-white/10" />
                <div className="text-center px-2">
                  <span className="block text-lg sm:text-xl font-black text-neon-emerald flex items-center justify-center gap-1">
                    <MapPin size={15} />
                    {partner.distanceKm} km
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Distance</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Identity & Bio */}
        <div className="space-y-3.5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {partner.restaurantName}
            </h1>
            <p className="text-xs text-neon-rose font-black mt-0.5">@{partner.username}</p>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            {partner.description || 'Authentic flavors, premium ingredients, and fresh preparation.'}
          </p>

          {/* Cuisine highlight pills */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {cuisines.map((c, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1 rounded-full text-xs font-bold glass-pill text-slate-200 border border-white/10"
              >
                {c}
              </span>
            ))}
          </div>

          {/* Details Grid: Address, Hours, Phone */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-neon-rose shrink-0" />
              <span className="truncate">{partner.address}, {partner.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-neon-amber shrink-0" />
              <span>{partner.openingHours || '10:00 AM - 11:00 PM'}</span>
            </div>
            {partner.phone && (
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-neon-emerald shrink-0" />
                <span>{partner.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Instagram Profile Navigation Tabs */}
        <div className="mt-8 border-t border-white/10 flex items-center justify-center gap-4 sm:gap-8 pt-1">
          <button
            onClick={() => setActiveTab('reels')}
            className={`flex items-center gap-2 py-3 px-6 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'reels'
                ? 'bg-gradient-to-r from-brand-600 to-neon-rose text-white shadow-neon-rose scale-105'
                : 'text-slate-400 hover:text-white glass-pill border-transparent hover:border-white/10'
            }`}
          >
            <Sparkles size={15} />
            <span>Food Reels Grid</span>
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 py-3 px-6 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'menu'
                ? 'bg-gradient-to-r from-brand-600 to-neon-rose text-white shadow-neon-rose scale-105'
                : 'text-slate-400 hover:text-white glass-pill border-transparent hover:border-white/10'
            }`}
          >
            <Utensils size={15} />
            <span>Full Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
