import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Flame, User, Store, Mail, Lock, Phone, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'foodPartner' ? 'foodPartner' : 'user';

  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    // Partner specific
    restaurantName: '',
    username: '',
    address: '',
    city: 'Hyderabad',
    cuisine: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('role') === 'foodPartner') {
      setRole('foodPartner');
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email, and password are required.');
      return;
    }

    if (role === 'foodPartner') {
      if (!formData.restaurantName || !formData.address || !formData.city) {
        setError('Restaurant name, address, and city are required for food partners.');
        return;
      }
    }

    try {
      setLoading(true);
      setError('');

      const payload = {
        ...formData,
        role,
      };

      const result = await register(payload);
      if (result.success) {
        if (role === 'foodPartner') {
          navigate('/partner/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(result.message || 'Registration failed.');
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl p-8 sm:p-10 rounded-3xl glass-card border border-white/15 shadow-glass-lg space-y-6 relative overflow-hidden">
        {/* Decorative Top Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-neon-rose/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 relative">
          <div className="relative inline-block mb-1">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-brand-600 to-neon-rose blur-md opacity-80" />
            <div className="relative w-14 h-14 rounded-2xl bg-cosmic-950 border border-white/20 flex items-center justify-center text-neon-rose shadow-glass">
              <Flame size={28} className="fill-neon-rose animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs text-slate-400">
            Join VS Food to watch food reels, order, or partner with us
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-3xl glass-dock border border-white/10 shadow-glass">
          <button
            type="button"
            onClick={() => setRole('user')}
            className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black transition-all ${
              role === 'user'
                ? 'bg-gradient-to-r from-brand-600 to-neon-rose text-white shadow-neon-rose scale-105'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User size={15} />
            <span>Foodie (User)</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('foodPartner')}
            className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black transition-all ${
              role === 'foodPartner'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-neon-amber font-black scale-105'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store size={15} />
            <span>Restaurant Partner</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {role === 'foodPartner' ? 'Owner / Manager Name *' : 'Full Name *'}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-rose"
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
                className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-rose"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="user@example.com"
                className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-rose"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Password (min 6 chars) *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-rose"
              />
            </div>
          </div>

          {/* Food Partner Specific Fields */}
          {role === 'foodPartner' && (
            <div className="p-5 rounded-3xl glass-dock border border-amber-500/30 space-y-4 shadow-glass animate-fade-in">
              <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Store size={15} />
                <span>Restaurant Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Restaurant Name *
                  </label>
                  <input
                    type="text"
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    required={role === 'foodPartner'}
                    placeholder="e.g. Royal Biryani House"
                    className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Handle / Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="e.g. royalbiryani"
                    className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Restaurant Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required={role === 'foodPartner'}
                  placeholder="Plot 10, Road No 36, Jubilee Hills"
                  className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required={role === 'foodPartner'}
                    className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Cuisines (comma separated)
                  </label>
                  <input
                    type="text"
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleChange}
                    placeholder="Biryani, Mughlai, Kebabs"
                    className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
              role === 'foodPartner'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-slate-950 shadow-neon-amber font-black'
                : 'bg-gradient-to-r from-brand-600 via-rose-500 to-neon-rose hover:opacity-95 text-white shadow-neon-rose'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create {role === 'foodPartner' ? 'Restaurant' : 'User'} Account</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-neon-rose hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
