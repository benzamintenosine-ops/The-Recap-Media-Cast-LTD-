import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Bookmark, 
  WifiOff, 
  Mail, 
  LogOut, 
  Edit3, 
  Phone,
  CheckCircle,
  MapPin
} from 'lucide-react';
import { UserProfile, Language } from '../types';
import { subscribeToReaders, saveReaderToFirebase } from '../services/firebaseDataService';
import { UnifiedAuthCard, UnifiedAuthData } from './UnifiedAuthCard';
import { UnifiedProfileSetup, UnifiedProfileSetupData } from './UnifiedProfileSetup';

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
  const [authError, setAuthError] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState('');

  const [registeredReaders, setRegisteredReaders] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('recap_registered_readers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const unsubscribe = subscribeToReaders((readersList) => {
      if (readersList && readersList.length > 0) {
        setRegisteredReaders(readersList);
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handlePerformLogout = () => {
    try {
      localStorage.removeItem('the_recap_media_reader_user');
      localStorage.removeItem('recap_user');
    } catch (e) {
      console.warn(e);
    }
    setAuthError('');
    setIsEditingProfile(false);
    onLogout();
  };

  const handleUnifiedLogin = (credentials: { email: string; password: string }) => {
    setAuthError('');
    const cleanEmail = credentials.email.trim().toLowerCase();

    let matched = registeredReaders.find((r) => r.email.trim().toLowerCase() === cleanEmail);

    if (!matched) {
      try {
        const saved = localStorage.getItem('recap_registered_readers');
        if (saved) {
          const parsed: UserProfile[] = JSON.parse(saved);
          matched = parsed.find((r) => r.email.trim().toLowerCase() === cleanEmail);
        }
      } catch {}
    }

    if (!matched) {
      setAuthError('এই ইমেইলে কোনো পাঠক অ্যাকাউন্ট পাওয়া যায়নি! সাইন-ইন করার পূর্বে অনুগ্রহ করে প্রথমে "নতুন পাঠক সাইন-আপ (Sign Up)" করুন।');
      return;
    }

    if (matched.password && matched.password !== credentials.password.trim()) {
      setAuthError('ভুল পাসওয়ার্ড! অনুগ্রহ করে আপনার নিবন্ধিত সঠিক পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    try {
      localStorage.setItem('the_recap_media_reader_user', JSON.stringify(matched));
      localStorage.setItem('recap_user', JSON.stringify(matched));
    } catch (e) {
      console.warn(e);
    }

    onLogin(matched);
  };

  const handleUnifiedSignUp = (data: UnifiedAuthData) => {
    setAuthError('');
    const cleanEmail = data.email.trim().toLowerCase();

    const alreadyExists = registeredReaders.some((r) => r.email.trim().toLowerCase() === cleanEmail);
    if (alreadyExists) {
      setAuthError('এই ইমেইলে ইতিমধ্যে একটি পাঠক অ্যাকাউন্ট রয়েছে! অনুগ্রহ করে সাইন-ইন (Sign In) করুন।');
      return;
    }

    const newReader: UserProfile = {
      id: `reader-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password.trim(),
      mobile: data.mobile.trim(),
      role: 'viewer',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
      bio: 'THE RECAP MEDIA CAST সংবাদ পাঠক ও নিয়মিত পাঠক।',
      bookmarks: [],
      offlineSaved: [],
      joinedAt: new Date().toISOString()
    };

    const updatedList = [...registeredReaders.filter((r) => r.email.toLowerCase() !== cleanEmail), newReader];
    setRegisteredReaders(updatedList);
    try {
      localStorage.setItem('recap_registered_readers', JSON.stringify(updatedList));
      localStorage.setItem('the_recap_media_reader_user', JSON.stringify(newReader));
      localStorage.setItem('recap_user', JSON.stringify(newReader));
    } catch (e) {
      console.warn(e);
    }

    saveReaderToFirebase(newReader).catch((err) => console.warn('Could not save reader to Firestore:', err));

    onLogin(newReader);
    setIsEditingProfile(true); // Automatically open profile setup after sign up!
  };

  const handleSaveUnifiedProfile = async (profileData: UnifiedProfileSetupData) => {
    if (!user) return;

    const updatedUser: UserProfile = {
      ...user,
      name: profileData.name,
      mobile: profileData.mobile,
      bio: profileData.bio,
      avatar: profileData.avatarUrl || user.avatar,
      address: profileData.address,
      nidNumber: profileData.nidNumber,
      division: profileData.division,
      district: profileData.district,
      thana: profileData.thana,
      postOffice: profileData.postOffice,
      postCode: profileData.postCode,
      age: profileData.age
    };

    const updatedList = registeredReaders.map((r) =>
      r.email.toLowerCase() === user.email.toLowerCase() ? updatedUser : r
    );
    setRegisteredReaders(updatedList);

    try {
      localStorage.setItem('recap_registered_readers', JSON.stringify(updatedList));
      localStorage.setItem('the_recap_media_reader_user', JSON.stringify(updatedUser));
      localStorage.setItem('recap_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.warn('Storage save warning:', err);
    }

    saveReaderToFirebase(updatedUser).catch((err) => console.warn('Firestore update warning:', err));
    onLogin(updatedUser);

    setEditSuccessMsg('প্রোফাইল সফলভাবে সংরক্ষণ করা হয়েছে!');
    setTimeout(() => {
      setEditSuccessMsg('');
      setIsEditingProfile(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-4 flex justify-center items-center">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {user ? (isEditingProfile ? 'পাঠক প্রোফাইল সেটআপ / সংশোধন' : 'নিয়মিত পাঠক প্রোফাইল') : 'নিয়মিত পাঠক পোর্টাল'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                The Recap Media Cast পাঠক ও ফলোয়ার কমিউনিটি
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If user logged in */}
        {user ? (
          isEditingProfile ? (
            /* UNIFIED PROFILE SETUP FOR READER (NID REMOVED AS REQUESTED) */
            <UnifiedProfileSetup
              title="পাঠক প্রোফাইল সেটআপ (Profile Setup)"
              subtitle="আপনার পাঠক অ্যাকাউন্টের সম্পূর্ণ ও নির্ভুল তথ্য প্রদান করুন।"
              panelBadge="নিয়মিত পাঠক"
              hideNid={true}
              initialData={{
                name: user.name || '',
                email: user.email || '',
                mobile: user.mobile || '',
                age: user.age || 25,
                division: user.division || '',
                district: user.district || '',
                thana: user.thana || '',
                postOffice: user.postOffice || '',
                postCode: user.postCode || '',
                avatarUrl: user.avatar || '',
                bio: user.bio || '',
                designation: 'নিয়মিত পাঠক'
              }}
              onSave={handleSaveUnifiedProfile}
              onCancel={() => setIsEditingProfile(false)}
              isEditing={true}
            />
          ) : (
            /* READER PROFILE VIEW */
            <div className="space-y-6">
              {editSuccessMsg && (
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-200 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{editSuccessMsg}</span>
                </div>
              )}

              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-2 border-red-500 object-cover shadow-sm shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg truncate">{user.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3 text-red-500 shrink-0" /> {user.email}
                  </p>
                  {user.mobile && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400 shrink-0" /> {user.mobile}
                    </p>
                  )}
                  {user.address && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {user.address}
                    </p>
                  )}
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-300 dark:border-emerald-800">
                    ✓ নিবন্ধিত নিয়মিত পাঠক
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

              {/* Action Buttons: Edit Profile & Logout */}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex-1 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-red-200 dark:border-red-800 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" /> প্রোফাইল এডিট
                </button>
                <button
                  onClick={handlePerformLogout}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" /> লগআউট করুন
                </button>
              </div>
            </div>
          )
        ) : (
          /* UNIFIED AUTH CARD FOR READER */
          <UnifiedAuthCard
            portalTitle="পাঠক সাইন-ইন ও রেজিস্ট্রেশন"
            portalSubtitle="নিয়মিত পাঠক হিসেবে যুক্ত হতে সাইন-ইন বা সাইন-আপ করুন"
            portalIcon={<User className="w-8 h-8" />}
            themeColor="red"
            secretCodePlaceholder="রেফার কোড (RECAP2026 বা ফাঁকা রাখুন)..."
            secretCodeHint="ঐচ্ছিক রেফার কোড (যদি থাকে)"
            errorMessage={authError}
            onLogin={handleUnifiedLogin}
            onSignUp={handleUnifiedSignUp}
          />
        )}
      </div>
    </div>
  );
};
