import React, { useState, useEffect, useMemo } from 'react';
import { 
  Camera, 
  MapPin, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  CreditCard,
  Sparkles,
  Loader2,
  FileText
} from 'lucide-react';
import { BANGLADESH_GEO_DATA } from '../data/bangladeshGeoData';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../services/cloudinaryService';

export interface UnifiedProfileSetupData {
  name: string;
  email: string;
  mobile: string;
  age: number;
  nidNumber?: string;
  division: string;
  district: string;
  thana: string;
  postOffice: string;
  postCode: string;
  address: string;
  avatarUrl: string;
  bio?: string;
  designation?: string;
}

interface UnifiedProfileSetupProps {
  title?: string;
  subtitle?: string;
  panelBadge?: string;
  initialData: Partial<UnifiedProfileSetupData>;
  onSave: (data: UnifiedProfileSetupData) => void;
  onCancel?: () => void;
  isEditing?: boolean;
  hideNid?: boolean;
}

export const UnifiedProfileSetup: React.FC<UnifiedProfileSetupProps> = ({
  title = 'প্রোফাইল সেটআপ (Profile Setup)',
  subtitle = 'আপনার প্রোফাইল সক্রিয় ও সম্পূর্ণ করতে নিচের প্রয়োজনীয় সকল তথ্য সঠিক ও নির্ভুলভাবে পূরণ করুন।',
  panelBadge = 'প্রোফাইল যাচাইকরণ',
  initialData,
  onSave,
  onCancel,
  isEditing = false,
  hideNid = false
}) => {
  const [name, setName] = useState(initialData.name || '');
  const [email] = useState(initialData.email || '');
  const [mobile, setMobile] = useState(initialData.mobile || '');
  const [age, setAge] = useState<number | ''>(initialData.age || 25);
  const [nidNumber, setNidNumber] = useState(initialData.nidNumber || '');
  const [division, setDivision] = useState(initialData.division || '');
  const [district, setDistrict] = useState(initialData.district || '');
  const [thana, setThana] = useState(initialData.thana || '');
  const [postOffice, setPostOffice] = useState(initialData.postOffice || '');
  const [postCode, setPostCode] = useState(initialData.postCode || '');
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl || '');
  const [bio, setBio] = useState(initialData.bio || '');
  const [designation, setDesignation] = useState(initialData.designation || '');

  const [isVerifyingPhoto, setIsVerifyingPhoto] = useState(false);
  const [photoVerified, setPhotoVerified] = useState<boolean>(Boolean(initialData.avatarUrl));
  const [errorMsg, setErrorMsg] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [ruleCheckboxes, setRuleCheckboxes] = useState<boolean[]>([true, true, true, true, true, true]);

  // Synchronize with initialData
  useEffect(() => {
    if (initialData.name) setName(initialData.name);
    if (initialData.mobile) setMobile(initialData.mobile);
    if (initialData.age) setAge(initialData.age);
    if (initialData.nidNumber) setNidNumber(initialData.nidNumber);
    if (initialData.division) setDivision(initialData.division);
    if (initialData.district) setDistrict(initialData.district);
    if (initialData.thana) setThana(initialData.thana);
    if (initialData.postOffice) setPostOffice(initialData.postOffice);
    if (initialData.postCode) setPostCode(initialData.postCode);
    if (initialData.avatarUrl) {
      setAvatarUrl(initialData.avatarUrl);
      setPhotoVerified(true);
    }
    if (initialData.bio) setBio(initialData.bio);
    if (initialData.designation) setDesignation(initialData.designation);
  }, [initialData]);

  // Cascading Location Helpers
  const availableDistricts = useMemo(() => {
    if (!division) return [];
    const divObj = BANGLADESH_GEO_DATA.find(d => d.name === division);
    return divObj ? divObj.districts : [];
  }, [division]);

  const availableUpazilas = useMemo(() => {
    if (!district || !division) return [];
    const divObj = BANGLADESH_GEO_DATA.find(d => d.name === division);
    const distObj = divObj?.districts.find(dst => dst.name === district);
    return distObj ? distObj.upazilas : [];
  }, [division, district]);

  const availablePostOffices = useMemo(() => {
    if (!thana || !district || !division) return [];
    const divObj = BANGLADESH_GEO_DATA.find(d => d.name === division);
    const distObj = divObj?.districts.find(dst => dst.name === district);
    const upaObj = distObj?.upazilas.find(u => u.name === thana);
    return upaObj ? upaObj.postOffices : [];
  }, [division, district, thana]);

  const isNidRequired = !hideNid && panelBadge !== 'নিয়মিত পাঠক' && panelBadge !== 'সাধারণ পাঠক';

  // Photo Upload Handler with AI Human verification & Cloudinary upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    const previousOldAvatar = avatarUrl || initialData.avatarUrl;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (!base64) return;

      setIsVerifyingPhoto(true);
      try {
        const res = await fetch('/api/verify-human-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64 })
        });
        const data = await res.json();
        if (data.isHuman) {
          try {
            const cloudinaryUrl = await uploadImageToCloudinary(file, 'user_avatars');
            setAvatarUrl(cloudinaryUrl);
            setPhotoVerified(true);
            if (previousOldAvatar && previousOldAvatar !== cloudinaryUrl) {
              deleteImageFromCloudinary(previousOldAvatar).catch(() => {});
            }
          } catch {
            setAvatarUrl(base64);
            setPhotoVerified(true);
          }
        } else {
          setPhotoVerified(false);
          setAvatarUrl('');
          setErrorMsg(data.reason || 'শুধুমাত্র মানুষের ছবি গ্রহণযোগ্য! (প্রাণী, বস্তু বা কৃত্রিম ছবি অগ্রহণযোগ্য)');
        }
      } catch (err) {
        try {
          const cloudinaryUrl = await uploadImageToCloudinary(file, 'user_avatars');
          setAvatarUrl(cloudinaryUrl);
          if (previousOldAvatar && previousOldAvatar !== cloudinaryUrl) {
            deleteImageFromCloudinary(previousOldAvatar).catch(() => {});
          }
        } catch {
          setAvatarUrl(base64);
        }
        setPhotoVerified(true);
      } finally {
        setIsVerifyingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (
      !name.trim() ||
      !postOffice.trim() ||
      !postCode.trim() ||
      !thana.trim() ||
      !district.trim() ||
      !division.trim() ||
      (isNidRequired && !nidNumber.trim()) ||
      !mobile.trim() ||
      age === ''
    ) {
      setErrorMsg(
        isNidRequired
          ? 'সকল ক্ষেত্র (নাম, পোস্ট অফিস, পোস্ট কোড, থানা, জেলা, বিভাগ, NID নম্বর, মোবাইল নম্বর, বয়স, ছবি) পূরণ করা বাধ্যতামূলক!'
          : 'সকল ক্ষেত্র (নাম, পোস্ট অফিস, পোস্ট কোড, থানা, জেলা, বিভাগ, মোবাইল নম্বর, বয়স, ছবি) পূরণ করা বাধ্যতামূলক!'
      );
      return;
    }

    const cleanMobile = mobile.trim().replace(/\D/g, '');
    if (cleanMobile.length !== 11) {
      setErrorMsg('মোবাইল নম্বরটি অবশ্যই সঠিক ১১ ডিজিটের হতে হবে (যেমন: 01712345678)!');
      return;
    }

    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 18) {
      setErrorMsg('বয়স অবশ্যই ১৮ বছর বা তার বেশি হতে হবে! (১৮ বছরের নিচে আবেদন গ্রহণযোগ্য নয়)');
      return;
    }

    let nidDigits = '';
    if (isNidRequired) {
      nidDigits = nidNumber.trim().replace(/\D/g, '');
      if (nidDigits.length < 10) {
        setErrorMsg('NID নম্বরটি সঠিক নয়! সর্বনিম্ন ১০ বা ১৩ ডিজিটের জাতীয় পরিচয়পত্র (NID) নম্বর লিখুন।');
        return;
      }
    }

    if (!avatarUrl || !photoVerified) {
      setErrorMsg('ডিভাইস থেকে নিজস্ব মানুষের প্রোফাইল ছবি আপলোড এবং AI যাচাইকরণ বাধ্যতামূলক!');
      return;
    }

    if (!ruleCheckboxes.every(Boolean) || !agreedToTerms) {
      setErrorMsg('নীতিমালার সকল বক্সে এবং স্বীকারোক্তিতে টিক চিহ্ন দেওয়া বাধ্যতামূলক!');
      return;
    }

    const formattedAddress = `পোস্ট অফিস: ${postOffice.trim()}, পোস্ট কোড: ${postCode.trim()}, থানা: ${thana.trim()}, জেলা: ${district.trim()}, বিভাগ: ${division.trim()}`;

    const profileData: UnifiedProfileSetupData = {
      name: name.trim(),
      email: email.trim(),
      mobile: cleanMobile,
      age: ageNum,
      nidNumber: isNidRequired ? nidDigits : undefined,
      division: division.trim(),
      district: district.trim(),
      thana: thana.trim(),
      postOffice: postOffice.trim(),
      postCode: postCode.trim(),
      address: formattedAddress,
      avatarUrl: avatarUrl.trim(),
      bio: bio.trim(),
      designation: designation.trim()
    };

    onSave(profileData);
  };

  const handleRuleToggle = (index: number) => {
    const updated = [...ruleCheckboxes];
    updated[index] = !updated[index];
    setRuleCheckboxes(updated);
  };

  const rulesList = [
    'আমি ঘোষণা করছি যে প্রদত্ত সমস্ত তথ্য (নাম, NID, বয়স ও ঠিকানা) সম্পূর্ণ সত্য ও নির্ভুল।',
    'কোনো ভুয়া তথ্য বা বিভ্রান্তিকর সংবাদ প্রচার করব না এবং সাইবার আইন মেনে চলব।',
    'জাতীয় ও আন্তর্জাতিক নীতিমালার পরিপন্থী কোনো কাজ করব না।',
    'গোপনীয়তা ও ডেটা সুরক্ষা নীতিমালা সার্বক্ষণিক অনুসরণ করব।',
    'যেকোনো সময় প্ল্যাটফর্মের নিয়মাবলী মেনে চলার প্রতিশ্রুতি প্রদান করছি।',
    'প্রদত্ত তথ্যে কোনো গড়মিল থাকলে অ্যাকাউন্ট বাতিল ও আইনি পদক্ষেপের দায় স্বীকার করব।'
  ];

  return (
    <div className="max-w-xl mx-auto my-6 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="text-center space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold text-xs rounded-full border border-red-200 dark:border-red-900">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{panelBadge}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-serif">
          {title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          {subtitle}
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 text-xs font-bold rounded-2xl border border-red-200 dark:border-red-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Avatar Upload with AI Face Verification */}
        <div className="flex flex-col items-center justify-center p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-md bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-slate-400" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg cursor-pointer transition-all">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
                disabled={isVerifyingPhoto}
              />
            </label>
          </div>

          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              প্রোফাইল ছবি (Profile Photo) *
            </span>
            {isVerifyingPhoto ? (
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 justify-center">
                <Loader2 className="w-3 h-3 animate-spin" /> AI ছবি যাচাই ও ক্লাউড আপলোড চলছে...
              </span>
            ) : photoVerified ? (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 justify-center">
                <CheckCircle className="w-3 h-3" /> ছবি সঠিকভাবে যাচাইকৃত হয়েছে
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 block">
                ডিভাইস থেকে মানুষের স্পষ্ট পোর্ট্রেট ছবি আপলোড করুন
              </span>
            )}
          </div>
        </div>

        {/* Full Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              পূর্ণ নাম (Full Name) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার পূর্ণ নাম"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              ইমেইল (Email)
            </label>
            <input
              type="email"
              readOnly
              value={email}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Mobile & Age */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                মোবাইল নম্বর (Mobile) *
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

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                বয়স (Age) *
              </label>
              <span className="text-[10px] text-red-500 font-bold">(১৮ এর নিচে প্রযোজ্য নয়)</span>
            </div>
            <input
              type="number"
              required
              min={18}
              value={age}
              onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value))}
              placeholder="যেমন: 25"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* NID Number (UNLOCKED & FULLY EDITABLE - Hidden for Reader profiles) */}
        {isNidRequired && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                জাতীয় পরিচয়পত্র নম্বর (NID Number) *
              </label>
              <span className="text-[10px] text-red-500 font-bold">(সর্বনিম্ন ১০ বা ১৩ ডিজিটের NID নম্বর)</span>
            </div>
            <input
              type="text"
              required
              value={nidNumber}
              onChange={(e) => setNidNumber(e.target.value)}
              placeholder="১০ বা ১৩ ডিজিটের এনআইডি (NID) নম্বর লিখুন..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-red-500"
            />
          </div>
        )}

        {/* Cascading Address Breakdown (UNLOCKED & FULLY EDITABLE) */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-500" />
              বর্তমান ঠিকানার বিবরণ (Address Breakdown) *
            </label>
          </div>

          <div className="space-y-3">
            {/* 1. Division */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                ১. বিভাগ (Division) *
              </label>
              <select
                required
                value={division}
                onChange={(e) => {
                  setDivision(e.target.value);
                  setDistrict('');
                  setThana('');
                  setPostOffice('');
                  setPostCode('');
                }}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-red-500"
              >
                <option value="">-- বিভাগ নির্বাচন করুন --</option>
                {BANGLADESH_GEO_DATA.map((div) => (
                  <option key={div.name} value={div.name}>
                    {div.name} {div.nameEn ? `(${div.nameEn})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Grid for District and Thana */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 2. District */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ২. জেলা (District) *
                </label>
                <select
                  required
                  disabled={!division || availableDistricts.length === 0}
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setThana('');
                    setPostOffice('');
                    setPostCode('');
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                >
                  <option value="">
                    {!division ? 'প্রথমে বিভাগ সিলেক্ট করুন' : '-- জেলা নির্বাচন করুন --'}
                  </option>
                  {availableDistricts.map((dist) => (
                    <option key={dist.name} value={dist.name}>
                      {dist.name} {dist.nameEn ? `(${dist.nameEn})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Thana / Upazila */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ৩. থানা / উপজেলা (Thana / Upazila) *
                </label>
                <select
                  required
                  disabled={!district || availableUpazilas.length === 0}
                  value={thana}
                  onChange={(e) => {
                    setThana(e.target.value);
                    setPostOffice('');
                    setPostCode('');
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                >
                  <option value="">
                    {!district ? 'প্রথমে জেলা সিলেক্ট করুন' : '-- থানা/উপজেলা নির্বাচন করুন --'}
                  </option>
                  {availableUpazilas.map((upa) => (
                    <option key={upa.name} value={upa.name}>
                      {upa.name} {upa.nameEn ? `(${upa.nameEn})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid for Post Office and Auto Post Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 4. Post Office */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ৪. পোস্ট অফিস (Post Office) *
                </label>
                <select
                  required
                  disabled={!thana || availablePostOffices.length === 0}
                  value={postOffice}
                  onChange={(e) => {
                    const poName = e.target.value;
                    setPostOffice(poName);
                    const matched = availablePostOffices.find((p) => p.name === poName);
                    if (matched) {
                      setPostCode(matched.code);
                    }
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                >
                  <option value="">
                    {!thana ? 'প্রথমে থানা সিলেক্ট করুন' : '-- পোস্ট অফিস নির্বাচন করুন --'}
                  </option>
                  {availablePostOffices.map((po, idx) => (
                    <option key={`${po.name}-${idx}`} value={po.name}>
                      {po.name} ({po.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Post Code */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    ৫. পোস্ট কোড (Post Code) *
                  </label>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    (অটো-ফিল্ড)
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={postCode}
                  onChange={(e) => setPostCode(e.target.value)}
                  placeholder={postOffice ? 'অটো-ফিল্ড পোস্ট কোড' : 'পোস্ট অফিস সিলেক্ট করুন'}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-emerald-50/50 dark:bg-emerald-950/20 text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Rules Agreement Checkboxes */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
            নীতিমালা ও শর্তাবলী সম্মতি (Rules & Terms of Service) *
          </label>
          <div className="space-y-2">
            {rulesList.map((rule, idx) => (
              <label key={idx} className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
                <input
                  type="checkbox"
                  required
                  checked={ruleCheckboxes[idx]}
                  onChange={() => handleRuleToggle(idx)}
                  className="mt-0.5 rounded text-red-600 focus:ring-red-500"
                />
                <span>{rule}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Declaration Confirmation */}
        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300 font-medium p-3 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/30">
          <input
            type="checkbox"
            required
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 rounded text-red-600 focus:ring-red-500"
          />
          <span>আমি শপথ করে বলছি যে, উপরে উল্লেখিত সকল বিবরণ সঠিক ও সত্য।</span>
        </label>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="py-3 px-6 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-2xl transition-all cursor-pointer"
            >
              বাতিল করুন
            </button>
          )}

          <button
            type="submit"
            className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isEditing ? 'প্রোফাইল আপডেট সংরক্ষণ করুন' : 'প্রোফাইল সংরক্ষণ করুন'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
