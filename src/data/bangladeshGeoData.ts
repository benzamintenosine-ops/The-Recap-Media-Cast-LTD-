export interface PostOfficeInfo {
  name: string;
  nameEn?: string;
  code: string;
}

export interface UpazilaInfo {
  name: string;
  nameEn?: string;
  postOffices: PostOfficeInfo[];
}

export interface DistrictInfo {
  name: string;
  nameEn?: string;
  upazilas: UpazilaInfo[];
}

export interface DivisionInfo {
  name: string;
  nameEn?: string;
  districts: DistrictInfo[];
}

export const BANGLADESH_GEO_DATA: DivisionInfo[] = [
  {
    name: 'ঢাকা',
    nameEn: 'Dhaka',
    districts: [
      {
        name: 'ঢাকা',
        nameEn: 'Dhaka',
        upazilas: [
          {
            name: 'গুলশান / বনানী',
            nameEn: 'Gulshan / Banani',
            postOffices: [
              { name: 'গুলশান মডেল টাউন', code: '1212' },
              { name: 'বনানী', code: '1213' },
              { name: 'বারিধারা', code: '1212' },
              { name: 'নিকুঞ্জ', code: '1229' }
            ]
          },
          {
            name: 'ধানমন্ডি',
            nameEn: 'Dhanmondi',
            postOffices: [
              { name: 'ধানমন্ডি', code: '1209' },
              { name: 'ঝিগাতলা', code: '1209' },
              { name: 'সায়েন্স ল্যাবরেটরি', code: '1205' }
            ]
          },
          {
            name: 'মিরপুর',
            nameEn: 'Mirpur',
            postOffices: [
              { name: 'মিরপুর-১', code: '1216' },
              { name: 'মিরপুর-২', code: '1216' },
              { name: 'মিরপুর-১০', code: '1216' },
              { name: 'মিরপুর-১২', code: '1216' },
              { name: 'পল্লবী', code: '1216' },
              { name: 'কাফরুল', code: '1206' }
            ]
          },
          {
            name: 'উত্তরা',
            nameEn: 'Uttara',
            postOffices: [
              { name: 'উত্তরা মডেল টাউন', code: '1230' },
              { name: 'উত্তরখান', code: '1230' },
              { name: 'দক্ষিণখান', code: '1230' },
              { name: 'বিমানবন্দর', code: '1229' }
            ]
          },
          {
            name: 'মতিঝিল / পল্টন',
            nameEn: 'Motijheel / Paltan',
            postOffices: [
              { name: 'মতিঝিল প্রধান কার্যালয়', code: '1000' },
              { name: 'দিলকুশা', code: '1000' },
              { name: 'পল্টন', code: '1000' },
              { name: 'গুলিস্তান', code: '1000' },
              { name: 'বিজয়নগর', code: '1000' }
            ]
          },
          {
            name: 'মোহাম্মদপুর',
            nameEn: 'Mohammadpur',
            postOffices: [
              { name: 'মোহাম্মদপুর প্রধান কার্যালয়', code: '1207' },
              { name: 'শ্যামলী', code: '1207' },
              { name: 'আদাবর', code: '1207' },
              { name: 'আসাদগেট', code: '1207' }
            ]
          },
          {
            name: 'রমনা / শাহবাগ',
            nameEn: 'Ramna / Shahbagh',
            postOffices: [
              { name: 'ঢাকা জিপিও', code: '1000' },
              { name: 'ঢাকা বিশ্ববিদ্যালয়', code: '1000' },
              { name: 'কাকরাইল', code: '1000' },
              { name: 'মগবাজার', code: '1217' },
              { name: 'শান্তিনগর', code: '1217' }
            ]
          },
          {
            name: 'পুরান ঢাকা / কোতোয়ালি',
            nameEn: 'Old Dhaka / Kotwali',
            postOffices: [
              { name: 'সদরঘাট', code: '1100' },
              { name: 'ওয়ারী', code: '1203' },
              { name: 'লালবাগ', code: '1211' },
              { name: 'চকবাজার', code: '1211' },
              { name: 'গেণ্ডারিয়া', code: '1204' },
              { name: 'সূত্রাপুর', code: '1100' }
            ]
          },
          {
            name: 'সাভার',
            nameEn: 'Savar',
            postOffices: [
              { name: 'সাভার প্রধান ডাকঘর', code: '1340' },
              { name: 'সাভার ক্যান্টনমেন্ট', code: '1344' },
              { name: 'আশুলিয়া', code: '1341' },
              { name: 'জাহাঙ্গীরনগর বিশ্ববিদ্যালয়', code: '1342' },
              { name: 'ধামরাই', code: '1350' },
              { name: 'হেমায়েতপুর', code: '1340' }
            ]
          },
          {
            name: 'কেরানীগঞ্জ',
            nameEn: 'Keraniganj',
            postOffices: [
              { name: 'কেরানীগঞ্জ', code: '1310' },
              { name: 'জিনজিরা', code: '1310' },
              { name: 'হাসনাবাদ', code: '1311' },
              { name: 'আটিবাজার', code: '1312' }
            ]
          },
          {
            name: 'নবাবগঞ্জ / দোহার',
            nameEn: 'Nawabganj / Dohar',
            postOffices: [
              { name: 'নবাবগঞ্জ', code: '1320' },
              { name: 'জয়পাড়া (দোহার)', code: '1330' },
              { name: 'কলিয়াকৈর বাজার', code: '1321' }
            ]
          }
        ]
      },
      {
        name: 'গাজীপুর',
        nameEn: 'Gazipur',
        upazilas: [
          {
            name: 'গাজীপুর সদর / জয়দেবপুর',
            nameEn: 'Gazipur Sadar / Joydebpur',
            postOffices: [
              { name: 'জয়দেবপুর প্রধান ডাকঘর', code: '1700' },
              { name: 'গাজীপুর বিএডিসি', code: '1701' },
              { name: 'বাংলাদেশ উন্মুক্ত বিশ্ববিদ্যালয় (বাউবি)', code: '1705' },
              { name: 'জাতীয় বিশ্ববিদ্যালয়', code: '1704' },
              { name: 'চান্দনা চৌরাস্তা', code: '1702' },
              { name: 'টঙ্গী প্রধান ডাকঘর', code: '1710' },
              { name: 'টঙ্গী শিল্প এলাকা', code: '1711' },
              { name: 'বোর্ড বাজার', code: '1704' }
            ]
          },
          {
            name: 'কালিয়াকৈর',
            nameEn: 'Kaliakair',
            postOffices: [
              { name: 'কালিয়াকৈর', code: '1750' },
              { name: 'সফিপুর', code: '1751' },
              { name: 'মৌচাক', code: '1751' }
            ]
          },
          {
            name: 'শ্রীপুর',
            nameEn: 'Sreepur',
            postOffices: [
              { name: 'শ্রীপুর', code: '1740' },
              { name: 'মাওনা', code: '1740' },
              { name: 'বরমী', code: '1743' }
            ]
          },
          {
            name: 'কাপাসিয়া',
            nameEn: 'Kapasia',
            postOffices: [
              { name: 'কাপাসিয়া', code: '1730' },
              { name: 'রায়েদ', code: '1731' }
            ]
          },
          {
            name: 'কালীগঞ্জ',
            nameEn: 'Kaliganj',
            postOffices: [
              { name: 'কালীগঞ্জ', code: '1720' },
              { name: 'পুবাইল', code: '1721' }
            ]
          }
        ]
      },
      {
        name: 'নারায়ণগঞ্জ',
        nameEn: 'Narayanganj',
        upazilas: [
          {
            name: 'নারায়ণগঞ্জ সদর',
            nameEn: 'Narayanganj Sadar',
            postOffices: [
              { name: 'নারায়ণগঞ্জ প্রধান ডাকঘর', code: '1400' },
              { name: 'চাষাড়া', code: '1400' },
              { name: 'সিদ্ধিরগঞ্জ', code: '1430' },
              { name: 'ফতুল্লা', code: '1420' }
            ]
          },
          {
            name: 'সোনারগাঁও',
            nameEn: 'Sonargaon',
            postOffices: [
              { name: 'সোনারগাঁও', code: '1440' },
              { name: 'মেঘনা ঘাট', code: '1441' },
              { name: 'কাঁচপুর', code: '1430' }
            ]
          },
          {
            name: 'রূপগঞ্জ',
            nameEn: 'Rupganj',
            postOffices: [
              { name: 'রূপগঞ্জ', code: '1460' },
              { name: 'ভুলতা', code: '1462' },
              { name: 'মুড়াপাড়া', code: '1464' }
            ]
          },
          {
            name: 'আড়াইহাজার',
            nameEn: 'Araihazar',
            postOffices: [
              { name: 'আড়াইহাজার', code: '1450' },
              { name: 'গোপালদী', code: '1451' }
            ]
          },
          {
            name: 'বন্দর',
            nameEn: 'Bandar',
            postOffices: [
              { name: 'বন্দর', code: '1410' },
              { name: 'মদনগঞ্জ', code: '1414' }
            ]
          }
        ]
      },
      {
        name: 'নরসিংদী',
        nameEn: 'Narsingdi',
        upazilas: [
          {
            name: 'নরসিংদী সদর',
            nameEn: 'Narsingdi Sadar',
            postOffices: [
              { name: 'নরসিংদী প্রধান ডাকঘর', code: '1600' },
              { name: 'মাধবদী', code: '1604' },
              { name: 'করিমপুর', code: '1601' }
            ]
          },
          {
            name: 'পলাশ',
            nameEn: 'Palash',
            postOffices: [
              { name: 'পলাশ', code: '1610' },
              { name: 'ঘোড়াশাল', code: '1613' }
            ]
          },
          {
            name: 'শিবপুর',
            nameEn: 'Shibpur',
            postOffices: [{ name: 'শিবপুর', code: '1620' }]
          },
          {
            name: 'রায়পুরা',
            nameEn: 'Raipura',
            postOffices: [{ name: 'রায়পুরা', code: '1630' }]
          },
          {
            name: 'মনোহরদী',
            nameEn: 'Monohardi',
            postOffices: [{ name: 'মনোহরদী', code: '1650' }]
          },
          {
            name: 'বেলাবো',
            nameEn: 'Belabo',
            postOffices: [{ name: 'বেলাবো', code: '1640' }]
          }
        ]
      },
      {
        name: 'টাঙ্গাইল',
        nameEn: 'Tangail',
        upazilas: [
          {
            name: 'টাঙ্গাইল সদর',
            nameEn: 'Tangail Sadar',
            postOffices: [
              { name: 'টাঙ্গাইল প্রধান ডাকঘর', code: '1900' },
              { name: 'করটিয়া', code: '1903' },
              { name: 'সন্তোষ', code: '1902' }
            ]
          },
          {
            name: 'মির্জাপুর',
            nameEn: 'Mirzapur',
            postOffices: [
              { name: 'মির্জাপুর', code: '1940' },
              { name: 'গোড়াই', code: '1941' }
            ]
          },
          {
            name: 'কালিহাতী',
            nameEn: 'Kalihati',
            postOffices: [
              { name: 'কালিহাতী', code: '1970' },
              { name: 'এলেঙ্গা', code: '1973' }
            ]
          },
          {
            name: 'মধুপুর',
            nameEn: 'Madhupur',
            postOffices: [{ name: 'মধুপুর', code: '1996' }]
          },
          {
            name: 'ঘাটাইল',
            nameEn: 'Ghatail',
            postOffices: [{ name: 'ঘাটাইল', code: '1980' }]
          },
          {
            name: 'সখিপুর',
            nameEn: 'Sakhipur',
            postOffices: [{ name: 'সখিপুর', code: '1950' }]
          },
          {
            name: 'গোপালপুর',
            nameEn: 'Gopalpur',
            postOffices: [{ name: 'গোপালপুর', code: '1960' }]
          },
          {
            name: 'ভূঞাপুর',
            nameEn: 'Bhuapur',
            postOffices: [{ name: 'ভূঞাপুর', code: '1965' }]
          },
          {
            name: 'বাসাইল',
            nameEn: 'Basail',
            postOffices: [{ name: 'বাসাইল', code: '1920' }]
          },
          {
            name: 'দেলদুয়ার',
            nameEn: 'Delduar',
            postOffices: [{ name: 'দেলদুয়ার', code: '1918' }]
          },
          {
            name: 'নাগরপুর',
            nameEn: 'Nagarpur',
            postOffices: [{ name: 'নাগরপুর', code: '1936' }]
          },
          {
            name: 'ধনবাড়ী',
            nameEn: 'Dhanbari',
            postOffices: [{ name: 'ধনবাড়ী', code: '1997' }]
          }
        ]
      },
      {
        name: 'কিশোরগঞ্জ',
        nameEn: 'Kishoreganj',
        upazilas: [
          {
            name: 'কিশোরগঞ্জ সদর',
            nameEn: 'Kishoreganj Sadar',
            postOffices: [{ name: 'কিশোরগঞ্জ প্রধান ডাকঘর', code: '2300' }]
          },
          {
            name: 'ভৈরব',
            nameEn: 'Bhairab',
            postOffices: [{ name: 'ভৈরব বাজার', code: '2350' }]
          },
          {
            name: 'বাজিতপুর',
            nameEn: 'Bajitpur',
            postOffices: [{ name: 'বাজিতপুর', code: '2336' }]
          },
          {
            name: 'করিমগঞ্জ',
            nameEn: 'Karimganj',
            postOffices: [{ name: 'করিমগঞ্জ', code: '2310' }]
          },
          {
            name: 'নিকলী',
            nameEn: 'Nikli',
            postOffices: [{ name: 'নিকলী', code: '2360' }]
          },
          {
            name: 'ইটনা',
            nameEn: 'Itna',
            postOffices: [{ name: 'ইটনা', code: '2390' }]
          },
          {
            name: 'মিঠামইন',
            nameEn: 'Mithamoin',
            postOffices: [{ name: 'মিঠামইন', code: '2370' }]
          },
          {
            name: 'অষ্টগ্রাম',
            nameEn: 'Austagram',
            postOffices: [{ name: 'অষ্টগ্রাম', code: '2380' }]
          },
          {
            name: 'কটিয়াদী',
            nameEn: 'Katiadi',
            postOffices: [{ name: 'কটিয়াদী', code: '2330' }]
          },
          {
            name: 'পাকুন্দিয়া',
            nameEn: 'Pakundia',
            postOffices: [{ name: 'পাকুন্দিয়া', code: '2326' }]
          },
          {
            name: 'হোসেনপুর',
            nameEn: 'Hossainpur',
            postOffices: [{ name: 'হোসেনপুর', code: '2320' }]
          },
          {
            name: 'কুলিয়ারচর',
            nameEn: 'Kuliarchar',
            postOffices: [{ name: 'কুলিয়ারচর', code: '2340' }]
          },
          {
            name: 'তাড়াইল',
            nameEn: 'Tarail',
            postOffices: [{ name: 'তাড়াইল', code: '2316' }]
          }
        ]
      },
      {
        name: 'মানিকগঞ্জ',
        nameEn: 'Manikganj',
        upazilas: [
          {
            name: 'মানিকগঞ্জ সদর',
            nameEn: 'Manikganj Sadar',
            postOffices: [{ name: 'মানিকগঞ্জ প্রধান ডাকঘর', code: '1800' }]
          },
          {
            name: 'সিংগাইর',
            nameEn: 'Singair',
            postOffices: [{ name: 'সিংগাইর', code: '1820' }]
          },
          {
            name: 'সাটুরিয়া',
            nameEn: 'Saturia',
            postOffices: [{ name: 'সাটুরিয়া', code: '1810' }]
          },
          {
            name: 'ঘিওর',
            nameEn: 'Ghior',
            postOffices: [{ name: 'ঘিওর', code: '1840' }]
          },
          {
            name: 'শিবালয় / আরিচা',
            nameEn: 'Shibalaya / Aricha',
            postOffices: [
              { name: 'শিবালয়', code: '1850' },
              { name: 'আরিচা ঘাট', code: '1851' }
            ]
          },
          {
            name: 'দৌলতপুর',
            nameEn: 'Daulatpur',
            postOffices: [{ name: 'দৌলতপুর', code: '1860' }]
          },
          {
            name: 'হরিরামপুর',
            nameEn: 'Harirampur',
            postOffices: [{ name: 'হরিরামপুর', code: '1870' }]
          }
        ]
      },
      {
        name: 'মুন্সীগঞ্জ',
        nameEn: 'Munshiganj',
        upazilas: [
          {
            name: 'মুন্সীগঞ্জ সদর',
            nameEn: 'Munshiganj Sadar',
            postOffices: [{ name: 'মুন্সীগঞ্জ প্রধান ডাকঘর', code: '1500' }, { name: 'মুক্তারপুর', code: '1502' }]
          },
          {
            name: 'সিরাজদিখান',
            nameEn: 'Sirajdikhan',
            postOffices: [{ name: 'সিরাজদিখান', code: '1540' }]
          },
          {
            name: 'শ্রীনগর',
            nameEn: 'Sreenagar',
            postOffices: [{ name: 'শ্রীনগর', code: '1550' }]
          },
          {
            name: 'লৌহজং / মাওয়া',
            nameEn: 'Lohajang / Mawa',
            postOffices: [
              { name: 'লৌহজং', code: '1530' },
              { name: 'মাওয়া ঘাট', code: '1531' }
            ]
          },
          {
            name: 'গজারিয়া',
            nameEn: 'Gazaria',
            postOffices: [{ name: 'গজারিয়া', code: '1510' }]
          },
          {
            name: 'টংগিবাড়ী',
            nameEn: 'Tongibari',
            postOffices: [{ name: 'টংগিবাড়ী', code: '1520' }]
          }
        ]
      },
      {
        name: 'ফরিদপুর',
        nameEn: 'Faridpur',
        upazilas: [
          {
            name: 'ফরিদপুর সদর',
            nameEn: 'Faridpur Sadar',
            postOffices: [{ name: 'ফরিদপুর প্রধান ডাকঘর', code: '7800' }]
          },
          {
            name: 'ভাঙ্গা',
            nameEn: 'Bhanga',
            postOffices: [{ name: 'ভাঙ্গা', code: '7830' }]
          },
          {
            name: 'বোয়ালমারী',
            nameEn: 'Boalmari',
            postOffices: [{ name: 'বোয়ালমারী', code: '7860' }]
          },
          {
            name: 'নগরকান্দা',
            nameEn: 'Nagarkanda',
            postOffices: [{ name: 'নগরকান্দা', code: '7840' }]
          },
          {
            name: 'মধুখালী',
            nameEn: 'Madhukhali',
            postOffices: [{ name: 'মধুখালী', code: '7850' }]
          },
          {
            name: 'আলফাডাঙ্গা',
            nameEn: 'Alfadanga',
            postOffices: [{ name: 'আলফাডাঙ্গা', code: '7870' }]
          },
          {
            name: 'চরভদ্রাসন',
            nameEn: 'Charbhadrasan',
            postOffices: [{ name: 'চরভদ্রাসন', code: '7810' }]
          },
          {
            name: 'সদরপুর',
            nameEn: 'Sadarpur',
            postOffices: [{ name: 'সদরপুর', code: '7820' }]
          },
          {
            name: 'সালথা',
            nameEn: 'Saltha',
            postOffices: [{ name: 'সালথা', code: '7841' }]
          }
        ]
      },
      {
        name: 'গোপালগঞ্জ',
        nameEn: 'Gopalganj',
        upazilas: [
          {
            name: 'গোপালগঞ্জ সদর',
            nameEn: 'Gopalganj Sadar',
            postOffices: [{ name: 'গোপালগঞ্জ প্রধান ডাকঘর', code: '8100' }]
          },
          {
            name: 'টুঙ্গিপাড়া',
            nameEn: 'Tungipara',
            postOffices: [{ name: 'টুঙ্গিপাড়া', code: '8120' }]
          },
          {
            name: 'কোটালীপাড়া',
            nameEn: 'Kotalipara',
            postOffices: [{ name: 'কোটালীপাড়া', code: '8110' }]
          },
          {
            name: 'কাশিয়ানী',
            nameEn: 'Kashiani',
            postOffices: [{ name: 'কাশিয়ানী', code: '8130' }]
          },
          {
            name: 'মুকসুদপুর',
            nameEn: 'Muksudpur',
            postOffices: [{ name: 'মুকসুদপুর', code: '8140' }]
          }
        ]
      },
      {
        name: 'রাজবাড়ী',
        nameEn: 'Rajbari',
        upazilas: [
          {
            name: 'রাজবাড়ী সদর',
            nameEn: 'Rajbari Sadar',
            postOffices: [{ name: 'রাজবাড়ী প্রধান ডাকঘর', code: '7700' }]
          },
          {
            name: 'গোয়ালন্দ / দৌলতদিয়া',
            nameEn: 'Goalanda / Daulatdia',
            postOffices: [
              { name: 'গোয়ালন্দ ঘাট', code: '7710' },
              { name: 'দৌলতদিয়া ঘাট', code: '7711' }
            ]
          },
          {
            name: 'পাংশা',
            nameEn: 'Pangsha',
            postOffices: [{ name: 'পাংশা', code: '7720' }]
          },
          {
            name: 'বালিয়াকান্দি',
            nameEn: 'Baliakandi',
            postOffices: [{ name: 'বালিয়াকান্দি', code: '7730' }]
          },
          {
            name: 'কালুখালী',
            nameEn: 'Kalukhali',
            postOffices: [{ name: 'কালুখালী', code: '7721' }]
          }
        ]
      },
      {
        name: 'মাদারীপুর',
        nameEn: 'Madaripur',
        upazilas: [
          {
            name: 'মাদারীপুর সদর',
            nameEn: 'Madaripur Sadar',
            postOffices: [{ name: 'মাদারীপুর প্রধান ডাকঘর', code: '7900' }]
          },
          {
            name: 'শিবচর',
            nameEn: 'Shibchar',
            postOffices: [{ name: 'শিবচর', code: '7930' }]
          },
          {
            name: 'কালকিনি',
            nameEn: 'Kalkini',
            postOffices: [{ name: 'কালকিনি', code: '7920' }]
          },
          {
            name: 'রাজৈর',
            nameEn: 'Rajoir',
            postOffices: [{ name: 'রাজৈর', code: '7910' }]
          },
          {
            name: 'ডাসার',
            nameEn: 'Dasar',
            postOffices: [{ name: 'ডাসার', code: '7921' }]
          }
        ]
      },
      {
        name: 'শরীয়তপুর',
        nameEn: 'Shariatpur',
        upazilas: [
          {
            name: 'শরীয়তপুর সদর',
            nameEn: 'Shariatpur Sadar',
            postOffices: [{ name: 'শরীয়তপুর প্রধান ডাকঘর', code: '8000' }]
          },
          {
            name: 'জাজিরা',
            nameEn: 'Zajira',
            postOffices: [{ name: 'জাজিরা', code: '8010' }]
          },
          {
            name: 'নড়িয়া',
            nameEn: 'Naria',
            postOffices: [{ name: 'নড়িয়া', code: '8020' }]
          },
          {
            name: 'ভেদরগঞ্জ',
            nameEn: 'Bhedarganj',
            postOffices: [{ name: 'ভেদরগঞ্জ', code: '8030' }]
          },
          {
            name: 'ডামুড্যা',
            nameEn: 'Damudya',
            postOffices: [{ name: 'ডামুড্যা', code: '8040' }]
          },
          {
            name: 'গোসাইরহাট',
            nameEn: 'Gosairhat',
            postOffices: [{ name: 'গোসাইরহাট', code: '8050' }]
          }
        ]
      }
    ]
  },
  {
    name: 'চট্টগ্রাম',
    nameEn: 'Chattogram',
    districts: [
      {
        name: 'চট্টগ্রাম',
        nameEn: 'Chattogram',
        upazilas: [
          {
            name: 'চট্টগ্রাম সদর / কোতোয়ালি',
            nameEn: 'Chattogram Sadar / Kotwali',
            postOffices: [
              { name: 'চট্টগ্রাম জিপিও', code: '4000' },
              { name: 'আগ্রাবাদ প্রধান ডাকঘর', code: '4100' },
              { name: 'নাসিরাবাদ', code: '4203' },
              { name: 'খুলশী', code: '4225' },
              { name: 'পতেঙ্গা', code: '4204' },
              { name: 'হালিশহর', code: '4216' },
              { name: 'পাহাড়তলী', code: '4202' },
              { name: 'চান্দগাঁও', code: '4212' },
              { name: 'পাঁচলাইশ', code: '4203' },
              { name: 'বন্দর', code: '4100' }
            ]
          },
          {
            name: 'হাটহাজারী',
            nameEn: 'Hathazari',
            postOffices: [
              { name: 'হাটহাজারী', code: '4330' },
              { name: 'চট্টগ্রাম বিশ্ববিদ্যালয়', code: '4331' }
            ]
          },
          {
            name: 'সীতাকুণ্ড',
            nameEn: 'Sitakunda',
            postOffices: [
              { name: 'সীতাকুণ্ড', code: '4310' },
              { name: 'ভাটিয়ারী', code: '4315' },
              { name: 'বার আউলিয়া', code: '4317' }
            ]
          },
          {
            name: 'পটিয়া',
            nameEn: 'Patiya',
            postOffices: [{ name: 'পটিয়া', code: '4370' }]
          },
          {
            name: 'রাউজান',
            nameEn: 'Raozan',
            postOffices: [
              { name: 'রাউজান', code: '4340' },
              { name: 'চুয়েট (CUET)', code: '4349' }
            ]
          },
          {
            name: 'রাঙ্গুনিয়া',
            nameEn: 'Rangunia',
            postOffices: [{ name: 'রাঙ্গুনিয়া', code: '4360' }]
          },
          {
            name: 'ফটিকছড়ি',
            nameEn: 'Fatikchhari',
            postOffices: [{ name: 'ফটিকছড়ি', code: '4350' }, { name: 'নাজিরহাট', code: '4352' }]
          },
          {
            name: 'মিরসরাই',
            nameEn: 'Mirsharai',
            postOffices: [{ name: 'মিরসরাই', code: '4320' }, { name: 'বারইয়ারহাট', code: '4321' }]
          },
          {
            name: 'বোয়ালখালী',
            nameEn: 'Boalkhali',
            postOffices: [{ name: 'বোয়ালখালী', code: '4366' }]
          },
          {
            name: 'আনোয়ারা',
            nameEn: 'Anwara',
            postOffices: [{ name: 'আনোয়ারা', code: '4376' }]
          },
          {
            name: 'চন্দনাইশ',
            nameEn: 'Chandanpukur',
            postOffices: [{ name: 'চন্দনাইশ', code: '4373' }]
          },
          {
            name: 'সাতকানিয়া',
            nameEn: 'Satkania',
            postOffices: [{ name: 'সাতকানিয়া', code: '4386' }, { name: 'কেরানীহাট', code: '4387' }]
          },
          {
            name: 'লোহাগাড়া',
            nameEn: 'Lohagara',
            postOffices: [{ name: 'লোহাগাড়া', code: '4396' }]
          },
          {
            name: 'বাঁশখালী',
            nameEn: 'Banshkhali',
            postOffices: [{ name: 'বাঁশখালী', code: '4390' }]
          },
          {
            name: 'সন্দ্বীপ',
            nameEn: 'Sandwip',
            postOffices: [{ name: 'সন্দ্বীপ', code: '4300' }]
          },
          {
            name: 'কর্ণফুলী',
            nameEn: 'Karnafuli',
            postOffices: [{ name: 'কর্ণফুলী', code: '4378' }]
          }
        ]
      },
      {
        name: 'কক্সবাজার',
        nameEn: "Cox's Bazar",
        upazilas: [
          {
            name: 'কক্সবাজার সদর',
            nameEn: "Cox's Bazar Sadar",
            postOffices: [{ name: 'কক্সবাজার প্রধান ডাকঘর', code: '4700' }, { name: 'ঝাউতলা', code: '4700' }]
          },
          {
            name: 'টেকনাফ',
            nameEn: 'Teknaf',
            postOffices: [{ name: 'টেকনাফ', code: '4760' }, { name: 'সেন্টমার্টিন', code: '4762' }]
          },
          {
            name: 'উখিয়া',
            nameEn: 'Ukhia',
            postOffices: [{ name: 'উখিয়া', code: '4750' }]
          },
          {
            name: 'রামু',
            nameEn: 'Ramu',
            postOffices: [{ name: 'রামু', code: '4730' }]
          },
          {
            name: 'চকোরিয়া',
            nameEn: 'Chakaria',
            postOffices: [{ name: 'চকোরিয়া', code: '4740' }]
          },
          {
            name: 'মহেশখালী',
            nameEn: 'Maheshkhali',
            postOffices: [{ name: 'মহেশখালী', code: '4710' }]
          },
          {
            name: 'কুতুবদিয়া',
            nameEn: 'Kutubdia',
            postOffices: [{ name: 'কুতুবদিয়া', code: '4720' }]
          },
          {
            name: 'পেকুয়া',
            nameEn: 'Pekua',
            postOffices: [{ name: 'পেকুয়া', code: '4744' }]
          },
          {
            name: 'ঈদগাঁও',
            nameEn: 'Eidgaon',
            postOffices: [{ name: 'ঈদগাঁও', code: '4702' }]
          }
        ]
      },
      {
        name: 'কুমিল্লা',
        nameEn: 'Cumilla',
        upazilas: [
          {
            name: 'কুমিল্লা আদর্শ সদর',
            nameEn: 'Cumilla Adarsha Sadar',
            postOffices: [
              { name: 'কুমিল্লা প্রধান ডাকঘর', code: '3500' },
              { name: 'কুমিল্লা সেনানিবাস', code: '3501' },
              { name: 'কুমিল্লা বিশ্ববিদ্যালয়', code: '3506' }
            ]
          },
          {
            name: 'দাউদকান্দি',
            nameEn: 'Daudkandi',
            postOffices: [{ name: 'দাউদকান্দি', code: '3516' }, { name: 'গৌরীপুর বাজার', code: '3517' }]
          },
          {
            name: 'লাকসাম',
            nameEn: 'Laksam',
            postOffices: [{ name: 'লাকসাম', code: '3570' }]
          },
          {
            name: 'চান্দিনা',
            nameEn: 'Chandina',
            postOffices: [{ name: 'চান্দিনা', code: '3510' }]
          },
          {
            name: 'মুরাদনগর',
            nameEn: 'Muradnagar',
            postOffices: [{ name: 'মুরাদনগর', code: '3540' }]
          },
          {
            name: 'দেবীদ্বার',
            nameEn: 'Debidwar',
            postOffices: [{ name: 'দেবীদ্বার', code: '3530' }]
          },
          {
            name: 'হোমনা',
            nameEn: 'Homna',
            postOffices: [{ name: 'হোমনা', code: '3536' }]
          },
          {
            name: 'বুড়িচং',
            nameEn: 'Burichang',
            postOffices: [{ name: 'বুড়িচং', code: '3520' }]
          },
          {
            name: 'ব্রাহ্মণপাড়া',
            nameEn: 'Brahmanpara',
            postOffices: [{ name: 'ব্রাহ্মণপাড়া', code: '3526' }]
          },
          {
            name: 'চৌদ্দগ্রাম',
            nameEn: 'Chauddagram',
            postOffices: [{ name: 'চৌদ্দগ্রাম', code: '3550' }]
          },
          {
            name: 'বরুড়া',
            nameEn: 'Barura',
            postOffices: [{ name: 'বরুড়া', code: '3560' }]
          },
          {
            name: 'নাঙ্গলকোট',
            nameEn: 'Nangalkot',
            postOffices: [{ name: 'নাঙ্গলকোট', code: '3580' }]
          },
          {
            name: 'মনোহরগঞ্জ',
            nameEn: 'Monohargonj',
            postOffices: [{ name: 'মনোহরগঞ্জ', code: '3573' }]
          },
          {
            name: 'তিতাস',
            nameEn: 'Titas',
            postOffices: [{ name: 'তিতাস', code: '3518' }]
          },
          {
            name: 'মেঘনা',
            nameEn: 'Meghna',
            postOffices: [{ name: 'মেঘনা', code: '3519' }]
          },
          {
            name: 'লালমাই',
            nameEn: 'Lalmai',
            postOffices: [{ name: 'লালমাই', code: '3503' }]
          }
        ]
      },
      {
        name: 'চাঁদপুর',
        nameEn: 'Chandpur',
        upazilas: [
          {
            name: 'চাঁদপুর সদর',
            nameEn: 'Chandpur Sadar',
            postOffices: [{ name: 'চাঁদপুর প্রধান ডাকঘর', code: '3600' }, { name: 'পুরাণবাজার', code: '3601' }]
          },
          {
            name: 'হাজীগঞ্জ',
            nameEn: 'Hajiganj',
            postOffices: [{ name: 'হাজীগঞ্জ', code: '3610' }]
          },
          {
            name: 'মতলব দক্ষিণ',
            nameEn: 'Matlab South',
            postOffices: [{ name: 'মতলব', code: '3640' }]
          },
          {
            name: 'মতলব উত্তর',
            nameEn: 'Matlab North',
            postOffices: [{ name: 'ছেংগারচর', code: '3641' }]
          },
          {
            name: 'ফরিদগঞ্জ',
            nameEn: 'Faridganj',
            postOffices: [{ name: 'ফরিদগঞ্জ', code: '3650' }]
          },
          {
            name: 'শাহরাস্তি',
            nameEn: 'Shahrasti',
            postOffices: [{ name: 'শাহরাস্তি', code: '3620' }]
          },
          {
            name: 'কচুয়া',
            nameEn: 'Kachua',
            postOffices: [{ name: 'কচুয়া', code: '3630' }]
          },
          {
            name: 'হাইমচর',
            nameEn: 'Haimchar',
            postOffices: [{ name: 'হাইমচর', code: '3660' }]
          }
        ]
      },
      {
        name: 'ব্রাহ্মণবাড়িয়া',
        nameEn: 'Brahmanbaria',
        upazilas: [
          {
            name: 'ব্রাহ্মণবাড়িয়া সদর',
            nameEn: 'Brahmanbaria Sadar',
            postOffices: [{ name: 'ব্রাহ্মণবাড়িয়া প্রধান ডাকঘর', code: '3400' }]
          },
          {
            name: 'আশুগঞ্জ',
            nameEn: 'Ashuganj',
            postOffices: [{ name: 'আশুগঞ্জ', code: '3402' }]
          },
          {
            name: 'সরাইল',
            nameEn: 'Sarail',
            postOffices: [{ name: 'সরাইল', code: '3430' }]
          },
          {
            name: 'নাসিরনগর',
            nameEn: 'Nasirnagar',
            postOffices: [{ name: 'নাসিরনগর', code: '3440' }]
          },
          {
            name: 'নবীনগর',
            nameEn: 'Nabinagar',
            postOffices: [{ name: 'নবীনগর', code: '3410' }]
          },
          {
            name: 'কসবা',
            nameEn: 'Kasba',
            postOffices: [{ name: 'কসবা', code: '3460' }]
          },
          {
            name: 'আখাউড়া',
            nameEn: 'Akhaura',
            postOffices: [{ name: 'আখাউড়া', code: '3450' }]
          },
          {
            name: 'বাঞ্ছারামপুর',
            nameEn: 'Bancharampur',
            postOffices: [{ name: 'বাঞ্ছারামপুর', code: '3420' }]
          },
          {
            name: 'বিজয়নগর',
            nameEn: 'Bijoynagar',
            postOffices: [{ name: 'বিজয়নগর', code: '3405' }]
          }
        ]
      },
      {
        name: 'নোয়াখালী',
        nameEn: 'Noakhali',
        upazilas: [
          {
            name: 'নোয়াখালী সদর / সুধারাম',
            nameEn: 'Noakhali Sadar / Sudharam',
            postOffices: [{ name: 'মাইজদী প্রধান ডাকঘর', code: '3800' }]
          },
          {
            name: 'বেগমগঞ্জ / চৌমুহনী',
            nameEn: 'Begumganj / Chowmuhani',
            postOffices: [{ name: 'চৌমুহনী বাজার', code: '3821' }, { name: 'বেগমগঞ্জ', code: '3820' }]
          },
          {
            name: 'চাটখিল',
            nameEn: 'Chatkhil',
            postOffices: [{ name: 'চাটখিল', code: '3870' }]
          },
          {
            name: 'সেনবাগ',
            nameEn: 'Senbagh',
            postOffices: [{ name: 'সেনবাগ', code: '3860' }]
          },
          {
            name: 'কোম্পানীগঞ্জ / বসুরহাট',
            nameEn: 'Companiganj / Basurhat',
            postOffices: [{ name: 'বসুরহাট', code: '3850' }]
          },
          {
            name: 'হাতিয়া',
            nameEn: 'Hatiya',
            postOffices: [{ name: 'হাতিয়া', code: '3890' }]
          },
          {
            name: 'সোনাইমুড়ী',
            nameEn: 'Sonaimuri',
            postOffices: [{ name: 'সোনাইমুড়ী', code: '3827' }]
          },
          {
            name: 'সুবর্ণচর',
            nameEn: 'Subarnachar',
            postOffices: [{ name: 'সুবর্ণচর', code: '3811' }]
          },
          {
            name: 'কবিরহাট',
            nameEn: 'Kabirhat',
            postOffices: [{ name: 'কবিরহাট', code: '3853' }]
          }
        ]
      },
      {
        name: 'ফেনী',
        nameEn: 'Feni',
        upazilas: [
          {
            name: 'ফেনী সদর',
            nameEn: 'Feni Sadar',
            postOffices: [{ name: 'ফেনী প্রধান ডাকঘর', code: '3900' }]
          },
          {
            name: 'দাগনভূঞা',
            nameEn: 'Daganbhuiyan',
            postOffices: [{ name: 'দাগনভূঞা', code: '3920' }]
          },
          {
            name: 'সোনাগাজী',
            nameEn: 'Sonagazi',
            postOffices: [{ name: 'সোনাগাজী', code: '3930' }]
          },
          {
            name: 'ছাগলনাইয়া',
            nameEn: 'Chhagalnaiya',
            postOffices: [{ name: 'ছাগলনাইয়া', code: '3910' }]
          },
          {
            name: 'পরশুরাম',
            nameEn: 'Parshuram',
            postOffices: [{ name: 'পরশুরাম', code: '3940' }]
          },
          {
            name: 'ফুলগাজী',
            nameEn: 'Fulgazi',
            postOffices: [{ name: 'ফুলগাজী', code: '3942' }]
          }
        ]
      },
      {
        name: 'লক্ষ্মীপুর',
        nameEn: 'Lakshmipur',
        upazilas: [
          {
            name: 'লক্ষ্মীপুর সদর',
            nameEn: 'Lakshmipur Sadar',
            postOffices: [{ name: 'লক্ষ্মীপুর প্রধান ডাকঘর', code: '3700' }]
          },
          {
            name: 'রায়পুর',
            nameEn: 'Raipur',
            postOffices: [{ name: 'রায়পুর', code: '3710' }]
          },
          {
            name: 'রামগঞ্জ',
            nameEn: 'Ramganj',
            postOffices: [{ name: 'রামগঞ্জ', code: '3720' }]
          },
          {
            name: 'রামগতি',
            nameEn: 'Ramgati',
            postOffices: [{ name: 'রামগতি', code: '3730' }]
          },
          {
            name: 'কমলনগর',
            nameEn: 'Kamalnagar',
            postOffices: [{ name: 'হাজীরহাট', code: '3731' }]
          }
        ]
      },
      {
        name: 'খাগড়াছড়ি',
        nameEn: 'Khagrachhari',
        upazilas: [
          {
            name: 'খাগড়াছড়ি সদর',
            nameEn: 'Khagrachhari Sadar',
            postOffices: [{ name: 'খাগড়াছড়ি প্রধান ডাকঘর', code: '4400' }]
          },
          {
            name: 'দীঘিনালা / সাজেক',
            nameEn: 'Dighinala / Sajek',
            postOffices: [{ name: 'দীঘিনালা', code: '4420' }, { name: 'সাজেক ভ্যালি', code: '4421' }]
          },
          {
            name: 'পানছড়ি',
            nameEn: 'Panchhari',
            postOffices: [{ name: 'পানছড়ি', code: '4410' }]
          },
          {
            name: 'মাটিরাঙ্গা',
            nameEn: 'Matiranga',
            postOffices: [{ name: 'মাটিরাঙ্গা', code: '4450' }]
          },
          {
            name: 'রামগড়',
            nameEn: 'Ramgarh',
            postOffices: [{ name: 'রামগড়', code: '4440' }]
          },
          {
            name: 'মহালছড়ি',
            nameEn: 'Mohalchhari',
            postOffices: [{ name: 'মহালছড়ি', code: '4430' }]
          },
          {
            name: 'মানিকছড়ি',
            nameEn: 'Manikchhari',
            postOffices: [{ name: 'মানিকছড়ি', code: '4460' }]
          },
          {
            name: 'লক্ষ্মীছড়ি',
            nameEn: 'Lakshmichhari',
            postOffices: [{ name: 'লক্ষ্মীছড়ি', code: '4470' }]
          },
          {
            name: 'গুইমারা',
            nameEn: 'Guimara',
            postOffices: [{ name: 'গুইমারা', code: '4451' }]
          }
        ]
      },
      {
        name: 'রাঙ্গামাটি',
        nameEn: 'Rangamati',
        upazilas: [
          {
            name: 'রাঙ্গামাটি সদর',
            nameEn: 'Rangamati Sadar',
            postOffices: [{ name: 'রাঙ্গামাটি প্রধান ডাকঘর', code: '4500' }]
          },
          {
            name: 'কাপ্তাই',
            nameEn: 'Kaptai',
            postOffices: [{ name: 'কাপ্তাই', code: '4530' }, { name: 'চন্দ্রঘোনা', code: '4531' }]
          },
          {
            name: 'বাঘাইছড়ি',
            nameEn: 'Baghaichhari',
            postOffices: [{ name: 'বাঘাইছড়ি', code: '4540' }]
          },
          {
            name: 'কাউখালী / বেতবুনিয়া',
            nameEn: 'Kawkhali / Betbunia',
            postOffices: [{ name: 'বেতবুনিয়া', code: '4511' }, { name: 'কাউখালী', code: '4510' }]
          },
          {
            name: 'নানিয়ারচর',
            nameEn: 'Naniarchar',
            postOffices: [{ name: 'নানিয়ারচর', code: '4520' }]
          },
          {
            name: 'লংগদু',
            nameEn: 'Langadu',
            postOffices: [{ name: 'লংগদু', code: '4570' }]
          },
          {
            name: 'বরকল',
            nameEn: 'Barkal',
            postOffices: [{ name: 'বরকল', code: '4560' }]
          },
          {
            name: 'জুরাইছড়ি',
            nameEn: 'Juraichhari',
            postOffices: [{ name: 'জুরাইছড়ি', code: '4580' }]
          },
          {
            name: 'বিলাইছড়ি',
            nameEn: 'Belaichhari',
            postOffices: [{ name: 'বিলাইছড়ি', code: '4590' }]
          },
          {
            name: 'রাজস্থলী',
            nameEn: 'Rajasthali',
            postOffices: [{ name: 'রাজস্থলী', code: '4550' }]
          }
        ]
      },
      {
        name: 'বান্দরবান',
        nameEn: 'Bandarban',
        upazilas: [
          {
            name: 'বান্দরবান সদর',
            nameEn: 'Bandarban Sadar',
            postOffices: [{ name: 'বান্দরবান প্রধান ডাকঘর', code: '4600' }]
          },
          {
            name: 'রুমা',
            nameEn: 'Ruma',
            postOffices: [{ name: 'রুমা', code: '4620' }]
          },
          {
            name: 'থানচি',
            nameEn: 'Thanchi',
            postOffices: [{ name: 'থানচি', code: '4630' }]
          },
          {
            name: 'লামা',
            nameEn: 'Lama',
            postOffices: [{ name: 'লামা', code: '4640' }]
          },
          {
            name: 'আলীকদম',
            nameEn: 'Alikadam',
            postOffices: [{ name: 'আলীকদম', code: '4650' }]
          },
          {
            name: 'রোয়াংছড়ি',
            nameEn: 'Rowangchhari',
            postOffices: [{ name: 'রোয়াংছড়ি', code: '4610' }]
          },
          {
            name: 'নাইক্ষ্যংছড়ি',
            nameEn: 'Naikhongchhari',
            postOffices: [{ name: 'নাইক্ষ্যংছড়ি', code: '4660' }]
          }
        ]
      }
    ]
  },
  {
    name: 'রাজশাহী',
    nameEn: 'Rajshahi',
    districts: [
      {
        name: 'রাজশাহী',
        nameEn: 'Rajshahi',
        upazilas: [
          {
            name: 'বোয়ালিয়া / রাজশাহী সদর',
            nameEn: 'Boalia / Rajshahi Sadar',
            postOffices: [
              { name: 'রাজশাহী জিপিও', code: '6000' },
              { name: 'রাজশাহী বিশ্ববিদ্যালয়', code: '6205' },
              { name: 'রাজশাহী কোর্ট', code: '6201' },
              { name: 'মতিহার', code: '6204' },
              { name: 'কাজীহাটা', code: '6000' }
            ]
          },
          {
            name: 'বাঘা',
            nameEn: 'Bagha',
            postOffices: [{ name: 'বাঘা', code: '6280' }]
          },
          {
            name: 'চারঘাট',
            nameEn: 'Charghat',
            postOffices: [{ name: 'চারঘাট', code: '6270' }, { name: 'সারদা পুলিশ একাডেমি', code: '6271' }]
          },
          {
            name: 'পবা',
            nameEn: 'Paba',
            postOffices: [{ name: 'নওহাটা', code: '6203' }, { name: 'পবা', code: '6202' }]
          },
          {
            name: 'গোদাগাড়ী',
            nameEn: 'Godagari',
            postOffices: [{ name: 'গোদাগাড়ী', code: '6290' }, { name: 'প্রেমতলী', code: '6291' }]
          },
          {
            name: 'তানোর',
            nameEn: 'Tanor',
            postOffices: [{ name: 'তানোর', code: '6220' }]
          },
          {
            name: 'মোহনপুর',
            nameEn: 'Mohanpur',
            postOffices: [{ name: 'মোহনপুর', code: '6220' }]
          },
          {
            name: 'বাগমারা',
            nameEn: 'Bagmara',
            postOffices: [{ name: 'ভবানীগঞ্জ', code: '6250' }]
          },
          {
            name: 'দুর্গাপুর',
            nameEn: 'Durgapur',
            postOffices: [{ name: 'দুর্গাপুর', code: '6240' }]
          },
          {
            name: 'পুঠিয়া',
            nameEn: 'Puthia',
            postOffices: [{ name: 'পুঠিয়া', code: '6260' }]
          }
        ]
      },
      {
        name: 'বগুড়া',
        nameEn: 'Bogura',
        upazilas: [
          {
            name: 'বগুড়া সদর',
            nameEn: 'Bogura Sadar',
            postOffices: [{ name: 'বগুড়া প্রধান ডাকঘর', code: '5800' }, { name: 'বগুড়া সেনানিবাস', code: '5801' }]
          },
          {
            name: 'শেরপুর',
            nameEn: 'Sherpur',
            postOffices: [{ name: 'শেরপুর', code: '5840' }]
          },
          {
            name: 'শিবগঞ্জ',
            nameEn: 'Shibganj',
            postOffices: [{ name: 'শিবগঞ্জ', code: '5810' }, { name: 'মহাস্থানগড়', code: '5811' }]
          },
          {
            name: 'ধুনট',
            nameEn: 'Dhunat',
            postOffices: [{ name: 'ধুনট', code: '5850' }]
          },
          {
            name: 'গাবতলী',
            nameEn: 'Gabtali',
            postOffices: [{ name: 'গাবতলী', code: '5820' }]
          },
          {
            name: 'কাহালু',
            nameEn: 'Kahalu',
            postOffices: [{ name: 'কাহালু', code: '5870' }]
          },
          {
            name: 'দুপচাঁচিয়া',
            nameEn: 'Dupchanchia',
            postOffices: [{ name: 'দুপচাঁচিয়া', code: '5880' }]
          },
          {
            name: 'আদমদিঘী / সান্তাহার',
            nameEn: 'Adamdighi / Santahar',
            postOffices: [{ name: 'সান্তাহার', code: '5891' }, { name: 'আদমদিঘী', code: '5890' }]
          },
          {
            name: 'নন্দীগ্রাম',
            nameEn: 'Nandigram',
            postOffices: [{ name: 'নন্দীগ্রাম', code: '5860' }]
          },
          {
            name: 'সোনাতলা',
            nameEn: 'Sonatala',
            postOffices: [{ name: 'সোনাতলা', code: '5826' }]
          },
          {
            name: 'সারিয়াকান্দি',
            nameEn: 'Sariakandi',
            postOffices: [{ name: 'সারিয়াকান্দি', code: '5830' }]
          },
          {
            name: 'শাহজাহানপুর',
            nameEn: 'Shajahanpur',
            postOffices: [{ name: 'রানীবাজার', code: '5802' }]
          }
        ]
      },
      {
        name: 'পাবনা',
        nameEn: 'Pabna',
        upazilas: [
          {
            name: 'পাবনা সদর',
            nameEn: 'Pabna Sadar',
            postOffices: [{ name: 'পাবনা প্রধান ডাকঘর', code: '6600' }]
          },
          {
            name: 'ঈশ্বরদী / রূপপুর',
            nameEn: 'Ishwardi / Rooppur',
            postOffices: [{ name: 'ঈশ্বরদী', code: '6620' }, { name: 'রূপপুর', code: '6621' }, { name: 'পাকশী', code: '6622' }]
          },
          {
            name: 'সাঁথিয়া',
            nameEn: 'Santhia',
            postOffices: [{ name: 'সাঁথিয়া', code: '6670' }]
          },
          {
            name: 'সুজানগর',
            nameEn: 'Sujanagar',
            postOffices: [{ name: 'সুজানগর', code: '6660' }]
          },
          {
            name: 'চাটমোহর',
            nameEn: 'Chatmohar',
            postOffices: [{ name: 'চাটমোহর', code: '6630' }]
          },
          {
            name: 'ভাঙ্গুড়া',
            nameEn: 'Bhangura',
            postOffices: [{ name: 'ভাঙ্গুড়া', code: '6640' }]
          },
          {
            name: 'ফরিদপুর (পাবনা)',
            nameEn: 'Faridpur (Pabna)',
            postOffices: [{ name: 'ফরিদপুর', code: '6650' }]
          },
          {
            name: 'বেড়া',
            nameEn: 'Bera',
            postOffices: [{ name: 'বেড়া', code: '6680' }, { name: 'কাশীনাথপুর', code: '6682' }]
          },
          {
            name: 'আটঘরিয়া',
            nameEn: 'Atgharia',
            postOffices: [{ name: 'আটঘরিয়া', code: '6610' }]
          }
        ]
      },
      {
        name: 'সিরাজগঞ্জ',
        nameEn: 'Sirajganj',
        upazilas: [
          {
            name: 'সিরাজগঞ্জ সদর',
            nameEn: 'Sirajganj Sadar',
            postOffices: [{ name: 'সিরাজগঞ্জ প্রধান ডাকঘর', code: '6700' }]
          },
          {
            name: 'শাহজাদপুর',
            nameEn: 'Shahjadpur',
            postOffices: [{ name: 'শাহজাদপুর', code: '6770' }]
          },
          {
            name: 'উল্লাপাড়া',
            nameEn: 'Ullapara',
            postOffices: [{ name: 'উল্লাপাড়া', code: '6740' }]
          },
          {
            name: 'রায়গঞ্জ',
            nameEn: 'Raiganj',
            postOffices: [{ name: 'রায়গঞ্জ', code: '6730' }]
          },
          {
            name: 'বেলকুচি',
            nameEn: 'Belkuchi',
            postOffices: [{ name: 'বেলকুচি', code: '6760' }, { name: 'সোহাগপুর', code: '6761' }]
          },
          {
            name: 'কামারখন্দ',
            nameEn: 'Kamarkhanda',
            postOffices: [{ name: 'যমুনাসেতু পশ্চিম', code: '6701' }]
          },
          {
            name: 'কাজীপুর',
            nameEn: 'Kazipur',
            postOffices: [{ name: 'কাজীপুর', code: '6710' }]
          },
          {
            name: 'তাড়াশ',
            nameEn: 'Tarash',
            postOffices: [{ name: 'তাড়াশ', code: '6780' }]
          },
          {
            name: 'চৌহালী',
            nameEn: 'Chauhali',
            postOffices: [{ name: 'চৌহালী', code: '6750' }]
          }
        ]
      },
      {
        name: 'নওগাঁ',
        nameEn: 'Naogaon',
        upazilas: [
          {
            name: 'নওগাঁ সদর',
            nameEn: 'Naogaon Sadar',
            postOffices: [{ name: 'নওগাঁ প্রধান ডাকঘর', code: '6500' }]
          },
          {
            name: 'পত্নীতলা',
            nameEn: 'Patnitala',
            postOffices: [{ name: 'নজিপুর', code: '6540' }]
          },
          {
            name: 'মহাদেবপুর',
            nameEn: 'Mohadevpur',
            postOffices: [{ name: 'মহাদেবপুর', code: '6530' }]
          },
          {
            name: 'মান্দা',
            nameEn: 'Manda',
            postOffices: [{ name: 'মান্দা', code: '6520' }]
          },
          {
            name: 'বদলগাছী / পাহাড়পুর',
            nameEn: 'Badalgachhi / Paharpur',
            postOffices: [{ name: 'বদলগাছী', code: '6570' }, { name: 'পাহাড়পুর বৌদ্ধবিহার', code: '6571' }]
          },
          {
            name: 'ধামইরহাট',
            nameEn: 'Dhamoirhat',
            postOffices: [{ name: 'ধামইরহাট', code: '6580' }]
          },
          {
            name: 'সাপাহার',
            nameEn: 'Sapahar',
            postOffices: [{ name: 'সাপাহার', code: '6560' }]
          },
          {
            name: 'পোরশা',
            nameEn: 'Porsha',
            postOffices: [{ name: 'পোরশা', code: '6550' }]
          },
          {
            name: 'রানীনগর',
            nameEn: 'Raninagar',
            postOffices: [{ name: 'রানীনগর', code: '6590' }]
          },
          {
            name: 'আত্রাই',
            nameEn: 'Atrai',
            postOffices: [{ name: 'আত্রাই', code: '6596' }]
          },
          {
            name: 'নিয়ামতপুর',
            nameEn: 'Niamatpur',
            postOffices: [{ name: 'নিয়ামতপুর', code: '6510' }]
          }
        ]
      },
      {
        name: 'নাটোর',
        nameEn: 'Natore',
        upazilas: [
          {
            name: 'নাটোর সদর',
            nameEn: 'Natore Sadar',
            postOffices: [{ name: 'নাটোর প্রধান ডাকঘর', code: '6400' }]
          },
          {
            name: 'বড়াইগ্রাম',
            nameEn: 'Baraigram',
            postOffices: [{ name: 'বড়াইগ্রাম', code: '6430' }, { name: 'বনপাড়া', code: '6432' }]
          },
          {
            name: 'বাগাতিপাড়া',
            nameEn: 'Bagatipara',
            postOffices: [{ name: 'বাগাতিপাড়া', code: '6410' }, { name: 'দয়ারামপুর', code: '6411' }]
          },
          {
            name: 'সিংড়া',
            nameEn: 'Singra',
            postOffices: [{ name: 'সিংড়া', code: '6450' }]
          },
          {
            name: 'গুরুদাসপুর',
            nameEn: 'Gurudaspur',
            postOffices: [{ name: 'গুরুদাসপুর', code: '6440' }]
          },
          {
            name: 'লালপুর',
            nameEn: 'Lalpur',
            postOffices: [{ name: 'লালপুর', code: '6420' }, { name: 'গোপালপুর', code: '6422' }]
          },
          {
            name: 'নলডাঙ্গা',
            nameEn: 'Naldanga',
            postOffices: [{ name: 'নলডাঙ্গা', code: '6404' }]
          }
        ]
      },
      {
        name: 'চাঁপাইনবাবগঞ্জ',
        nameEn: 'Chapai Nawabganj',
        upazilas: [
          {
            name: 'চাঁপাইনবাবগঞ্জ সদর',
            nameEn: 'Chapai Nawabganj Sadar',
            postOffices: [{ name: 'চাঁপাইনবাবগঞ্জ প্রধান ডাকঘর', code: '6300' }]
          },
          {
            name: 'শিবগঞ্জ / সোনামসজিদ',
            nameEn: 'Shibganj / Sonamasjid',
            postOffices: [{ name: 'শিবগঞ্জ', code: '6320' }, { name: 'সোনামসজিদ বন্দর', code: '6321' }]
          },
          {
            name: 'গোমস্তাপুর / রহনপুর',
            nameEn: 'Gomostapur / Rohanpur',
            postOffices: [{ name: 'রহনপুর', code: '6311' }, { name: 'গোমস্তাপুর', code: '6310' }]
          },
          {
            name: 'নাচোল',
            nameEn: 'Nachole',
            postOffices: [{ name: 'নাচোল', code: '6330' }]
          },
          {
            name: 'ভোলাহাট',
            nameEn: 'Bholahat',
            postOffices: [{ name: 'ভোলাহাট', code: '6340' }]
          }
        ]
      },
      {
        name: 'জয়পুরহাট',
        nameEn: 'Joypurhat',
        upazilas: [
          {
            name: 'জয়পুরহাট সদর',
            nameEn: 'Joypurhat Sadar',
            postOffices: [{ name: 'জয়পুরহাট প্রধান ডাকঘর', code: '5900' }]
          },
          {
            name: 'পাঁচবিবি',
            nameEn: 'Panchbibi',
            postOffices: [{ name: 'পাঁচবিবি', code: '5910' }]
          },
          {
            name: 'কালাই',
            nameEn: 'Kalai',
            postOffices: [{ name: 'কালাই', code: '5930' }]
          },
          {
            name: 'ক্ষেতলাল',
            nameEn: 'Khetlal',
            postOffices: [{ name: 'ক্ষেতলাল', code: '5920' }]
          },
          {
            name: 'আক্কেলপুর',
            nameEn: 'Akkelpur',
            postOffices: [{ name: 'আক্কেলপুর', code: '5940' }]
          }
        ]
      }
    ]
  },
  {
    name: 'খুলনা',
    nameEn: 'Khulna',
    districts: [
      {
        name: 'খুলনা',
        nameEn: 'Khulna',
        upazilas: [
          {
            name: 'খুলনা সদর / খালিশপুর / সোনাডাঙ্গা',
            nameEn: 'Khulna Sadar / Khalishpur / Sonadanga',
            postOffices: [
              { name: 'খুলনা প্রধান ডাকঘর (জিপিও)', code: '9000' },
              { name: 'খুলনা বিশ্ববিদ্যালয়', code: '9208' },
              { name: 'কুয়েট (KUET)', code: '9203' },
              { name: 'খালিশপুর', code: '9000' },
              { name: 'দৌলতপুর', code: '9202' },
              { name: 'সোনাডাঙ্গা', code: '9100' }
            ]
          },
          {
            name: 'ডুমুরিয়া',
            nameEn: 'Dumuria',
            postOffices: [{ name: 'ডুমুরিয়া', code: '9250' }]
          },
          {
            name: 'পাইকগাছা',
            nameEn: 'Paikgachha',
            postOffices: [{ name: 'পাইকগাছা', code: '9280' }, { name: 'কপিলমুনি', code: '9282' }]
          },
          {
            name: 'কয়রা',
            nameEn: 'Koyra',
            postOffices: [{ name: 'কয়রা', code: '9290' }]
          },
          {
            name: 'রূপসা',
            nameEn: 'Rupsha',
            postOffices: [{ name: 'রূপসা', code: '9240' }]
          },
          {
            name: 'ফুলতলা',
            nameEn: 'Phultala',
            postOffices: [{ name: 'ফুলতলা', code: '9210' }]
          },
          {
            name: 'বটিয়াঘাটা',
            nameEn: 'Batiaghata',
            postOffices: [{ name: 'বটিয়াঘাটা', code: '9260' }]
          },
          {
            name: 'দিঘলিয়া',
            nameEn: 'Dighalia',
            postOffices: [{ name: 'দিঘলিয়া', code: '9220' }]
          },
          {
            name: 'তেরখাদা',
            nameEn: 'Terokhada',
            postOffices: [{ name: 'তেরখাদা', code: '9230' }]
          },
          {
            name: 'দাকোপ / চালনা',
            nameEn: 'Dacope / Chalna',
            postOffices: [{ name: 'চালনা বাজার', code: '9270' }, { name: 'দাকোপ', code: '9271' }]
          }
        ]
      },
      {
        name: 'যশোর',
        nameEn: 'Jashore',
        upazilas: [
          {
            name: 'যশোর সদর',
            nameEn: 'Jashore Sadar',
            postOffices: [
              { name: 'যশোর প্রধান ডাকঘর', code: '7400' },
              { name: 'যশোর সেনানিবাস', code: '7403' },
              { name: 'যবিপ্রবি (JUST)', code: '7408' }
            ]
          },
          {
            name: 'বেনাপোল / শার্শা',
            nameEn: 'Benapole / Sharsha',
            postOffices: [
              { name: 'বেনাপোল কাস্টমস বন্দর', code: '7431' },
              { name: 'শার্শা', code: '7430' },
              { name: 'নাভারন', code: '7432' }
            ]
          },
          {
            name: 'ঝিকরগাছা',
            nameEn: 'Jhikargachha',
            postOffices: [{ name: 'ঝিকরগাছা', code: '7420' }]
          },
          {
            name: 'মণিরামপুর',
            nameEn: 'Manirampur',
            postOffices: [{ name: 'মণিরামপুর', code: '7440' }]
          },
          {
            name: 'কেশবপুর',
            nameEn: 'Keshabpur',
            postOffices: [{ name: 'কেশবপুর', code: '7450' }]
          },
          {
            name: 'অভয়নগর / নওয়াপাড়া',
            nameEn: 'Abhaynagar / Noapara',
            postOffices: [{ name: 'নওয়াপাড়া', code: '7460' }]
          },
          {
            name: 'বাঘারপাড়া',
            nameEn: 'Bagherpara',
            postOffices: [{ name: 'বাঘারপাড়া', code: '7470' }]
          },
          {
            name: 'চৌগাছা',
            nameEn: 'Chaugachha',
            postOffices: [{ name: 'চৌগাছা', code: '7410' }]
          }
        ]
      },
      {
        name: 'বাগেরহাট',
        nameEn: 'Bagerhat',
        upazilas: [
          {
            name: 'বাগেরহাট সদর',
            nameEn: 'Bagerhat Sadar',
            postOffices: [{ name: 'বাগেরহাট প্রধান ডাকঘর', code: '9300' }]
          },
          {
            name: 'মোংলা / সুন্দরবন',
            nameEn: 'Mongla / Sundarbans',
            postOffices: [{ name: 'মোংলা পোর্ট', code: '9351' }, { name: 'মোংলা', code: '9350' }]
          },
          {
            name: 'মোরেলগঞ্জ',
            nameEn: 'Morelganj',
            postOffices: [{ name: 'মোরেলগঞ্জ', code: '9320' }]
          },
          {
            name: 'শরণখোলা',
            nameEn: 'Sarankhola',
            postOffices: [{ name: 'রায়েন্দা', code: '9330' }]
          },
          {
            name: 'রামপাল',
            nameEn: 'Rampal',
            postOffices: [{ name: 'রামপাল', code: '9340' }]
          },
          {
            name: 'ফকিরহাট',
            nameEn: 'Fakirhat',
            postOffices: [{ name: 'ফকিরহাট', code: '9370' }]
          },
          {
            name: 'কচুয়া (বাগেরহাট)',
            nameEn: 'Kachua (Bagerhat)',
            postOffices: [{ name: 'কচুয়া', code: '9310' }]
          },
          {
            name: 'মোল্লাহাট',
            nameEn: 'Mollahat',
            postOffices: [{ name: 'মোল্লাহাট', code: '9380' }]
          },
          {
            name: 'চিতলমারী',
            nameEn: 'Chitalmari',
            postOffices: [{ name: 'চিতলমারী', code: '9360' }]
          }
        ]
      },
      {
        name: 'সাতক্ষীরা',
        nameEn: 'Satkhira',
        upazilas: [
          {
            name: 'সাতক্ষীরা সদর',
            nameEn: 'Satkhira Sadar',
            postOffices: [{ name: 'সাতক্ষীরা প্রধান ডাকঘর', code: '9400' }]
          },
          {
            name: 'শ্যামনগর',
            nameEn: 'Shyamnagar',
            postOffices: [{ name: 'শ্যামনগর', code: '9450' }]
          },
          {
            name: 'কালীগঞ্জ (সাতক্ষীরা)',
            nameEn: 'Kaliganj (Satkhira)',
            postOffices: [{ name: 'কালীগঞ্জ', code: '9440' }]
          },
          {
            name: 'আশাশুনি',
            nameEn: 'Assasuni',
            postOffices: [{ name: 'আশাশুনি', code: '9460' }]
          },
          {
            name: 'তালা',
            nameEn: 'Tala',
            postOffices: [{ name: 'তালা', code: '9420' }, { name: 'পাটকেলঘাটা', code: '9421' }]
          },
          {
            name: 'কলারোয়া',
            nameEn: 'Kalaroa',
            postOffices: [{ name: 'কলারোয়া', code: '9410' }]
          },
          {
            name: 'দেবহাটা / ভোমরা',
            nameEn: 'Debhata / Bhomra',
            postOffices: [{ name: 'দেবহাটা', code: '9430' }, { name: 'ভোমরা স্থলবন্দর', code: '9403' }]
          }
        ]
      },
      {
        name: 'কুষ্টিয়া',
        nameEn: 'Kushtia',
        upazilas: [
          {
            name: 'কুষ্টিয়া সদর',
            nameEn: 'Kushtia Sadar',
            postOffices: [
              { name: 'কুষ্টিয়া প্রধান ডাকঘর', code: '7000' },
              { name: 'ইসলামী বিশ্ববিদ্যালয় (IU)', code: '7003' }
            ]
          },
          {
            name: 'কুমারখালী',
            nameEn: 'Kumarkhali',
            postOffices: [{ name: 'কুমারখালী', code: '7010' }, { name: 'শিলাইদহ', code: '7011' }]
          },
          {
            name: 'ভেড়ামারা',
            nameEn: 'Bheramara',
            postOffices: [{ name: 'ভেড়ামারা', code: '7040' }]
          },
          {
            name: 'মিরপুর (কুষ্টিয়া)',
            nameEn: 'Mirpur (Kushtia)',
            postOffices: [{ name: 'মিরপুর', code: '7030' }]
          },
          {
            name: 'খোকসা',
            nameEn: 'Khoksa',
            postOffices: [{ name: 'খোকসা', code: '7020' }]
          },
          {
            name: 'দৌলতপুর (কুষ্টিয়া)',
            nameEn: 'Daulatpur (Kushtia)',
            postOffices: [{ name: 'দৌলতপুর', code: '7050' }]
          }
        ]
      },
      {
        name: 'ঝিনাইদহ',
        nameEn: 'Jhenaidah',
        upazilas: [
          {
            name: 'ঝিনাইদহ সদর',
            nameEn: 'Jhenaidah Sadar',
            postOffices: [{ name: 'ঝিনাইদহ প্রধান ডাকঘর', code: '7300' }, { name: 'ঝিনাইদহ ক্যাডেট কলেজ', code: '7301' }]
          },
          {
            name: 'কালীগঞ্জ (ঝিনাইদহ)',
            nameEn: 'Kaliganj (Jhenaidah)',
            postOffices: [{ name: 'কালীগঞ্জ', code: '7320' }]
          },
          {
            name: 'শৈলকুপা',
            nameEn: 'Shailkupa',
            postOffices: [{ name: 'শৈলকুপা', code: '7310' }]
          },
          {
            name: 'হরিণাকুণ্ডু',
            nameEn: 'Harinakundu',
            postOffices: [{ name: 'হরিণাকুণ্ডু', code: '7330' }]
          },
          {
            name: 'কোটচাঁদপুর',
            nameEn: 'Kotchandpur',
            postOffices: [{ name: 'কোটচাঁদপুর', code: '7350' }]
          },
          {
            name: 'মহেশপুর',
            nameEn: 'Maheshpur',
            postOffices: [{ name: 'মহেশপুর', code: '7340' }]
          }
        ]
      },
      {
        name: 'চুয়াডাঙ্গা',
        nameEn: 'Chuadanga',
        upazilas: [
          {
            name: 'চুয়াডাঙ্গা সদর',
            nameEn: 'Chuadanga Sadar',
            postOffices: [{ name: 'চুয়াডাঙ্গা প্রধান ডাকঘর', code: '7200' }]
          },
          {
            name: 'আলমডাঙ্গা',
            nameEn: 'Alamdanga',
            postOffices: [{ name: 'আলমডাঙ্গা', code: '7210' }]
          },
          {
            name: 'দামুড়হুদা / দর্শনা',
            nameEn: 'Damurhuda / Darsana',
            postOffices: [{ name: 'দর্শনা', code: '7221' }, { name: 'দামুড়হুদা', code: '7220' }]
          },
          {
            name: 'জীবননগর',
            nameEn: 'Jibannagar',
            postOffices: [{ name: 'জীবননগর', code: '7230' }]
          }
        ]
      },
      {
        name: 'মেহেরপুর',
        nameEn: 'Meherpur',
        upazilas: [
          {
            name: 'মেহেরপুর সদর',
            nameEn: 'Meherpur Sadar',
            postOffices: [{ name: 'মেহেরপুর প্রধান ডাকঘর', code: '7100' }]
          },
          {
            name: 'মুজিবনগর',
            nameEn: 'Mujibnagar',
            postOffices: [{ name: 'মুজিবনগর স্মৃতিসৌধ', code: '7102' }]
          },
          {
            name: 'গাংনী',
            nameEn: 'Gangni',
            postOffices: [{ name: 'গাংনী', code: '7110' }]
          }
        ]
      },
      {
        name: 'মাগুরা',
        nameEn: 'Magura',
        upazilas: [
          {
            name: 'মাগুরা সদর',
            nameEn: 'Magura Sadar',
            postOffices: [{ name: 'মাগুরা প্রধান ডাকঘর', code: '7600' }]
          },
          {
            name: 'শ্রীপুর (মাগুরা)',
            nameEn: 'Sreepur (Magura)',
            postOffices: [{ name: 'শ্রীপুর', code: '7610' }]
          },
          {
            name: 'শালিখা',
            nameEn: 'Shalikha',
            postOffices: [{ name: 'আড়পাড়া', code: '7620' }]
          },
          {
            name: 'মহম্মদপুর',
            nameEn: 'Mohammadpur (Magura)',
            postOffices: [{ name: 'মহম্মদপুর', code: '7630' }]
          }
        ]
      },
      {
        name: 'নড়াইল',
        nameEn: 'Narail',
        upazilas: [
          {
            name: 'নড়াইল সদর',
            nameEn: 'Narail Sadar',
            postOffices: [{ name: 'নড়াইল প্রধান ডাকঘর', code: '7500' }]
          },
          {
            name: 'লোহাগড়া (নড়াইল)',
            nameEn: 'Lohagara (Narail)',
            postOffices: [{ name: 'লোহাগড়া', code: '7510' }]
          },
          {
            name: 'কালিয়া',
            nameEn: 'Kalia',
            postOffices: [{ name: 'কালিয়া', code: '7520' }]
          }
        ]
      }
    ]
  },
  {
    name: 'বরিশাল',
    nameEn: 'Barishal',
    districts: [
      {
        name: 'বরিশাল',
        nameEn: 'Barishal',
        upazilas: [
          {
            name: 'বরিশাল সদর / কোতোয়ালি',
            nameEn: 'Barishal Sadar / Kotwali',
            postOffices: [
              { name: 'বরিশাল প্রধান ডাকঘর (জিপিও)', code: '8200' },
              { name: 'বরিশাল বিশ্ববিদ্যালয়', code: '8200' },
              { name: 'নথুল্লাবাদ', code: '8200' },
              { name: 'রূপাতলী', code: '8200' }
            ]
          },
          {
            name: 'গৌরনদী',
            nameEn: 'Gournadi',
            postOffices: [{ name: 'গৌরনদী', code: '8230' }]
          },
          {
            name: 'আগৈলঝাড়া',
            nameEn: 'Agailjhara',
            postOffices: [{ name: 'আগৈলঝাড়া', code: '8240' }]
          },
          {
            name: 'উজিরপুর',
            nameEn: 'Uzirpur',
            postOffices: [{ name: 'উজিরপুর', code: '8220' }]
          },
          {
            name: 'বানারীপাড়া',
            nameEn: 'Banaripara',
            postOffices: [{ name: 'বানারীপাড়া', code: '8250' }]
          },
          {
            name: 'বাবুগঞ্জ',
            nameEn: 'Babuganj',
            postOffices: [{ name: 'বাবুগঞ্জ', code: '8210' }]
          },
          {
            name: 'মুলাদী',
            nameEn: 'Muladi',
            postOffices: [{ name: 'মুলাদী', code: '8270' }]
          },
          {
            name: 'হিজলা',
            nameEn: 'Hizla',
            postOffices: [{ name: 'হিজলা', code: '8280' }]
          },
          {
            name: 'মেহেন্দিগঞ্জ',
            nameEn: 'Mehendiganj',
            postOffices: [{ name: 'পাতারহাট', code: '8260' }]
          },
          {
            name: 'বাকেরগঞ্জ',
            nameEn: 'Bakerganj',
            postOffices: [{ name: 'বাকেরগঞ্জ', code: '8290' }]
          }
        ]
      },
      {
        name: 'পটুয়াখালী',
        nameEn: 'Patuakhali',
        upazilas: [
          {
            name: 'পটুয়াখালী সদর',
            nameEn: 'Patuakhali Sadar',
            postOffices: [{ name: 'পটুয়াখালী প্রধান ডাকঘর', code: '8600' }]
          },
          {
            name: 'কুয়াকাটা / কলাপাড়া',
            nameEn: 'Kuakata / Kalapara',
            postOffices: [{ name: 'কুয়াকাটা সৈকত', code: '8651' }, { name: 'কলাপাড়া', code: '8650' }]
          },
          {
            name: 'বাউফল',
            nameEn: 'Bauphal',
            postOffices: [{ name: 'বাউফল', code: '8620' }]
          },
          {
            name: 'গলাচিপা',
            nameEn: 'Galachipa',
            postOffices: [{ name: 'গলাচিপা', code: '8630' }]
          },
          {
            name: 'দশমিনা',
            nameEn: 'Dashmina',
            postOffices: [{ name: 'দশমিনা', code: '8640' }]
          },
          {
            name: 'মির্জাগঞ্জ',
            nameEn: 'Mirzaganj',
            postOffices: [{ name: 'মির্জাগঞ্জ', code: '8610' }]
          },
          {
            name: 'দুমকি',
            nameEn: 'Dumki',
            postOffices: [{ name: 'পটুয়াখালী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (PSTU)', code: '8602' }]
          },
          {
            name: 'রাঙ্গাবালী',
            nameEn: 'Rangabali',
            postOffices: [{ name: 'রাঙ্গাবালী', code: '8631' }]
          }
        ]
      },
      {
        name: 'ভোলা',
        nameEn: 'Bhola',
        upazilas: [
          {
            name: 'ভোলা সদর',
            nameEn: 'Bhola Sadar',
            postOffices: [{ name: 'ভোলা প্রধান ডাকঘর', code: '8300' }]
          },
          {
            name: 'বোরহানউদ্দিন',
            nameEn: 'Borhanuddin',
            postOffices: [{ name: 'বোরহানউদ্দিন', code: '8320' }]
          },
          {
            name: 'লালমোহন',
            nameEn: 'Lalmohan',
            postOffices: [{ name: 'লালমোহন', code: '8330' }]
          },
          {
            name: 'চরফ্যাশন',
            nameEn: 'Charfasson',
            postOffices: [{ name: 'চরফ্যাশন', code: '8340' }]
          },
          {
            name: 'দৌলতখান',
            nameEn: 'Daulatkhan',
            postOffices: [{ name: 'দৌলতখান', code: '8310' }]
          },
          {
            name: 'তজুমদ্দিন',
            nameEn: 'Tazumuddin',
            postOffices: [{ name: 'তজুমদ্দিন', code: '8350' }]
          },
          {
            name: 'মনপুরা',
            nameEn: 'Manpura',
            postOffices: [{ name: 'মনপুরা', code: '8360' }]
          }
        ]
      },
      {
        name: 'পিরোজপুর',
        nameEn: 'Pirojpur',
        upazilas: [
          {
            name: 'পিরোজপুর সদর',
            nameEn: 'Pirojpur Sadar',
            postOffices: [{ name: 'পিরোজপুর প্রধান ডাকঘর', code: '8500' }]
          },
          {
            name: 'মঠবাড়িয়া',
            nameEn: 'Mathbaria',
            postOffices: [{ name: 'মঠবাড়িয়া', code: '8560' }]
          },
          {
            name: 'ভাণ্ডারিয়া',
            nameEn: 'Bhandaria',
            postOffices: [{ name: 'ভাণ্ডারিয়া', code: '8550' }]
          },
          {
            name: 'নাজিরপুর',
            nameEn: 'Nazirpur',
            postOffices: [{ name: 'নাজিরপুর', code: '8540' }]
          },
          {
            name: 'স্বরূপকাঠি / নেছারাবাদ',
            nameEn: 'Nesarabad / Swarupkati',
            postOffices: [{ name: 'স্বরূপকাঠি', code: '8520' }]
          },
          {
            name: 'কাউখালী (পিরোজপুর)',
            nameEn: 'Kawkhali (Pirojpur)',
            postOffices: [{ name: 'কাউখালী', code: '8510' }]
          },
          {
            name: 'ইন্দুরকানী / জিয়ানগর',
            nameEn: 'Indurkani',
            postOffices: [{ name: 'ইন্দুরকানী', code: '8505' }]
          }
        ]
      },
      {
        name: 'বরগুনা',
        nameEn: 'Barguna',
        upazilas: [
          {
            name: 'বরগুনা সদর',
            nameEn: 'Barguna Sadar',
            postOffices: [{ name: 'বরগুনা প্রধান ডাকঘর', code: '8700' }]
          },
          {
            name: 'আমতলী',
            nameEn: 'Amtali',
            postOffices: [{ name: 'আমতলী', code: '8710' }]
          },
          {
            name: 'পাথরঘাটা',
            nameEn: 'Patharghata',
            postOffices: [{ name: 'পাথরঘাটা', code: '8720' }]
          },
          {
            name: 'বেতাগী',
            nameEn: 'Betagi',
            postOffices: [{ name: 'বেতাগী', code: '8740' }]
          },
          {
            name: 'বামনা',
            nameEn: 'Bamna',
            postOffices: [{ name: 'বামনা', code: '8730' }]
          },
          {
            name: 'তালতলী',
            nameEn: 'Taltali',
            postOffices: [{ name: 'তালতলী', code: '8711' }]
          }
        ]
      },
      {
        name: 'ঝালকাঠি',
        nameEn: 'Jhalokathi',
        upazilas: [
          {
            name: 'ঝালকাঠি সদর',
            nameEn: 'Jhalokathi Sadar',
            postOffices: [{ name: 'ঝালকাঠি প্রধান ডাকঘর', code: '8400' }]
          },
          {
            name: 'নলছিটি',
            nameEn: 'Nalchity',
            postOffices: [{ name: 'নলছিটি', code: '8420' }]
          },
          {
            name: 'রাজাপুর',
            nameEn: 'Rajapur',
            postOffices: [{ name: 'রাজাপুর', code: '8410' }]
          },
          {
            name: 'কাঠালিয়া',
            nameEn: 'Kathalia',
            postOffices: [{ name: 'কাঠালিয়া', code: '8430' }]
          }
        ]
      }
    ]
  },
  {
    name: 'সিলেট',
    nameEn: 'Sylhet',
    districts: [
      {
        name: 'সিলেট',
        nameEn: 'Sylhet',
        upazilas: [
          {
            name: 'সিলেট সদর / কোতোয়ালি',
            nameEn: 'Sylhet Sadar / Kotwali',
            postOffices: [
              { name: 'সিলেট প্রধান ডাকঘর (জিপিও)', code: '3100' },
              { name: 'শাহজালাল বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (SUST)', code: '3114' },
              { name: 'সিলেট ক্যাডেট কলেজ', code: '3103' },
              { name: 'আম্বরখানা', code: '3100' },
              { name: 'জিন্দাবাজার', code: '3100' }
            ]
          },
          {
            name: 'গোলাপগঞ্জ',
            nameEn: 'Golapganj',
            postOffices: [{ name: 'গোলাপগঞ্জ', code: '3160' }, { name: 'ঢাকা দক্ষিণ', code: '3161' }]
          },
          {
            name: 'বিয়ানীবাজার',
            nameEn: 'Beanibazar',
            postOffices: [{ name: 'বিয়ানীবাজার', code: '3170' }]
          },
          {
            name: 'জাফলং / গোয়াইনঘাট',
            nameEn: 'Gowainghat / Jaflong',
            postOffices: [{ name: 'গোয়াইনঘাট', code: '3150' }, { name: 'জাফলং', code: '3151' }]
          },
          {
            name: 'বিশ্বনাথ',
            nameEn: 'Bishwanath',
            postOffices: [{ name: 'বিশ্বনাথ', code: '3130' }]
          },
          {
            name: 'ওসমানীনগর / তাজপুর',
            nameEn: 'Osmaninagar / Tajpur',
            postOffices: [{ name: 'তাজপুর', code: '3122' }]
          },
          {
            name: 'বালাগঞ্জ',
            nameEn: 'Balaganj',
            postOffices: [{ name: 'বালাগঞ্জ', code: '3120' }]
          },
          {
            name: 'জৈন্তাপুর / তামাবিল',
            nameEn: 'Jaintiapur / Tamabil',
            postOffices: [{ name: 'জৈন্তাপুর', code: '3156' }, { name: 'তামাবিল বন্দর', code: '3157' }]
          },
          {
            name: 'জকিগঞ্জ',
            nameEn: 'Zakiganj',
            postOffices: [{ name: 'জকিগঞ্জ', code: '3190' }]
          },
          {
            name: 'কানাইঘাট',
            nameEn: 'Kanaighat',
            postOffices: [{ name: 'কানাইঘাট', code: '3180' }]
          },
          {
            name: 'কোম্পানীগঞ্জ (সিলেট) / ভোলাগঞ্জ',
            nameEn: 'Companiganj / Bholaganj',
            postOffices: [{ name: 'ভোলাগঞ্জ', code: '3141' }, { name: 'কোম্পানীগঞ্জ', code: '3140' }]
          },
          {
            name: 'ফেঞ্চুগঞ্জ',
            nameEn: 'Fenchuganj',
            postOffices: [{ name: 'ফেঞ্চুগঞ্জ সার কারখানা', code: '3117' }, { name: 'ফেঞ্চুগঞ্জ', code: '3116' }]
          },
          {
            name: 'দক্ষিণ সুরমা',
            nameEn: 'Dakshin Surma',
            postOffices: [{ name: 'কদমতলী', code: '3111' }]
          }
        ]
      },
      {
        name: 'সুনামগঞ্জ',
        nameEn: 'Sunamganj',
        upazilas: [
          {
            name: 'সুনামগঞ্জ সদর',
            nameEn: 'Sunamganj Sadar',
            postOffices: [{ name: 'সুনামগঞ্জ প্রধান ডাকঘর', code: '3000' }]
          },
          {
            name: 'তাহিরপুর / টাঙ্গুয়ার হাওর',
            nameEn: 'Tahirpur / Tanguar Haor',
            postOffices: [{ name: 'তাহিরপুর', code: '3030' }]
          },
          {
            name: 'ছাতক',
            nameEn: 'Chhatak',
            postOffices: [{ name: 'ছাতক সিমেন্ট ফ্যাক্টরি', code: '3081' }, { name: 'ছাতক', code: '3080' }]
          },
          {
            name: 'জগন্নাথপুর',
            nameEn: 'Jagannathpur',
            postOffices: [{ name: 'জগন্নাথপুর', code: '3060' }]
          },
          {
            name: 'দিরাই',
            nameEn: 'Derai',
            postOffices: [{ name: 'দিরাই', code: '3040' }]
          },
          {
            name: 'ধর্মপাশা / মধ্যনগর',
            nameEn: 'Dharampasha / Madhyanagar',
            postOffices: [{ name: 'ধর্মপাশা', code: '3050' }]
          },
          {
            name: 'দোয়ারাবাজার',
            nameEn: 'Dowarabazar',
            postOffices: [{ name: 'দোয়ারাবাজার', code: '3070' }]
          },
          {
            name: 'শাল্লা',
            nameEn: 'Shalla',
            postOffices: [{ name: 'শাল্লা', code: '3041' }]
          },
          {
            name: 'জামালগঞ্জ',
            nameEn: 'Jamalganj',
            postOffices: [{ name: 'জামালগঞ্জ', code: '3020' }]
          },
          {
            name: 'বিশ্বম্ভরপুর',
            nameEn: 'Bishwamvarpur',
            postOffices: [{ name: 'বিশ্বম্ভরপুর', code: '3010' }]
          },
          {
            name: 'শান্তিগঞ্জ',
            nameEn: 'Shantiganj',
            postOffices: [{ name: 'শান্তিগঞ্জ', code: '3005' }]
          }
        ]
      },
      {
        name: 'মৌলভীবাজার',
        nameEn: 'Moulvibazar',
        upazilas: [
          {
            name: 'মৌলভীবাজার সদর',
            nameEn: 'Moulvibazar Sadar',
            postOffices: [{ name: 'মৌলভীবাজার প্রধান ডাকঘর', code: '3200' }]
          },
          {
            name: 'শ্রীমঙ্গল / চা বাগান',
            nameEn: 'Sreemangal',
            postOffices: [{ name: 'শ্রীমঙ্গল', code: '3210' }]
          },
          {
            name: 'কুলাউড়া',
            nameEn: 'Kulaura',
            postOffices: [{ name: 'কুলাউড়া', code: '3230' }]
          },
          {
            name: 'কমলগঞ্জ',
            nameEn: 'Kamalganj',
            postOffices: [{ name: 'কমলগঞ্জ', code: '3220' }, { name: 'শমসেরনগর', code: '3222' }]
          },
          {
            name: 'বড়লেখা',
            nameEn: 'Barlekha',
            postOffices: [{ name: 'বড়লেখা', code: '3250' }]
          },
          {
            name: 'রাজনগর',
            nameEn: 'Rajnagar',
            postOffices: [{ name: 'রাজনগর', code: '3240' }]
          },
          {
            name: 'জুড়ী',
            nameEn: 'Juri',
            postOffices: [{ name: 'জুড়ী', code: '3251' }]
          }
        ]
      },
      {
        name: 'হবিগঞ্জ',
        nameEn: 'Habiganj',
        upazilas: [
          {
            name: 'হবিগঞ্জ সদর',
            nameEn: 'Habiganj Sadar',
            postOffices: [{ name: 'হবিগঞ্জ প্রধান ডাকঘর', code: '3300' }]
          },
          {
            name: 'মাধবপুর',
            nameEn: 'Madhabpur',
            postOffices: [{ name: 'মাধবপুর', code: '3330' }]
          },
          {
            name: 'চুনারুঘাট',
            nameEn: 'Chunarughat',
            postOffices: [{ name: 'চুনারুঘাট', code: '3320' }, { name: 'শায়েস্তাগঞ্জ', code: '3310' }]
          },
          {
            name: 'বাহুবল',
            nameEn: 'Bahubal',
            postOffices: [{ name: 'বাহুবল', code: '3310' }]
          },
          {
            name: 'নবীগঞ্জ',
            nameEn: 'Nabiganj',
            postOffices: [{ name: 'নবীগঞ্জ', code: '3370' }]
          },
          {
            name: 'বানিয়াচং',
            nameEn: 'Baniachong',
            postOffices: [{ name: 'বানিয়াচং', code: '3350' }]
          },
          {
            name: 'লাখাই',
            nameEn: 'Lakhai',
            postOffices: [{ name: 'লাখাই', code: '3340' }]
          },
          {
            name: 'আজমিরীগঞ্জ',
            nameEn: 'Ajmiriganj',
            postOffices: [{ name: 'আজমিরীগঞ্জ', code: '3360' }]
          },
          {
            name: 'শায়েস্তাগঞ্জ',
            nameEn: 'Shayestaganj',
            postOffices: [{ name: 'শায়েস্তাগঞ্জ জংশন', code: '3310' }]
          }
        ]
      }
    ]
  },
  {
    name: 'রংপুর',
    nameEn: 'Rangpur',
    districts: [
      {
        name: 'রংপুর',
        nameEn: 'Rangpur',
        upazilas: [
          {
            name: 'রংপুর সদর / কোতোয়ালি',
            nameEn: 'Rangpur Sadar / Kotwali',
            postOffices: [
              { name: 'রংপুর প্রধান ডাকঘর (জিপিও)', code: '5400' },
              { name: 'বেগম রোকেয়া বিশ্ববিদ্যালয় (BRUR)', code: '5400' },
              { name: 'রংপুর ক্যাডেট কলেজ', code: '5404' }
            ]
          },
          {
            name: 'পীরগঞ্জ',
            nameEn: 'Pirganj',
            postOffices: [{ name: 'পীরগঞ্জ', code: '5470' }]
          },
          {
            name: 'মিঠাপুকুর',
            nameEn: 'Mithapukur',
            postOffices: [{ name: 'মিঠাপুকুর', code: '5460' }]
          },
          {
            name: 'বদরগঞ্জ',
            nameEn: 'Badarganj',
            postOffices: [{ name: 'বদরগঞ্জ', code: '5430' }, { name: 'শ্যামপুর', code: '5431' }]
          },
          {
            name: 'কাউনিয়া',
            nameEn: 'Kaunia',
            postOffices: [{ name: 'কাউনিয়া', code: '5440' }, { name: 'হারাগাছ', code: '5441' }]
          },
          {
            name: 'গঙ্গাচড়া',
            nameEn: 'Gangachhara',
            postOffices: [{ name: 'গঙ্গাচড়া', code: '5410' }]
          },
          {
            name: 'পীরগাছা',
            nameEn: 'Pirgachha',
            postOffices: [{ name: 'পীরগাছা', code: '5450' }]
          },
          {
            name: 'তারাগঞ্জ',
            nameEn: 'Taraganj',
            postOffices: [{ name: 'তারাগঞ্জ', code: '5420' }]
          }
        ]
      },
      {
        name: 'দিনাজপুর',
        nameEn: 'Dinajpur',
        upazilas: [
          {
            name: 'দিনাজপুর সদর',
            nameEn: 'Dinajpur Sadar',
            postOffices: [
              { name: 'দিনাজপুর প্রধান ডাকঘর', code: '5200' },
              { name: 'হাজী মোহাম্মদ দানেশ বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (HSTU)', code: '5200' }
            ]
          },
          {
            name: 'পার্বতীপুর / মধ্যপাড়া',
            nameEn: 'Parbatipur',
            postOffices: [{ name: 'পার্বতীপুর', code: '5250' }, { name: 'মধ্যপাড়া কঠিন শিলা', code: '5251' }]
          },
          {
            name: 'ফুলবাড়ী / বড়পুকুরিয়া',
            nameEn: 'Fulbari / Barapukuria',
            postOffices: [{ name: 'ফুলবাড়ী', code: '5260' }, { name: 'বড়পুকুরিয়া কয়লাখনি', code: '5261' }]
          },
          {
            name: 'বীরগঞ্জ / কান্তজীউ',
            nameEn: 'Birganj / Kantajew',
            postOffices: [{ name: 'বীরগঞ্জ', code: '5220' }, { name: 'কান্তনগর', code: '5221' }]
          },
          {
            name: 'নবাবগঞ্জ (দিনাজপুর)',
            nameEn: 'Nawabganj (Dinajpur)',
            postOffices: [{ name: 'দাউদপুর', code: '5280' }]
          },
          {
            name: 'ঘোড়াঘাট',
            nameEn: 'Ghoraghat',
            postOffices: [{ name: 'ঘোড়াঘাট', code: '5290' }]
          },
          {
            name: 'বিরামপুর',
            nameEn: 'Birampur',
            postOffices: [{ name: 'বিরামপুর', code: '5270' }]
          },
          {
            name: 'হাকিমপুর / হিলি',
            nameEn: 'Hili / Hakimpur',
            postOffices: [{ name: 'হিলি স্থলবন্দর', code: '5271' }]
          },
          {
            name: 'বোচাগঞ্জ / সেতাবগঞ্জ',
            nameEn: 'Bochaganj / Setabganj',
            postOffices: [{ name: 'সেতাবগঞ্জ', code: '5216' }]
          },
          {
            name: 'কাহারোল',
            nameEn: 'Kaharole',
            postOffices: [{ name: 'কাহারোল', code: '5210' }]
          },
          {
            name: 'চিরিরবন্দর',
            nameEn: 'Chirirbandar',
            postOffices: [{ name: 'চিরিরবন্দর', code: '5240' }]
          },
          {
            name: 'বিরল',
            nameEn: 'Birol',
            postOffices: [{ name: 'বিরল', code: '5230' }]
          },
          {
            name: 'খানসামা',
            nameEn: 'Khansama',
            postOffices: [{ name: 'খানসামা', code: '5226' }]
          }
        ]
      },
      {
        name: 'গাইবান্ধা',
        nameEn: 'Gaibandha',
        upazilas: [
          {
            name: 'গাইবান্ধা সদর',
            nameEn: 'Gaibandha Sadar',
            postOffices: [{ name: 'গাইবান্ধা প্রধান ডাকঘর', code: '5700' }]
          },
          {
            name: 'গোবিন্দগঞ্জ',
            nameEn: 'Gobindaganj',
            postOffices: [{ name: 'গোবিন্দগঞ্জ', code: '5740' }, { name: 'মহিমাগঞ্জ', code: '5741' }]
          },
          {
            name: 'পলাশবাড়ী',
            nameEn: 'Palashbari',
            postOffices: [{ name: 'পলাশবাড়ী', code: '5730' }]
          },
          {
            name: 'সুন্দরগঞ্জ',
            nameEn: 'Sundarganj',
            postOffices: [{ name: 'সুন্দরগঞ্জ', code: '5710' }]
          },
          {
            name: 'সাদুল্লাপুর',
            nameEn: 'Sadullapur',
            postOffices: [{ name: 'সাদুল্লাপুর', code: '5720' }]
          },
          {
            name: 'সাঘাটা',
            nameEn: 'Saghata',
            postOffices: [{ name: 'সাঘাটা', code: '5750' }]
          },
          {
            name: 'ফুলছড়ি',
            nameEn: 'Fulchhari',
            postOffices: [{ name: 'ফুলছড়ি', code: '5760' }]
          }
        ]
      },
      {
        name: 'কুড়িগ্রাম',
        nameEn: 'Kurigram',
        upazilas: [
          {
            name: 'কুড়িগ্রাম সদর',
            nameEn: 'Kurigram Sadar',
            postOffices: [{ name: 'কুড়িগ্রাম প্রধান ডাকঘর', code: '5600' }]
          },
          {
            name: 'উলিপুর',
            nameEn: 'Ulipur',
            postOffices: [{ name: 'উলিপুর', code: '5620' }]
          },
          {
            name: 'নাগেশ্বরী',
            nameEn: 'Nageshwari',
            postOffices: [{ name: 'নাগেশ্বরী', code: '5660' }]
          },
          {
            name: 'ভুরুঙ্গামারী / সোনাহাট',
            nameEn: 'Bhurungamari / Sonahat',
            postOffices: [{ name: 'ভুরুঙ্গামারী', code: '5670' }, { name: 'সোনাহাট বন্দর', code: '5671' }]
          },
          {
            name: 'রৌমারী',
            nameEn: 'Roumari',
            postOffices: [{ name: 'রৌমারী', code: '5640' }]
          },
          {
            name: 'চিলমারী',
            nameEn: 'Chilmari',
            postOffices: [{ name: 'চিলমারী', code: '5630' }]
          },
          {
            name: 'রাজারহাট',
            nameEn: 'Rajarhat',
            postOffices: [{ name: 'রাজারহাট', code: '5610' }]
          },
          {
            name: 'রাজীবপুর',
            nameEn: 'Rajibpur',
            postOffices: [{ name: 'রাজীবপুর', code: '5650' }]
          },
          {
            name: 'ফুলবাড়ী (কুড়িগ্রাম)',
            nameEn: 'Fulbari (Kurigram)',
            postOffices: [{ name: 'ফুলবাড়ী', code: '5680' }]
          }
        ]
      },
      {
        name: 'নীলফামারী',
        nameEn: 'Nilphamari',
        upazilas: [
          {
            name: 'নীলফামারী সদর',
            nameEn: 'Nilphamari Sadar',
            postOffices: [{ name: 'নীলফামারী প্রধান ডাকঘর', code: '5300' }]
          },
          {
            name: 'সৈয়দপুর',
            nameEn: 'Saidpur',
            postOffices: [
              { name: 'সৈয়দপুর প্রধান ডাকঘর', code: '5310' },
              { name: 'সৈয়দপুর বিমানবন্দর', code: '5311' }
            ]
          },
          {
            name: 'ডোমার',
            nameEn: 'Domar',
            postOffices: [{ name: 'ডোমার', code: '5320' }, { name: 'চিলাহাটি বন্দর', code: '5321' }]
          },
          {
            name: 'ডিমলা / তিস্তা ব্যারেজ',
            nameEn: 'Dimla / Teesta Barrage',
            postOffices: [{ name: 'ডিমলা', code: '5330' }]
          },
          {
            name: 'জলঢাকা',
            nameEn: 'Jaldhaka',
            postOffices: [{ name: 'জলঢাকা', code: '5340' }]
          },
          {
            name: 'কিশোরগঞ্জ (নীলফামারী)',
            nameEn: 'Kishoreganj (Nilphamari)',
            postOffices: [{ name: 'কিশোরগঞ্জ', code: '5350' }]
          }
        ]
      },
      {
        name: 'পঞ্চগড়',
        nameEn: 'Panchagarh',
        upazilas: [
          {
            name: 'পঞ্চগড় সদর',
            nameEn: 'Panchagarh Sadar',
            postOffices: [{ name: 'পঞ্চগড় প্রধান ডাকঘর', code: '5000' }]
          },
          {
            name: 'তেঁতুলিয়া / বাংলাবান্ধা',
            nameEn: 'Tetulia / Banglabandha',
            postOffices: [
              { name: 'তেঁতুলিয়া', code: '5030' },
              { name: 'বাংলাবান্ধা জিরো পয়েন্ট ও স্থলবন্দর', code: '5031' }
            ]
          },
          {
            name: 'বোদা',
            nameEn: 'Boda',
            postOffices: [{ name: 'বোদা', code: '5010' }]
          },
          {
            name: 'দেবীগঞ্জ',
            nameEn: 'Debiganj',
            postOffices: [{ name: 'দেবীগঞ্জ', code: '5020' }]
          },
          {
            name: 'আটোয়ারী',
            nameEn: 'Atwari',
            postOffices: [{ name: 'আটোয়ারী', code: '5040' }]
          }
        ]
      },
      {
        name: 'ঠাকুরগাঁও',
        nameEn: 'Thakurgaon',
        upazilas: [
          {
            name: 'ঠাকুরগাঁও সদর',
            nameEn: 'Thakurgaon Sadar',
            postOffices: [{ name: 'ঠাকুরগাঁও প্রধান ডাকঘর', code: '5100' }]
          },
          {
            name: 'পীরগঞ্জ (ঠাকুরগাঁও)',
            nameEn: 'Pirganj (Thakurgaon)',
            postOffices: [{ name: 'পীরগঞ্জ', code: '5110' }]
          },
          {
            name: 'বালিয়াডাঙ্গী',
            nameEn: 'Baliadangi',
            postOffices: [{ name: 'বালিয়াডাঙ্গী', code: '5140' }]
          },
          {
            name: 'রাণীশংকৈল',
            nameEn: 'Ranisankail',
            postOffices: [{ name: 'রাণীশংকৈল', code: '5120' }]
          },
          {
            name: 'হরিপুর',
            nameEn: 'Haripur',
            postOffices: [{ name: 'হরিপুর', code: '5130' }]
          }
        ]
      },
      {
        name: 'লালমনিরহাট',
        nameEn: 'Lalmonirhat',
        upazilas: [
          {
            name: 'লালমনিরহাট সদর',
            nameEn: 'Lalmonirhat Sadar',
            postOffices: [{ name: 'লালমনিরহাট প্রধান ডাকঘর', code: '5500' }]
          },
          {
            name: 'পাটগ্রাম / বুড়িমারী',
            nameEn: 'Patgram / Burimari',
            postOffices: [
              { name: 'বুড়িমারী স্থলবন্দর', code: '5541' },
              { name: 'পাটগ্রাম', code: '5540' }
            ]
          },
          {
            name: 'হাতীবান্ধা',
            nameEn: 'Hatibandha',
            postOffices: [{ name: 'হাতীবান্ধা', code: '5530' }]
          },
          {
            name: 'কালীগঞ্জ (লালমনিরহাট)',
            nameEn: 'Kaliganj (Lalmonirhat)',
            postOffices: [{ name: 'কালীগঞ্জ', code: '5520' }]
          },
          {
            name: 'আদিতমারী',
            nameEn: 'Aditmari',
            postOffices: [{ name: 'আদিতমারী', code: '5510' }]
          }
        ]
      }
    ]
  },
  {
    name: 'ময়মনসিংহ',
    nameEn: 'Mymensingh',
    districts: [
      {
        name: 'ময়মনসিংহ',
        nameEn: 'Mymensingh',
        upazilas: [
          {
            name: 'ময়মনসিংহ সদর / কোতোয়ালি',
            nameEn: 'Mymensingh Sadar / Kotwali',
            postOffices: [
              { name: 'ময়মনসিংহ প্রধান ডাকঘর (জিপিও)', code: '2200' },
              { name: 'বাংলাদেশ কৃষি বিশ্ববিদ্যালয় (BAU)', code: '2202' },
              { name: 'ময়মনসিংহ ক্যাডেট কলেজ', code: '2203' }
            ]
          },
          {
            name: 'মুক্তাগাছা',
            nameEn: 'Muktagachha',
            postOffices: [{ name: 'মুক্তাগাছা', code: '2210' }]
          },
          {
            name: 'ত্রিশাল / জাতীয় কবি কাজী নজরুল ইসলাম বিশ্ববিদ্যালয়',
            nameEn: 'Trishal / JKKNIU',
            postOffices: [{ name: 'ত্রিশাল', code: '2220' }, { name: 'নজরুল বিশ্ববিদ্যালয়', code: '2221' }]
          },
          {
            name: 'ভালুকা',
            nameEn: 'Bhaluka',
            postOffices: [{ name: 'ভালুকা', code: '2240' }]
          },
          {
            name: 'গফরগাঁও',
            nameEn: 'Gafargaon',
            postOffices: [{ name: 'গফরগাঁও', code: '2230' }]
          },
          {
            name: 'ফুলবাড়িয়া',
            nameEn: 'Fulbaria',
            postOffices: [{ name: 'ফুলবাড়িয়া', code: '2216' }]
          },
          {
            name: 'ঈশ্বরগঞ্জ',
            nameEn: 'Ishwarganj',
            postOffices: [{ name: 'ঈশ্বরগঞ্জ', code: '2280' }]
          },
          {
            name: 'নান্দাইল',
            nameEn: 'Nandail',
            postOffices: [{ name: 'নান্দাইল', code: '2290' }]
          },
          {
            name: 'গৌরীপুর',
            nameEn: 'Gouripur',
            postOffices: [{ name: 'গৌরীপুর', code: '2270' }]
          },
          {
            name: 'হালুয়াঘাট',
            nameEn: 'Haluaghat',
            postOffices: [{ name: 'হালুয়াঘাট', code: '2260' }]
          },
          {
            name: 'ফুলপুর',
            nameEn: 'Phulpur',
            postOffices: [{ name: 'ফুলপুর', code: '2250' }]
          },
          {
            name: 'ধোবাউড়া',
            nameEn: 'Dhobaura',
            postOffices: [{ name: 'ধোবাউড়া', code: '2265' }]
          },
          {
            name: 'তারাকান্দা',
            nameEn: 'Tarakanda',
            postOffices: [{ name: 'তারাকান্দা', code: '2251' }]
          }
        ]
      },
      {
        name: 'জামালপুর',
        nameEn: 'Jamalpur',
        upazilas: [
          {
            name: 'জামালপুর সদর',
            nameEn: 'Jamalpur Sadar',
            postOffices: [{ name: 'জামালপুর প্রধান ডাকঘর', code: '2000' }]
          },
          {
            name: 'সরিষাবাড়ী',
            nameEn: 'Sarishabari',
            postOffices: [{ name: 'সরিষাবাড়ী', code: '2050' }, { name: 'যমুনা ফার্টিলাইজার', code: '2051' }]
          },
          {
            name: 'মেলান্দহ',
            nameEn: 'Melandaha',
            postOffices: [{ name: 'মেলান্দহ', code: '2010' }]
          },
          {
            name: 'ইসলামপুর',
            nameEn: 'Islampur',
            postOffices: [{ name: 'ইসলামপুর', code: '2020' }]
          },
          {
            name: 'মাদারগঞ্জ',
            nameEn: 'Madarganj',
            postOffices: [{ name: 'মাদারগঞ্জ', code: '2040' }]
          },
          {
            name: 'বকশীগঞ্জ',
            nameEn: 'Bakshiganj',
            postOffices: [{ name: 'বকশীগঞ্জ', code: '2030' }]
          },
          {
            name: 'দেওয়ানগঞ্জ',
            nameEn: 'Dewanganj',
            postOffices: [{ name: 'দেওয়ানগঞ্জ সুগার মিলস', code: '2031' }]
          }
        ]
      },
      {
        name: 'নেত্রকোণা',
        nameEn: 'Netrokona',
        upazilas: [
          {
            name: 'নেত্রকোণা সদর',
            nameEn: 'Netrokona Sadar',
            postOffices: [{ name: 'নেত্রকোণা প্রধান ডাকঘর', code: '2400' }]
          },
          {
            name: 'দুর্গাপুর / বিরিশিরি',
            nameEn: 'Durgapur / Birishiri',
            postOffices: [{ name: 'বিরিশিরি', code: '2420' }, { name: 'দুর্গাপুর', code: '2421' }]
          },
          {
            name: 'কেন্দুয়া',
            nameEn: 'Kendua',
            postOffices: [{ name: 'কেন্দুয়া', code: '2480' }]
          },
          {
            name: 'মোহনগঞ্জ',
            nameEn: 'Mohanganj',
            postOffices: [{ name: 'মোহনগঞ্জ', code: '2440' }]
          },
          {
            name: 'পূর্বধলা',
            nameEn: 'Purbadhala',
            postOffices: [{ name: 'পূর্বধলা', code: '2410' }]
          },
          {
            name: 'কলমাকান্দা',
            nameEn: 'Kalmakanda',
            postOffices: [{ name: 'কলমাকান্দা', code: '2430' }]
          },
          {
            name: 'মদন',
            nameEn: 'Madan',
            postOffices: [{ name: 'মদন', code: '2490' }]
          },
          {
            name: 'বারহাট্টা',
            nameEn: 'Barhatta',
            postOffices: [{ name: 'বারহাট্টা', code: '2442' }]
          },
          {
            name: 'আটপাড়া',
            nameEn: 'Atpara',
            postOffices: [{ name: 'আটপাড়া', code: '2470' }]
          },
          {
            name: 'খালিয়াজুড়ি',
            nameEn: 'Khaliajuri',
            postOffices: [{ name: 'খালিয়াজুড়ি', code: '2450' }]
          }
        ]
      },
      {
        name: 'শেরপুর',
        nameEn: 'Sherpur',
        upazilas: [
          {
            name: 'শেরপুর সদর',
            nameEn: 'Sherpur Sadar',
            postOffices: [{ name: 'শেরপুর প্রধান ডাকঘর', code: '2100' }]
          },
          {
            name: 'নকলা',
            nameEn: 'Nakla',
            postOffices: [{ name: 'নকলা', code: '2150' }]
          },
          {
            name: 'নালিতাবাড়ী',
            nameEn: 'Nalitabari',
            postOffices: [{ name: 'নালিতাবাড়ী', code: '2110' }]
          },
          {
            name: 'ঝিনাইগাতী',
            nameEn: 'Jhenaigati',
            postOffices: [{ name: 'ঝিনাইগাতী', code: '2120' }]
          },
          {
            name: 'শ্রীবরদী',
            nameEn: 'Sreebardi',
            postOffices: [{ name: 'শ্রীবরদী', code: '2130' }]
          }
        ]
      }
    ]
  }
];
