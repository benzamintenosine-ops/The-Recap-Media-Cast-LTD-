import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  KeyRound,
  LogIn,
  UserPlus
} from 'lucide-react';

export interface UnifiedAuthData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword?: string;
  secretCode: string;
}

interface UnifiedAuthCardProps {
  portalTitle: string;
  portalSubtitle: string;
  portalIcon: React.ReactNode;
  themeColor?: 'red' | 'blue' | 'indigo' | 'emerald' | 'amber';
  initialMode?: 'login' | 'signup';
  secretCodePlaceholder?: string;
  secretCodeHint?: string;
  errorMessage?: string;
  onLogin: (credentials: { email: string; password: string }) => void;
  onSignUp: (data: UnifiedAuthData) => void;
}

export const UnifiedAuthCard: React.FC<UnifiedAuthCardProps> = ({
  portalTitle,
  portalSubtitle,
  portalIcon,
  themeColor = 'red',
  initialMode = 'login',
  secretCodePlaceholder = 'গোপন রেফার কোড লিখুন...',
  secretCodeHint = 'সংশ্লিষ্ট প্যানেল থেকে সংগৃহীত গোপন রেফার কোড প্রদান করুন।',
  errorMessage = '',
  onLogin,
  onSignUp
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [localError, setLocalError] = useState('');

  const activeError = errorMessage || localError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email.trim() || !password.trim()) {
      setLocalError('ইমেইল এবং পাসওয়ার্ড প্রদান করা বাধ্যতামূলক!');
      return;
    }

    if (authMode === 'login') {
      onLogin({ email: email.trim().toLowerCase(), password: password.trim() });
      return;
    }

    // Sign Up Validation
    if (!name.trim()) {
      setLocalError('আপনার পূর্ণ নাম প্রদান করুন!');
      return;
    }

    if (!mobile.trim()) {
      setLocalError('মোবাইল নম্বর প্রদান করুন!');
      return;
    }

    const cleanMobile = mobile.trim().replace(/\D/g, '');
    if (cleanMobile.length !== 11) {
      setLocalError('মোবাইল নম্বরটি অবশ্যই সঠিক ১১ ডিজিটের হতে হবে (যেমন: 01712345678)!');
      return;
    }

    if (password.trim().length < 6) {
      setLocalError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!');
      return;
    }

    if (!confirmPassword.trim()) {
      setLocalError('কনফার্ম পাসওয়ার্ড প্রদান করুন!');
      return;
    }

    if (password.trim() !== confirmPassword.trim()) {
      setLocalError('পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!');
      return;
    }

    if (!secretCode.trim()) {
      setLocalError('গোপন রেফার কোড প্রদান করা বাধ্যতামূলক!');
      return;
    }

    onSignUp({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: cleanMobile,
      password: password.trim(),
      confirmPassword: confirmPassword.trim(),
      secretCode: secretCode.trim()
    });
  };

  const getButtonColor = () => {
    switch (themeColor) {
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20';
      case 'indigo':
        return 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20';
      case 'emerald':
        return 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20';
      case 'amber':
        return 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20';
      default:
        return 'bg-red-600 hover:bg-red-700 shadow-red-600/20';
    }
  };

  const getActiveTabColor = () => {
    switch (themeColor) {
      case 'blue':
        return 'bg-blue-600 text-white shadow';
      case 'indigo':
        return 'bg-indigo-600 text-white shadow';
      case 'emerald':
        return 'bg-emerald-600 text-white shadow';
      case 'amber':
        return 'bg-amber-600 text-white shadow';
      default:
        return 'bg-red-600 text-white shadow';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg bg-gradient-to-tr from-slate-800 to-slate-950">
          {portalIcon}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-serif">
          {portalTitle}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {portalSubtitle}
        </p>
      </div>

      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold">
        <button
          type="button"
          onClick={() => { setAuthMode('login'); setLocalError(''); }}
          className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            authMode === 'login' ? getActiveTabColor() : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>সাইন-ইন (Sign In)</span>
        </button>
        <button
          type="button"
          onClick={() => { setAuthMode('signup'); setLocalError(''); }}
          className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            authMode === 'signup' ? getActiveTabColor() : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>সাইন-আপ (Sign Up)</span>
        </button>
      </div>

      {activeError && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 text-xs font-bold rounded-xl border border-red-200 dark:border-red-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{activeError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name (Only for Sign Up) */}
        {authMode === 'signup' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              পূর্ণ নাম (Full Name) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার পূর্ণ নাম লিখুন"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-red-500"
            />
          </div>
        )}

        {/* Email (Always) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            ইমেইল (Email) *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Mobile Number (Only for Sign Up, Max 11 digits) */}
        {authMode === 'signup' && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                মোবাইল নম্বর (Mobile Number) *
              </label>
              <span className="text-[10px] text-red-500 font-bold">(সর্বোচ্চ ১১ সংখ্যা)</span>
            </div>
            <input
              type="tel"
              required
              maxLength={11}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="017XXXXXXXX"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
            />
          </div>
        )}

        {/* Password (Always) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            {authMode === 'signup' ? 'পাসওয়ার্ড (Password - কমপক্ষে ৬ অক্ষর) *' : 'পাসওয়ার্ড (Password) *'}
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Confirm Password (Only for Sign Up) */}
        {authMode === 'signup' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              কনফার্ম পাসওয়ার্ড (Confirm Password) *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
            />
          </div>
        )}

        {/* Secret Referral Code (Only for Sign Up) */}
        {authMode === 'signup' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              গোপন রেফার কোড (Secret Referral Code) *
            </label>
            <input
              type="text"
              required
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              placeholder={secretCodePlaceholder}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/30 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 font-mono font-bold uppercase tracking-wider"
            />
            {secretCodeHint && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {secretCodeHint}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-3.5 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${getButtonColor()}`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{authMode === 'signup' ? 'রেজিস্ট্রেশন করুন ও প্রোফাইল সাজান' : 'প্যানেলে সাইন ইন করুন'}</span>
        </button>
      </form>
    </div>
  );
};
