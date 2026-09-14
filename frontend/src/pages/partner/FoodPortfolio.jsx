import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Play,
  Star,
} from 'lucide-react';
import { foodService } from '../../services/foodService';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, getFoodTypeBadge } from '../../utils/formatters';
import LoadingSpinner from '../../components/LoadingSpinner';

const FoodPortfolio = () => {
  const { partner } = useAuth();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      if (partner?._id) {
        const res = await foodService.getFoods({
          foodPartner: partner._id,
          limit: 100,
        });
        if (res.success && res.data) {
          setFoods(res.data.foods || []);
        }
      }
    } catch (err) {
      console.error('Failed to load portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [partner]);

  const handleToggleAvailability = async (food) => {
    try {
      const updatedAvailability = !food.isAvailable;
      const res = await foodService.updateFood(food._id, {
        isAvailable: updatedAvailability,
      });

      if (res.success) {
        setFoods((prev) =>
          prev.map((f) =>
            f._id === food._id ? { ...f, isAvailable: updatedAvailability } : f
          )
        );
      }
    } catch (err) {
      alert('Failed to update availability status.');
    }
  };

  const handleDelete = async (foodId) => {
    if (!window.confirm('Are you sure you want to delete this food reel?')) return;

    try {
      setDeletingId(foodId);
      const res = await foodService.deleteFood(foodId);
      if (res.success) {
        setFoods((prev) => prev.filter((f) => f._id !== foodId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete food.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Sparkles size={24} className="text-amber-400" />
            <span>Food Portfolio & Video Reels</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your dishes, video reels, pricing, and live availability
          </p>
        </div>

        <Link
          to="/partner/add-food"
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-slate-950 text-xs font-black flex items-center gap-2 shadow-neon-amber transition-transform active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle size={16} />
          <span>Upload Food Reel</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <LoadingSpinner size="lg" message="Loading your portfolio..." />
        </div>
      ) : foods.length === 0 ? (
        <div className="p-12 rounded-3xl glass-card border border-white/10 text-center space-y-4 max-w-md mx-auto my-12 shadow-glass">
          <Sparkles size={40} className="mx-auto text-amber-400/60" />
          <h3 className="text-lg font-black text-white">No Food Reels Yet</h3>
          <p className="text-xs text-slate-400">
            Upload your first video reel to start receiving orders from foodies!
          </p>
          <Link
            to="/partner/add-food"
            className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-black shadow-neon-amber"
          >
            Upload Food Reel
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foods.map((food) => {
            const badge = getFoodTypeBadge(food.foodType);

            return (
              <div
                key={food._id}
                className="rounded-3xl glass-card glass-card-hover border border-white/10 overflow-hidden shadow-glass flex flex-col justify-between group"
              >
                {/* Media preview */}
                <div className="relative aspect-video sm:aspect-square w-full bg-cosmic-950 overflow-hidden">
                  <img
                    src={
                      food.thumbnailUrl ||
                      food.imageUrl ||
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Play badge */}
                  {food.videoUrl && (
                    <div className="absolute top-3 right-3 p-2 rounded-2xl glass-dock text-white border border-white/20 shadow-glass">
                      <Play size={12} className="fill-amber-400 text-amber-400" />
                    </div>
                  )}

                  {/* Food Type Indicator */}
                  <div
                    className={`absolute top-3 left-3 w-4 h-4 rounded-md border ${badge.border} flex items-center justify-center p-0.5 glass-dock`}
                    title={badge.label}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${badge.dot} shadow-[0_0_8px_currentColor]`} />
                  </div>

                  {/* Availability Badge */}
                  <button
                    onClick={() => handleToggleAvailability(food)}
                    className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-[10px] font-black backdrop-blur-md flex items-center gap-1.5 shadow-md transition-all ${
                      food.isAvailable
                        ? 'bg-emerald-500 text-slate-950 shadow-neon-emerald'
                        : 'bg-rose-500 text-white shadow-neon-rose'
                    }`}
                  >
                    {food.isAvailable ? (
                      <>
                        <CheckCircle2 size={12} />
                        <span>Available</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={12} />
                        <span>Sold Out</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Body Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                      {food.category}
                    </span>
                    <h3 className="text-sm font-black text-white line-clamp-1 mt-0.5">
                      {food.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 min-h-[32px] leading-relaxed">
                      {food.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-base font-black text-neon-emerald">
                      {formatCurrency(food.price)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/partner/edit-food/${food._id}`}
                        className="p-2 rounded-xl glass-action-btn text-slate-300 hover:text-white transition-colors"
                        title="Edit Food Reel"
                      >
                        <Edit2 size={14} />
                      </Link>

                      <button
                        onClick={() => handleDelete(food._id)}
                        disabled={deletingId === food._id}
                        className="p-2 rounded-xl glass-action-btn text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete Food Reel"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FoodPortfolio;
