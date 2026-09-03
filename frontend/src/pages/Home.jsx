import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Utensils, Search, SlidersHorizontal, MapPin } from 'lucide-react';
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
      {/* Top Filter Bar (Sticky below navbar) */}
      <div className="w-full max-w-xl px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar z-20">
        {/* Diet toggle */}
        <div className="flex items-center rounded-2xl bg-slate-900/90 border border-slate-800 p-1 shrink-0">
          <button
            onClick={() => setSelectedFoodType('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
              selectedFoodType === 'all'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedFoodType('veg')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
              selectedFoodType === 'veg'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🌱 Veg
          </button>
          <button
            onClick={() => setSelectedFoodType('nonVeg')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
              selectedFoodType === 'nonVeg'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🍗 Non-Veg
          </button>
        </div>

        <div className="w-px h-6 bg-slate-800 shrink-0" />

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
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
