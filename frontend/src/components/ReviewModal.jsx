import React, { useState } from 'react';
import { Star, X, Send } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-white mb-1">Rate & Review</h3>
        <p className="text-xs text-slate-400 mb-6 truncate">{food.name}</p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star selector */}
          <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-xs font-semibold text-slate-300">Your Rating</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-slate-600 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    size={32}
                    className={`transition-colors ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                        : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-sm font-bold text-amber-400">
              {rating === 5 && '🌟 Exceptional!'}
              {rating === 4 && '👍 Great Taste'}
              {rating === 3 && '👌 Good'}
              {rating === 2 && '👎 Below Average'}
              {rating === 1 && '⚠️ Disappointing'}
            </span>
          </div>

          {/* Comment textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Share your experience
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others what you loved about this dish, the flavor, portion size..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send size={16} />
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
