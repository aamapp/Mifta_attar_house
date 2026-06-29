/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  X,
  ArrowLeft,
  User,
  ShoppingBag,
  Heart,
  LogOut,
  ChevronRight,
  ChevronDown,
  Eye,
  KeyRound,
  Mail,
  Lock,
  Compass,
  Camera,
  Image as ImageIcon,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SmartSelect from './SmartSelect';
import { locationData } from '../lib/locationData';
import { uploadProductImage } from '../lib/supabase';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
  onAdminAccess?: () => void;
}

export default function AccountModal({ isOpen, onClose, onSelectProduct, onAdminAccess }: AccountModalProps) {
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
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');

  // Profile Form state editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    district: user?.district || '',
    division: user?.division || '',
    upazila: user?.upazila || '',
    photoURL: user?.photoURL || ''
  });

  // Sync profile form when user changes
  React.useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        district: user.district || '',
        division: user.division || '',
        upazila: user.upazila || '',
        photoURL: user.photoURL || ''
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast({ en: 'Please select an image file.', bn: 'দয়া করে একটি ছবি ফাইল নির্বাচন করুন।' }, 'error');
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const publicUrl = await uploadProductImage(file);
      if (publicUrl) {
        updateProfile({ photoURL: publicUrl });
        setProfileForm(prev => ({ ...prev, photoURL: publicUrl }));
        addToast({ en: 'Profile photo updated!', bn: 'প্রোফাইল ছবি আপডেট হয়েছে!' }, 'success');
      }
    } catch (err) {
      console.error('Photo upload error:', err);
      addToast({ en: 'Failed to upload photo.', bn: 'ছবি আপলোড করতে ব্যর্থ হয়েছে।' }, 'error');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authEmail.trim() === '') return;

    // SECRET ADMIN LOGIN CHECK
    if (authEmail.trim().toLowerCase() === 'admin@mifta.com' && authPassword === 'mifta@786#admin') {
      onClose();
      if (onAdminAccess) onAdminAccess();
      addToast({ 
        en: 'Secret Admin Portal Accessed!', 
        bn: 'সিক্রেট অ্যাডমিন পোর্টাল অ্যাক্সেস করা হয়েছে!' 
      }, 'success');
      return;
    }

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
    <div className="fixed inset-0 z-50 bg-white text-stone-900 flex flex-col h-screen overflow-hidden pb-safe">
      {/* Top Sticky Header */}
      <div className="sticky top-0 bg-white border-b border-stone-100 z-40 w-full shadow-xs shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 -ml-2 rounded-lg text-stone-700 hover:text-stone-950 hover:bg-stone-50 transition-all font-sans font-bold text-sm sm:text-base cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-orange-600 shrink-0" />
            <span className="font-extrabold text-stone-850 text-sm sm:text-base">{language === 'en' ? 'Back to Shop' : 'হোমে ফিরে যান'}</span>
          </button>
          
          <h2 className="hidden sm:block font-serif text-xs uppercase tracking-widest font-bold text-stone-850">
            {language === 'en' ? 'My Account' : 'আমার অ্যাকাউন্ট'}
          </h2>
          
          <button
            onClick={onClose}
            className="p-1.5 flex items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 hover:text-stone-950 hover:bg-stone-50 hover:scale-105 shadow-xs transition-all cursor-pointer"
            title={language === 'en' ? 'Close' : 'বন্ধ করুন'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative w-full max-w-7xl mx-auto p-6 sm:p-12 pb-32 sm:pb-32">
        {/* AUTHENTICATION SHIELD GATE (IF LOGGED OUT) */}
        {!user ? (
          <div className="max-w-md mx-auto py-6 space-y-6 text-center">
            <div className="relative flex h-14 w-14 mx-auto items-center justify-center rounded-sm border border-gold-500 bg-gold-500/5">
              <KeyRound className="w-6 h-6 text-gold-600" />
            </div>

            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                <div className="text-center">
                  <h2 className="font-serif text-2xl font-bold text-gold-600 tracking-widest">
                    {language === 'en' ? 'MEMBER ACCESS' : 'সদস্য লগইন'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1 font-sans">
                    {language === 'en' ? 'Login to explore your premium orders history' : 'আপনার প্রিমিয়াম অর্ডার হিস্ট্রি দেখতে লগইন করুন'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1">
                      {language === 'en' ? 'Email Address' : 'ইমেইল অ্যাড্রেস'}
                    </label>
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
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1">
                      {language === 'en' ? 'Password' : 'পাসওয়ার্ড'}
                    </label>
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
                  {language === 'en' ? 'SECURE SIGN IN' : 'নিরাপদ লগইন'}
                </button>

                <div className="flex justify-between text-xs text-stone-500 pt-1 font-sans">
                  <button type="button" onClick={() => setAuthMode('forgot')} className="hover:text-gold-600 cursor-pointer">
                    {language === 'en' ? 'Forgot Password?' : 'পাসওয়ার্ড ভুলে গেছেন?'}
                  </button>
                  <button type="button" onClick={() => setAuthMode('signup')} className="hover:text-gold-600 font-bold cursor-pointer">
                    {language === 'en' ? 'Create Account' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}
                  </button>
                </div>
              </form>
            )}

            {authMode === 'signup' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                <div className="text-center">
                  <h2 className="font-serif text-2xl font-bold text-gold-600 tracking-widest">
                    {language === 'en' ? 'REGISTRATION' : 'নিবন্ধন করুন'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    {language === 'en' ? 'Join the Mifta Fragrance Club for royal benefits' : 'রয়েল বেনিফিটের জন্য মিফতাহ ফ্র্যাগ্রেন্স ক্লাবে যোগ দিন'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1">
                      {language === 'en' ? 'Full Name' : 'পূর্ণ নাম'}
                    </label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full h-11 px-4 rounded-sm bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-gold-500 text-stone-950"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1">
                      {language === 'en' ? 'Email Address' : 'ইমেইল অ্যাড্রেস'}
                    </label>
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
                  {language === 'en' ? 'REGISTER ACCOUNT' : 'অ্যাকাউন্ট নিবন্ধন করুন'}
                </button>

                <button type="button" onClick={() => setAuthMode('login')} className="block w-full text-center text-xs text-stone-500 hover:text-gold-600 font-bold mt-2 cursor-pointer">
                  {language === 'en' ? 'Already have an account? Sign In' : 'ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন'}
                </button>
              </form>
            )}

            {authMode === 'forgot' && (
              <div className="space-y-4 text-left">
                <div className="text-center">
                  <h2 className="font-serif text-2xl font-bold text-gold-600 tracking-widest">
                    {language === 'en' ? 'RESET PASSWORD' : 'পাসওয়ার্ড রিসেট'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    {language === 'en' ? 'Enter your email and we will send a password recovery token' : 'আপনার ইমেইল দিন, আমরা একটি পাসওয়ার্ড পুনরুদ্ধারের লিঙ্ক পাঠাব'}
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1">
                    {language === 'en' ? 'Email Address' : 'ইমেইল অ্যাড্রেস'}
                  </label>
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
                  {language === 'en' ? 'SEND RESET LINK' : 'রিসেট লিঙ্ক পাঠান'}
                </button>

                <button type="button" onClick={() => setAuthMode('login')} className="block w-full text-center text-xs text-stone-500 hover:text-gold-600 font-bold mt-2 cursor-pointer">
                  {language === 'en' ? 'Return to Sign In' : 'লগইন-এ ফিরে যান'}
                </button>
              </div>
            )}

          </div>
        ) : (
          /* FULL CUSTOMER LOGGED IN PROFILE INTERFACE */
          <div className="space-y-6 text-left">
            
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
                <div className="space-y-8">
                  {/* Avatar Section inspired by reference image */}
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="relative group">
                      <div className="w-48 h-48 sm:w-56 sm:h-56 bg-stone-100 rounded-sm border-4 border-white shadow-xl overflow-hidden relative">
                        {user?.photoURL ? (
                          <img 
                            src={user.photoURL} 
                            alt={user.name} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gold-500/5">
                            <User className="w-20 h-20 text-gold-600 opacity-20" />
                          </div>
                        )}
                        
                        {/* Upload Overlay */}
                        {isUploadingPhoto && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                            <RefreshCw className="w-8 h-8 text-white animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* Camera Button - Reference inspired */}
                      <label 
                        htmlFor="profile-photo-upload"
                        className="absolute -bottom-3 -right-3 h-14 w-14 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform z-10 border-4 border-white"
                      >
                        <Camera className="w-6 h-6" />
                        <input 
                          id="profile-photo-upload"
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handlePhotoUpload}
                        />
                      </label>
                    </div>

                    <div className="text-center mt-8 space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-bold text-stone-900 font-serif tracking-tight">{user?.name}</h3>
                        <p className="text-xs text-stone-500 font-mono mb-2 opacity-60">{user?.email}</p>
                        <p className="text-xs text-stone-500 uppercase tracking-widest font-bold">
                          {language === 'en' ? 'Mifta Gold Member' : 'মিফতা গোল্ড মেম্বার'}
                        </p>
                      </div>
                      
                      <button
                        onClick={handleLogout}
                        className="mx-auto flex items-center gap-2 px-6 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-all cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{language === 'en' ? 'Log Out' : 'লগআউট'}</span>
                      </button>
                    </div>
                  </div>

                  {!isEditingProfile ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-sm border border-stone-200 bg-stone-50">
                      <div className="space-y-1">
                        <span className="block text-[9px] uppercase tracking-wider text-gold-600 font-bold font-mono">
                          {language === 'en' ? 'Contact Name' : 'যোগাযোগের নাম'}
                        </span>
                        <span className="font-sans font-medium text-stone-800">{user.name}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="block text-[9px] uppercase tracking-wider text-gold-600 font-bold font-mono">
                          {language === 'en' ? 'Mobile Phone' : 'মোবাইল নম্বর'}
                        </span>
                        <span className="font-sans font-medium text-stone-800">
                          {user.phone || (language === 'en' ? 'Not provided' : 'দেওয়া হয়নি')}
                        </span>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <span className="block text-[9px] uppercase tracking-wider text-gold-600 font-bold font-mono">
                          {language === 'en' ? 'Default Delivery Address' : 'ডিফল্ট ডেলিভারি ঠিকানা'}
                        </span>
                        <span className="font-sans font-medium text-stone-800">
                          {user.address || (language === 'en' ? 'Not provided' : 'দেওয়া হয়নি')}
                        </span>
                      </div>
                        <div className="space-y-1">
                          <span className="block text-[9px] uppercase tracking-wider text-gold-600 font-bold font-mono">
                            {language === 'en' ? 'Upazila / District / Division' : 'উপজেলা / জেলা / বিভাগ'}
                          </span>
                          <span className="font-sans font-medium text-stone-800">
                            {user.district ? `${user.upazila ? user.upazila + ', ' : ''}${user.district}, ${user.division}` : (language === 'en' ? 'Not provided' : 'দেওয়া হয়নি')}
                          </span>
                        </div>

                      <div className="md:col-span-2 pt-4">
                        <button
                          onClick={() => setIsEditingProfile(true)}
                          className="px-5 py-2.5 rounded-sm border border-gold-500 text-gold-600 text-xs font-bold hover:bg-gold-500/5 transition-colors cursor-pointer tracking-wider"
                        >
                          {language === 'en' ? 'EDIT SHIPPING INFO' : 'ডেলিভারি তথ্য পরিবর্তন করুন'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-500 mb-1">
                            {language === 'en' ? 'Name' : 'নাম'}
                          </label>
                          <input
                            type="text"
                            required
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                            className="w-full h-11 px-4 rounded-sm bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-gold-500 text-stone-950"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-500 mb-1">
                            {language === 'en' ? 'Phone' : 'মোবাইল'}
                          </label>
                          <input
                            type="text"
                            required
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            className="w-full h-11 px-4 rounded-sm bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-gold-500 text-stone-950"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-stone-500 mb-1">
                            {language === 'en' ? 'Address' : 'ঠিকানা'}
                          </label>
                          <input
                            type="text"
                            required
                            value={profileForm.address}
                            onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                            className="w-full h-11 px-4 rounded-sm bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-gold-500 text-stone-950"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <SmartSelect
                            label={language === 'en' ? 'Division' : 'বিভাগ'}
                            value={profileForm.division}
                            onChange={(val) => setProfileForm({ ...profileForm, division: val, district: '', upazila: '' })}
                            options={[
                              { value: '', label: language === 'en' ? '-- Select --' : '-- সিলেক্ট করুন --' },
                              ...Object.entries(locationData.divisions).map(([key, div]) => ({
                                value: key,
                                label: language === 'en' ? div.en : div.bn
                              }))
                            ]}
                          />
                          <SmartSelect
                            label={language === 'en' ? 'District' : 'জেলা'}
                            disabled={!profileForm.division}
                            value={profileForm.district}
                            onChange={(val) => setProfileForm({ ...profileForm, district: val, upazila: '' })}
                            options={[
                              { value: '', label: language === 'en' ? '-- Select --' : '-- সিলেক্ট করুন --' },
                              ...(profileForm.division && locationData.divisions[profileForm.division]
                                ? Object.entries(locationData.divisions[profileForm.division].districts).map(([key, dist]) => ({
                                    value: key,
                                    label: language === 'en' ? dist.en : dist.bn
                                  }))
                                : [])
                            ]}
                          />
                          <SmartSelect
                            label={language === 'en' ? 'Upazila' : 'উপজেলা'}
                            disabled={!profileForm.district}
                            value={profileForm.upazila}
                            onChange={(val) => setProfileForm({ ...profileForm, upazila: val })}
                            options={[
                              { value: '', label: language === 'en' ? '-- Select --' : '-- সিলেক্ট করুন --' },
                              ...(profileForm.division && profileForm.district && locationData.divisions[profileForm.division]?.districts[profileForm.district]
                                ? (locationData.divisions[profileForm.division].districts[profileForm.district].upazilas || []).map((up) => ({
                                    value: up.en,
                                    label: language === 'en' ? up.en : up.bn
                                  }))
                                : [])
                            ]}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-5 py-2.5 border border-stone-200 bg-white rounded-sm text-stone-500 text-xs font-bold cursor-pointer"
                        >
                          {language === 'en' ? 'CANCEL' : 'বাতিল করুন'}
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-gold-500 text-black rounded-sm text-xs font-bold cursor-pointer"
                        >
                          {language === 'en' ? 'SAVE CHANGES' : 'পরিবর্তন সংরক্ষণ করুন'}
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
                      <p className="text-xs text-stone-400">
                        {language === 'en' ? 'No purchase records found yet.' : 'এখনো কোনো অর্ডার রেকর্ড পাওয়া যায়নি।'}
                      </p>
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
                                {ord.orderStatus === 'delivered' ? (language === 'en' ? 'delivered' : 'ডেলিভারড') :
                                 ord.orderStatus === 'shipped' ? (language === 'en' ? 'shipped' : 'পাঠানো হয়েছে') :
                                 ord.orderStatus === 'cancelled' ? (language === 'en' ? 'cancelled' : 'বাতিল হয়েছে') :
                                 (language === 'en' ? 'processing' : 'প্রসেসিং হচ্ছে')}
                              </span>
                              <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold uppercase ${
                                ord.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                              }`}>
                                {ord.paymentStatus === 'paid' ? (language === 'en' ? 'paid' : 'পরিশোধিত') : (language === 'en' ? 'pending' : 'বাকি (COD)')}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <span className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider">
                              {language === 'en' ? 'Items Purchased:' : 'ক্রয়কৃত প্রোডাক্টসমূহ:'}
                            </span>
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
                              <span className="text-stone-500">
                                {language === 'en' ? 'Tracking Code:' : 'ট্র্যাকিং কোড:'}
                              </span>
                              <span className="font-mono font-bold text-emerald-600">{ord.trackingNumber}</span>
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-2 border-t border-stone-200">
                            <span className="text-stone-500 uppercase tracking-widest font-bold text-[9px]">
                              {language === 'en' ? 'Grand Total Paid:' : 'সর্বমোট পরিশোধিত:'}
                            </span>
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
                      <p className="text-xs text-stone-400">
                        {language === 'en' ? 'Your wishlist folder is currently empty.' : 'আপনার পছন্দের তালিকাটি (উইশলিস্ট) এখন খালি আছে।'}
                      </p>
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
    </div>
  );
}
