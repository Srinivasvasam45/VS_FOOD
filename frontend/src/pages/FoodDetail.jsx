import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, ShoppingBag, Check, MessageCircle, ArrowLeft, Store, Sparkles } from 'lucide-react';
import { foodService } from '../services/foodService';
import { reviewService } from '../services/reviewService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { formatCurrency, formatDistance, formatDate, getFoodTypeBadge } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ReviewModal from '../components/ReviewModal';

const FoodDetail = () => {
  const { id } = useParams();
  const { coords } = useLocation();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [food, setFood] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  useEffect(() => {
    const fetchFoodAndReviews = async () => {
      try {
        setLoading(true);
        setError('');
        const params = {};
        if (coords?.lat && coords?.lng) {
          params.lat = coords.lat;
          params.lng = coords.lng;
        }

        const [foodRes, reviewsRes] = await Promise.all([
          foodService.getFoodById(id, params),
          reviewService.getFoodReviews(id),
        ]);

        if (foodRes.success && foodRes.data) {
          setFood(foodRes.data);
        } else {
          setError('Food item not found');
        }

        if (reviewsRes.success && reviewsRes.data) {
          setReviews(reviewsRes.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load food details');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodAndReviews();
  }, [id, coords]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
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

  const handleReviewSubmitted = (newReview) => {
    setReviews([newReview, ...reviews]);
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingSpinner size="lg" message="Loading food reel..." />
      </div>
    );
  }

  if (error || !food) {
    return (
      <div className="max-w-md mx-auto py-20 px-4">
        <ErrorMessage message={error || 'Food item not found'} />
      </div>
    );
  }

  const partner = food.foodPartner || {};
  const badge = getFoodTypeBadge(food.foodType);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-black text-slate-400 hover:text-white transition-colors glass-pill px-4 py-2 rounded-2xl border border-white/10"
      >
        <ArrowLeft size={16} />
        <span>Back to Reels Feed</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Vertical Cinema Video Player */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[380px] aspect-[9/16] rounded-3xl overflow-hidden bg-cosmic-950 border border-white/15 shadow-glass-lg group">
            <video
              src={food.videoUrl}
              poster={food.thumbnailUrl || food.imageUrl}
              controls
              playsInline
              autoPlay
              loop
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Column: Dish Info, Restaurant Card & Reviews */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/15 shadow-glass-lg space-y-5">
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-md border ${badge.border} flex items-center justify-center p-0.5 glass-dock`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${badge.dot} shadow-[0_0_8px_currentColor]`} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full glass-dock text-slate-300 border border-white/10">
                {food.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {food.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {food.description || 'Prepared fresh with signature recipe and handpicked ingredients.'}
            </p>

            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-2xl sm:text-3xl font-black text-neon-emerald drop-shadow-[0_0_12px_rgba(0,245,155,0.4)]">
                {formatCurrency(food.price)}
              </span>
              <div className="flex items-center gap-1.5 text-sm font-black text-amber-400">
                <Star size={17} className="fill-amber-400" />
                <span>{food.rating || 4.5}</span>
                <span className="text-slate-400 font-medium">
                  ({food.totalReviews || reviews.length} reviews)
                </span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={handleAddToCart}
                disabled={isAdding || justAdded || !food.isAvailable}
                className={`w-full sm:w-auto px-8 py-4 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-95 ${
                  justAdded
                    ? 'bg-emerald-500 text-slate-950 shadow-neon-emerald'
                    : !food.isAvailable
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-brand-600 via-rose-500 to-neon-rose text-white shadow-neon-rose hover:opacity-95'
                }`}
              >
                {isAdding ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : justAdded ? (
                  <>
                    <Check size={18} />
                    <span>Added to Cart!</span>
                  </>
                ) : !food.isAvailable ? (
                  <span>Currently Unavailable</span>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>Add to Cart • {formatCurrency(food.price)}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Restaurant Details Mini Card */}
          <div className="p-5 rounded-3xl glass-card border border-white/10 flex items-center justify-between gap-4 shadow-glass">
            <div className="flex items-center gap-3.5">
              <img
                src={
                  partner.profileImage ||
                  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80'
                }
                alt={partner.restaurantName}
                className="w-12 h-12 rounded-2xl object-cover border border-neon-rose/40"
              />
              <div>
                <h4 className="text-sm font-black text-white">
                  {partner.restaurantName}
                </h4>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <MapPin size={12} className="text-neon-rose" />
                  <span>{food.distanceKm !== null ? formatDistance(food.distanceKm) : partner.city}</span>
                </p>
              </div>
            </div>

            <Link
              to={`/restaurant/${partner.username || partner._id}`}
              className="px-4 py-2 rounded-xl glass-action-btn text-slate-200 text-xs font-bold transition-all hover:border-white/30"
            >
              View Menu
            </Link>
          </div>

          {/* Customer Reviews Section */}
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 space-y-4 shadow-glass">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <MessageCircle size={18} className="text-neon-rose" />
                <span>Customer Reviews</span>
              </h3>

              {isAuthenticated && (
                <button
                  onClick={() => setIsReviewOpen(true)}
                  className="text-xs font-black text-neon-rose hover:underline"
                >
                  Write a Review
                </button>
              )}
            </div>

            <div className="space-y-3 pt-1">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No reviews written yet. Be the first to share your thoughts!
                </p>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="p-4 rounded-2xl glass-dock border border-white/5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        {rev.user?.name || 'Customer'}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-black">
                        <Star size={12} className="fill-amber-400" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-500 block pt-0.5">
                      {formatDate(rev.createdAt)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <ReviewModal
        food={food}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};

export default FoodDetail;
