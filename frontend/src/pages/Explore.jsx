import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, UtensilsCrossed, Store, Star, X } from 'lucide-react';
import { foodService } from '../services/foodService';
import { partnerService } from '../services/partnerService';
import { useLocation } from '../context/LocationContext';
import FoodCard from '../components/FoodCard';
import RestaurantCard from '../components/RestaurantCard';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = ['All', 'Biryani', 'Pizza', 'Burger', 'South Indian', 'Chinese', 'Desserts', 'Beverages'];

const Explore = () => {
  const [activeTab, setActiveTab] = useState('foods'); // 'foods' | 'restaurants'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDiet, setSelectedDiet] = useState('all');
  const [minRating, setMinRating] = useState('');
  const [foods, setFoods] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const { coords } = useLocation();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      if (activeTab === 'foods') {
        const params = {};
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (selectedDiet !== 'all') params.foodType = selectedDiet;
        if (minRating) params.minRating = minRating;
        if (coords?.lat && coords?.lng) {
          params.lat = coords.lat;
          params.lng = coords.lng;
        }

        const res = await foodService.getFoods(params);
        if (res.success && res.data) {
          setFoods(res.data.foods || []);
        }
      } else {
        const params = {};
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (coords?.lat && coords?.lng) {
          params.lat = coords.lat;
          params.lng = coords.lng;
        }

        const res = await partnerService.getAllPartners(params);
        if (res.success && res.data) {
          setPartners(res.data || []);
        }
      }
    } catch (error) {
      console.error('Failed to load explore data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, selectedCategory, selectedDiet, minRating, coords]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDiet('all');
    setMinRating('');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || selectedDiet !== 'all' || minRating;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
        {/* Search Box */}
        <div className="relative flex-1 max-w-xl">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'foods'
                ? 'Search dishes, biryani, pizzas, rolls...'
                : 'Search restaurants, cuisines, cafes...'
            }
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-slate-900 border border-slate-700/80 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-md"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex items-center rounded-2xl bg-slate-900 border border-slate-800 p-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('foods')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'foods'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UtensilsCrossed size={15} />
            <span>Dishes & Reels</span>
          </button>
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'restaurants'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store size={15} />
            <span>Restaurants</span>
          </button>
        </div>
      </div>

      {/* Filter Controls (When exploring foods) */}
      {activeTab === 'foods' && (
        <div className="space-y-3 pt-1">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary Filters: Diet & Rating */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <SlidersHorizontal size={13} />
              Filters:
            </span>

            {/* Diet toggle */}
            <button
              onClick={() => setSelectedDiet(selectedDiet === 'veg' ? 'all' : 'veg')}
              className={`px-3 py-1 rounded-xl font-bold border transition-colors ${
                selectedDiet === 'veg'
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              🌱 Veg Only
            </button>

            <button
              onClick={() => setSelectedDiet(selectedDiet === 'nonVeg' ? 'all' : 'nonVeg')}
              className={`px-3 py-1 rounded-xl font-bold border transition-colors ${
                selectedDiet === 'nonVeg'
                  ? 'bg-rose-600/20 border-rose-500 text-rose-400'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              🍗 Non-Veg
            </button>

            {/* Rating 4.0+ */}
            <button
              onClick={() => setMinRating(minRating === '4' ? '' : '4')}
              className={`px-3 py-1 rounded-xl font-bold border flex items-center gap-1 transition-colors ${
                minRating === '4'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <Star size={12} className="fill-amber-400" />
              <span>4.0+ Stars</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[11px] text-rose-400 hover:underline font-semibold ml-auto"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content Feed */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" message={`Finding top ${activeTab}...`} />
        </div>
      ) : activeTab === 'foods' ? (
        foods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-3 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8 max-w-md mx-auto">
            <UtensilsCrossed size={40} className="mx-auto text-slate-600" />
            <h3 className="text-lg font-bold text-white">No Dishes Found</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search terms or filters to find what you are craving.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
            >
              Reset Filters
            </button>
          </div>
        )
      ) : partners.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <RestaurantCard key={partner._id} partner={partner} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-3 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8 max-w-md mx-auto">
          <Store size={40} className="mx-auto text-slate-600" />
          <h3 className="text-lg font-bold text-white">No Restaurants Found</h3>
          <p className="text-xs text-slate-400">
            We couldn't find restaurants matching your search.
          </p>
        </div>
      )}
    </div>
  );
};

export default Explore;
