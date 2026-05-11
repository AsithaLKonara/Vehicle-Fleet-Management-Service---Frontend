'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, RocketLaunchIcon, KeyIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data.data;
      login(token, user);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Verification failed. Please check credentials.');
      } else {
        setError('An unexpected system error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background overflow-hidden">
      {/* Left Side: Auth Form */}
      <div className="w-full lg:w-[450px] p-8 md:p-12 flex flex-col justify-center relative z-10 bg-background">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-12"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">U</div>
            <span className="text-2xl font-bold tracking-tight text-white">UltraDrive</span>
          </Link>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">Welcome <span className="gradient-text">Back.</span></h1>
            <p className="text-text-dim text-lg font-medium leading-relaxed">Enter your credentials to access the fleet management operations.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-muted uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  className="input-field w-full" 
                  placeholder="admin@fleet.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="login-email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-text-muted uppercase tracking-widest">Password</label>
                <Link href="#" className="text-xs font-bold text-primary hover:text-primary-light">Forgot Password?</Link>
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  className="input-field w-full" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="login-password"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm font-medium"
                data-testid="login-error"
              >
                <ShieldCheckIcon className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              className="btn-primary w-full py-4 text-lg"
              disabled={loading}
              data-testid="login-submit"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <KeyIcon className="w-5 h-5" />
                  Sign Into Dashboard
                </div>
              )}
            </button>
          </form>

          <p className="text-center text-text-muted text-sm font-medium">
            Don&apos;t have access? <Link href="#" className="text-primary hover:text-primary-light font-bold">Contact Fleet Admin</Link>
          </p>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Right Side: Visual Brand Experience */}
      <div className="hidden lg:flex flex-1 relative bg-surface overflow-hidden">
        <Image 
          src="/fleet_hero_background_1778484577272.png" 
          alt="UltraDrive Fleet Brand" 
          fill 
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/20 to-transparent"></div>
        
        <div className="absolute bottom-12 left-12 right-12 z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-10 rounded-[2.5rem] max-w-2xl border border-white/10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary/20 rounded-2xl">
                <RocketLaunchIcon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Mission Control for Modern Fleets.</h2>
            </div>
            <p className="text-text-dim text-lg leading-relaxed font-medium">
              Join leading logistics companies using UltraDrive to optimize utilization, track history, and scale operations with enterprise-grade security.
            </p>
            <div className="mt-8 flex gap-8">
              <div>
                <p className="text-3xl font-bold text-white">99.9%</p>
                <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">Reliability</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">12k+</p>
                <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">Assignments</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">24/7</p>
                <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">Live Support</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
