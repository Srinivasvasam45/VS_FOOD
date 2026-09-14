import React, { useState } from 'react';
import { User, Phone, Mail, ShieldCheck, Check, LogOut, ReceiptText, Sparkles, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    profileImage: user?.profileImage || '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');

      const res = await authService.updateUserProfile(formData);
      if (res.success && res.data) {
        updateUser(res.data);
        setSuccessMsg('Profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          User Account Profile
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal information and contact details
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/15 shadow-glass-lg space-y-6">
        {/* Avatar & Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-white/10">
          <div className="p-1 rounded-2xl bg-gradient-to-tr from-brand-500 via-neon-rose to-amber-500 shadow-glass">
            <img
              src={
                formData.profileImage ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
              }
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-cosmic-950"
            />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">{user?.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[9px] font-black bg-brand-500/20 text-neon-rose border border-brand-500/30 uppercase tracking-widest">
              {user?.role}
            </span>
          </div>
        </div>

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

        {/* Profile Update Form */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white focus:outline-none focus:border-neon-rose"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Email Address (Permanent)
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 rounded-2xl glass-dock border border-white/5 text-xs text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white focus:outline-none focus:border-neon-rose"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Profile Avatar Image URL
            </label>
            <input
              type="url"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white focus:outline-none focus:border-neon-rose"
            />
          </div>

          <div className="pt-3 flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-neon-rose hover:opacity-95 text-white text-xs font-black transition-all shadow-neon-rose flex items-center gap-2 active:scale-95"
            >
              <Save size={15} />
              <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="px-4 py-2.5 rounded-2xl glass-dock hover:bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-colors border border-rose-500/20"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
