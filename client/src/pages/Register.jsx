import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from 'lucide-react';
import Logo from '../components/layout/Logo';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await register(name, email, password, role);
      if (user) {
        navigate('/dashboard', { replace: true });
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Register exception:', err);
      setError(err?.response?.data?.message || err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#090B13] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-hover/15 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass-card rounded-3xl p-8 border border-border/80 shadow-2xl relative z-10"
      >
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <Logo className="mb-4" />
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Join CollabBoard and start managing your workspaces
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 bg-danger/10 border border-danger/30 text-danger text-xs p-3 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-all"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-card border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">
              Account Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-xl text-text-primary focus:outline-none focus:border-purple cursor-pointer"
            >
              <option value="employee">Employee / Member</option>
              <option value="manager">Manager / Admin</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-purple hover:bg-purple-hover text-white font-medium text-sm rounded-xl shadow-purple-glow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-text-secondary mt-6">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-purple font-semibold hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;