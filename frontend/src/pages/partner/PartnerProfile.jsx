import React, { useState, useEffect } from 'react';
import {
  Settings,
  Store,
  MapPin,
  Clock,
  Phone,
  Save,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { partnerService } from '../../services/partnerService';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';

const PartnerProfile = () => {
  const { partner, updatePartner } = useAuth();

  const [formData, setFormData] = useState({
    restaurantName: '',
    username: '',
    description: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: 17.3850,
    longitude: 78.4867,
    cuisine: '',
    openingHours: '',
    profileImage: '',
    coverImage: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await partnerService.getCurrentPartnerProfile();
        if (res.success && res.data?.partner) {
          const p = res.data.partner;
          setFormData({
            restaurantName: p.restaurantName || '',
            username: p.username || '',
            description: p.description || '',
            phone: p.phone || '',
            address: p.address || '',
            city: p.city || '',
            state: p.state || '',
            pincode: p.pincode || '',
            latitude: p.latitude || 17.3850,
            longitude: p.longitude || 78.4867,
            cuisine: Array.isArray(p.cuisine) ? p.cuisine.join(', ') : p.cuisine || '',
            openingHours: p.openingHours || '10:00 AM - 11:00 PM',
            profileImage: p.profileImage || '',
            coverImage: p.coverImage || '',
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg('');
      setSuccessMsg('');

      const res = await partnerService.updatePartnerProfile({
        ...formData,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      });

      if (res.success && res.data) {
        updatePartner(res.data);
        setSuccessMsg('Restaurant profile saved successfully!');
        setTimeout(() => setSuccessMsg(''), 3500);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update restaurant profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingSpinner size="lg" message="Loading restaurant profile settings..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Settings size={24} className="text-amber-400" />
            <span>Restaurant Profile Settings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Update your public profile, logo, banner, address coordinates, and opening hours
          </p>
        </div>

        {formData.username && (
          <Link
            to={`/restaurant/${formData.username}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-400 text-xs font-bold transition-colors self-start sm:self-auto"
          >
            <span>View Public Page</span>
            <ExternalLink size={14} />
          </Link>
        )}
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
            <Check size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Restaurant Brand Name *
              </label>
              <input
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Handle / Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                disabled
                className="w-full px-4 py-3 rounded-2xl bg-slate-800/50 border border-slate-800 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Bio / Restaurant Story
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Media URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Logo / Avatar Image URL
              </label>
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Banner Cover Image URL
              </label>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Location & GPS */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin size={14} />
              <span>Location & Coordinates (For Customer Distance Calculation)</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Latitude (e.g. 17.4156)
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Longitude (e.g. 78.4357)
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Operational Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cuisines (Comma Separated)
              </label>
              <input
                type="text"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                placeholder="Biryani, Hyderabadi, Mughlai"
                className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Opening Hours
              </label>
              <input
                type="text"
                name="openingHours"
                value={formData.openingHours}
                onChange={handleChange}
                placeholder="10:00 AM - 11:30 PM"
                className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save size={16} />
                <span>Save Restaurant Profile</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PartnerProfile;
