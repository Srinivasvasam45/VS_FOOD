import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, UtensilsCrossed, Store, Star, X, Sparkles, Flame } from 'lucide-react';
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
    }, 200);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
        {/* Futuristic Search Box */}
        <div className="relative flex-1 max-w-xl group">
          <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-neon-rose via-neon-indigo to-neon-cyan opacity-0 group-focus-within:opacity-75 blur-md transition duration-300" />
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-4.5 text-slate-400 group-focus-within:text-neon-rose transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'foods'
                  ? 'Search dishes, crispy pizzas, biryanis, desserts...'
                  : 'Search restaurants, cuisines, dining spots...'
              }
              className="w-full pl-12 pr-10 py-3.5 rounded-3xl glass-input text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-neon-rose shadow-glass"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center rounded-3xl glass-dock p-1.5 self-start sm:self-auto border border-white/10 shadow-glass">
          <button
            onClick={() => setActiveTab('foods')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'foods'
                ? 'bg-gradient-to-r from-brand-600 to-neon-rose text-white shadow-neon-rose scale-105'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UtensilsCrossed size={14} />
            <span>Dishes & Reels</span>
          </button>
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'restaurants'
                ? 'bg-gradient-to-r from-brand-600 to-neon-rose text-white shadow-neon-rose scale-105'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store size={14} />
            <span>Restaurants</span>
          </button>
        </div>
      </div>

      {/* Filter Controls (When exploring foods) */}
      {activeTab === 'foods' && (
        <div className="space-y-3.5 pt-1">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-brand-600 via-rose-500 to-neon-rose text-white shadow-neon-rose scale-105 border border-white/20'
                    : 'glass-pill text-slate-300 hover:border-white/25 hover:text-white hover:scale-105'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary Filters: Diet & Rating */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1.5 mr-1">
              <SlidersHorizontal size={13} className="text-neon-rose" />
              Filters:
            </span>

            {/* Diet toggle */}
            <button
              onClick={() => setSelectedDiet(selectedDiet === 'veg' ? 'all' : 'veg')}
              className={`px-3.5 py-1.5 rounded-xl font-black border transition-all ${
                selectedDiet === 'veg'
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-neon-emerald shadow-neon-emerald'
                  : 'glass-pill text-slate-300 hover:border-white/20'
              }`}
            >
              🌱 Veg Only
            </button>

            <button
              onClick={() => setSelectedDiet(selectedDiet === 'nonVeg' ? 'all' : 'nonVeg')}
              className={`px-3.5 py-1.5 rounded-xl font-black border transition-all ${
                selectedDiet === 'nonVeg'
                  ? 'bg-rose-500/20 border-rose-500/40 text-neon-rose shadow-neon-rose'
                  : 'glass-pill text-slate-300 hover:border-white/20'
              }`}
            >
              🍗 Non-Veg
            </button>

            {/* Rating 4.0+ */}
            <button
              onClick={() => setMinRating(minRating === '4' ? '' : '4')}
              className={`px-3.5 py-1.5 rounded-xl font-black border flex items-center gap-1.5 transition-all ${
                minRating === '4'
                  ? 'bg-amber-500/20 border-amber-500/40 text-neon-amber shadow-neon-amber'
                  : 'glass-pill text-slate-300 hover:border-white/20'
              }`}
            >
              <Star size={12} className="fill-neon-amber" />
              <span>4.0+ Stars</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-neon-rose hover:underline font-bold ml-auto"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content Feed Grid */}
      {loading ? (
        <div className="py-24 flex justify-center">
          <LoadingSpinner size="lg" message={`Exploring top ${activeTab}...`} />
        </div>
      ) : activeTab === 'foods' ? (
        foods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 rounded-3xl glass-card border border-white/10 p-8 max-w-md mx-auto shadow-glass">
            <UtensilsCrossed size={42} className="mx-auto text-slate-600" />
            <h3 className="text-lg font-black text-white">No Dishes Found</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search terms or filters to find what you are craving.
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors"
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
        <div className="py-20 text-center space-y-4 rounded-3xl glass-card border border-white/10 p-8 max-w-md mx-auto shadow-glass">
          <Store size={42} className="mx-auto text-slate-600" />
          <h3 className="text-lg font-black text-white">No Restaurants Found</h3>
          <p className="text-xs text-slate-400">
            We couldn't find restaurants matching your search.
          </p>
        </div>
      )}
    </div>
  );
};

export default Explore;
