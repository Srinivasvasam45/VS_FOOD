import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Sparkles, Utensils, X, ShoppingBag, Check } from 'lucide-react';
import { partnerService } from '../services/partnerService';
import { useLocation } from '../context/LocationContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProfileHeader from '../components/ProfileHeader';
import FoodCard from '../components/FoodCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ReelCard from '../components/ReelCard';
import { formatCurrency } from '../utils/formatters';

const RestaurantDetail = () => {
  const { id } = useParams();
  const { coords } = useLocation();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [partner, setPartner] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('reels'); // 'reels' | 'menu'
  const [selectedReelFood, setSelectedReelFood] = useState(null);
  const [isModalMuted, setIsModalMuted] = useState(true);

  useEffect(() => {
    const fetchPartnerDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const params = {};
        if (coords?.lat && coords?.lng) {
          params.lat = coords.lat;
          params.lng = coords.lng;
        }

        const res = await partnerService.getPartnerById(id, params);
        if (res.success && res.data) {
          setPartner(res.data.partner);
          setFoods(res.data.foods || []);
        } else {
          setError(res.message || 'Restaurant not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load restaurant profile');
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerDetails();
  }, [id, coords]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingSpinner size="lg" message="Loading restaurant portfolio..." />
      </div>
    );
  }

  if (error || !partner) {
    return (
      <div className="max-w-md mx-auto py-20 px-4">
        <ErrorMessage message={error || 'Restaurant profile not found'} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Instagram-style Header */}
      <ProfileHeader
        partner={partner}
        totalFoodCount={foods.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Tab 1: Instagram-style Food Reels Grid */}
      {activeTab === 'reels' && (
        <div>
          {foods.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3 rounded-3xl glass-card border border-white/10 p-8 max-w-md mx-auto shadow-glass">
              <Sparkles size={36} className="mx-auto text-amber-400/60" />
              <p className="text-sm font-bold text-white">No food reels posted yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {foods.map((food) => (
                <div
                  key={food._id}
                  onClick={() => setSelectedReelFood(food)}
                  className="group relative aspect-[9/16] rounded-3xl overflow-hidden bg-cosmic-950 border border-white/10 cursor-pointer shadow-glass hover:border-neon-rose/60 transition-all hover:scale-[1.03]"
                >
                  <img
                    src={
                      food.thumbnailUrl ||
                      food.imageUrl ||
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-cosmic-950/95 via-transparent to-black/30 group-hover:from-cosmic-950/98 transition-all" />

                  {/* Play Icon Badge */}
                  <div className="absolute top-3 right-3 p-2 rounded-2xl glass-dock text-white border border-white/20 shadow-glass group-hover:scale-110 transition-transform">
                    <Play size={12} className="fill-neon-rose text-neon-rose" />
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg glass-dock text-[10px] font-black uppercase tracking-wider text-white border border-white/10">
                    {food.category}
                  </div>

                  {/* Bottom details inside grid cell */}
                  <div className="absolute bottom-0 left-0 right-0 p-3.5 text-left">
                    <p className="text-xs font-black text-white truncate drop-shadow">
                      {food.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-black text-neon-emerald">
                        {formatCurrency(food.price)}
                      </span>
                      <span className="text-[10px] font-black text-amber-400">
                        ⭐ {food.rating || 4.5}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Full Menu List View */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <FoodCard key={food._id} food={{ ...food, foodPartner: partner }} showRestaurant={false} />
            ))}
          </div>
        </div>
      )}

      {/* Modal Popup Viewer when clicking a reel from the grid */}
      {selectedReelFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-cosmic-950/90 backdrop-blur-2xl animate-fade-in">
          <div className="relative w-full max-w-[430px] h-full sm:h-[800px] max-h-full sm:rounded-3xl overflow-hidden bg-black shadow-glass-lg border-0 sm:border sm:border-white/15">
            <button
              onClick={() => setSelectedReelFood(null)}
              className="absolute top-4 left-4 z-40 p-2.5 rounded-full glass-action-btn text-white shadow-glass hover:scale-110 active:scale-95 transition-all"
            >
              <X size={18} />
            </button>

            <ReelCard
              food={{ ...selectedReelFood, foodPartner: partner }}
              isActive={true}
              isMuted={isModalMuted}
              toggleMute={() => setIsModalMuted(!isModalMuted)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
