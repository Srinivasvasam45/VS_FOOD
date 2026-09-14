import React, { useState, useEffect } from 'react';
import {
  Store,
  MapPin,
  Clock,
  Phone,
  Check,
  Save,
  Image,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { partnerService } from '../../services/partnerService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const PartnerProfile = () => {
  const { partner, setPartner } = useAuth();

  const [formData, setFormData] = useState({
    restaurantName: '',
    description: '',
    address: '',
    city: '',
    cuisine: '',
    phone: '',
    openingHours: '',
    profileImage: '',
    coverImage: '',
    lat: '',
    lng: '',
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
            description: p.description || '',
            address: p.address || '',
            city: p.city || '',
            cuisine: Array.isArray(p.cuisine) ? p.cuisine.join(', ') : p.cuisine || '',
            phone: p.phone || '',
            openingHours: p.openingHours || '',
            profileImage: p.profileImage || '',
            coverImage: p.coverImage || '',
            lat: p.location?.coordinates ? p.location.coordinates[1] : '',
            lng: p.location?.coordinates ? p.location.coordinates[0] : '',
          });
        }
      } catch (err) {
        setErrorMsg('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetCurrentCoords = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData({
            ...formData,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setSuccessMsg('GPS coordinates captured from current position!');
          setTimeout(() => setSuccessMsg(''), 3000);
        },
        () => {
          alert('Location permission denied.');
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg('');
      setSuccessMsg('');

      const payload = {
        ...formData,
        cuisine: formData.cuisine.split(',').map((c) => c.trim()).filter(Boolean),
        location: {
          type: 'Point',
          coordinates: [Number(formData.lng) || 78.4867, Number(formData.lat) || 17.3850],
        },
      };

      const res = await partnerService.updatePartnerProfile(payload);
      if (res.success && res.data) {
        if (setPartner) setPartner(res.data);
        setSuccessMsg('Restaurant profile saved successfully!');
        setTimeout(() => setSuccessMsg(''), 3500);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update partner profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingSpinner size="lg" message="Loading restaurant profile parameters..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Store size={24} className="text-amber-400" />
            <span>Restaurant Brand Profile</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure your brand identity, cover image, cuisine tags, and GPS delivery coordinates
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/15 shadow-glass-lg space-y-6 relative overflow-hidden">
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-neon-emerald flex items-center gap-2">
            <Check size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Restaurant Brand Name *
              </label>
              <input
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Contact Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Brand Bio / Culinary Tagline
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Signature hyderabadi biryanis, authentic clay-pot dum style cooking..."
              className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Cuisines (Comma Separated)
              </label>
              <input
                type="text"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                placeholder="Biryani, Mughlai, Kebabs"
                className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Operating Hours
              </label>
              <input
                type="text"
                name="openingHours"
                value={formData.openingHours}
                onChange={handleChange}
                placeholder="11:00 AM - 11:30 PM"
                className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Media Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Restaurant Avatar / Logo URL
              </label>
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Restaurant Cover / Banner Image URL
              </label>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Location & GPS */}
          <div className="p-5 rounded-3xl glass-dock border border-white/10 space-y-4 shadow-glass">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={15} />
                <span>Restaurant Location & GPS</span>
              </span>

              <button
                type="button"
                onClick={handleGetCurrentCoords}
                className="text-[11px] font-bold text-neon-emerald hover:underline flex items-center gap-1"
              >
                <span>Use Current Device GPS</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
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
