"use client";
import { useState, useMemo, useContext } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import styles from "./page.module.css";
import '@fontsource/righteous';
import '@fontsource/josefin-sans';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaArrowRight } from 'react-icons/fa';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UIContext } from "./layout";

interface Consultant {
  id: number;
  name: string;
  lat: number;
  lng: number;
  expertise: string;
  intro: string;
  image: string;
  rating: number;
}

interface LatLng {
  lat: number;
  lng: number;
}

const consultants: Consultant[] = [
  {
    id: 1,
    name: "Dr. Asha Mehta",
    lat: 28.6139,
    lng: 77.2090,
    expertise: "Child Psychologist",
    intro: "Expert in child psychology with 15+ years of experience.",
    image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=256&h=256&facepad=2",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Mr. Rajiv Kumar",
    lat: 28.5355,
    lng: 77.3910,
    expertise: "Speech Therapist",
    intro: "Specialist in speech therapy for children and adults.",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=256&h=256&facepad=2",
    rating: 4.6,
  },
  {
    id: 3,
    name: "Ms. Priya Singh",
    lat: 28.4089,
    lng: 77.3178,
    expertise: "Special Educator",
    intro: "Inclusive education advocate and special needs educator.",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=256&h=256&facepad=2",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Dr. Neha Sharma",
    lat: 28.7041,
    lng: 77.1025,
    expertise: "Clinical Psychologist",
    intro: "Clinical psychologist with a focus on adolescent therapy.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=256&h=256&facepad=2",
    rating: 4.7,
  },
  {
    id: 5,
    name: "Mr. Anil Kapoor",
    lat: 28.4595,
    lng: 77.0266,
    expertise: "Occupational Therapist",
    intro: "Helping children develop life skills through occupational therapy.",
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=facearea&w=256&h=256&facepad=2",
    rating: 4.5,
  },
  {
    id: 6,
    name: "Ms. Ritu Verma",
    lat: 26.2006,
    lng: 92.9376,
    expertise: "Behavioral Therapist",
    intro: "Behavioral therapist with 10+ years of experience in special education.",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=256&h=256&facepad=2",
    rating: 4.8,
  },
  {
    id: 7,
    name: "Dr. Suresh Gupta",
    lat: 25.4670,
    lng: 91.3662,
    expertise: "Neurodevelopmental Specialist",
    intro: "Expert in neurodevelopmental disorders and early intervention.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=256&h=256&facepad=2",
    rating: 4.9,
  },
  {
    id: 8,
    name: "Ms. Kavita Joshi",
    lat: 28.5355,
    lng: 77.3910,
    expertise: "Counselor",
    intro: "Counselor specializing in family and child counseling.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=256&h=256&facepad=2",
    rating: 4.7,
  },
  {
    id: 9,
    name: "Dr. Amitabh Das",
    lat: 26.1433,
    lng: 91.7898,
    expertise: "Child Psychiatrist",
    intro: "Specialist in child psychiatry and adolescent mental health.",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=256&h=256&facepad=2",
    rating: 4.8,
  },
  {
    id: 10,
    name: "Ms. Sunita Paul",
    lat: 25.5705,
    lng: 91.8802,
    expertise: "Special Needs Educator",
    intro: "Special needs educator with a focus on inclusive learning in Meghalaya.",
    image: "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=facearea&w=256&h=256&facepad=2",
    rating: 4.6,
  },
  {
    id: 11,
    name: "Mr. Rohit Singh",
    lat: 28.4089,
    lng: 77.3178,
    expertise: "Speech Pathologist",
    intro: "Speech pathologist based in Noida, working with children and adults.",
    image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=256&h=256&facepad=2",
    rating: 4.7,
  },
  {
    id: 12,
    name: "Ms. Pooja Kapoor",
    lat: 28.4595,
    lng: 77.0266,
    expertise: "Occupational Therapist",
    intro: "Occupational therapist based in Gurgaon, helping children thrive.",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=256&h=256&facepad=2",
    rating: 4.8,
  },
];

const marketplaceItems = [
  {
    id: 1,
    title: "Mindfulness for Kids (Online Course)",
    category: "course",
    categoryLabel: "Online Course",
    price: 1499,
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80",
    description: "A fun, interactive course to help children develop mindfulness and emotional regulation skills.",
    popularity: 90,
  },
  {
    id: 2,
    title: "Coping with Anxiety (Book)",
    category: "book",
    categoryLabel: "Book",
    price: 499,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    description: "A practical guide for managing anxiety, with exercises and real-life stories.",
    popularity: 80,
  },
  {
    id: 3,
    title: "Therapy Journal (Product)",
    category: "product",
    categoryLabel: "Product",
    price: 299,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
    description: "A beautifully designed journal to track therapy progress and personal growth.",
    popularity: 70,
  },
  {
    id: 4,
    title: "Positive Parenting (Online Course)",
    category: "course",
    categoryLabel: "Online Course",
    price: 1799,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    description: "Learn effective parenting strategies for a positive, nurturing home environment.",
    popularity: 95,
  },
  {
    id: 5,
    title: "The Resilience Workbook (Book)",
    category: "book",
    categoryLabel: "Book",
    price: 599,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    description: "Build resilience and emotional strength with this evidence-based workbook.",
    popularity: 85,
  },
  {
    id: 6,
    title: "Fidget Toy Set (Product)",
    category: "product",
    categoryLabel: "Product",
    price: 399,
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
    description: "A set of sensory fidget toys to help with focus and stress relief.",
    popularity: 100,
  },
  {
    id: 7,
    title: "Social Skills for Teens (Online Course)",
    category: "course",
    categoryLabel: "Online Course",
    price: 1599,
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80",
    description: "Empower teens to build confidence, communication, and social skills in a supportive environment.",
    popularity: 88,
  },
  {
    id: 8,
    title: "Emotional Intelligence Mastery (Online Course)",
    category: "course",
    categoryLabel: "Online Course",
    price: 1999,
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80",
    description: "A comprehensive course to help children and adults understand, express, and manage emotions effectively.",
    popularity: 92,
  },
];

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '16px',
  boxShadow: '0 4px 24px rgba(90,103,216,0.08)',
  margin: '0 auto',
};

const center = { lat: 28.6139, lng: 77.209 };

export default function Home() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [filteredConsultants, setFilteredConsultants] = useState<Consultant[]>(consultants);
  const [search, setSearch] = useState<string>("");
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [marketplaceSearch, setMarketplaceSearch] = useState("");
  const [marketplaceCategory, setMarketplaceCategory] = useState("all");
  const [marketplaceSort, setMarketplaceSort] = useState("popularity");
  const [marketplaceView, setMarketplaceView] = useState("grid");
  const [marketplacePage, setMarketplacePage] = useState(1);
  const itemsPerPage = 4;
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingConsultant, setBookingConsultant] = useState<string | null>(null);
  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  type Lang = 'en' | 'hi';
  const { lang: contextLang, fontSize, highContrast } = useContext(UIContext);
  const lang = contextLang as Lang;
  const t: Record<Lang, Record<string, string>> = {
    en: {
      findConsultant: "Find the Right Consultant for Mental Health and Special Education",
      searchDesc: "Search for mental health and special education professionals near you. Book sessions, get support, and thrive with MieT.",
      searchPlaceholder: "Search by name or expertise...",
      nearMe: "Near Me",
      filter: "Filter:",
      sort: "Sort:",
      all: "All",
      childPsych: "Child Psychologist",
      speechTherapist: "Speech Therapist",
      specialEducator: "Special Educator",
      rating: "⭐",
      az: "A-Z",
      review: "Review",
      consult: "Consult",
      featured: "Featured Consultants",
      about: "About MieT",
      objective: "Objective:",
      aboutObj: "We aim to provide specialized education services for children with unique needs, and address mental health challenges along with integration of latest technology.",
      aboutDesc: "MieT is a marketplace for product/service providers working in the mental health and special education arena, across geographies.",
      specialized: "Specialized education & mental health services",
      experienced: "Experienced Consultants",
      marketplace: "Marketplace for mental health and special education products & services",
      diversity: "Diversity and Inclusion",
      marketplaceTitle: "Marketplace: Courses, Books & Products",
      searchKeyword: "Search by keyword...",
      courses: "Courses",
      books: "Books",
      products: "Products",
      sortPopularity: "Sort by Popularity",
      priceAsc: "Price: Low to High",
      priceDesc: "Price: High to Low",
      buy: "Buy",
      ctaTitle: "Ready to Take the Next Step?",
      ctaText: "Book a free consultation with our experts and start your journey to better mental health and inclusion.",
      bookConsult: "Book a Consultation",
      faq: "Frequently Asked Questions",
      consultant: "Consultant:",
      selectDate: "Select Date",
      chooseDate: "Choose a date",
      selectTime: "Select Time",
      chooseTimeSlot: "Choose a time slot",
      yourName: "Your Name",
      enterName: "Enter your name",
      yourEmail: "Your Email",
      enterEmail: "Enter your email",
      submitBooking: "Submit Booking",
      thankYou: "Thank you!",
      consultationBooked: "Your consultation has been booked",
      with: "with",
      for: "for",
      at: "at",
      weWillContact: "We will contact you at",
      close: "Close",
    },
    hi: {
      findConsultant: "मानसिक स्वास्थ्य और विशेष शिक्षा के लिए सही सलाहकार खोजें",
      searchDesc: "अपने पास मानसिक स्वास्थ्य और विशेष शिक्षा पेशेवरों की खोज करें। सत्र बुक करें, समर्थन प्राप्त करें, और मीत के साथ आगे बढ़ें।",
      searchPlaceholder: "नाम या विशेषज्ञता से खोजें...",
      nearMe: "मेरे पास",
      filter: "फ़िल्टर:",
      sort: "क्रमबद्ध:",
      all: "सभी",
      childPsych: "बाल मनोवैज्ञानिक",
      speechTherapist: "स्पीच थेरेपिस्ट",
      specialEducator: "विशेष शिक्षक",
      rating: "⭐",
      az: "A-Z",
      review: "समीक्षा",
      consult: "परामर्श",
      featured: "विशेष सलाहकार",
      about: "मीत के बारे में",
      objective: "उद्देश्य:",
      aboutObj: "हम बच्चों की विशेष आवश्यकताओं के लिए विशेष शिक्षा सेवाएं प्रदान करने और नवीनतम तकनीक के साथ मानसिक स्वास्थ्य चुनौतियों का समाधान करने का लक्ष्य रखते हैं।",
      aboutDesc: "मीत मानसिक स्वास्थ्य और विशेष शिक्षा क्षेत्र में उत्पाद/सेवा प्रदाताओं के लिए एक मार्केटप्लेस है।",
      specialized: "विशेष शिक्षा और मानसिक स्वास्थ्य सेवाएँ",
      experienced: "अनुभवी सलाहकार",
      marketplace: "मानसिक स्वास्थ्य और विशेष शिक्षा उत्पादों और सेवाओं के लिए मार्केटप्लेस",
      diversity: "विविधता और समावेशन",
      marketplaceTitle: "मार्केटप्लेस: कोर्स, किताबें और उत्पाद",
      searchKeyword: "कीवर्ड से खोजें...",
      courses: "कोर्स",
      books: "किताबें",
      products: "उत्पाद",
      sortPopularity: "लोकप्रियता से क्रमबद्ध करें",
      priceAsc: "कीमत: कम से अधिक",
      priceDesc: "कीमत: अधिक से कम",
      buy: "खरीदें",
      ctaTitle: "अगला कदम उठाने के लिए तैयार हैं?",
      ctaText: "हमारे विशेषज्ञों के साथ निःशुल्क परामर्श बुक करें और बेहतर मानसिक स्वास्थ्य और समावेशन की यात्रा शुरू करें।",
      bookConsult: "परामर्श बुक करें",
      faq: "अक्सर पूछे जाने वाले प्रश्न",
      consultant: "सलाहकार:",
      selectDate: "तारीख चुनें",
      chooseDate: "तारीख चुनें",
      selectTime: "समय चुनें",
      chooseTimeSlot: "समय स्लॉट चुनें",
      yourName: "आपका नाम",
      enterName: "अपना नाम दर्ज करें",
      yourEmail: "आपका ईमेल",
      enterEmail: "अपना ईमेल दर्ज करें",
      submitBooking: "बुकिंग सबमिट करें",
      thankYou: "धन्यवाद!",
      consultationBooked: "आपकी परामर्श बुक हो गई है",
      with: "के साथ",
      for: "के लिए",
      at: "को",
      weWillContact: "हम आपसे संपर्क करेंगे",
      close: "बंद करें",
    }
  };

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setFilteredConsultants(
          consultants.filter(c =>
            Math.abs(c.lat - position.coords.latitude) < 0.2 &&
            Math.abs(c.lng - position.coords.longitude) < 0.2
          )
        );
      });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setFilteredConsultants(
      consultants.filter(c =>
        c.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        c.expertise.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const handleFilter = (type: string) => {
    setFilteredConsultants(
      consultants.filter(c =>
        type === "" || c.expertise === type
      )
    );
  };

  const handleSort = (type: string) => {
    const sorted = [...filteredConsultants];
    if (type === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (type === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    setFilteredConsultants(sorted);
  };

  const filteredMarketplace = useMemo(() => {
    let items = marketplaceItems.filter(item =>
      (marketplaceCategory === "all" || item.category === marketplaceCategory) &&
      item.title.toLowerCase().includes(marketplaceSearch.toLowerCase())
    );
    if (marketplaceSort === "price-asc") items = items.sort((a, b) => a.price - b.price);
    else if (marketplaceSort === "price-desc") items = items.sort((a, b) => b.price - a.price);
    else if (marketplaceSort === "popularity") items = items.sort((a, b) => b.popularity - a.popularity);
    return items;
  }, [marketplaceSearch, marketplaceCategory, marketplaceSort]);

  const paginatedMarketplace = useMemo(() => {
    const start = (marketplacePage - 1) * itemsPerPage;
    return filteredMarketplace.slice(start, start + itemsPerPage);
  }, [filteredMarketplace, marketplacePage]);

  const totalPages = Math.ceil(filteredMarketplace.length / itemsPerPage);

  const openBookingModal = (consultantName?: string) => {
    setShowScheduler(true);
    setBookingConsultant(consultantName || null);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitted(true);
    // Here you would send the booking data to your backend or email service
  };

  const faqs: { q: string; a: string }[] = [
    {
      q: lang === 'en' ? "What is MieT and who is it for?" : "मीत क्या है और यह किसके लिए है?",
      a: lang === 'en'
        ? "MieT (मीत) is a modern platform focused on mind inclusion, education, and technology. We connect families, children, and individuals with mental health and special education consultants, as well as provide access to products, courses, and services for holistic well-being."
        : "मीत (मीत) एक आधुनिक प्लेटफॉर्म है जो माइंड इन्क्लूजन, शिक्षा और तकनीक पर केंद्रित है। हम परिवारों, बच्चों और व्यक्तियों को मानसिक स्वास्थ्य और विशेष शिक्षा सलाहकारों से जोड़ते हैं, साथ ही समग्र कल्याण के लिए उत्पाद, कोर्स और सेवाएँ भी उपलब्ध कराते हैं।",
    },
    {
      q: lang === 'en' ? "How do I book a consultation with a consultant?" : "मैं सलाहकार के साथ परामर्श कैसे बुक करूं?",
      a: lang === 'en'
        ? "You can book a consultation by clicking the 'Consult' button on any consultant card or in the featured consultants section. This opens a calendar where you can select your preferred date and time and submit your details."
        : "आप किसी भी सलाहकार कार्ड या विशेष सलाहकार अनुभाग में 'परामर्श' बटन पर क्लिक करके परामर्श बुक कर सकते हैं। इससे एक कैलेंडर खुलता है जिसमें आप अपनी पसंदीदा तारीख और समय चुन सकते हैं और अपनी जानकारी सबमिट कर सकते हैं।",
    },
    {
      q: lang === 'en' ? "Are the consultants verified and experienced?" : "क्या सलाहकार प्रमाणित और अनुभवी हैं?",
      a: lang === 'en'
        ? "Yes, all consultants on MieT are carefully vetted for their qualifications, experience, and commitment to inclusivity and mental health support."
        : "हाँ, मीत पर सभी सलाहकारों की योग्यता, अनुभव और समावेशन व मानसिक स्वास्थ्य समर्थन के प्रति प्रतिबद्धता की सावधानीपूर्वक जांच की जाती है।",
    },
    {
      q: lang === 'en' ? "What types of products and courses are available in the marketplace?" : "मार्केटप्लेस में किस प्रकार के उत्पाद और कोर्स उपलब्ध हैं?",
      a: lang === 'en'
        ? "Our marketplace features online courses, books, and products focused on mental health, special education, mindfulness, and personal growth for children and families."
        : "हमारे मार्केटप्लेस में बच्चों और परिवारों के लिए मानसिक स्वास्थ्य, विशेष शिक्षा, माइंडफुलनेस और व्यक्तिगत विकास पर केंद्रित ऑनलाइन कोर्स, किताबें और उत्पाद उपलब्ध हैं।",
    },
    {
      q: lang === 'en' ? "How does MieT promote inclusivity and accessibility?" : "मीत समावेशन और पहुँच को कैसे बढ़ावा देता है?",
      a: lang === 'en'
        ? "MieT is designed with accessibility in mind, offering a diverse range of consultants, resources, and tools to support individuals of all backgrounds and abilities."
        : "मीत को पहुँच को ध्यान में रखकर डिज़ाइन किया गया है, जो सभी पृष्ठभूमियों और क्षमताओं के व्यक्तियों के समर्थन के लिए विविध सलाहकार, संसाधन और उपकरण प्रदान करता है।",
    },
  ];

  return (
    <main className={styles.main} style={{ fontSize: `${fontSize}em`, background: highContrast ? '#000' : undefined, color: highContrast ? '#fff' : undefined }}>
      <div className={styles.container1400}>
        <section className={styles.heroSearchSection}>
          <div className={styles.searchPanel}>
            <h2>{t[lang].findConsultant}</h2>
            <p>{t[lang].searchDesc}</p>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder={t[lang].searchPlaceholder}
                value={search}
                onChange={handleSearch}
                className={styles.input}
              />
              <button onClick={handleNearMe} className={styles.nearMeBtn}>
                📍 {t[lang].nearMe}
              </button>
            </div>
            <div className={styles.filterSortRow}>
              <span className={styles.filterLabel}>{t[lang].filter}</span>
              <button className={styles.filterBtn} onClick={() => handleFilter("")}>{t[lang].all}</button>
              <button className={styles.filterBtn} onClick={() => handleFilter("Child Psychologist")}>{t[lang].childPsych}</button>
              <button className={styles.filterBtn} onClick={() => handleFilter("Speech Therapist")}>{t[lang].speechTherapist}</button>
              <button className={styles.filterBtn} onClick={() => handleFilter("Special Educator")}>{t[lang].specialEducator}</button>
              <span className={styles.sortLabel}>{t[lang].sort}</span>
              <button className={styles.sortBtn} onClick={() => handleSort("rating")}>{t[lang].rating}</button>
              <button className={styles.sortBtn} onClick={() => handleSort("name")}>{t[lang].az}</button>
            </div>
            <div className={styles.consultantList}>
              {filteredConsultants.map(c => (
                <div key={c.id} className={styles.consultantCard} onClick={() => setSelectedConsultant(c)}>
                  <img src={c.image} alt={c.name} className={styles.consultantImg} />
                  <div className={styles.consultantInfo}>
                    <div className={styles.consultantTitle}>{c.name}</div>
                    <div className={styles.consultantDesignation}>{c.expertise}</div>
                    <div className={styles.consultantIntro}>{c.intro}</div>
                    <div className={styles.consultantRating}>⭐ {c.rating}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                      <button
                        className={styles.reviewBtn}
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedConsultant(c);
                        }}
                      >
                        {t[lang].review}
                      </button>
                      <button
                        className={styles.consultBtn}
                        onClick={e => {
                          e.stopPropagation();
                          openBookingModal(c.name);
                        }}
                      >
                        {t[lang].consult}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.mapWrap}>
            {isLoaded && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={userLocation || center}
                zoom={userLocation ? 12 : 5}
                onLoad={() => {}}
              >
                {filteredConsultants.map(c => (
                  <Marker
                    key={c.id}
                    position={{ lat: c.lat, lng: c.lng }}
                    onClick={() => setSelectedConsultant(c)}
                    icon={{
                      url: c.image,
                      scaledSize: new window.google.maps.Size(48, 48),
                      origin: new window.google.maps.Point(0, 0),
                      anchor: new window.google.maps.Point(24, 24),
                      labelOrigin: new window.google.maps.Point(24, 60),
                    }}
                  />
                ))}
                {userLocation && (
                  <Marker position={userLocation} icon={{ url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png" }} label="You" />
                )}
                {selectedConsultant && (
                  <InfoWindow
                    position={{ lat: selectedConsultant.lat, lng: selectedConsultant.lng }}
                    onCloseClick={() => setSelectedConsultant(null)}
                  >
                    <div className={styles.infoWindow}>
                      <img src={selectedConsultant.image} alt={selectedConsultant.name} className={styles.infoImg} />
                      <div className={styles.infoTitle}>{selectedConsultant.name}</div>
                      <div className={styles.infoDesignation}>{selectedConsultant.expertise}</div>
                      <div className={styles.infoIntro}>{selectedConsultant.intro}</div>
                      <div className={styles.infoRating}>⭐ {selectedConsultant.rating}</div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            )}
          </div>
        </section>
      </div>
      <section className={styles.featuredSection}>
        <div className={styles.featuredSectionInner}>
          <div className={styles.featuredSectionTitle}>{t[lang].featured}</div>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{
              700: { slidesPerView: 2 },
              1100: { slidesPerView: 3 },
              1400: { slidesPerView: 4 },
            }}
            style={{ paddingBottom: '3rem' }}
          >
            {consultants.map(f => (
              <SwiperSlide key={f.id}>
                <div className={styles.featuredCardMain}>
                  <img src={f.image} alt={f.name} className={styles.featuredImgMain} />
                  <div className={styles.featuredNameMain}>{f.name}</div>
                  <div className={styles.featuredDesignationMain}>{f.expertise}</div>
                  <div className={styles.featuredIntroMain}>{f.intro}</div>
                  <div className={styles.featuredRatingMain}>⭐ {f.rating}</div>
                  <button className={styles.featuredBtnMain} onClick={() => openBookingModal(f.name)}>
                    {t[lang].consult}
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      {/* About Section */}
      <section className={styles.aboutSection} id="about">
        <div className={styles.aboutInner}>
          <div className={styles.aboutContent}>
            <h2 className={styles.aboutTitle}>{t[lang].about}</h2>
            <p className={styles.aboutText}>
              <b>{t[lang].objective}</b> <br />
              {t[lang].aboutObj}
            </p>
            <p className={styles.aboutText}>
              {t[lang].aboutDesc}
            </p>
            <ul className={styles.aboutList}>
              <li><FaArrowRight style={{ marginRight: 8, color: '#5a67d8', fontSize: 14, verticalAlign: 'middle' }} />{t[lang].specialized}</li>
              <li><FaArrowRight style={{ marginRight: 8, color: '#5a67d8', fontSize: 14, verticalAlign: 'middle' }} />{t[lang].experienced}</li>
              <li><FaArrowRight style={{ marginRight: 8, color: '#5a67d8', fontSize: 14, verticalAlign: 'middle' }} />{t[lang].marketplace}</li>
              <li><FaArrowRight style={{ marginRight: 8, color: '#5a67d8', fontSize: 14, verticalAlign: 'middle' }} />{t[lang].diversity}</li>
            </ul>
          </div>
          <div className={styles.aboutImages}>
            <img src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80" alt="Inclusive Education" className={styles.aboutImg} />
            <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" alt="Mental Health" className={styles.aboutImg} />
            <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80" alt="Technology in Education" className={styles.aboutImg} />
            <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" alt="Diversity and Inclusion" className={styles.aboutImg} />
          </div>
        </div>
      </section>
      <section className={styles.marketplaceSection} id="marketplace">
        <div className={styles.marketplaceInner}>
          <div className={styles.marketplaceHeader}>
            <h2 className={styles.marketplaceTitle}>{t[lang].marketplaceTitle}</h2>
            <div className={styles.marketplaceFiltersRow}>
              <div className={styles.marketplaceFiltersLeft}>
                <input
                  type="text"
                  placeholder={t[lang].searchKeyword}
                  className={styles.marketplaceSearch}
                  value={marketplaceSearch}
                  onChange={e => setMarketplaceSearch(e.target.value)}
                />
                <select
                  className={styles.marketplaceSelect}
                  value={marketplaceCategory}
                  onChange={e => setMarketplaceCategory(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="course">Courses</option>
                  <option value="book">Books</option>
                  <option value="product">Products</option>
                </select>
              </div>
              <div className={styles.marketplaceFiltersRight}>
                <select
                  className={styles.marketplaceSort}
                  value={marketplaceSort}
                  onChange={e => { setMarketplaceSort(e.target.value); setMarketplacePage(1); }}
                >
                  <option value="popularity">{t[lang].sortPopularity}</option>
                  <option value="price-asc">{t[lang].priceAsc}</option>
                  <option value="price-desc">{t[lang].priceDesc}</option>
                </select>
                <button className={styles.marketplaceViewBtn} onClick={() => setMarketplaceView('grid')} style={{ color: marketplaceView === 'grid' ? '#5a67d8' : '#888' }}>▦</button>
                <button className={styles.marketplaceViewBtn} onClick={() => setMarketplaceView('list')} style={{ color: marketplaceView === 'list' ? '#5a67d8' : '#888' }}>☰</button>
              </div>
            </div>
          </div>
          <div className={marketplaceView === 'grid' ? styles.marketplaceGrid : styles.marketplaceList}>
            {paginatedMarketplace.map(item => (
              <div key={item.id} className={marketplaceView === 'grid' ? styles.marketplaceCard : styles.marketplaceCardList}>
                <img src={item.image} alt={item.title} className={styles.marketplaceImg} />
                <div className={styles.marketplaceCardContent}>
                  <div className={styles.marketplaceCardTitle}>{item.title}</div>
                  <div className={styles.marketplaceCardCategory}>{item.categoryLabel}</div>
                  <div className={styles.marketplaceCardPrice}>₹{item.price}</div>
                  <div className={styles.marketplaceCardDesc}>{item.description}</div>
                  <button className={styles.marketplaceBuyBtn}>{t[lang].buy}</button>
                </div>
              </div>
            ))}
            <div className={styles.marketplacePagination}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={styles.marketplacePageBtn + (marketplacePage === i + 1 ? ' ' + styles.marketplacePageBtnActive : '')}
                  onClick={() => setMarketplacePage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section with Scheduler */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>{t[lang].ctaTitle}</h2>
          <p className={styles.ctaText}>{t[lang].ctaText}</p>
          <button className={styles.ctaBtn} onClick={() => openBookingModal()}>
            {t[lang].bookConsult}
          </button>
        </div>
        {showScheduler && (
          <div className={styles.modalOverlay} onClick={() => setShowScheduler(false)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <button className={styles.modalClose} onClick={() => setShowScheduler(false)}>&times;</button>
              {!bookingSubmitted ? (
                <form className={styles.bookingForm + ' ' + styles.bookingFormGrid} onSubmit={handleBookingSubmit}>
                  <h3 className={styles.bookingTitle}>{t[lang].bookConsult}</h3>
                  {bookingConsultant && (
                    <div className={styles.bookingLabel} style={{ marginBottom: 8, gridColumn: '1 / -1' }}>
                      {t[lang].consultant}: <b>{bookingConsultant}</b>
                    </div>
                  )}
                  <div className={styles.bookingColLeft}>
                    <label className={styles.bookingLabel}>{t[lang].selectDate}</label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={date => setSelectedDate(date)}
                      minDate={new Date()}
                      className={styles.bookingInput}
                      placeholderText={t[lang].chooseDate}
                      required
                    />
                    <label className={styles.bookingLabel}>{t[lang].selectTime}</label>
                    <select
                      className={styles.bookingInput}
                      value={selectedTime}
                      onChange={e => setSelectedTime(e.target.value)}
                      required
                    >
                      <option value="">{t[lang].chooseTimeSlot}</option>
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.bookingColRight}>
                    <label className={styles.bookingLabel}>{t[lang].yourName}</label>
                    <input
                      type="text"
                      className={styles.bookingInput}
                      value={bookingName}
                      onChange={e => setBookingName(e.target.value)}
                      placeholder={t[lang].enterName}
                      required
                    />
                    <label className={styles.bookingLabel}>{t[lang].yourEmail}</label>
                    <input
                      type="email"
                      className={styles.bookingInput}
                      value={bookingEmail}
                      onChange={e => setBookingEmail(e.target.value)}
                      placeholder={t[lang].enterEmail}
                      required
                    />
                  </div>
                  <button type="submit" className={styles.ctaBtn} style={{ marginTop: 16, gridColumn: '1 / -1' }}>
                    {t[lang].submitBooking}
                  </button>
                </form>
              ) : (
                <div className={styles.bookingConfirmation}>
                  <h3 className={styles.bookingTitle}>{t[lang].thankYou}</h3>
                  <p className={styles.bookingText}>{t[lang].consultationBooked} {bookingConsultant && <> {t[lang].with} <b>{bookingConsultant}</b></>} {t[lang].for} <b>{selectedDate && selectedDate.toLocaleDateString()}</b> {t[lang].at} <b>{selectedTime}</b>.<br />{t[lang].weWillContact} <b>{bookingEmail}</b>.</p>
                  <button className={styles.ctaBtn} onClick={() => { setShowScheduler(false); setBookingSubmitted(false); setSelectedDate(null); setSelectedTime(""); setBookingName(""); setBookingEmail(""); setBookingConsultant(null); }} style={{ marginTop: 16 }}>
                    {t[lang].close}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.faqInner}>
          <h2 className={styles.faqTitle}>{t[lang].faq}</h2>
          <div className={styles.faqList}>
            {faqs.map((faq: { q: string; a: string }, idx: number) => (
              <div key={idx} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  aria-expanded={faqOpen === idx}
                  aria-controls={`faq-panel-${idx}`}
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                >
                  {faq.q}
                  <span className={styles.faqIcon}>{faqOpen === idx ? '−' : '+'}</span>
                </button>
                <div
                  id={`faq-panel-${idx}`}
                  className={styles.faqAnswer}
                  style={{ display: faqOpen === idx ? 'block' : 'none' }}
                >
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
