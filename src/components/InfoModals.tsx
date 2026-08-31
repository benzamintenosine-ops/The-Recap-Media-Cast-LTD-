import React, { useState } from 'react';
import { 
  X, 
  Info, 
  ShieldCheck, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle, 
  Globe, 
  Award, 
  Users, 
  FileText, 
  Lock,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';
import { Language } from '../types';

interface InfoModalsProps {
  activeModal: 'about' | 'privacy' | 'contact' | null;
  onClose: () => void;
  currentLang: Language;
}

export const InfoModals: React.FC<InfoModalsProps> = ({
  activeModal,
  onClose,
  currentLang
}) => {
  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  if (!activeModal) return null;

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
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto my-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* MODAL 1: ABOUT US (আমাদের কথা) */}
        {activeModal === 'about' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-12 h-12 bg-red-600/10 text-red-600 dark:text-red-500 rounded-2xl flex items-center justify-center">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
                  {currentLang === 'bn' ? 'আমাদের কথা (About Us)' : 'About Us'}
                </h2>
                <p className="text-xs text-slate-500">
                  THE RECAP MEDIA CAST LTD — সত্যনিষ্ঠ, বস্তুনিষ্ঠ ও তাৎক্ষণিক সংবাদ
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <p className="font-semibold text-slate-900 dark:text-white text-sm">
                'দ্য রিক্যাপ মিডিয়া কাস্ট লিমিটেড' বাংলাদেশের অন্যতম শীর্ষস্থানীয় রিয়েল-টাইম ডিজিটাল সংবাদ মাধ্যম। আমরা বস্তুনিষ্ঠ তথ্য উপস্থাপন ও তাৎক্ষণিক ব্রেকিং সংবাদ পরিবেশনে প্রতিশ্রুতিবদ্ধ।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <Globe className="w-5 h-5 text-red-500 mx-auto" />
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">সারাদেশে বিশাল নেটওয়ার্ক</h4>
                  <p className="text-[10px] text-slate-500">৬৪ জেলায় নিজস্ব প্রতিবেদক</p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <Award className="w-5 h-5 text-amber-500 mx-auto" />
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">বস্তুনিষ্ঠ সাংবাদিকতা</h4>
                  <p className="text-[10px] text-slate-500">নিরপেক্ষ ও নির্ভরযোগ্য সংবাদ</p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <Users className="w-5 h-5 text-emerald-500 mx-auto" />
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">স্মার্ট প্রযুক্তি প্যানেল</h4>
                  <p className="text-[10px] text-slate-500">এআই ভেরিফাইড লেখক প্যানেল</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-red-500" /> আমাদের লক্ষ্য ও উদ্দেশ্য:
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <li>জাতীয়, আন্তর্জাতিক, অর্থনীতি, খেলাধুলা ও প্রযুক্তির সত্য খবর সবার আগে পৌঁছে দেওয়া।</li>
                  <li>গুজব মুক্ত সংবাদ পরিবেশন নিশ্চিত করতে কৃত্রিম বুদ্ধিমত্তা ও সিনিয়র এডিটরদের দ্বারা প্রতিটি খবর যাচাই করা।</li>
                  <li>তৃণমূল থেকে শুরু করে রাজধানী পর্যন্ত অনুসন্ধানী সাংবাদিকতাকে উৎসাহিত করা।</li>
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
                <span>© ২০২৬ দ্য রিক্যাপ মিডিয়া কাস্ট লিমিটেড</span>
                <span className="font-mono">Govt Reg: RMC-2026-BD</span>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: PRIVACY & POLICY (প্রাইভেসি পলিসি) */}
        {activeModal === 'privacy' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-12 h-12 bg-emerald-600/10 text-emerald-600 dark:text-emerald-500 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
                  {currentLang === 'bn' ? 'প্রাইভেসি ও ব্যবহারের নীতি (Privacy & Policy)' : 'Privacy & Policy'}
                </h2>
                <p className="text-xs text-slate-500">
                  পাঠক ও ব্যবহারকারীদের ব্যক্তিগত তথ্যের সুরক্ষা এবং গোপনীয়তা রক্ষা নীতিমালা
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs space-y-1">
                <strong className="block font-bold flex items-center gap-1">
                  <Lock className="w-4 h-4" /> আপনার তথ্যের সর্বোচ্চ সুরক্ষা
                </strong>
                <span>'দ্য রিক্যাপ মিডিয়া কাস্ট লিমিটেড' পাঠকদের ব্যক্তিগত গোপনীয়তাকে সর্বোচ্চ গুরুত্ব দেয়।</span>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-1">১. তথ্য সংগ্রহ (Data Collection)</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    আমাদের পোর্টালে সাধারণ সংবাদ পড়ার জন্য কোনো তথ্যের প্রয়োজন নেই। লেখক প্যানেলে নিবন্ধনের সময় প্রদত্ত নাম, ইমেইল, মোবাইল নম্বর ও প্রোফাইল ছবি নিরাপদ সার্ভারে সংরক্ষিত থাকে।
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-1">২. কুকিজ নীতিমালা (Cookies Policy)</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    পাঠকের পছন্দ অনুযায়ী সংবাদ প্রদর্শন, নাইট মোড থিম সেটিং এবং অফলাইন পড়ার সুবিধা প্রদান করতে সাময়িকভাবে লোকাল স্টোরেজ ও কুকিজ ব্যবহার করা হয়।
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-1">৩. কন্টেন্ট নীতি ও মন্তব্য প্রকাশ (Comment Guidelines)</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    সংবাদের নিচে পাঠকদের শালীন ও গঠনমূলক মন্তব্য করার অনুরোধ করা হচ্ছে। কোনো বিদ্বেষমূলক বা বিভ্রান্তিকর তথ্য মন্তব্য বক্সে প্রকাশ করা আইনত দণ্ডনীয়।
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-1">৪. কপিরাইট ও পুনঃপ্রকাশ (Copyright Terms)</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    'দ্য রিক্যাপ মিডিয়া কাস্ট' পোর্টালে প্রকাশিত লিখিত কন্টেন্ট ও ছবি অনুমতি ছাড়া বাণিজ্যিক উদ্দেশ্যে হুবহু অনুলিপি করা নিষিদ্ধ।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: CONTACT WITH US (যোগাযোগ করুন) */}
        {activeModal === 'contact' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-12 h-12 bg-amber-600/10 text-amber-600 dark:text-amber-500 rounded-2xl flex items-center justify-center">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
                  {currentLang === 'bn' ? 'আমাদের সাথে যোগাযোগ (Contact With Us)' : 'Contact With Us'}
                </h2>
                <p className="text-xs text-slate-500">
                  যেকোনো তথ্য, বিজ্ঞাপন অথবা সংবাদের বিষয়ে আমাদের কার্যালয়ে যোগাযোগ করুন
                </p>
              </div>
            </div>

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
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">অফিসিয়াল ঠিকানা</h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                      <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold text-slate-900 dark:text-white">হেড অফিস:</strong>
                        <span>প্লট #১২, রোড #২৫, গুলশান-২, ঢাকা-১২১২, বাংলাদেশ।</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                      <PhoneCall className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold text-slate-900 dark:text-white">হেল্পলাইন / হটলাইন:</strong>
                        <span>+৮৮০ ১৭০০-০০০০০০, +৮৮০ ২-৯৮৮০০০০</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                      <Mail className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold text-slate-900 dark:text-white">ইমেইল এড্রেস:</strong>
                        <span>contact@therecapmediacast.com</span>
                      </div>
                    </div>
                  </div>

                  {/* Social Buttons preview inside contact modal */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400">সোশ্যাল মিডিয়া পেজ:</span>
                    <div className="flex items-center gap-2">
                      <a href="https://facebook.com/therecapmediacast" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                        <Facebook className="w-4 h-4" />
                      </a>
                      <a href="https://instagram.com/therecapmediacast" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-pink-600/10 text-pink-600 hover:bg-pink-600 hover:text-white transition-colors">
                        <Instagram className="w-4 h-4" />
                      </a>
                      <a href="https://youtube.com/@therecapmediacast" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white transition-colors">
                        <Youtube className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">বার্তা পাঠান</h3>

                  <div>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="আপনার নাম *"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="ইমেইল এড্রেস *"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="বিষয় (Subject)"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <textarea
                      required
                      rows={3}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="আপনার বার্তা বা খবরের বিস্তারিত..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> বার্তা পাঠান
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
