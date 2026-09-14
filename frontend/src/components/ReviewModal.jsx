import React, { useState } from 'react';
import { Star, X, Send, Sparkles } from 'lucide-react';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';

const ReviewModal = ({ food, isOpen, onClose, onReviewSubmitted }) => {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !food) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a short review comment.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await reviewService.addReview({
        foodId: food._id,
        rating,
        comment: comment.trim(),
      });

      if (res.success) {
        if (onReviewSubmitted) onReviewSubmitted(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cosmic-950/85 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl glass-card border border-white/20 p-6 sm:p-8 shadow-glass-lg">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full glass-action-btn text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>

        <h3 className="text-xl font-black text-white mb-1 tracking-tight">Rate & Review</h3>
        <p className="text-xs text-neon-rose font-bold mb-6 truncate">{food.name}</p>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star selector */}
          <div className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-3xl glass-dock border border-white/10 shadow-glass">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Your Rating</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-slate-600 transition-transform hover:scale-130 active:scale-95 focus:outline-none"
                >
                  <Star
                    size={32}
                    className={`transition-all ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(255,184,0,0.6)]'
                        : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-black text-amber-400">
              {rating === 5 && '🌟 Exceptional Flavor!'}
              {rating === 4 && '👍 Delicious Meal'}
              {rating === 3 && '👌 Good Experience'}
              {rating === 2 && '👎 Below Expectations'}
              {rating === 1 && '⚠️ Disappointing'}
            </span>
          </div>

          {/* Comment textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Share your experience
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other foodies what you loved about the texture, spice levels, freshness..."
              className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-rose resize-none shadow-glass"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-neon-rose hover:opacity-95 disabled:opacity-50 text-white text-xs font-black flex items-center justify-center gap-2 shadow-neon-rose transition-all active:scale-95"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send size={15} />
                <span>Submit Review</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
