import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Flame, Mail, Lock, ArrowRight, Store, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await login(email, password);
      if (result.success) {
        if (result.user.role === 'foodPartner') {
          navigate('/partner/dashboard');
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setError(result.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl glass-card border border-white/15 shadow-glass-lg space-y-6 relative overflow-hidden">
        {/* Decorative Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 relative">
          <div className="relative inline-block mb-1">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-brand-600 to-neon-rose blur-md opacity-80" />
            <div className="relative w-14 h-14 rounded-2xl bg-cosmic-950 border border-white/20 flex items-center justify-center text-neon-rose shadow-glass">
              <Flame size={28} className="fill-neon-rose animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to watch food reels, order meals, or manage your kitchen
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-rose"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-rose"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-rose-500 to-neon-rose hover:opacity-95 text-white text-xs font-black flex items-center justify-center gap-2 shadow-neon-rose transition-all active:scale-95"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center space-y-3">
          <p className="text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-neon-rose hover:underline">
              Create an Account
            </Link>
          </p>

          <Link
            to="/register?role=foodPartner"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold"
          >
            <Store size={14} />
            <span>Register as a Restaurant Partner</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
