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
  Sparkles,
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
  const [likeCount, setLikeCount] = useState(() => Math.floor(28 + (food.rating || 4.5) * 40));
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [progress, setProgress] = useState(0);

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

  // Video progress time update
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const currentProgress = (video.currentTime / video.duration) * 100;
    setProgress(currentProgress);
  };

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

  // Double tap to like with blooming effect
  const handleDoubleTap = (e) => {
    e.stopPropagation();
    if (!isLiked) {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
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
      setTimeout(() => setShowHeartAnim(false), 800);
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
          text: `Watch ${food.name} on VS Food Reels!`,
          url: shareUrl,
        });
      } catch (err) {}
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
      <div className="relative w-full h-[calc(100vh-5.5rem)] md:h-[790px] max-h-[92vh] rounded-none md:rounded-3xl overflow-hidden bg-cosmic-950 shadow-glass-lg border-0 md:border md:border-white/10 flex items-center justify-center select-none group">
        {/* Ambient Video Glow on container borders */}
        <div className="hidden md:block absolute -inset-1 rounded-3xl bg-gradient-to-tr from-brand-600/20 via-neon-indigo/10 to-neon-cyan/20 blur-xl opacity-60 pointer-events-none group-hover:opacity-90 transition-opacity" />

        {/* Video Player */}
        <video
          ref={videoRef}
          src={food.videoUrl}
          poster={food.thumbnailUrl || food.imageUrl}
          loop
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onClick={togglePlayPause}
          onDoubleClick={handleDoubleTap}
          className="w-full h-full object-cover cursor-pointer z-0"
        />

        {/* Double-tap Blooming Heart Pop Animation */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-36 h-36 rounded-full bg-neon-rose/30 blur-2xl animate-ping" />
              <Heart
                size={120}
                className="fill-neon-rose text-neon-rose drop-shadow-[0_0_35px_rgba(255,42,95,0.9)] animate-like-bounce"
              />
            </div>
          </div>
        )}

        {/* Top Vignette Gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cosmic-950/90 via-cosmic-950/40 to-transparent pointer-events-none z-10" />

        {/* Bottom Vignette Gradient with deep cosmic blur */}
        <div className="absolute bottom-0 left-0 right-0 h-[28rem] bg-gradient-to-t from-cosmic-950/98 via-cosmic-950/70 to-transparent pointer-events-none z-10" />

        {/* Top Controls: Sound Equalizer & Mute Toggle */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {/* Live Soundwave Audio Visualizer (when sound is unmuted and playing) */}
          {!isMuted && isPlaying && (
            <div className="flex items-end gap-1 px-3 py-2 rounded-full glass-pill border border-neon-cyan/30 text-neon-cyan shadow-neon-cyan">
              <span className="w-1 bg-neon-cyan rounded-full animate-sound-bar-1" />
              <span className="w-1 bg-neon-cyan rounded-full animate-sound-bar-2" />
              <span className="w-1 bg-neon-cyan rounded-full animate-sound-bar-3" />
              <span className="w-1 bg-neon-cyan rounded-full animate-sound-bar-4" />
            </div>
          )}

          {/* Mute / Unmute Button */}
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-full glass-action-btn text-white hover:border-neon-rose/50 transition-all active:scale-90"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={17} className="text-slate-300" /> : <Volume2 size={17} className="text-neon-rose" />}
          </button>
        </div>

        {/* Play/Pause Pulse indicator overlay when paused */}
        {!isPlaying && isActive && (
          <div
            onClick={togglePlayPause}
            className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
          >
            <div className="p-5 rounded-full glass-dock border border-white/20 text-white backdrop-blur-2xl shadow-glass-lg animate-pulse-subtle">
              <Play size={42} className="fill-white translate-x-0.5" />
            </div>
          </div>
        )}

        {/* Right Side Social Actions Capsule */}
        <div className="absolute right-3.5 bottom-24 z-20 flex flex-col items-center gap-4">
          <div className="p-2 rounded-3xl glass-dock flex flex-col items-center gap-4 border border-white/10 shadow-glass">
            {/* Like Action */}
            <button
              onClick={toggleLike}
              className="flex flex-col items-center gap-1 group"
              aria-label="Like"
            >
              <div
                className={`p-2.5 rounded-full transition-all active:scale-125 ${
                  isLiked
                    ? 'bg-neon-rose/20 text-neon-rose shadow-neon-rose'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Heart
                  size={21}
                  className={isLiked ? 'fill-neon-rose text-neon-rose' : 'group-hover:scale-110 transition-transform'}
                />
              </div>
              <span className="text-[10px] font-black text-white/90 drop-shadow">
                {likeCount}
              </span>
            </button>

            {/* Comments / Review Action */}
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="flex flex-col items-center gap-1 group"
              aria-label="Reviews"
            >
              <div className="p-2.5 rounded-full text-white/90 hover:bg-white/10 hover:text-white transition-all group-hover:scale-110">
                <MessageCircle size={21} />
              </div>
              <span className="text-[10px] font-black text-white/90 drop-shadow">
                {food.totalReviews || 12}
              </span>
            </button>

            {/* Bookmark Action */}
            <button
              onClick={toggleSave}
              className="flex flex-col items-center gap-1 group"
              aria-label="Save"
            >
              <div
                className={`p-2.5 rounded-full transition-all active:scale-125 ${
                  isSaved
                    ? 'bg-neon-amber/20 text-neon-amber shadow-neon-amber'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Bookmark
                  size={21}
                  className={isSaved ? 'fill-neon-amber text-neon-amber' : 'group-hover:scale-110 transition-transform'}
                />
              </div>
              <span className="text-[10px] font-black text-white/90 drop-shadow">
                {isSaved ? 'Saved' : 'Save'}
              </span>
            </button>

            {/* Share Action */}
            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-1 group"
              aria-label="Share"
            >
              <div className="p-2.5 rounded-full text-white/90 hover:bg-white/10 hover:text-white transition-all group-hover:scale-110">
                <Share2 size={21} />
              </div>
              <span className="text-[10px] font-black text-white/90 drop-shadow">
                {copiedLink ? 'Copied' : 'Share'}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Food & Restaurant Details Glass Card */}
        <div className="absolute left-0 right-16 bottom-3 z-20 p-4 sm:p-5 text-left space-y-3.5">
          {/* Restaurant Header Chip */}
          <Link
            to={`/restaurant/${partner.username || partner._id}`}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-pill hover:bg-cosmic-900/90 transition-all border border-white/20 group shadow-glass"
          >
            <div className="relative">
              <img
                src={
                  partner.profileImage ||
                  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=100&q=80'
                }
                alt={partner.restaurantName}
                className="w-6 h-6 rounded-full object-cover border border-neon-rose/50"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-neon-emerald ring-1 ring-black" />
            </div>
            <span className="text-xs font-black text-white truncate max-w-[150px] group-hover:text-neon-rose transition-colors">
              {partner.restaurantName || 'Gourmet Kitchen'}
            </span>
            <span className="text-[10px] text-amber-400 font-extrabold flex items-center gap-0.5 pl-1 border-l border-white/10">
              <Star size={10} className="fill-amber-400" />
              {partner.rating || 4.7}
            </span>
          </Link>

          {/* Food Info & Badges */}
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {/* Glowing Diet Badge */}
              <div
                className={`w-4 h-4 rounded-md border ${foodTypeBadge.border} flex items-center justify-center p-0.5 bg-cosmic-950/80 shadow-sm`}
                title={foodTypeBadge.label}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${foodTypeBadge.dot} shadow-[0_0_8px_currentColor]`} />
              </div>

              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg bg-white/10 text-white/90 backdrop-blur-md border border-white/10">
                {food.category}
              </span>

              {/* Distance Tag */}
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                <MapPin size={12} className="text-neon-rose shrink-0" />
                {food.distanceKm !== null && food.distanceKm !== undefined
                  ? formatDistance(food.distanceKm)
                  : partner.city || '2.1 km away'}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug drop-shadow-md line-clamp-1">
              {food.name}
            </h2>

            {food.description && (
              <p className="text-xs text-slate-300/85 line-clamp-2 mt-0.5 drop-shadow leading-relaxed">
                {food.description}
              </p>
            )}
          </div>

          {/* Pricing & Call-to-Action Bar */}
          <div className="flex items-center gap-3 pt-1">
            <div className="flex flex-col">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                Price
              </span>
              <span className="text-xl font-black text-neon-emerald drop-shadow-[0_0_12px_rgba(0,245,155,0.4)]">
                {formatCurrency(food.price)}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-[270px]">
              <Link
                to={`/restaurant/${partner.username || partner._id}`}
                className="px-3 py-2.5 rounded-2xl glass-action-btn text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shrink-0 hover:border-white/30"
              >
                <Store size={14} />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                onClick={handleAddToCart}
                disabled={isAdding || justAdded || !food.isAvailable}
                className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                  justAdded
                    ? 'bg-emerald-500 text-slate-950 shadow-neon-emerald font-black'
                    : !food.isAvailable
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-brand-600 via-rose-500 to-neon-rose hover:opacity-95 text-white shadow-neon-rose'
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

        {/* Video Scrubber Timeline Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
          <div
            className="h-full bg-gradient-to-r from-brand-500 via-neon-rose to-neon-amber transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
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
