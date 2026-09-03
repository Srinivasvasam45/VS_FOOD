import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Bookmark,
  MessageCircle,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  MapPin,
  Star,
  ShoppingBag,
  Store,
  Check,
} from 'lucide-react';
import { formatCurrency, formatDistance, getFoodTypeBadge } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ReviewModal from './ReviewModal';

const ReelCard = ({ food, isActive, isMuted, toggleMute }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(() => Math.floor(20 + (food.rating || 4.5) * 45));
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const partner = food.foodPartner || {};
  const foodTypeBadge = getFoodTypeBadge(food.foodType);

  // Play/Pause when isActive changes (Intersection Observer driven)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Autoplay prevented by browser:', err);
            setIsPlaying(false);
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Double tap to like
  const handleDoubleTap = (e) => {
    e.stopPropagation();
    if (!isLiked) {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 700);
  };

  const toggleLike = (e) => {
    e.stopPropagation();
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 700);
    }
  };

  const toggleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/food/${food._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: food.name,
          text: `Check out ${food.name} on VS Food!`,
          url: shareUrl,
        });
      } catch (err) {
        // Share cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAddToCart = async (e) => {
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
    <>
      <div className="relative w-full h-[calc(100vh-4rem)] md:h-[780px] max-h-[92vh] rounded-none md:rounded-3xl overflow-hidden bg-black shadow-2xl flex items-center justify-center select-none">
        {/* Video Player */}
        <video
          ref={videoRef}
          src={food.videoUrl}
          poster={food.thumbnailUrl || food.imageUrl}
          loop
          playsInline
          muted={isMuted}
          onClick={togglePlayPause}
          onDoubleClick={handleDoubleTap}
          className="w-full h-full object-cover cursor-pointer"
        />

        {/* Double-tap Heart Pop Animation */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <Heart
              size={110}
              className="fill-rose-500 text-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.8)] animate-like-bounce"
            />
          </div>
        )}

        {/* Top Vignette Gradient */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />

        {/* Bottom Vignette Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />

        {/* Top Right Media Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {/* Mute / Unmute Button */}
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-full glass-action-btn text-white hover:bg-black/60 transition-transform active:scale-95"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        {/* Play / Pause Indicator overlay when clicked */}
        {!isPlaying && isActive && (
          <div
            onClick={togglePlayPause}
            className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
          >
            <div className="p-4 rounded-full bg-black/50 text-white backdrop-blur-md animate-pulse">
              <Play size={40} className="fill-white" />
            </div>
          </div>
        )}

        {/* Right Side Social Actions Column */}
        <div className="absolute right-3.5 bottom-24 z-20 flex flex-col items-center gap-4">
          {/* Like */}
          <button
            onClick={toggleLike}
            className="flex flex-col items-center gap-1 group"
            aria-label="Like"
          >
            <div
              className={`p-3 rounded-full glass-action-btn transition-transform active:scale-125 ${
                isLiked ? 'text-rose-500 bg-rose-500/20' : 'text-white'
              }`}
            >
              <Heart
                size={22}
                className={isLiked ? 'fill-rose-500 text-rose-500' : 'group-hover:scale-110'}
              />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow-md">
              {likeCount}
            </span>
          </button>

          {/* Reviews / Comments */}
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="flex flex-col items-center gap-1 group"
            aria-label="Reviews"
          >
            <div className="p-3 rounded-full glass-action-btn text-white group-hover:scale-110 transition-transform">
              <MessageCircle size={22} />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow-md">
              {food.totalReviews || 12}
            </span>
          </button>

          {/* Bookmark / Save */}
          <button
            onClick={toggleSave}
            className="flex flex-col items-center gap-1 group"
            aria-label="Save"
          >
            <div
              className={`p-3 rounded-full glass-action-btn transition-transform active:scale-125 ${
                isSaved ? 'text-amber-400 bg-amber-400/20' : 'text-white'
              }`}
            >
              <Bookmark
                size={22}
                className={isSaved ? 'fill-amber-400 text-amber-400' : 'group-hover:scale-110'}
              />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow-md">
              {isSaved ? 'Saved' : 'Save'}
            </span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 group"
            aria-label="Share"
          >
            <div className="p-3 rounded-full glass-action-btn text-white group-hover:scale-110 transition-transform">
              <Share2 size={22} />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow-md">
              {copiedLink ? 'Copied!' : 'Share'}
            </span>
          </button>
        </div>

        {/* Bottom Food & Restaurant Details Overlay */}
        <div className="absolute left-0 right-16 bottom-4 z-20 p-4 sm:p-5 text-left space-y-3">
          {/* Restaurant Header Chip */}
          <Link
            to={`/restaurant/${partner.username || partner._id}`}
            className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full glass-pill hover:bg-black/70 transition-all border border-white/20 group"
          >
            <img
              src={
                partner.profileImage ||
                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=100&q=80'
              }
              alt={partner.restaurantName}
              className="w-6 h-6 rounded-full object-cover border border-white/40"
            />
            <span className="text-xs font-bold text-white truncate max-w-[150px] group-hover:text-brand-400 transition-colors">
              {partner.restaurantName || 'Gourmet Kitchen'}
            </span>
            <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-0.5">
              <Star size={11} className="fill-amber-400" />
              {partner.rating || 4.7}
            </span>
          </Link>

          {/* Food Title, Category & Diet Badge */}
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {/* Veg / NonVeg Symbol indicator */}
              <div
                className={`w-3.5 h-3.5 rounded-sm border ${foodTypeBadge.border} flex items-center justify-center p-0.5 bg-black/40`}
                title={foodTypeBadge.label}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${foodTypeBadge.dot}`} />
              </div>

              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white backdrop-blur-sm">
                {food.category}
              </span>

              {/* Distance calculation */}
              <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1 drop-shadow">
                <MapPin size={12} className="text-brand-500" />
                {food.distanceKm !== null && food.distanceKm !== undefined
                  ? formatDistance(food.distanceKm)
                  : partner.city || '2.1 km away'}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug drop-shadow-md line-clamp-1">
              {food.name}
            </h2>

            {food.description && (
              <p className="text-xs text-slate-300/90 line-clamp-2 mt-0.5 drop-shadow">
                {food.description}
              </p>
            )}
          </div>

          {/* Pricing & Call-to-Action Bar */}
          <div className="flex items-center gap-3 pt-1">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Price
              </span>
              <span className="text-lg sm:text-xl font-black text-emerald-400 drop-shadow">
                {formatCurrency(food.price)}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-[260px]">
              <Link
                to={`/restaurant/${partner.username || partner._id}`}
                className="px-3 py-2.5 rounded-2xl glass-action-btn hover:bg-slate-800 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shrink-0"
              >
                <Store size={14} />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                onClick={handleAddToCart}
                disabled={isAdding || justAdded || !food.isAvailable}
                className={`flex-1 py-2.5 px-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-lg ${
                  justAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-600/40'
                    : !food.isAvailable
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 text-white shadow-brand-600/40 active:scale-95'
                }`}
              >
                {isAdding ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : justAdded ? (
                  <>
                    <Check size={15} />
                    <span>Added!</span>
                  </>
                ) : !food.isAvailable ? (
                  <span>Unavailable</span>
                ) : (
                  <>
                    <ShoppingBag size={15} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        food={food}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </>
  );
};

export default ReelCard;
