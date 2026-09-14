import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  Check,
  AlertCircle,
  Video,
  Save,
} from 'lucide-react';
import { foodService } from '../../services/foodService';
import LoadingSpinner from '../../components/LoadingSpinner';

const categories = [
  'Biryani',
  'Pizza',
  'Burger',
  'South Indian',
  'Chinese',
  'Desserts',
  'Beverages',
  'North Indian',
  'Continental',
  'Snacks',
];

const EditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Biryani',
    foodType: 'veg',
    videoUrl: '',
    thumbnailUrl: '',
    isAvailable: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setLoading(true);
        const res = await foodService.getFoodById(id);
        if (res.success && res.data) {
          const item = res.data;
          setFormData({
            name: item.name || '',
            description: item.description || '',
            price: item.price || '',
            category: item.category || 'Biryani',
            foodType: item.foodType || 'veg',
            videoUrl: item.videoUrl || '',
            thumbnailUrl: item.thumbnailUrl || item.imageUrl || '',
            isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
          });
        }
      } catch (err) {
        setError('Failed to load food item.');
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');

      await foodService.updateFood(id, {
        ...formData,
        price: Number(formData.price),
      });

      navigate('/partner/food');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update food reel.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingSpinner size="lg" message="Loading dish parameters..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/partner/food"
        className="inline-flex items-center gap-2 text-xs font-black text-slate-400 hover:text-white transition-colors glass-pill px-4 py-2 rounded-2xl border border-white/10"
      >
        <ArrowLeft size={16} />
        <span>Back to Food Portfolio</span>
      </Link>

      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/15 shadow-glass-lg space-y-6 relative overflow-hidden">
        <div className="relative">
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Sparkles size={24} className="text-amber-400" />
            <span>Edit Food Reel</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Update pricing, descriptions, dietary classification, or video link
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Food Dish Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Price in ₹ (INR) *
              </label>
              <input
                type="number"
                name="price"
                min="0"
                step="1"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Food Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl glass-dock border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-cosmic-950 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Dietary Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'veg', label: '🌱 Veg' },
                  { id: 'nonVeg', label: '🍗 Non-Veg' },
                  { id: 'egg', label: '🥚 Egg' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, foodType: type.id })}
                    className={`py-3 rounded-2xl text-xs font-black border transition-all ${
                      formData.foodType === type.id
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-500 shadow-neon-amber'
                        : 'glass-dock text-slate-400 border-white/10'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Description / Recipe Notes
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Video Reel URL
              </label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Thumbnail Image URL
              </label>
              <input
                type="url"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="w-4 h-4 rounded accent-amber-500"
            />
            <label htmlFor="isAvailable" className="text-xs font-bold text-slate-300">
              Dish is currently available for ordering
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-neon-amber transition-all active:scale-95"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save size={16} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditFood;
