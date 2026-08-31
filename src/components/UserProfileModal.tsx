import React, { useState } from 'react';
import { X, User, Bookmark, WifiOff, Mail, Shield, LogOut, Check, Sparkles } from 'lucide-react';
import { UserProfile, Language } from '../types';
import { getTranslation } from '../utils/i18n';

interface UserProfileModalProps {
  user: UserProfile | null;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  currentLang: Language;
  bookmarksCount: number;
  offlineCount: number;
  onOpenBookmarks: () => void;
  onOpenOffline: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  onClose,
  onLogin,
  onLogout,
  currentLang,
  bookmarksCount,
  offlineCount,
  onOpenBookmarks,
  onOpenOffline
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const t = (key: any) => getTranslation(currentLang, key);

  const handleSubmitAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const loggedUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      role: 'viewer',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      bio: 'THE RECAP MEDIA CAST সংবাদ পাঠক ও নিয়মিত শুভাকাঙ্ক্ষী।',
      bookmarks: [],
      offlineSaved: [],
      joinedAt: new Date().toISOString()
    };
    onLogin(loggedUser);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-4 flex justify-center items-center">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
              <User className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {user ? t('profile') : t('signUpLogin')}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If user logged in */}
        {user ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                alt={user.name}
                className="w-16 h-16 rounded-full border-2 border-red-500 object-cover"
              />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg">{user.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-red-500" /> {user.email}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-[10px] font-bold">
                  {user.role === 'admin' ? 'অ্যাডমিন অ্যাকাউন্ট' : 'নিবন্ধিত সাধারণ পাঠক'}
                </span>
              </div>
            </div>

            {/* User Activity Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => { onClose(); onOpenBookmarks(); }}
                className="p-4 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-100 dark:border-red-900/50 cursor-pointer hover:scale-[1.02] transition-transform text-center"
              >
                <Bookmark className="w-6 h-6 text-red-600 mx-auto mb-1" />
                <span className="block text-xl font-extrabold text-slate-900 dark:text-white">{bookmarksCount}</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">সংরক্ষিত বুকমার্ক</span>
              </div>

              <div 
                onClick={() => { onClose(); onOpenOffline(); }}
                className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/50 cursor-pointer hover:scale-[1.02] transition-transform text-center"
              >
                <WifiOff className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                <span className="block text-xl font-extrabold text-slate-900 dark:text-white">{offlineCount}</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">অফলাইন পঠিত খবর</span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-red-600 dark:text-red-400 font-bold text-xs hover:bg-red-50 dark:hover:bg-red-950 transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
            >
              <LogOut className="w-4 h-4" /> লগআউট করুন
            </button>
          </div>
        ) : (
          /* Sign Up / Login Form */
          <div className="space-y-4">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-1.5 rounded-lg transition-all ${!isSignUp ? 'bg-white dark:bg-slate-900 text-red-600 shadow' : 'text-slate-500'}`}
              >
                লগইন (Sign In)
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-1.5 rounded-lg transition-all ${isSignUp ? 'bg-white dark:bg-slate-900 text-red-600 shadow' : 'text-slate-500'}`}
              >
                নতুন রেজিস্টার (Sign Up)
              </button>
            </div>

            <form onSubmit={handleSubmitAuth} className="space-y-3">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">পূর্ণ নাম (Full Name)</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: তানজিল হোসেন"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ইমেইল এড্রেস (Email)</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">পাসওয়ার্ড (Password)</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/20 transition-all mt-2"
              >
                {isSignUp ? 'অ্যাকাউন্ট তৈরি করুন (Create Account)' : 'প্রবেশ করুন (Sign In)'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
