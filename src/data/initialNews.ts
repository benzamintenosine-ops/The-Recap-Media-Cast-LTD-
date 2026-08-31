import { NewsArticle, AdBanner } from '../types';

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'ঢাকা-চট্টগ্রাম এক্সপ্রেসওয়ে প্রকল্প ত্বরান্বিতকরণে নতুন মাস্টারপ্ল্যান অনুমোদন',
    titleEn: 'New Masterplan Approved to Accelerate Dhaka-Chittagong Expressway Project',
    summary: 'দেশের প্রধান অর্থনৈতিক ধমনীতে দ্রুত গতিশীল যোগাযোগ নিশ্চিতে আধুনিক আট লেনের আধুনিক এক্সপ্রেসওয়ে নির্মাণের বিশেষ নির্দেশনা দেওয়া হয়েছে।',
    summaryEn: 'Special instructions have been issued to construct a modern 8-lane expressway to ensure rapid connectivity along the country\'s primary economic arterial route.',
    content: `দেশের সার্বিক বাণিজ্য ও যাতায়াত ব্যবস্থায় বৈপ্লবিক পরিবর্তন আনতে ঢাকা-চট্টগ্রাম করিডোর উন্নয়ন সংক্রান্ত নতুন মাস্টারপ্ল্যান অনুমোদন দেয়া হয়েছে। আজকের উচ্চপর্যায়ের এক বৈঠকে এই সিদ্ধান্ত গৃহীত হয়।

**প্রধান বৈশিষ্ট্যসমূহ:**
1. এক্সপ্রেসওয়েটিতে আন্তর্জাতিক মানের আটটি লেন থাকবে।
2. নিরবচ্ছিন্ন সড়ক চলাচলের জন্য স্থাপন করা হবে স্মার্ট টোল কালেকশন সিস্টেম।
3. হাইওয়ে নিরাপত্তায় স্থাপন করা হবে কৃত্রিম বুদ্ধিমত্তা চালিত সেন্সর ও ক্যামেরা।

অর্থনীতিবিদরা বলছেন, এটি বাস্তবায়ন হলে বার্ষিক জিডিপিতে প্রায় ১.৫% অতিরিক্ত প্রবৃদ্ধি যুক্ত হবে এবং পণ্য পরিবহনের সময় অর্ধেকেরও নিচে নেমে আসবে।`,
    contentEn: `A comprehensive new masterplan for the Dhaka-Chittagong corridor development has been approved to revolutionize the country's overall trade and transportation infrastructure.

**Key Highlights:**
1. The expressway will feature 8 international-standard lanes.
2. Smart automated toll collection systems will be installed for seamless traffic flow.
3. Artificial intelligence-powered cameras and environmental sensors will monitor highway safety.

Economists state that upon completion, this project will add approximately 1.5% to annual GDP growth and reduce cargo transport times by over 50%.`,
    category: 'অর্থনীতি',
    tags: ['অর্থনীতি', 'যোগাযোগ', 'ঢাকা-চট্টগ্রাম', 'মেগা-প্রকল্প', 'উন্নয়ন'],
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    author: 'এম. এ. রাজ্জাক (জ্যেষ্ঠ প্রতিবেদক)',
    publishedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    isBreaking: true,
    isTrending: true,
    viewsCount: 1420,
    readTimeMinutes: 4,
    comments: [
      {
        id: 'c1',
        authorName: 'তানভীর আহমেদ',
        text: 'এটি দ্রুত বাস্তবায়িত হলে দেশের ব্যবসা-বাণিজ্যের অনেক সুবিধা হবে। সাধুবাদ জানাই!',
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        likes: 12,
      },
      {
        id: 'c2',
        authorName: 'Sarah Jenkins',
        text: 'Crucial infrastructure upgrade for Bangladesh economic growth!',
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        likes: 7,
      }
    ]
  },
  {
    id: 'news-2',
    title: 'কৃত্রিম বুদ্ধিমত্তা ও মহাকাশ গবেষণায় যৌথ সহযোগিতার নতুন দিগন্ত',
    titleEn: 'New Horizons in Joint AI and Space Exploration Research',
    summary: 'আন্তর্জাতিক নাসা ও দেশীয় মহাকাশ সংস্থা যৌথভাবে জলবায়ু পরিবর্তন পর্যবেক্ষণে এআই স্যাটেলাইট উৎক্ষেপণ করতে যাচ্ছে।',
    summaryEn: 'International NASA and local space agencies are partnering to launch AI-driven satellites for precision climate monitoring.',
    content: `গবেষকরা সম্প্রতি একটি নতুন প্রজন্মের স্যাটেলাইট নেটওয়ার্ক ডিজাইন করেছেন যা পৃথিবীর আবহাওয়া ও জলবায়ুর যেকোনো আকস্মিক পরিবর্তন সেকেন্ডের মধ্যে পূর্বাভাস দিতে পারবে।

বিজ্ঞানীরা জানিয়েছেন, এই স্যাটেলাইটে ব্যবহৃত এআই মডেল দুর্যোগের ঝুঁকি ৫০ শতাংশ পর্যন্ত হ্রাস করতে কার্যকর ভূমিকা পালন করবে।`,
    contentEn: `Researchers have recently designed a next-generation satellite network capable of forecasting extreme weather and climate anomalies within seconds using real-time machine learning.

Scientists confirm that the AI algorithms onboard will reduce disaster management reaction times by up to 50 percent.`,
    category: 'বিজ্ঞান',
    tags: ['বিজ্ঞান', 'এআই', 'মহাকাশ', 'জলবায়ু', 'স্যাটেলাইট'],
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    author: 'ড. নুসরাত পারভীন',
    publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    isBreaking: true,
    isTrending: true,
    viewsCount: 2890,
    readTimeMinutes: 3,
    comments: [
      {
        id: 'c3',
        authorName: 'ফারহান কবির',
        text: 'বিজ্ঞান ও প্রযুক্তির এমন অগ্রগতি মানবজাতির জন্য আশীর্বাদ।',
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        likes: 19,
      }
    ]
  },
  {
    id: 'news-3',
    title: 'এশিয়া কাপের ফাইনালে জয়ের লক্ষে টাইগারদের কঠোর প্রস্তুতি',
    titleEn: 'Tigers Train Rigorously with Eyes Set on Asia Cup Final Victory',
    summary: 'চূড়ান্ত লড়াইয়ের আগে মিরপুর শেরেবাংলা স্টেডিয়ামে নিবিড় অনুশীলনে ব্যস্ত সময় পার করছে জাতীয় ক্রিকেট দল।',
    summaryEn: 'The national cricket squad undergoes intensive practice sessions at Sher-e-Bangla Stadium ahead of the crucial clash.',
    content: `আসন্ন এশিয়া কাপের শিরোপা লড়াইয়ে মুখোমুখি হতে বাংলাদেশ দল মনোস্তাত্ত্বিক ও শারীরিক দুইভাবেই সেরা প্রস্তুতি নিচ্ছে। প্রধান কোচ সংবাদ সম্মেলনে আশাবাদ ব্যক্ত করেছেন।

ওপেনিং জুটিতে আগ্রাসী সূচনা এবং ডেথ ওভারে নিয়ন্ত্রিত বোলিংই হবে জয়ের প্রধান চাবিকাঠি।`,
    contentEn: `Ahead of the grand Asia Cup final, the Bangladesh national cricket team is undergoing high-intensity tactical and physical conditioning. The head coach expressed strong confidence.

Explosive opening partnerships combined with disciplined death-overs bowling will serve as the core strategy for victory.`,
    category: 'খেলাধুলা',
    tags: ['খেলাধুলা', 'ক্রিকেট', 'টাইগার্স', 'এশিয়া-কাপ', 'বাংলাদেশ'],
    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
    author: 'রাফসান সাবাব (ক্রীড়া সম্পাদক)',
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    isBreaking: false,
    isTrending: true,
    viewsCount: 5120,
    readTimeMinutes: 5,
    comments: []
  },
  {
    id: 'news-4',
    title: 'প্রযুক্তি মেলায় নতুন ৫জি স্মার্টফোন ও এআই ডিভাইসের মেলা',
    titleEn: 'New 5G Smartphones and AI Gadgets Unveiled at Tech Expo',
    summary: 'তিন দিনব্যাপী আন্তর্জাতিক টেক সামিটে স্থান পেয়েছে সর্বশেষ ফোল্ডেবল ডিসপ্লে ও পরিধানযোগ্য স্মার্ট সেন্সর।',
    summaryEn: 'The 3-day international Tech Summit featured cutting-edge foldable displays and wearable smart health sensors.',
    content: `রাজধানীর আইসিটি মিলনায়তনে শুরু হওয়া টেক প্রদর্শনীতে দর্শনার্থীদের ভিড় জমেছে। দেশি-বিদেশি ৫০টিরও বেশি স্টার্টআপ তাদের নতুন আবিষ্কার প্রদর্শন করছে।

দর্শকদের মূল আকর্ষণ এআইচালিত ব্যক্তিগত সহকারী রোবট যা মানুষের দৈনন্দিন কাজ সহজ করে দেয়।`,
    contentEn: `Crowds gathered at the ICT auditorium as over 50 domestic and international technology startups unveiled breakthrough consumer hardware.

The flagship attraction was an autonomous home assistant robot capable of managing complex household tasks.`,
    category: 'প্রযুক্তি',
    tags: ['প্রযুক্তি', 'স্মার্টফোন', '৫জি', 'এআই', 'টেক-মেলা'],
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    author: 'সাইফ চৌধুরী',
    publishedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    isBreaking: false,
    isTrending: false,
    viewsCount: 980,
    readTimeMinutes: 3,
    comments: []
  },
  {
    id: 'news-5',
    title: 'আন্তর্জাতিক বাণিজ্য মেলায় রেকর্ড পরিমাণ রফতানি আদেশের সম্ভাবনা',
    titleEn: 'Record Export Orders Expected at International Trade Fair',
    summary: 'পোশাক শিল্পের পাশাপাশি প্রক্রিয়াজাত খাদ্য ও আইটি সেবায় বিশ্ববাজারের গভীর আগ্রহ দেখা যাচ্ছে।',
    summaryEn: 'Foreign buyers show overwhelming interest in ready-made garments, processed foods, and IT service exports.',
    content: `আন্তর্জাতিক বাণিজ্য মেলা ২০২৬-এ বিদেশি ক্রেতাদের অংশগ্রহণ গতবারের চেয়ে ৪০% বৃদ্ধি পেয়েছে। বিশেষ করে ইউরোপ এবং উত্তর আমেরিকার বাণিজ্যিক প্রতিনিধি দল বাংলাদেশের তথ্যপ্রযুক্তি খাতে বড় রকমের বিনিয়োগে আগ্রহী।`,
    contentEn: `Foreign buyer participation at the International Trade Fair 2026 jumped by 40%. European and North American commercial delegations expressed strong interest in investing in Bangladesh's IT sector.`,
    category: 'বাণিজ্য' as any,
    tags: ['বাণিজ্য', 'রপ্তানি', 'বাণিজ্য-মেলা', 'আইটি', 'অর্থনীতি'],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    author: 'তানিয়া রহমান',
    publishedAt: new Date(Date.now() - 1000 * 60 * 520).toISOString(),
    isBreaking: false,
    isTrending: false,
    viewsCount: 1750,
    readTimeMinutes: 4,
    comments: []
  }
];

export const INITIAL_ADS: AdBanner[] = [
  {
    id: 'ad-top-1',
    title: 'The Recap Global Media App Download',
    sponsorName: 'THE RECAP MEDIA CAST LTD',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    targetUrl: '#',
    placement: 'header_top',
    active: true
  },
  {
    id: 'ad-side-1',
    title: 'Smart Cloud Hosting 50% Off',
    sponsorName: 'Apex Cloud Solutions',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    targetUrl: '#',
    placement: 'sidebar',
    active: true
  },
  {
    id: 'ad-article-1',
    title: 'Future Tech Summit 2026 Pass',
    sponsorName: 'TechCorp BD',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
    targetUrl: '#',
    placement: 'in_article',
    active: true
  }
];
