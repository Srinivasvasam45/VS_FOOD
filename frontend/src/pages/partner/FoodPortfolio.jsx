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
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles size={24} className="text-amber-400" />
            <span>Food Portfolio & Reels</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your dishes, video reels, pricing, and availability
          </p>
        </div>

        <Link
          to="/partner/add-food"
          className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-transform active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle size={16} />
          <span>Add New Food Reel</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <LoadingSpinner size="lg" message="Loading your dishes..." />
        </div>
      ) : foods.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 max-w-md mx-auto my-12">
          <Sparkles size={40} className="mx-auto text-amber-400/60" />
          <h3 className="text-lg font-bold text-white">No Food Reels Yet</h3>
          <p className="text-xs text-slate-400">
            Upload your first video reel to start receiving orders from foodies!
          </p>
          <Link
            to="/partner/add-food"
            className="inline-block px-5 py-2.5 rounded-2xl bg-amber-500 text-slate-950 text-xs font-black"
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
                className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between group"
              >
                {/* Media preview */}
                <div className="relative aspect-video sm:aspect-square w-full bg-slate-950 overflow-hidden">
                  <img
                    src={
                      food.thumbnailUrl ||
                      food.imageUrl ||
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Play badge */}
                  {food.videoUrl && (
                    <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                      <Play size={12} className="fill-white" />
                    </div>
                  )}

                  {/* Food Type Indicator */}
                  <div
                    className={`absolute top-3 left-3 w-4 h-4 rounded-sm border ${badge.border} flex items-center justify-center p-0.5 bg-black/70`}
                    title={badge.label}
                  >
                    <div className={`w-2 h-2 rounded-full ${badge.dot}`} />
                  </div>

                  {/* Availability Badge */}
                  <button
                    onClick={() => handleToggleAvailability(food)}
                    className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md flex items-center gap-1.5 shadow-md ${
                      food.isAvailable
                        ? 'bg-emerald-500/80 text-white'
                        : 'bg-rose-500/80 text-white'
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
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      {food.category}
                    </span>
                    <h3 className="text-sm font-bold text-white line-clamp-1 mt-0.5">
                      {food.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 min-h-[32px]">
                      {food.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-base font-black text-emerald-400">
                      {formatCurrency(food.price)}
                    </span>

                    <div className="flex items-center gap-1">
                      <Link
                        to={`/partner/edit-food/${food._id}`}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Edit Food Reel"
                      >
                        <Edit2 size={14} />
                      </Link>

                      <button
                        onClick={() => handleDelete(food._id)}
                        disabled={deletingId === food._id}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
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
