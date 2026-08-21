import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Chrome } from 'lucide-react';
import Logo from '../components/layout/Logo';
import Button from '../components/layout/Button';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('hesaradilnath@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Week 1 mock route navigation only
    navigate('/dashboard');
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
        <div className="flex flex-col items-center text-center mb-8">
          <Logo className="mb-4" />
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Sign in to access your collaborative workspaces
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-text-primary transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-text-secondary hover:text-text-primary">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-card border-border text-purple focus:ring-purple/40"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-purple hover:text-purple-hover font-medium transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {/* Main Submit Button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            className="mt-2"
          >
            <span>Sign In to Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>



       

        {/* Footer Link */}
        <p className="text-center text-xs text-text-secondary mt-6">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/dashboard')}
            className="text-purple font-semibold hover:underline"
          >
            Create Workspace Account
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;