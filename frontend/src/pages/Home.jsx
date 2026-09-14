import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Utensils, Search, SlidersHorizontal, MapPin, Flame } from 'lucide-react';
import { foodService } from '../services/foodService';
import { useLocation } from '../context/LocationContext';
import ReelFeed from '../components/ReelFeed';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = [
  'All',
  'Biryani',
  'Pizza',
  'Burger',
  'South Indian',
  'Chinese',
  'Desserts',
  'Beverages',
];

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFoodType, setSelectedFoodType] = useState('all');
  const { coords } = useLocation();

  const fetchReels = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedFoodType !== 'all') params.foodType = selectedFoodType;
      if (coords?.lat && coords?.lng) {
        params.lat = coords.lat;
        params.lng = coords.lng;
      }

      const res = await foodService.getFoods(params);
      if (res.success && res.data) {
        setFoods(res.data.foods || []);
      }
    } catch (error) {
      console.error('Failed to load food reels:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedFoodType, coords]);

  useEffect(() => {
    fetchReels();
  }, [fetchReels]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Filter Bar */}
      <div className="w-full max-w-2xl px-4 py-3 flex items-center gap-2.5 overflow-x-auto no-scrollbar z-20">
        {/* Diet toggle pill */}
        <div className="flex items-center rounded-2xl glass-dock p-1 shrink-0 border border-white/10 shadow-glass">
          <button
            onClick={() => setSelectedFoodType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              selectedFoodType === 'all'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedFoodType('veg')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all ${
              selectedFoodType === 'veg'
                ? 'bg-emerald-500/20 text-neon-emerald border border-emerald-500/30 shadow-neon-emerald'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neon-emerald" />
            <span>Veg</span>
          </button>
          <button
            onClick={() => setSelectedFoodType('nonVeg')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all ${
              selectedFoodType === 'nonVeg'
                ? 'bg-rose-500/20 text-neon-rose border border-rose-500/30 shadow-neon-rose'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neon-rose" />
            <span>Non-Veg</span>
          </button>
        </div>

        <div className="w-px h-6 bg-white/10 shrink-0" />

        {/* Category Pills */}
        <div className="flex items-center gap-2 shrink-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-brand-600 via-rose-500 to-neon-rose text-white shadow-neon-rose scale-105 border border-white/20'
                  : 'glass-pill text-slate-300 hover:border-white/25 hover:text-white hover:scale-105'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Reels Discovery Viewport */}
      <div className="w-full flex justify-center px-0 md:px-4">
        <ReelFeed foods={foods} loading={loading} onRefresh={fetchReels} />
      </div>
    </div>
  );
};

export default Home;
