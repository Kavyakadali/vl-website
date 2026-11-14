'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Lock,
  User as UserIcon,
  Mail,
  Phone,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AuthModal() {
  const router = useRouter();
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    login,
    signup,
  } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Signup fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await login(username, password);
      setIsLoading(false);
      if (res.success) {
        if (res.role === 'admin') {
          router.push('/admin');
        }
      } else {
        setErrorMessage(res.error || 'Incorrect username or password. Please try again.');
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('An unexpected error occurred during login.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await signup({ username, password, name, email, phone });
      setIsLoading(false);
      if (res.success) {
        // Logged in automatically
      } else {
        setErrorMessage(res.error || 'Registration failed. Please verify your details.');
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('An unexpected error occurred during registration.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div 
        className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E8E2D8] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1A3B2B] text-white px-6 py-5 flex items-center justify-between border-b border-[#2A5A43]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#2A5A43] text-[#E7C875] flex items-center justify-center font-serif text-xl font-black border border-[#3A7256]">
              VL
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#FAF8F5]">
                {authModalTab === 'signup' ? 'Create an Account' : 'Welcome to VL Designs'}
              </h3>
              <p className="text-[11px] text-[#D8D2C5]">
                {authModalTab === 'signup' ? 'Join for express checkout & order tracking' : 'Sign in to access your orders & saved wishlist'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 text-neutral-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection: Standard Real-World Tabs */}
        <div className="flex border-b border-[#E8E2D8] bg-white px-6 pt-3">
          <button
            onClick={() => { setAuthModalTab('customer'); setErrorMessage(''); }}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
              authModalTab !== 'signup'
                ? 'text-[#1A3B2B]'
                : 'text-[#7D8882] hover:text-[#1C201D]'
            }`}
          >
            Sign In
            {authModalTab !== 'signup' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C29B38]" />
            )}
          </button>

          <button
            onClick={() => { setAuthModalTab('signup'); setErrorMessage(''); }}
            className={`ml-6 pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
              authModalTab === 'signup'
                ? 'text-[#1A3B2B]'
                : 'text-[#7D8882] hover:text-[#1C201D]'
            }`}
          >
            Create Account
            {authModalTab === 'signup' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C29B38]" />
            )}
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Error Notice */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {authModalTab === 'signup' ? (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1C201D] mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#7D8882] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kavya Kadali"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-[#D8D2C5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C201D] mb-1">Username</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#7D8882] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white border border-[#D8D2C5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1C201D] mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7D8882] absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="name@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-[#D8D2C5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C201D] mb-1">Mobile (Optional)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#7D8882] absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="10-digit mobile"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full bg-white border border-[#D8D2C5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C201D] mb-1">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7D8882] absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-[#D8D2C5] rounded-xl pl-9 pr-10 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#7D8882] hover:text-[#1C201D]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-[#1A3B2B] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#2A5A43] transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C201D] mb-1">
                  Username or Email
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#7D8882] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your username or email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white border border-[#D8D2C5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C201D] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7D8882] absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-[#D8D2C5] rounded-xl pl-9 pr-10 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#7D8882] hover:text-[#1C201D]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 text-white bg-[#1A3B2B] hover:bg-[#2A5A43]"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-xs text-[#5F6762]">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthModalTab('signup'); setErrorMessage(''); }}
                  className="font-bold text-[#1A3B2B] hover:underline"
                >
                  Create one now
                </button>
              </div>
            </form>
          )}

          {/* Privacy Note */}
          <div className="mt-5 pt-4 border-t border-[#E8E2D8] flex items-center justify-between text-[11px] text-[#7D8882]">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1A3B2B]" />
              <span>Secure Encrypted Session</span>
            </span>
            <span>VL Designs • 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
