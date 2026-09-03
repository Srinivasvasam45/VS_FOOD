import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Upload,
  Video,
  Image,
  ArrowLeft,
  Check,
  AlertCircle,
  Play,
} from 'lucide-react';
import { foodService } from '../../services/foodService';

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

const AddFood = () => {
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

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [uploadMode, setUploadMode] = useState('url'); // 'url' | 'file'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 60 * 1024 * 1024) {
        setError('Video file exceeds 60MB limit.');
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price || !formData.category) {
      setError('Please fill in all required fields (Name, Price, Category).');
      return;
    }

    if (uploadMode === 'url' && !formData.videoUrl.trim()) {
      setError('Please provide a Food Reel video URL (e.g. MP4 link).');
      return;
    }

    if (uploadMode === 'file' && !videoFile) {
      setError('Please select a video file to upload.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (uploadMode === 'file') {
        const data = new FormData();
        data.append('name', formData.name.trim());
        data.append('description', formData.description.trim());
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('foodType', formData.foodType);
        data.append('isAvailable', formData.isAvailable);

        if (videoFile) data.append('video', videoFile);
        if (thumbnailFile) data.append('thumbnail', thumbnailFile);
        if (formData.thumbnailUrl) data.append('thumbnailUrl', formData.thumbnailUrl);

        await foodService.createFood(data);
      } else {
        await foodService.createFood({
          ...formData,
          price: Number(formData.price),
        });
      }

      navigate('/partner/food');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to upload food reel. If uploading large files, ensure Cloudinary is configured.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/partner/food"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Food Portfolio</span>
      </Link>

      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Sparkles size={24} className="text-amber-400" />
            <span>Upload New Food Reel</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Add a vertical food video, set the price, and publish it directly to the discovery feed
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Food Dish Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Special Chicken Dum Biryani"
                className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
                placeholder="299"
                className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Food Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Dietary Food Type *
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
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      formData.foodType === type.id
                        ? 'bg-amber-500 text-slate-950 border-amber-500 font-black'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description / Flavor Notes
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the aromatic spices, freshness, side accompaniments..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Media Input Mode: Direct URL vs File Upload */}
          <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Video size={15} />
                <span>Food Reel Media Source</span>
              </span>

              <div className="flex items-center rounded-xl bg-slate-800 p-1 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    uploadMode === 'url' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Direct URL
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('file')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    uploadMode === 'file' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Cloudinary Upload
                </button>
              </div>
            </div>

            {uploadMode === 'url' ? (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Food Reel Video URL (.mp4 / video stream) *
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    placeholder="https://assets.mixkit.co/.../video.mp4"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Tip: Enter any direct vertical MP4 link or Cloudinary video URL.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Cover / Thumbnail Image URL
                  </label>
                  <input
                    type="url"
                    name="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Video Reel File (MP4, WEBM up to 60MB) *
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Cover Thumbnail (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailFileChange}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-700 file:text-slate-200"
                  />
                </div>
              </div>
            )}

            {/* Video preview preview */}
            {(videoPreview || formData.videoUrl) && (
              <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center gap-4">
                <div className="relative w-24 aspect-[9/16] rounded-xl overflow-hidden bg-black border border-slate-700 shrink-0">
                  <video
                    src={videoPreview || formData.videoUrl}
                    muted
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <span className="font-bold text-slate-200 block">Live Reel Preview</span>
                  <p>Your video is ready to stream vertically in customer discovery feeds.</p>
                </div>
              </div>
            )}
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
            <label htmlFor="isAvailable" className="text-xs font-semibold text-slate-300">
              Immediately available for orders
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles size={16} />
                <span>Publish Food Reel</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFood;
