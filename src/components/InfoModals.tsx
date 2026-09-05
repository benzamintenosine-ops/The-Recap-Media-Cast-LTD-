import React, { useState, useEffect } from 'react';
import { 
  X, 
  Info, 
  ShieldCheck, 
  PhoneCall, 
  Mail, 
  MapPin, 
  CheckCircle, 
  Globe, 
  Award, 
  Users, 
  Lock,
  Facebook,
  Instagram,
  Youtube,
  Save,
  Edit3,
  ExternalLink
} from 'lucide-react';
import { Language, SiteSettings } from '../types';

interface InfoModalsProps {
  activeModal: 'about' | 'privacy' | 'contact' | null;
  onClose: () => void;
  currentLang: Language;
  siteSettings?: SiteSettings;
  isEditable?: boolean;
  onSave?: (updatedSettings: Partial<SiteSettings>) => void;
}

export const InfoModals: React.FC<InfoModalsProps> = ({
  activeModal,
  onClose,
  currentLang,
  siteSettings,
  isEditable = false,
  onSave
}) => {
  // Contact Form State (reader view)
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Success message in edit mode
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // ABOUT US EDITABLE STATE
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutSubtitle, setAboutSubtitle] = useState('');
  const [aboutIntro, setAboutIntro] = useState('');
  const [card1Title, setCard1Title] = useState('');
  const [card1Desc, setCard1Desc] = useState('');
  const [card2Title, setCard2Title] = useState('');
  const [card2Desc, setCard2Desc] = useState('');
  const [card3Title, setCard3Title] = useState('');
  const [card3Desc, setCard3Desc] = useState('');
  const [aboutMissionTitle, setAboutMissionTitle] = useState('');
  const [aboutMissionPoints, setAboutMissionPoints] = useState<string[]>([]);
  const [aboutFooterNotice, setAboutFooterNotice] = useState('');
  const [aboutRegNo, setAboutRegNo] = useState('');

  // PRIVACY POLICY EDITABLE STATE
  const [privacyTitle, setPrivacyTitle] = useState('');
  const [privacySubtitle, setPrivacySubtitle] = useState('');
  const [privacySecTitle, setPrivacySecTitle] = useState('');
  const [privacySecDesc, setPrivacySecDesc] = useState('');
  const [sec1Title, setSec1Title] = useState('');
  const [sec1Desc, setSec1Desc] = useState('');
  const [sec2Title, setSec2Title] = useState('');
  const [sec2Desc, setSec2Desc] = useState('');
  const [sec3Title, setSec3Title] = useState('');
  const [sec3Desc, setSec3Desc] = useState('');
  const [sec4Title, setSec4Title] = useState('');
  const [sec4Desc, setSec4Desc] = useState('');

  // CONTACT US EDITABLE STATE
  const [contactTitle, setContactTitle] = useState('');
  const [contactSubtitle, setContactSubtitle] = useState('');
  const [headOfficeAddress, setHeadOfficeAddress] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  // Synchronize state from siteSettings or sensible defaults
  useEffect(() => {
    // About Us Defaults & Custom Data
    const abData = siteSettings?.aboutUsData;
    setAboutTitle(abData?.title || 'আমাদের কথা (About Us)');
    setAboutSubtitle(abData?.subtitle || 'THE RECAP MEDIA CAST LTD — সত্যনিষ্ঠ, বস্তুনিষ্ঠ ও তাৎক্ষণিক সংবাদ');
    setAboutIntro(
      abData?.intro ||
      "'দ্য রিক্যাপ মিডিয়া কাস্ট লিমিটেড' বাংলাদেশের অন্যতম শীর্ষস্থানীয় রিয়েল-টাইম ডিজিটাল সংবাদ মাধ্যম। আমরা বস্তুনিষ্ঠ তথ্য উপস্থাপন ও তাৎক্ষণিক ব্রেকিং সংবাদ পরিবেশনে প্রতিশ্রুতিবদ্ধ।"
    );
    setCard1Title(abData?.card1Title || 'সারাদেশে বিশাল নেটওয়ার্ক');
    setCard1Desc(abData?.card1Desc || '৬৪ জেলায় নিজস্ব প্রতিবেদক');
    setCard2Title(abData?.card2Title || 'বস্তুনিষ্ঠ সাংবাদিকতা');
    setCard2Desc(abData?.card2Desc || 'নিরপেক্ষ ও নির্ভরযোগ্য সংবাদ');
    setCard3Title(abData?.card3Title || 'স্মার্ট প্রযুক্তি প্যানেল');
    setCard3Desc(abData?.card3Desc || 'এআই ভেরিফাইড প্রতিবেদক প্যানেল');
    setAboutMissionTitle(abData?.missionTitle || 'আমাদের লক্ষ্য ও উদ্দেশ্য:');
    setAboutMissionPoints(
      abData?.missionPoints && abData.missionPoints.length > 0
        ? abData.missionPoints
        : [
            'জাতীয়, আন্তর্জাতিক, অর্থনীতি, খেলাধুলা ও প্রযুক্তির সত্য খবর সবার আগে পৌঁছে দেওয়া।',
            'গুজব মুক্ত সংবাদ পরিবেশন নিশ্চিত করতে কৃত্রিম বুদ্ধিমত্তা ও সিনিয়র এডিটরদের দ্বারা প্রতিটি খবর যাচাই করা।',
            'তৃণমূল থেকে শুরু করে রাজধানী পর্যন্ত অনুসন্ধানী সাংবাদিকতাকে উৎসাহিত করা।'
          ]
    );
    setAboutFooterNotice(abData?.footerNotice || '© ২০২৬ দ্য রিক্যাপ মিডিয়া কাস্ট লিমিটেড');
    setAboutRegNo(abData?.regNo || 'Govt Reg: RMC-2026-BD');

    // Privacy Policy Defaults & Custom Data
    const privData = siteSettings?.privacyPolicyData;
    setPrivacyTitle(privData?.title || 'প্রাইভেসি ও ব্যবহারের নীতি (Privacy & Policy)');
    setPrivacySubtitle(privData?.subtitle || 'পাঠক ও ব্যবহারকারীদের ব্যক্তিগত তথ্যের সুরক্ষা এবং গোপনীয়তা রক্ষা নীতিমালা');
    setPrivacySecTitle(privData?.securityTitle || 'আপনার তথ্যের সর্বোচ্চ সুরক্ষা');
    setPrivacySecDesc(privData?.securityDesc || "'দ্য রিক্যাপ মিডিয়া কাস্ট লিমিটেড' পাঠকদের ব্যক্তিগত গোপনীয়তাকে সর্বোচ্চ গুরুত্ব দেয়।");
    setSec1Title(privData?.sec1Title || '১. তথ্য সংগ্রহ (Data Collection)');
    setSec1Desc(
      privData?.sec1Desc ||
      'আমাদের পোর্টালে সাধারণ সংবাদ পড়ার জন্য কোনো তথ্যের প্রয়োজন নেই। প্রতিবেদক প্যানেলে নিবন্ধনের সময় প্রদত্ত নাম, ইমেইল, মোবাইল নম্বর, NID ও প্রোফাইল ছবি নিরাপদ সার্ভারে সংরক্ষিত থাকে।'
    );
    setSec2Title(privData?.sec2Title || '২. কুকিজ নীতিমালা (Cookies Policy)');
    setSec2Desc(
      privData?.sec2Desc ||
      'পাঠকের পছন্দ অনুযায়ী সংবাদ প্রদর্শন, নাইট মোড থিম সেটিং এবং অফলাইন পড়ার সুবিধা প্রদান করতে সাময়িকভাবে লোকাল স্টোরেজ ও কুকিজ ব্যবহার করা হয়।'
    );
    setSec3Title(privData?.sec3Title || '৩. কন্টেন্ট নীতি ও মন্তব্য প্রকাশ (Comment Guidelines)');
    setSec3Desc(
      privData?.sec3Desc ||
      'সংবাদের নিচে পাঠকদের শালীন ও গঠনমূলক মন্তব্য করার অনুরোধ করা হচ্ছে। কোনো বিদ্বেষমূলক বা বিভ্রান্তিকর তথ্য মন্তব্য বক্সে প্রকাশ করা আইনত দণ্ডনীয়।'
    );
    setSec4Title(privData?.sec4Title || '৪. কপিরাইট ও পুনঃপ্রকাশ (Copyright Terms)');
    setSec4Desc(
      privData?.sec4Desc ||
      "'দ্য রিক্যাপ মিডিয়া কাস্ট' পোর্টালে প্রকাশিত লিখিত কন্টেন্ট ও ছবি অনুমতি ছাড়া বাণিজ্যিক উদ্দেশ্যে হুবহু অনুলিপি করা নিষিদ্ধ।"
    );

    // Contact Us Defaults & Custom Data
    const cData = siteSettings?.contactUsData;
    setContactTitle(cData?.title || 'আমাদের সাথে যোগাযোগ (Contact With Us)');
    setContactSubtitle(cData?.subtitle || 'যেকোনো তথ্য, বিজ্ঞাপন অথবা সংবাদের বিষয়ে আমাদের কার্যালয়ে যোগাযোগ করুন');
    setHeadOfficeAddress(cData?.headOfficeAddress || siteSettings?.officeAddress || 'প্লট #১২, রোড #২৫, গুলশান-২, ঢাকা-১২১২, বাংলাদেশ।');
    setPhoneNumbers(cData?.phoneNumbers || siteSettings?.contactPhone || '+৮৮০ ১৭০০-০০০০০০, +৮৮০ ২-৯৮৮০০০০');
    setOfficialEmail(cData?.emailAddress || siteSettings?.contactEmail || 'contact@therecapmediacast.com');
    setWebsiteUrl(cData?.websiteUrl || 'https://therecapmediacast.com');
    setFacebookUrl(cData?.facebookUrl || 'https://facebook.com/therecapmediacast');
    setInstagramUrl(cData?.instagramUrl || 'https://instagram.com/therecapmediacast');
    setYoutubeUrl(cData?.youtubeUrl || 'https://youtube.com/@therecapmediacast');
  }, [siteSettings, activeModal]);

  if (!activeModal) return null;

  // Save changes handler for admin
  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSave) return;
    onSave({
      aboutUsData: {
        title: aboutTitle,
        subtitle: aboutSubtitle,
        intro: aboutIntro,
        card1Title,
        card1Desc,
        card2Title,
        card2Desc,
        card3Title,
        card3Desc,
        missionTitle: aboutMissionTitle,
        missionPoints: aboutMissionPoints.filter(p => p.trim().length > 0),
        footerNotice: aboutFooterNotice,
        regNo: aboutRegNo
      }
    });
    setSaveSuccessMsg('About Us এর তথ্য সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleSavePrivacy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSave) return;
    onSave({
      privacyPolicyData: {
        title: privacyTitle,
        subtitle: privacySubtitle,
        securityTitle: privacySecTitle,
        securityDesc: privacySecDesc,
        sec1Title,
        sec1Desc,
        sec2Title,
        sec2Desc,
        sec3Title,
        sec3Desc,
        sec4Title,
        sec4Desc
      }
    });
    setSaveSuccessMsg('Privacy & Policy এর নীতিমালা সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSave) return;
    onSave({
      officeAddress: headOfficeAddress,
      contactPhone: phoneNumbers,
      contactEmail: officialEmail,
      contactUsData: {
        title: contactTitle,
        subtitle: contactSubtitle,
        headOfficeLabel: 'হেড অফিস',
        headOfficeAddress,
        phoneLabel: 'হেল্পলাইন / হটলাইন',
        phoneNumbers,
        emailLabel: 'ইমেইল এড্রেস',
        emailAddress: officialEmail,
        webLabel: 'ওয়েবসাইট',
        websiteUrl,
        facebookUrl,
        instagramUrl,
        youtubeUrl
      }
    });
    setSaveSuccessMsg('Contact With Us এর যোগাযোগ তথ্য সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Reader contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto my-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="বন্ধ করুন"
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Admin Edit Mode Alert Banner */}
        {isEditable && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs text-amber-700 dark:text-amber-300">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="font-bold">অ্যাডমিন এডিট মোড: এখানে সরাসরি লেখাগুলো পরিবর্তন করে 'সংরক্ষণ করুন' বাটনে চাপুন।</span>
            </div>
            {saveSuccessMsg && (
              <span className="bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] animate-fade-in flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> {saveSuccessMsg}
              </span>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 1: ABOUT US (আমাদের কথা) */}
        {/* ========================================================================= */}
        {activeModal === 'about' && (
          <form onSubmit={handleSaveAbout} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-12 h-12 bg-red-600/10 text-red-600 dark:text-red-500 rounded-2xl flex items-center justify-center shrink-0">
                <Info className="w-6 h-6" />
              </div>
              <div className="flex-1">
                {isEditable ? (
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={aboutTitle}
                      onChange={(e) => setAboutTitle(e.target.value)}
                      className="w-full text-lg font-bold text-slate-900 dark:text-white font-serif bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1"
                      placeholder="About Us শিরোনাম"
                      required
                    />
                    <input
                      type="text"
                      value={aboutSubtitle}
                      onChange={(e) => setAboutSubtitle(e.target.value)}
                      className="w-full text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1"
                      placeholder="উপশিরোনাম"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
                      {aboutTitle}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {aboutSubtitle}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {isEditable ? (
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    মূল সূচনা অনুচ্ছেদ (Introductory Paragraph):
                  </label>
                  <textarea
                    rows={3}
                    value={aboutIntro}
                    onChange={(e) => setAboutIntro(e.target.value)}
                    className="w-full text-xs sm:text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 leading-relaxed"
                  />
                </div>
              ) : (
                <p className="font-semibold text-slate-900 dark:text-white text-sm">
                  {aboutIntro}
                </p>
              )}

              {/* 3 Visual Highlight Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                {/* Card 1 */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <Globe className="w-5 h-5 text-red-500 mx-auto" />
                  {isEditable ? (
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={card1Title}
                        onChange={(e) => setCard1Title(e.target.value)}
                        className="w-full text-center font-bold text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-1"
                      />
                      <input
                        type="text"
                        value={card1Desc}
                        onChange={(e) => setCard1Desc(e.target.value)}
                        className="w-full text-center text-[10px] text-slate-500 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-1"
                      />
                    </div>
                  ) : (
                    <>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{card1Title}</h4>
                      <p className="text-[10px] text-slate-500">{card1Desc}</p>
                    </>
                  )}
                </div>

                {/* Card 2 */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <Award className="w-5 h-5 text-amber-500 mx-auto" />
                  {isEditable ? (
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={card2Title}
                        onChange={(e) => setCard2Title(e.target.value)}
                        className="w-full text-center font-bold text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-1"
                      />
                      <input
                        type="text"
                        value={card2Desc}
                        onChange={(e) => setCard2Desc(e.target.value)}
                        className="w-full text-center text-[10px] text-slate-500 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-1"
                      />
                    </div>
                  ) : (
                    <>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{card2Title}</h4>
                      <p className="text-[10px] text-slate-500">{card2Desc}</p>
                    </>
                  )}
                </div>

                {/* Card 3 */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <Users className="w-5 h-5 text-emerald-500 mx-auto" />
                  {isEditable ? (
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={card3Title}
                        onChange={(e) => setCard3Title(e.target.value)}
                        className="w-full text-center font-bold text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-1"
                      />
                      <input
                        type="text"
                        value={card3Desc}
                        onChange={(e) => setCard3Desc(e.target.value)}
                        className="w-full text-center text-[10px] text-slate-500 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-1"
                      />
                    </div>
                  ) : (
                    <>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{card3Title}</h4>
                      <p className="text-[10px] text-slate-500">{card3Desc}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Goals and Mission Points */}
              <div className="space-y-2">
                {isEditable ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={aboutMissionTitle}
                      onChange={(e) => setAboutMissionTitle(e.target.value)}
                      className="w-full font-bold text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1"
                      placeholder="লক্ষ্য ও উদ্দেশ্য শিরোনাম"
                    />
                    <label className="block text-[11px] text-slate-400">বুলেট পয়েন্টসমূহ (প্রতি লাইনে একটি):</label>
                    <textarea
                      rows={3}
                      value={aboutMissionPoints.join('\n')}
                      onChange={(e) => setAboutMissionPoints(e.target.value.split('\n'))}
                      className="w-full text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-2.5"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-red-500" /> {aboutMissionTitle}
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      {aboutMissionPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Bottom Copyright and Registration note */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between items-center gap-2">
                {isEditable ? (
                  <div className="w-full grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={aboutFooterNotice}
                      onChange={(e) => setAboutFooterNotice(e.target.value)}
                      className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-1 px-2"
                      placeholder="কপিরাইট তথ্য"
                    />
                    <input
                      type="text"
                      value={aboutRegNo}
                      onChange={(e) => setAboutRegNo(e.target.value)}
                      className="text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-1 px-2"
                      placeholder="রেজিস্ট্রেশন নম্বর"
                    />
                  </div>
                ) : (
                  <>
                    <span>{aboutFooterNotice}</span>
                    <span className="font-mono">{aboutRegNo}</span>
                  </>
                )}
              </div>
            </div>

            {/* Action Bar for Admin Edit */}
            {isEditable && (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" /> পরিবর্তন সংরক্ষণ করুন
                </button>
              </div>
            )}
          </form>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: PRIVACY & POLICY (প্রাইভেসি পলিসি) */}
        {/* ========================================================================= */}
        {activeModal === 'privacy' && (
          <form onSubmit={handleSavePrivacy} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-12 h-12 bg-emerald-600/10 text-emerald-600 dark:text-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                {isEditable ? (
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={privacyTitle}
                      onChange={(e) => setPrivacyTitle(e.target.value)}
                      className="w-full text-lg font-bold text-slate-900 dark:text-white font-serif bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1"
                      placeholder="Privacy & Policy শিরোনাম"
                      required
                    />
                    <input
                      type="text"
                      value={privacySubtitle}
                      onChange={(e) => setPrivacySubtitle(e.target.value)}
                      className="w-full text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1"
                      placeholder="উপশিরোনাম"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
                      {privacyTitle}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {privacySubtitle}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {/* Highlight Security Notice Box */}
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs space-y-1">
                {isEditable ? (
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={privacySecTitle}
                      onChange={(e) => setPrivacySecTitle(e.target.value)}
                      className="w-full font-bold text-xs bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-lg p-1 text-emerald-900 dark:text-emerald-100"
                      placeholder="সুরক্ষা বার্তা শিরোনাম"
                    />
                    <textarea
                      rows={2}
                      value={privacySecDesc}
                      onChange={(e) => setPrivacySecDesc(e.target.value)}
                      className="w-full text-xs bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-lg p-1 text-emerald-900 dark:text-emerald-100"
                      placeholder="সুরক্ষা বার্তা বিস্তারিত"
                    />
                  </div>
                ) : (
                  <>
                    <strong className="block font-bold flex items-center gap-1">
                      <Lock className="w-4 h-4" /> {privacySecTitle}
                    </strong>
                    <span>{privacySecDesc}</span>
                  </>
                )}
              </div>

              {/* Section 1 */}
              <div className="space-y-1">
                {isEditable ? (
                  <>
                    <input
                      type="text"
                      value={sec1Title}
                      onChange={(e) => setSec1Title(e.target.value)}
                      className="w-full font-bold text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1"
                    />
                    <textarea
                      rows={2}
                      value={sec1Desc}
                      onChange={(e) => setSec1Desc(e.target.value)}
                      className="w-full text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                    />
                  </>
                ) : (
                  <>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{sec1Title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{sec1Desc}</p>
                  </>
                )}
              </div>

              {/* Section 2 */}
              <div className="space-y-1">
                {isEditable ? (
                  <>
                    <input
                      type="text"
                      value={sec2Title}
                      onChange={(e) => setSec2Title(e.target.value)}
                      className="w-full font-bold text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1"
                    />
                    <textarea
                      rows={2}
                      value={sec2Desc}
                      onChange={(e) => setSec2Desc(e.target.value)}
                      className="w-full text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                    />
                  </>
                ) : (
                  <>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{sec2Title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{sec2Desc}</p>
                  </>
                )}
              </div>

              {/* Section 3 */}
              <div className="space-y-1">
                {isEditable ? (
                  <>
                    <input
                      type="text"
                      value={sec3Title}
                      onChange={(e) => setSec3Title(e.target.value)}
                      className="w-full font-bold text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1"
                    />
                    <textarea
                      rows={2}
                      value={sec3Desc}
                      onChange={(e) => setSec3Desc(e.target.value)}
                      className="w-full text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                    />
                  </>
                ) : (
                  <>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{sec3Title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{sec3Desc}</p>
                  </>
                )}
              </div>

              {/* Section 4 */}
              <div className="space-y-1">
                {isEditable ? (
                  <>
                    <input
                      type="text"
                      value={sec4Title}
                      onChange={(e) => setSec4Title(e.target.value)}
                      className="w-full font-bold text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1"
                    />
                    <textarea
                      rows={2}
                      value={sec4Desc}
                      onChange={(e) => setSec4Desc(e.target.value)}
                      className="w-full text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                    />
                  </>
                ) : (
                  <>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{sec4Title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{sec4Desc}</p>
                  </>
                )}
              </div>
            </div>

            {/* Action Bar for Admin Edit */}
            {isEditable && (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" /> পলিসি সংরক্ষণ করুন
                </button>
              </div>
            )}
          </form>
        )}

        {/* ========================================================================= */}
        {/* MODAL 3: CONTACT WITH US (যোগাযোগ করুন) */}
        {/* ========================================================================= */}
        {activeModal === 'contact' && (
          <form onSubmit={handleSaveContact} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-12 h-12 bg-amber-600/10 text-amber-600 dark:text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div className="flex-1">
                {isEditable ? (
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={contactTitle}
                      onChange={(e) => setContactTitle(e.target.value)}
                      className="w-full text-lg font-bold text-slate-900 dark:text-white font-serif bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1"
                      placeholder="Contact শিরোনাম"
                      required
                    />
                    <input
                      type="text"
                      value={contactSubtitle}
                      onChange={(e) => setContactSubtitle(e.target.value)}
                      className="w-full text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1"
                      placeholder="উপশিরোনাম"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
                      {contactTitle}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {contactSubtitle}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* If reader form submitted */}
            {contactSubmitted ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl text-center space-y-2 border border-emerald-200 dark:border-emerald-900">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-200">
                  ধন্যবাদ! আপনার বার্তাটি আমাদের কাছে পৌঁছেছে।
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-300">
                  আমাদের বার্তা প্রতিনিধি দ্রুত আপনার সাথে ইমেইলে যোগাযোগ করবে।
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Details Card */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">অফিসিয়াল ঠিকানা ও তথ্য</h3>

                  <div className="space-y-3 text-xs">
                    {/* Head Office Address */}
                    <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                      <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <strong className="block font-bold text-slate-900 dark:text-white">হেড অফিস:</strong>
                        {isEditable ? (
                          <textarea
                            rows={2}
                            value={headOfficeAddress}
                            onChange={(e) => setHeadOfficeAddress(e.target.value)}
                            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 mt-1"
                          />
                        ) : (
                          <span>{headOfficeAddress}</span>
                        )}
                      </div>
                    </div>

                    {/* Helpline Phone */}
                    <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                      <PhoneCall className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <strong className="block font-bold text-slate-900 dark:text-white">হেল্পলাইন / হটলাইন:</strong>
                        {isEditable ? (
                          <input
                            type="text"
                            value={phoneNumbers}
                            onChange={(e) => setPhoneNumbers(e.target.value)}
                            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 mt-1"
                          />
                        ) : (
                          <span>{phoneNumbers}</span>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                      <Mail className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <strong className="block font-bold text-slate-900 dark:text-white">ইমেইল এড্রেস:</strong>
                        {isEditable ? (
                          <input
                            type="email"
                            value={officialEmail}
                            onChange={(e) => setOfficialEmail(e.target.value)}
                            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 mt-1"
                          />
                        ) : (
                          <span>{officialEmail}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Social Buttons */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400">সোশ্যাল মিডিয়া পেজ লিংক:</span>
                    {isEditable ? (
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Facebook className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <input
                            type="text"
                            value={facebookUrl}
                            onChange={(e) => setFacebookUrl(e.target.value)}
                            placeholder="Facebook URL"
                            className="w-full text-[11px] bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1"
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Instagram className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                          <input
                            type="text"
                            value={instagramUrl}
                            onChange={(e) => setInstagramUrl(e.target.value)}
                            placeholder="Instagram URL"
                            className="w-full text-[11px] bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1"
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Youtube className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          <input
                            type="text"
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            placeholder="YouTube URL"
                            className="w-full text-[11px] bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {facebookUrl && (
                          <a href={facebookUrl} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                            <Facebook className="w-4 h-4" />
                          </a>
                        )}
                        {instagramUrl && (
                          <a href={instagramUrl} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-pink-600/10 text-pink-600 hover:bg-pink-600 hover:text-white transition-colors cursor-pointer">
                            <Instagram className="w-4 h-4" />
                          </a>
                        )}
                        {youtubeUrl && (
                          <a href={youtubeUrl} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer">
                            <Youtube className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Reader message form (disabled in Admin edit mode) */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    সরাসরি বার্তা পাঠান
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="block text-slate-500 mb-0.5">আপনার পুরো নাম *</label>
                      <input
                        type="text"
                        disabled={isEditable}
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="উদা: মোঃ আরিফুল ইসলাম"
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 mb-0.5">ইমেইল ঠিকানা *</label>
                      <input
                        type="email"
                        disabled={isEditable}
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 mb-0.5">বার্তার বিষয়</label>
                      <input
                        type="text"
                        disabled={isEditable}
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        placeholder="সংবাদ / বিজ্ঞাপন / মতামত"
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 mb-0.5">বিস্তারিত বার্তা *</label>
                      <textarea
                        rows={3}
                        disabled={isEditable}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="আপনার বক্তব্য লিখুন..."
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                      />
                    </div>

                    {!isEditable && (
                      <button
                        type="button"
                        onClick={handleContactSubmit}
                        className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all shadow-md text-xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" /> বার্তা পাঠান
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Bar for Admin Edit */}
            {isEditable && (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" /> যোগাযোগ তথ্য সংরক্ষণ করুন
                </button>
              </div>
            )}
          </form>
        )}

      </div>
    </div>
  );
};
