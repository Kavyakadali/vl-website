'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
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

export default function LoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, login, signup } = useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Signup fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect
  if (isAuthenticated && user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF8F5] px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E8E2D8] shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1A3B2B] text-[#E7C875] flex items-center justify-center font-bold text-xl mx-auto shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1A3B2B]">
            Welcome Back, {user.name}
          </h2>
          <p className="text-xs text-[#5F6762]">
            You are signed in as <strong>@{user.username}</strong>
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href={isAdmin ? '/admin' : '/account'}
              className="bg-[#1A3B2B] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#2A5A43]"
            >
              Go to {isAdmin ? 'Admin Dashboard' : 'My Account'}
            </Link>
            <Link
              href="/"
              className="bg-white border border-[#D8D2C5] text-[#1C201D] py-2 rounded-xl text-xs font-semibold hover:border-[#1A3B2B]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      setIsLoading(false);
      if (res.success) {
        if (res.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/account');
        }
      } else {
        setErrorMessage(res.error || 'Incorrect username or password. Please try again.');
      }
    }, 300);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = signup({ username, password, name, email, phone });
      setIsLoading(false);
      if (res.success) {
        router.push('/account');
      } else {
        setErrorMessage(res.error || 'Registration failed. Please check your information.');
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8E2D8] shadow-xl overflow-hidden">
        
        {/* Banner */}
        <div className="bg-[#1A3B2B] text-white p-6 text-center border-b border-[#2A5A43]">
          <div className="w-12 h-12 rounded-2xl bg-[#2A5A43] text-[#E7C875] flex items-center justify-center font-serif text-2xl font-black mx-auto mb-3 shadow-md border border-[#3A7256]">
            VL
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-wide">
            {activeTab === 'signup' ? 'Create Your Account' : 'Sign In to VL Designs'}
          </h1>
          <p className="text-xs text-[#D8D2C5] mt-1">
            {activeTab === 'signup' ? 'Join to track orders and save your favorites' : 'Enter your credentials to access your personal boutique'}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#E8E2D8] bg-[#FAF8F5] px-6 pt-3">
          <button
            onClick={() => { setActiveTab('signin'); setErrorMessage(''); }}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
              activeTab === 'signin'
                ? 'text-[#1A3B2B]'
                : 'text-[#7D8882] hover:text-[#1C201D]'
            }`}
          >
            Sign In
            {activeTab === 'signin' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C29B38]" />
            )}
          </button>

          <button
            onClick={() => { setActiveTab('signup'); setErrorMessage(''); }}
            className={`ml-6 pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
              activeTab === 'signup'
                ? 'text-[#1A3B2B]'
                : 'text-[#7D8882] hover:text-[#1C201D]'
            }`}
          >
            Create Account
            {activeTab === 'signup' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C29B38]" />
            )}
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {/* Error Notice */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {activeTab === 'signup' ? (
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
                    className="w-full bg-[#FAF8F5] border border-[#D8D2C5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
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
                    className="w-full bg-[#FAF8F5] border border-[#D8D2C5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1C201D] mb-1">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7D8882] absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="name@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#D8D2C5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
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
                      className="w-full bg-[#FAF8F5] border border-[#D8D2C5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C201D] mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7D8882] absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D8D2C5] rounded-xl pl-9 pr-10 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
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
                <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
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
                    className="w-full bg-[#FAF8F5] border border-[#D8D2C5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
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
                    className="w-full bg-[#FAF8F5] border border-[#D8D2C5] rounded-xl pl-9 pr-10 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
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
                  onClick={() => { setActiveTab('signup'); setErrorMessage(''); }}
                  className="font-bold text-[#1A3B2B] hover:underline"
                >
                  Create one now
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-[#E8E2D8] flex items-center justify-between text-[11px] text-[#7D8882]">
            <Link href="/" className="hover:text-[#1A3B2B]">
              ← Back to Storefront
            </Link>
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1A3B2B]" />
              <span>Secure Session</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
