/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  X,
  User,
  ShoppingBag,
  Heart,
  LogOut,
  ChevronRight,
  Eye,
  KeyRound,
  Mail,
  Lock,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
}

export default function AccountModal({ isOpen, onClose, onSelectProduct }: AccountModalProps) {
  const {
    user,
    orders,
    wishlist,
    products,
    loginUser,
    logoutUser,
    updateProfile,
    language,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('profile');
  
  // Auth screen state (if guest user or logged out)
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [authEmail, setAuthEmail] = useState('mamun15yr@gmail.com');
  const [authPassword, setAuthPassword] = useState('password123');
  const [authName, setAuthName] = useState('Mamun Chowdhury');

  // Profile Form state editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Mamun Chowdhury',
    phone: user?.phone || '01712345678',
    address: user?.address || 'House 42, Road 11, Banani',
    district: user?.district || 'Dhaka',
    division: user?.division || 'Dhaka'
  });

  // Sync profile form when user changes
  React.useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || 'Mamun Chowdhury',
        phone: user.phone || '01712345678',
        address: user.address || 'House 42, Road 11, Banani',
        district: user.district || 'Dhaka',
        division: user.division || 'Dhaka'
      });
    }
  }, [user]);

  if (!isOpen) return null;

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authEmail.trim() === '') return;
    loginUser(authEmail, authMode === 'signup' ? authName : undefined);
    setIsLoggedIn(true);
  };

  // Handle Logout
  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    setIsEditingProfile(false);
  };

  // Filter products that are wishlisted
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative max-w-3xl w-full rounded-sm border border-stone-200 bg-white text-stone-900 shadow-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-sm border border-stone-200 bg-stone-50 text-stone-500 hover:text-black cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* AUTHENTICATION SHIELD GATE (IF LOGGED OUT) */}
        {!user ? (
          <div className="max-w-md mx-auto py-6 space-y-6 text-center">
            <div className="relative flex h-14 w-14 mx-auto items-center justify-center rounded-sm border border-gold-500 bg-gold-500/5">
              <KeyRound className="w-6 h-6 text-gold-600" />
            </div>

            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                <div className="text-center">
                  <h2 className="font-serif text-2xl font-bold text-gold-600 tracking-widest">MEMBER ACCESS</h2>
                  <p className="text-xs text-stone-500 mt-1 font-sans">Login to explore your premium orders history</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-sm bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-gold-500 text-stone-950"
                      />
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-sm bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-gold-500 text-stone-950"
                      />
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gold-500 hover:brightness-110 text-black rounded-sm font-bold text-xs tracking-widest uppercase cursor-pointer"
                >
                  SECURE SIGN IN
                </button>

                <div className="flex justify-between text-xs text-stone-500 pt-1 font-sans">
                  <button type="button" onClick={() => setAuthMode('forgot')} className="hover:text-gold-600 cursor-pointer">Forgot Password?</button>
                  <button type="button" onClick={() => setAuthMode('signup')} className="hover:text-gold-600 font-bold cursor-pointer">Create Account</button>
                </div>
              </form>
            )}

            {authMode === 'signup' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                <div className="text-center">
                  <h2 className="font-serif text-2xl font-bold text-gold-600 tracking-widest">REGISTRATION</h2>
                  <p className="text-xs text-stone-500 mt-1">Join the Mifta Fragrance Club for royal benefits</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full h-11 px-4 rounded-sm bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-gold-500 text-stone-950"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full h-11 px-4 rounded-sm bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-gold-500 text-stone-950"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gold-500 hover:brightness-110 text-black rounded-sm font-bold text-xs tracking-widest uppercase cursor-pointer"
                >
                  REGISTER ACCOUNT
                </button>

                <button type="button" onClick={() => setAuthMode('login')} className="block w-full text-center text-xs text-stone-500 hover:text-gold-600 font-bold mt-2 cursor-pointer">
                  Already have an account? Sign In
                </button>
              </form>
            )}

            {authMode === 'forgot' && (
              <div className="space-y-4 text-left">
                <div className="text-center">
                  <h2 className="font-serif text-2xl font-bold text-gold-600 tracking-widest">RESET PASSWORD</h2>
                  <p className="text-xs text-stone-500 mt-1">Enter your email and we will send a password recovery token</p>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full h-11 px-4 rounded-sm bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-gold-500 text-stone-950 placeholder-stone-400"
                  />
                </div>

                <button
                  onClick={() => {
                    addToast({ en: 'Simulated password reset email dispatched!', bn: 'পাসওয়ার্ড রিসেট ইমেইল পাঠানো হয়েছে!' }, 'success');
                    setAuthMode('login');
                  }}
                  className="w-full py-3 bg-gold-500 hover:brightness-110 text-black rounded-sm font-bold text-xs tracking-widest uppercase cursor-pointer"
                >
                  SEND RESET LINK
                </button>

                <button type="button" onClick={() => setAuthMode('login')} className="block w-full text-center text-xs text-stone-500 hover:text-gold-600 font-bold mt-2 cursor-pointer">
                  Return to Sign In
                </button>
              </div>
            )}

          </div>
        ) : (
          /* FULL CUSTOMER LOGGED IN PROFILE INTERFACE */
          <div className="space-y-6 text-left">
            
            {/* Header / User greeting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-sm border border-gold-500 bg-gold-500/5 flex items-center justify-center">
                  <User className="w-6 h-6 text-gold-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-stone-900 font-sans">{user.name}</h2>
                  <span className="text-xs text-stone-500 font-mono">{user.email}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all cursor-pointer font-sans"
              >
                <LogOut className="w-4 h-4" />
                <span>{language === 'en' ? 'Log Out' : 'লগআউট'}</span>
              </button>
            </div>

            {/* Tab Selectors */}
            <div className="flex border-b border-stone-200 gap-1 sm:gap-4 overflow-x-auto">
              {[
                { id: 'profile', label: { en: 'Personal Profile', bn: 'আমার প্রোফাইল' }, icon: <User className="w-4 h-4" /> },
                { id: 'orders', label: { en: `Orders Logs (${orders.length})`, bn: `অর্ডার লগ (${orders.length})` }, icon: <ShoppingBag className="w-4 h-4" /> },
                { id: 'wishlist', label: { en: `Saved Wishlist (${wishlistedProducts.length})`, bn: `উইশলিস্ট (${wishlistedProducts.length})` }, icon: <Heart className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold tracking-wider uppercase border-b-2 -mb-px transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-gold-500 text-gold-600'
                      : 'border-transparent text-stone-400 hover:text-stone-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label[language]}</span>
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="min-h-[280px] py-3 text-sm">
              
              {/* Profile Editor */}
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  {!isEditingProfile ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-sm border border-stone-200 bg-stone-50">
                      <div className="space-y-1">
                        <span className="block text-[9px] uppercase tracking-wider text-gold-600 font-bold font-mono">Contact Name</span>
                        <span className="font-sans font-medium text-stone-800">{user.name}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="block text-[9px] uppercase tracking-wider text-gold-600 font-bold font-mono">Mobile Phone</span>
                        <span className="font-sans font-medium text-stone-800">{user.phone || 'Not provided'}</span>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <span className="block text-[9px] uppercase tracking-wider text-gold-600 font-bold font-mono">Default Delivery Address</span>
                        <span className="font-sans font-medium text-stone-800">{user.address || 'Not provided'}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="block text-[9px] uppercase tracking-wider text-gold-600 font-bold font-mono">District / Division</span>
                        <span className="font-sans font-medium text-stone-800">
                          {user.district ? `${user.district}, ${user.division}` : 'Not provided'}
                        </span>
                      </div>

                      <div className="md:col-span-2 pt-4">
                        <button
                          onClick={() => setIsEditingProfile(true)}
                          className="px-5 py-2.5 rounded-sm border border-gold-500 text-gold-600 text-xs font-bold hover:bg-gold-500/5 transition-colors cursor-pointer tracking-wider"
                        >
                          EDIT SHIPPING INFO
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-500 mb-1">Name</label>
                          <input
                            type="text"
                            required
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                            className="w-full h-11 px-4 rounded-sm bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-gold-500 text-stone-950"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-500 mb-1">Phone</label>
                          <input
                            type="text"
                            required
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            className="w-full h-11 px-4 rounded-sm bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-gold-500 text-stone-950"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-stone-500 mb-1">Address</label>
                          <input
                            type="text"
                            required
                            value={profileForm.address}
                            onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                            className="w-full h-11 px-4 rounded-sm bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-gold-500 text-stone-950"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-5 py-2.5 border border-stone-200 bg-white rounded-sm text-stone-500 text-xs font-bold cursor-pointer"
                        >
                          CANCEL
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-gold-500 text-black rounded-sm text-xs font-bold cursor-pointer"
                        >
                          SAVE CHANGES
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Order Logs Tracking history */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-10 space-y-2">
                      <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
                      <p className="text-xs text-stone-400">No purchase records found yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                      {orders.map((ord) => (
                        <div key={ord.id} className="p-4 rounded-sm border border-stone-200 bg-stone-50 text-xs space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2.5">
                            <div>
                              <span className="font-bold text-gold-600 font-mono text-sm">{ord.id}</span>
                              <span className="text-stone-500 ml-2 font-mono text-[10px]">{new Date(ord.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest ${
                                ord.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                ord.orderStatus === 'shipped' ? 'bg-sky-50 text-sky-600 border border-sky-200' :
                                ord.orderStatus === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-200' :
                                'bg-gold-50 text-gold-600 border border-gold-200'
                              }`}>
                                {ord.orderStatus}
                              </span>
                              <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold uppercase ${
                                ord.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                              }`}>
                                {ord.paymentStatus}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <span className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider">Items Purchased:</span>
                            <div className="space-y-1 pl-1">
                              {ord.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between font-sans text-stone-700">
                                  <span>• {item.name} {item.size ? `(${item.size})` : ''} x {item.quantity}</span>
                                  <span className="font-mono text-stone-500">৳{item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {ord.trackingNumber && (
                            <div className="p-2.5 bg-stone-100 rounded-sm border border-stone-200 flex items-center justify-between text-stone-700">
                              <span className="text-stone-500">Tracking Code:</span>
                              <span className="font-mono font-bold text-emerald-600">{ord.trackingNumber}</span>
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-2 border-t border-stone-200">
                            <span className="text-stone-500 uppercase tracking-widest font-bold text-[9px]">Grand Total Paid:</span>
                            <span className="font-mono font-bold text-gold-600 text-sm">৳{ord.total}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Saved Wishlist Grid */}
              {activeTab === 'wishlist' && (
                <div className="space-y-4">
                  {wishlistedProducts.length === 0 ? (
                    <div className="text-center py-10 space-y-2">
                      <Heart className="w-10 h-10 text-stone-300 mx-auto" />
                      <p className="text-xs text-stone-400">Your wishlist folder is currently empty.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-1">
                      {wishlistedProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            onSelectProduct(p);
                            onClose();
                          }}
                          className="p-2.5 rounded-sm border border-stone-200 bg-stone-50 hover:border-gold-500 cursor-pointer flex flex-col gap-2 transition-colors text-left"
                        >
                          <img src={p.images[0]} className="w-full aspect-square object-cover rounded-sm" />
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold truncate text-stone-900">{p.name[language]}</h4>
                            <span className="text-xs text-gold-600 font-mono font-bold">৳{p.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
