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
import { UserProfile, Language, SiteSettings, ManagerProfile } from '../types';
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
  siteSettings?: SiteSettings;
  managers?: ManagerProfile[];
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
  onOpenOffline,
  siteSettings,
  managers
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
    let alreadyExists = registeredReaders.some((r) => r.email.trim().toLowerCase() === cleanEmail);
    if (!alreadyExists) {
      try {
        const saved = localStorage.getItem('recap_registered_readers');
        if (saved) {
          const parsed: UserProfile[] = JSON.parse(saved);
          alreadyExists = parsed.some((r) => r.email.trim().toLowerCase() === cleanEmail);
        }
      } catch {}
    }

    if (alreadyExists) {
      setAuthError('এই ইমেইলে ইতোমধ্যে একটি পাঠক অ্যাকাউন্ট রয়েছে! একটি ইমেইল দিয়ে কেবল একটিমাত্র সাইন-আপ অনুমোদিত।');
      return;
    }

    // Check if entered code belongs to another panel (Admin or Manager)
    const enteredSecret = (data.secretCode || '').trim().toUpperCase();
    const adminCode1 = (siteSettings?.adminSecretCode || 'ADMIN-RECAP-2026').trim().toUpperCase();
    const adminCode2 = (siteSettings?.systemAdminSecretCode || 'ADMIN-RECAP-2026').trim().toUpperCase();
    const managingCode1 = (siteSettings?.managingSecretCode || 'MGR-RECAP-2026').trim().toUpperCase();
    const managingCode2 = (siteSettings?.managerSecretCode || 'MGR-RECAP-2026').trim().toUpperCase();

    if (
      enteredSecret &&
      (enteredSecret === adminCode1 ||
       enteredSecret === adminCode2 ||
       enteredSecret === 'ADMIN-RECAP-2026' ||
       enteredSecret === 'ADMIN2026' ||
       enteredSecret === 'ADMIN-RECAP-9824' ||
       enteredSecret === managingCode1 ||
       enteredSecret === managingCode2 ||
       enteredSecret === 'MGR-RECAP-2026' ||
       enteredSecret === 'MANAGING2026')
    ) {
      setAuthError('এই কোডটি অন্য প্যানেলের (ম্যানেজার বা অ্যাডমিন প্যানেলের)! এক প্যানেলের জন্য নির্ধারিত রেফার কোড দিয়ে অন্য প্যানেলে সাইন-আপ করা সম্পূর্ণ নিষিদ্ধ। পাঠক হিসেবে আপনি কোনো কোড ছাড়াই সরাসরি সাইন-আপ সম্পন্ন করতে পারবেন।');
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 flex justify-center items-center">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 p-6 space-y-6">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-sm shadow-xs border border-zinc-800">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-black dark:text-white leading-tight">
                {user ? (isEditingProfile ? 'পাঠক প্রোফাইল সেটআপ / সংশোধন' : 'নিয়মিত পাঠক প্রোফাইল') : 'নিয়মিত পাঠক পোর্টাল'}
              </h3>
              <p className="text-[11px] text-black dark:text-zinc-400 font-medium">
                The Recap Media Cast পাঠক ও ফলোয়ার কমিউনিটি
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full bg-black text-white hover:bg-zinc-800 transition-colors cursor-pointer border border-zinc-800"
          >
            <X className="w-4 h-4" />
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
                <div className="p-3 bg-black text-white border border-zinc-700 rounded-xl flex items-center gap-2 text-xs font-bold shadow-xs">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>{editSuccessMsg}</span>
                </div>
              )}

              <div className="flex items-center gap-4 p-4 bg-black text-white rounded-2xl border border-zinc-800 shadow-sm">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-2 border-white object-cover shadow-sm shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-white text-lg truncate">{user.name}</h4>
                  <p className="text-xs text-zinc-300 flex items-center gap-1 truncate font-medium">
                    <Mail className="w-3 h-3 text-zinc-400 shrink-0" /> {user.email}
                  </p>
                  {user.mobile && (
                    <p className="text-xs text-zinc-300 flex items-center gap-1 mt-0.5 font-medium">
                      <Phone className="w-3 h-3 text-zinc-400 shrink-0" /> {user.mobile}
                    </p>
                  )}
                  {user.address && (
                    <p className="text-xs text-zinc-300 flex items-center gap-1 mt-0.5 truncate font-medium">
                      <MapPin className="w-3 h-3 text-zinc-400 shrink-0" /> {user.address}
                    </p>
                  )}
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-zinc-800 text-white text-[10px] font-bold border border-zinc-700">
                    ✓ নিবন্ধিত নিয়মিত পাঠক
                  </span>
                </div>
              </div>

              {/* User Activity Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => { onClose(); onOpenBookmarks(); }}
                  className="p-4 bg-black text-white rounded-2xl border border-zinc-800 cursor-pointer hover:bg-zinc-900 transition-colors text-center shadow-xs"
                >
                  <Bookmark className="w-6 h-6 text-white mx-auto mb-1" />
                  <span className="block text-xl font-extrabold text-white font-mono">{bookmarksCount}</span>
                  <span className="text-xs font-semibold text-zinc-300">সংরক্ষিত বুকমার্ক</span>
                </div>

                <div 
                  onClick={() => { onClose(); onOpenOffline(); }}
                  className="p-4 bg-black text-white rounded-2xl border border-zinc-800 cursor-pointer hover:bg-zinc-900 transition-colors text-center shadow-xs"
                >
                  <WifiOff className="w-6 h-6 text-white mx-auto mb-1" />
                  <span className="block text-xl font-extrabold text-white font-mono">{offlineCount}</span>
                  <span className="text-xs font-semibold text-zinc-300">অফলাইন পঠিত খবর</span>
                </div>
              </div>

              {/* Action Buttons: Edit Profile & Logout */}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex-1 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-zinc-700 cursor-pointer shadow-sm"
                >
                  <Edit3 className="w-4 h-4" /> প্রোফাইল এডিট
                </button>
                <button
                  onClick={handlePerformLogout}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-zinc-700 cursor-pointer shadow-sm"
                >
                  <LogOut className="w-4 h-4 text-zinc-300" /> লগআউট করুন
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
            secretCodePlaceholder="রেফার কোড (ঐচ্ছিক - ফাঁকা রাখতে পারেন)..."
            secretCodeHint="ঐচ্ছিক রেফার কোড (যদি থাকে)"
            isSecretCodeOptional={true}
            errorMessage={authError}
            onLogin={handleUnifiedLogin}
            onSignUp={handleUnifiedSignUp}
          />
        )}
      </div>
    </div>
  );
};
