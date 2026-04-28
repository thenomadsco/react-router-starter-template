import { Link } from "react-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import nomadsLogo from "./the nomads logo.jpeg";
import kirtiProfile from "./kirti-shah-profile.jpeg";
import type { Route } from "./+types/home";

// --- HEADERS ---
export function headers() {
  return {
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
  };
}

// --- META ---
export function meta({}: Route.MetaArgs) {
  const title = "The Nomads Co. | Curated Journeys";
  const description = "Personalized premium travel planning by Kirti Shah.";
  const url = "https://thenomadsco.in";
  const ogImage =
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&fm=jpg&w=1200&q=75";

  return [
    { title },
    { name: "description", content: description },

    // Preload the LCP hero image
    {
      tagName: "link",
      rel: "preload",
      as: "image",
      href: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&fm=webp&w=1080&q=70",
      imageSrcSet:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&fm=webp&w=640&q=70 640w, https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&fm=webp&w=1080&q=70 1080w, https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&fm=webp&w=1920&q=70 1920w",
      imageSizes: "100vw",
      fetchPriority: "high",
    },

    // Social previews
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: ogImage },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];
}

// --- ICONS (Zero-Dependency Custom SVGs) ---
const iconDefaults = { size: 24, strokeWidth: 2 };

function IconBase({ size = iconDefaults.size, className, strokeWidth = iconDefaults.strokeWidth, fill = "none", children }: any) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

function MapPin(props: any) { return <IconBase {...props}><path d="M12 21s6-6.2 6-11a6 6 0 0 0-12 0c0 4.8 6 11 6 11z" /><circle cx="12" cy="10" r="2.5" /></IconBase>; }
function Star(props: any) { return <IconBase {...props} fill={props.fill ?? "currentColor"}><path d="M12 3.5 14.7 9l5.8.8-4.2 4.1 1 5.9L12 17l-5.3 2.8 1-5.9L3.5 9.8 9.3 9z" /></IconBase>; }
function Facebook(props: any) { return <IconBase {...props}><path d="M14 8h-2c-1.1 0-2 .9-2 2v2H8v3h2v5h3v-5h2.2l.8-3H13v-1.6c0-.4.3-.7.7-.7H16V8z" /></IconBase>; }
function Instagram(props: any) { return <IconBase {...props}><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></IconBase>; }
function Mail(props: any) { return <IconBase {...props}><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></IconBase>; }
function Phone(props: any) { return <IconBase {...props}><path d="M6.5 4.5h2l1.2 3-2 1.2c.9 2 2.5 3.6 4.5 4.5l1.2-2 3 1.2v2c0 .9-.7 1.6-1.6 1.6-6.3-.5-11.4-5.6-11.8-11.8 0-.9.7-1.6 1.5-1.6z" /></IconBase>; }
function MessageCircle(props: any) { return <IconBase {...props}><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-2.9-.4-4.1-1l-4.4 1.2 1.3-4.1A8.5 8.5 0 1 1 21 11.5z" /><path d="M8 12h.01" /><path d="M12 12h.01" /><path d="M16 12h.01" /></IconBase>; }
function X(props: any) { return <IconBase {...props}><path d="M18 6 6 18" /><path d="M6 6l12 12" /></IconBase>; }
function Calendar(props: any) { return <IconBase {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></IconBase>; }
function ChevronDown(props: any) { return <IconBase {...props}><polyline points="6 9 12 15 18 9" /></IconBase>; }
function Plane(props: any) { return <IconBase {...props}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 5-3.2 3.2-2.3-.8L2 17l4 2 2 4 .8-1.5-.8-2.3L11 16l5 6 1.2-.7c.4-.2.7-.6.6-1.1z" /></IconBase>; }
function Compass(props: any) { return <IconBase {...props}><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></IconBase>; }
function Headphones(props: any) { return <IconBase {...props}><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></IconBase>; }
function MapIcon(props: any) { return <IconBase {...props}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></IconBase>; }
function SlidersHorizontal(props: any) { return <IconBase {...props}><line x1="21" y1="4" x2="14" y2="4" /><line x1="10" y1="4" x2="3" y2="4" /><line x1="21" y1="12" x2="12" y2="12" /><line x1="8" y1="12" x2="3" y2="12" /><line x1="21" y1="20" x2="16" y2="20" /><line x1="12" y1="20" x2="3" y2="20" /><line x1="14" y1="2" x2="14" y2="6" /><line x1="8" y1="10" x2="8" y2="14" /><line x1="16" y1="18" x2="16" y2="22" /></IconBase>; }
function Shield(props: any) { return <IconBase {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></IconBase>; }
function CheckCircle2(props: any) { return <IconBase {...props}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></IconBase>; }
function Sparkles(props: any) { return <IconBase {...props}><path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" /><path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14z" /></IconBase>; }
function ArrowLeft(props: any) { return <IconBase {...props}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></IconBase>; }

// --- HELPER COMPONENTS ---
const OptimizedImage = ({ src, alt, className, priority = false }: { src: string; alt: string; className?: string; priority?: boolean; }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const finalSrc = error ? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&fm=webp&q=55&w=600" : src;

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className ?? ""}`}>
      <img
        src={finalSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        // @ts-ignore
        fetchpriority={priority ? "high" : "auto"}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      />
      {!isLoaded && !error && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
    </div>
  );
};

const revealCallbacks = new Map<Element, () => void>();
let sharedObserver: IntersectionObserver | null = null;
function getObserver() {
  if (typeof window === "undefined") return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          revealCallbacks.get(e.target)?.();
          revealCallbacks.delete(e.target);
          sharedObserver?.unobserve(e.target);
        }
      }),
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
  }
  return sharedObserver;
}

const RevealOnScroll = ({ children, className = "" }: { children: React.ReactNode; className?: string; }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = getObserver();
    if (!obs) { setIsVisible(true); return; }
    revealCallbacks.set(el, () => setIsVisible(true));
    obs.observe(el);
    return () => { revealCallbacks.delete(el); obs.unobserve(el); };
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}>
      {children}
    </div>
  );
};

// --- DATASETS ---
const heroImages = [
  { url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&fm=webp&w=1080&q=70", label: "Taj Mahal, India" },
  { url: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?auto=format&fit=crop&fm=webp&w=1080&q=70", label: "Santorini, Greece" },
  { url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&fm=webp&w=1080&q=70", label: "Eiffel Tower, Paris" },
];

const keyServices = [
  { icon: <Plane className="w-8 h-8 text-blue-600" />, title: "Visa & Flight Support", description: "Hassle-free documentation and booking assistance." },
  { icon: <MapIcon className="w-8 h-8 text-blue-600" />, title: "End-to-End Planning", description: "From itinerary creation to returning home safely." },
  { icon: <Shield className="w-8 h-8 text-blue-600" />, title: "Verified Premium Stays", description: "Handpicked 4 & 5 star accommodations for comfort." },
  { icon: <Headphones className="w-8 h-8 text-blue-600" />, title: "24/7 On-Trip Support", description: "Always just a message away whenever you need us." },
  { icon: <Compass className="w-8 h-8 text-blue-600" />, title: "Curated Local Experiences", description: "Authentic activities beyond standard tourist traps." },
  { icon: <SlidersHorizontal className="w-8 h-8 text-blue-600" />, title: "Flexible Itineraries", description: "Plans that adapt to your pace and preferences." },
];

// FULL RESTORED DESTINATIONS LIST
type Destination = { id: number; title: string; category: string; image: string; tags: string[]; description: string; };

const destinations: Destination[] = [
  // International
  { id: 1, title: "Bali, Indonesia", category: "International", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Tropical", "Beaches", "Culture"], description: "Island of Gods with serene beaches and vibrant culture." },
  { id: 2, title: "Maldives", category: "International", image: "https://commons.wikimedia.org/wiki/Special:FilePath/MaldivesBungalows.jpg?width=480", tags: ["Honeymoon", "Luxury", "Beaches"], description: "Overwater villas and crystal clear turquoise lagoons." },
  { id: 3, title: "Dubai, UAE", category: "International", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Luxury", "City", "Desert"], description: "Futuristic architecture, luxury shopping, and desert safaris." },
  { id: 4, title: "Singapore", category: "International", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["City", "Family", "Modern"], description: "A blend of nature and modernity in a global metropolis." },
  { id: 5, title: "Thailand", category: "International", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Beaches", "Culture", "Nightlife"], description: "Vibrant street life, ornate temples, and tropical beaches." },
  { id: 6, title: "Vietnam", category: "International", image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Nature", "Culture", "Food"], description: "Bustling cities, serene limestone islands, and rich history." },
  { id: 7, title: "Sri Lanka", category: "International", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Srilanka_ella.jpg?width=480", tags: ["Nature", "Wildlife", "Beaches"], description: "Diverse landscapes, wildlife, and ancient Buddhist ruins." },
  { id: 8, title: "Bhutan", category: "International", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Mountains", "Culture", "Peace"], description: "The last great Himalayan kingdom, shrouded in mystery." },
  { id: 9, title: "Europe (Schengen)", category: "International", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["History", "Culture", "Romance"], description: "Explore diverse cultures, history, and architecture across Europe." },
  { id: 10, title: "Australia", category: "International", image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Adventure", "Wildlife", "Beaches"], description: "The Great Barrier Reef, outback adventures, and vibrant cities." },
  { id: 11, title: "New Zealand", category: "International", image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Adventure", "Nature", "Landscapes"], description: "Stunning natural landscapes, from mountains to fjords." },
  { id: 12, title: "Japan", category: "International", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Culture", "Modern", "Food"], description: "A seamless blend of ancient traditions and cutting-edge technology." },
  { id: 13, title: "South Korea", category: "International", image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Culture", "City", "Food"], description: "Dynamic cities, ancient palaces, and trendy pop culture." },
  { id: 14, title: "Turkey", category: "International", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["History", "Culture", "Landscapes"], description: "Where East meets West, featuring rich history and unique landscapes." },
  { id: 15, title: "USA", category: "International", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Grand_Canyon_South_Rim_at_Sunset.jpg?width=480", tags: ["City", "Nature", "Diverse"], description: "Diverse experiences from bustling metropolises to vast national parks." },
  { id: 16, title: "South Africa", category: "International", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Table_mountain_cape_town.jpg?width=480", tags: ["Wildlife", "Adventure", "Nature"], description: "Safari adventures, stunning coastlines, and vibrant culture." },
  { id: 17, title: "Kenya", category: "International", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Wildlife", "Safari", "Nature"], description: "Home of the Great Migration and iconic African wildlife." },
  { id: 18, title: "Tanzania", category: "International", image: "https://commons.wikimedia.org/wiki/Special:FilePath/004_Sunrise_at_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg?width=480", tags: ["Wildlife", "Safari", "Beaches"], description: "Mount Kilimanjaro, Serengeti safaris, and Zanzibar beaches." },

  // India
  { id: 19, title: "Kashmir", category: "India", image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Mountains", "Nature", "Romance"], description: "Paradise on Earth with stunning valleys and Dal Lake." },
  { id: 20, title: "Leh-Ladakh", category: "India", image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Adventure", "Mountains", "Road Trip"], description: "Stark mountain landscapes, monasteries, and high passes." },
  { id: 21, title: "Himachal Pradesh", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Spiti_Valley%2C_Himachal_Pradesh.jpg?width=480", tags: ["Mountains", "Nature", "Adventure"], description: "Scenic hill stations, pine forests, and snow-capped peaks." },
  { id: 22, title: "Uttarakhand", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Valley_of_flowers%2C_Uttarakhand.jpg?width=480", tags: ["Mountains", "Spiritual", "Nature"], description: "Land of Gods, featuring pilgrimage sites and Himalayan vistas." },
  { id: 23, title: "Rajasthan", category: "India", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["History", "Culture", "Desert"], description: "Royal palaces, vibrant culture, and vast desert landscapes." },
  { id: 24, title: "Goa", category: "India", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Beaches", "Nightlife", "Relaxation"], description: "Sun, sand, beaches, and a relaxed coastal vibe." },
  { id: 25, title: "Kerala", category: "India", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Nature", "Backwaters", "Wellness"], description: "God's Own Country with tranquil backwaters and lush greenery." },
  { id: 26, title: "Andaman Islands", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Radhanagar_Beach%2C_Andaman_1.jpg?width=480", tags: ["Beaches", "Islands", "Adventure"], description: "Pristine beaches, clear waters, and water sports." },
  { id: 27, title: "North East India", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kaziranga_National_Park_%2C_Assam.jpg?width=480", tags: ["Nature", "Culture", "Offbeat"], description: "Unexplored beauty, tribal culture, and biodiversity." },
  { id: 28, title: "Sikkim", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kanchenjunga_from_Zuluk%2C_Sikkim.jpg?width=480", tags: ["Mountains", "Nature", "Monasteries"], description: "Home to Kanchenjunga, scenic landscapes, and monasteries." },
  { id: 29, title: "Meghalaya", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Living_Root_Bridge%2C_Meghalaya.jpg?width=480", tags: ["Nature", "Waterfalls", "Offbeat"], description: "Abode of Clouds, known for living root bridges and waterfalls." },
  { id: 30, title: "Arunachal Pradesh", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Tawang_Monastery%2C_Arunachal_Pradesh.jpg?width=480", tags: ["Mountains", "Culture", "Adventure"], description: "Land of the Dawn-Lit Mountains with rich tribal heritage." },
  { id: 31, title: "Karnataka", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Hampi_karnataka.jpg?width=480", tags: ["History", "Nature", "Culture"], description: "Heritage sites like Hampi, coffee plantations in Coorg." },
  { id: 32, title: "Tamil Nadu", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Meenakshi_Amman_Temple%2C_Madurai.jpg?width=480", tags: ["Culture", "Temples", "Beaches"], description: "Land of temples, rich culture, and coastal beauty." },
  { id: 33, title: "Pondicherry", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Beach_Promenade%2C_Pondicherry%2C_India.jpg?width=480", tags: ["Beaches", "French Colony", "Relaxation"], description: "A touch of French culture on the Indian coast." },
  { id: 34, title: "West Bengal", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Victoria_Memorial_Kolkata.jpg?width=480", tags: ["Culture", "History", "Mountains"], description: "Cultural richness of Kolkata to the tea gardens of Darjeeling." },
  { id: 35, title: "Odisha", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Konark_sun_temple%2C_Odisha.jpg?width=480", tags: ["Culture", "Temples", "Beaches"], description: "Known for its ancient temples, beaches, and tribal culture." },
  { id: 36, title: "Gujarat", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Rann_of_Kutch.jpg?width=480", tags: ["Culture", "Wildlife", "White Desert"], description: "Rann of Kutch, Asiatic Lions, and vibrant traditions." },
];

const testimonials = [
  { id: 1, name: "Client Review", location: "", rating: 5, text: `We decided to go on a holiday to Greece.\nWe were 10 of us. The destination was all we were sure of. Rest was chaos.\nIn a large group the nitty gritties, the co ordination and convincing everyone to a workable plan is the worst part if travel planning.\nWe the smart people that we are gave the job to Kirti, a dear dear friend. The headache was hers. We were in the holiday mode that day onwards.\nNeedless to say she did a wonderful job and always. This made us enjoy the much needed and much awaited holiday all the more.\nNomads has never failed to be on point to everything, the reminders the information and looking after everyone’s needs. Keep it up Kirti.\nThank you for this and all the ones we will put you through` },
  { id: 2, name: "Client Review", location: "", rating: 5, text: `Huge thanks for organizing such an incredible last-minute trip to Mauritius for my parents and relatives.\nDespite the short notice, everything was flawlessly planned and perfectly coordinated.\nThe hotels, transfers, and sightseeing were seamless and stress-free.\nMy parents felt well taken care of and absolutely loved the entire experience.\nTruly grateful for your professionalism, dedication, and ability to turn it into such a memorable holiday! 🌴✨` },
];

// =================================================================================
// CHATBOT & INTERACTIVE FUNNEL
// =================================================================================

const NOMADS_WHATSAPP_NUMBER_E164 = "919924399335";

// --- EXISTING CHATBOT (Unchanged) ---
type NomadsIntent = "enquiry" | "change" | "cancel";
type NomadsChatState = { intent?: NomadsIntent; name?: string; phone?: string; destination?: string; dates?: string; bookingRef?: string; details?: string; };
type NomadsMsg = { from: "bot" | "user"; text: string };

function buildNomadsWhatsappText(s: NomadsChatState) {
  const name = (s.name || "").trim() || "—";
  const phone = (s.phone || "").trim() || "—";

  if (s.intent === "enquiry") return `Hi The Nomads Co 👋\nI'm ${name} (${phone}). I'd like to enquire about a trip.\n\nDestination: ${s.destination || "—"}\nDates: ${s.dates || "—"}\n\nDetails:\n${s.details || "—"}`;
  if (s.intent === "change") return `Hi The Nomads Co 👋\nI'm ${name} (${phone}). I want to modify my reservation.\n\nBooking Ref: ${s.bookingRef || "—"}\nNew Destination: ${s.destination || "—"}\nNew Dates: ${s.dates || "—"}\n\nRequest:\n${s.details || "—"}`;
  return `Hi The Nomads Co 👋\nI'm ${name} (${phone}). I want to cancel my reservation.\n\nBooking Ref: ${s.bookingRef || "—"}\n\nReason / Notes:\n${s.details || "—"}`;
}

function nomadsWaLink(text: string) { return `https://wa.me/${NOMADS_WHATSAPP_NUMBER_E164}?text=${encodeURIComponent(text)}`; }
function normalizeNomadsPhone(v: string) { return v.replace(/[^0-9+]/g, ""); }

function NomadsChatbot() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [state, setState] = useState<NomadsChatState>({});
  const [msgs, setMsgs] = useState<NomadsMsg[]>([{ from: "bot", text: "Hey 👋 I’m Nomads Assistant. What do you want to do today? (1/2/3)" }, { from: "bot", text: "1) New enquiry  2) Change reservation  3) Cancel reservation" }]);

  const steps = useMemo(() => {
    const base: any[] = [{ key: "intent", prompt: "Cool — pick 1/2/3 (enquiry/change/cancel).", required: true }, { key: "name", prompt: "What’s your name?", required: true }, { key: "phone", prompt: "Phone number? (WhatsApp preferred)", required: true }];
    const intent = state.intent;
    if (!intent) return base;
    const mid: any[] = [];
    if (intent === "change" || intent === "cancel") mid.push({ key: "bookingRef", prompt: "Booking reference (if you have one). If not, type NA." });
    if (intent === "enquiry" || intent === "change") { mid.push({ key: "destination", prompt: "Which destination?", required: true }); mid.push({ key: "dates", prompt: "What dates? (approx is fine)", required: true }); }
    mid.push({ key: "details", prompt: "Tell me what you want in 1–2 lines.", required: true });
    return [...base, ...mid, { key: "done", prompt: "Done ✅ Tap below to send this on WhatsApp." }];
  }, [state.intent]);

  const current = steps[Math.min(step, steps.length - 1)];
  const whatsappText = useMemo(() => buildNomadsWhatsappText(state), [state]);
  const whatsappUrl = useMemo(() => nomadsWaLink(whatsappText), [whatsappText]);

  const pushBot = (t: string) => setMsgs((m) => [...m, { from: "bot", text: t }]);
  const pushUser = (t: string) => setMsgs((m) => [...m, { from: "user", text: t }]);

  const validate = (key: string, v: string) => {
    v = v.trim();
    if (key === "intent") {
      const s = v.toLowerCase();
      const intent = (s === "1" || s.includes("enq")) ? "enquiry" : (s === "2" || s.includes("change")) ? "change" : (s === "3" || s.includes("cancel")) ? "cancel" : undefined;
      return intent ? { ok: true, value: intent } : { ok: false, err: "Type 1 for Enquiry, 2 for Change, or 3 for Cancel 🙂" };
    }
    if (key === "name" && v.length < 2) return { ok: false, err: "Type your name (2+ letters) 🙂" };
    if (key === "phone" && normalizeNomadsPhone(v).length < 10) return { ok: false, err: "Phone number only here (10+ digits) 🙂" };
    if (current.required && !v) return { ok: false, err: "This can’t be blank 🙂" };
    return { ok: true, value: v };
  };

  const send = () => {
    if (!current || current.key === "done" || !input.trim()) return;
    pushUser(input.trim());
    const res = validate(current.key, input);
    setInput("");
    if (!res.ok) return pushBot(res.err);
    setState((prev) => ({ ...prev, [current.key]: res.value }));
    const next = step + 1;
    setStep(next);
    if (steps[next]?.prompt) pushBot(steps[next].prompt);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!open ? (
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-black text-white font-extrabold px-5 py-4 shadow-2xl hover:-translate-y-1 transition-all">
          <MessageCircle className="w-6 h-6" />
        </button>
      ) : (
        <div className="w-[320px] sm:w-[360px] rounded-2xl shadow-2xl bg-white overflow-hidden border border-black/10">
          <div className="flex items-center justify-between px-4 py-3 bg-black text-white">
            <div className="text-sm font-semibold">Nomads Assistant</div>
            <button onClick={() => setOpen(false)} className="text-lg leading-none">×</button>
          </div>
          <div className="h-[320px] overflow-y-auto px-4 py-3 space-y-3">
            {msgs.map((m, idx) => (
              <div key={idx} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.from === "user" ? "bg-black text-white" : "bg-gray-100 text-gray-900"}`}>{m.text}</div>
              </div>
            ))}
          </div>
          {current?.key !== "done" ? (
            <div className="p-3 border-t border-black/10 flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type here…" className="flex-1 rounded-xl border border-black/10 px-3 py-2 text-sm outline-none" />
              <button onClick={send} className="rounded-xl px-4 py-2 bg-black text-white text-sm">Send</button>
            </div>
          ) : (
            <div className="p-3 border-t border-black/10">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="block text-center rounded-xl px-4 py-3 bg-green-600 text-white text-sm font-semibold">Send on WhatsApp ✅</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- NEW: FOOLPROOF INTERACTIVE DESTINATION FUNNEL ---
function DestinationFunnel({ preselectedDest, onClose }: { preselectedDest?: string, onClose: () => void }) {
  const [step, setStep] = useState(preselectedDest ? 1 : 0);
  
  // Funnel Data State
  const [dest, setDest] = useState(preselectedDest || "");
  const [timeline, setTimeline] = useState("");
  const [travelers, setTravelers] = useState("");
  const [vibe, setVibe] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  // 1. Strict formatting & URI encoding
  const generateWhatsAppLink = () => {
    const payload = `Hi Kirti! 👋 I'm ${name}. I'd love to plan a trip${dest ? ` to ${dest}` : ""}.
    
*Travelers:* ${travelers}
*Timeline:* ${timeline}
*Vibe:* ${vibe}

Can you help me curate some ideas? You can reach me at ${phone}.`;
    
    // 2. Using the official wa.me smart routing protocol
    return `https://wa.me/${NOMADS_WHATSAPP_NUMBER_E164}?text=${encodeURIComponent(payload)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!name || !phone) return;
    
    // 3 & 4. Synchronous window.open strictly tied to the physical button click (Bypasses all pop-up blockers)
    window.open(generateWhatsAppLink(), "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" onClick={onClose} />
      
      {/* Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[420px] flex flex-col animate-fade-up border border-gray-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            {step > (preselectedDest ? 1 : 0) && (
              <button onClick={handleBack} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <span className="text-sm font-semibold tracking-wide text-gray-400 uppercase">Step {step + 1} of {preselectedDest ? 4 : 5}</span>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8 flex-1 flex flex-col justify-center">
          
          {step === 0 && !preselectedDest && (
            <div className="animate-fade-up">
              <h3 className="text-3xl font-bold mb-6 text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif" }}>Where are you dreaming of going?</h3>
              <input 
                type="text" 
                value={dest} 
                onChange={e => setDest(e.target.value)}
                placeholder="e.g. Bali, Paris, or 'Not sure yet!'"
                className="w-full text-lg px-5 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none mb-6"
                autoFocus
                onKeyDown={e => e.key === 'Enter' && dest && handleNext()}
              />
              <button 
                onClick={handleNext}
                disabled={!dest}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl disabled:opacity-50 hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-up">
              <h3 className="text-3xl font-bold mb-6 text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif" }}>When are you planning to travel?</h3>
              <div className="space-y-3">
                {["Within 30 Days", "1-3 Months", "3-6 Months", "Just dreaming for now"].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { setTimeline(opt); handleNext(); }}
                    className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all font-medium ${timeline === opt ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 hover:border-gray-300 text-gray-700'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-up">
              <h3 className="text-3xl font-bold mb-6 text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif" }}>Who is joining you on this journey?</h3>
              <div className="space-y-3">
                {["Solo Adventure", "Couples Retreat", "Family Vacation", "Group of Friends"].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { setTravelers(opt); handleNext(); }}
                    className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all font-medium ${travelers === opt ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 hover:border-gray-300 text-gray-700'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-up">
              <h3 className="text-3xl font-bold mb-6 text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif" }}>What defines your perfect trip?</h3>
              <div className="space-y-3">
                {["Total Relaxation & Beaches", "Adventure & Exploring", "Culture & History", "A mix of everything"].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { setVibe(opt); handleNext(); }}
                    className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all font-medium ${vibe === opt ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 hover:border-gray-300 text-gray-700'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-up">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold mb-2 text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif" }}>Perfect. We know exactly what to do.</h3>
              <p className="text-gray-500 mb-6">Where should we send your curated itinerary ideas?</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full text-lg px-5 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none"
                />
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="WhatsApp Number"
                  className="w-full text-lg px-5 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none"
                />
                <button 
                  type="submit"
                  disabled={!name || !phone}
                  className="w-full py-4 mt-2 bg-[#02A551] text-white font-bold rounded-2xl disabled:opacity-50 hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
                >
                  Send to WhatsApp ✈️
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
      
      {/* Global Style for Funnel Animation */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
}

// =================================================================================
// MAIN COMPONENT
// =================================================================================

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDestinations, setShowDestinations] = useState(false);
  const [activeCategory, setActiveCategory] = useState("International");
  const [heroActiveIndex, setHeroActiveIndex] = useState(0);
  
  // Funnel State
  const [showFunnel, setShowFunnel] = useState(false);
  const [funnelDest, setFunnelDest] = useState("");

  useEffect(() => {
    let id: ReturnType<typeof setInterval>;
    const start = () => { id = setInterval(() => setHeroActiveIndex((p) => (p + 1) % heroImages.length), 5000); };
    const onVis = () => (document.hidden ? clearInterval(id) : start());
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => { clearInterval(id); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredDestinations = destinations.filter((dest) => dest.category === activeCategory);

  const handleDestinationClick = (destinationName: string) => {
    setShowDestinations(false);
    setFunnelDest(destinationName);
    setShowFunnel(true);
  };

  const openGenericFunnel = () => {
    setFunnelDest("");
    setShowFunnel(true);
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-blue-50 via-white to-teal-50 opacity-60" />

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md py-4 shadow-sm border-b border-gray-100" : "bg-white/50 backdrop-blur-sm py-6"}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <img src={nomadsLogo} alt="The Nomads Co." width={40} height={40} loading="eager" className="h-10 w-auto rounded-md shadow-sm" />
            <span className="font-bold tracking-tighter text-lg sm:text-2xl">The Nomads Co.</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection("about")} className="text-sm font-medium hover:text-blue-600 transition-colors">About</button>
            <button onClick={() => scrollToSection("destinations")} className="text-sm font-medium hover:text-blue-600 transition-colors">Destinations</button>
            <button onClick={() => scrollToSection("reviews")} className="text-sm font-medium hover:text-blue-600 transition-colors">Reviews</button>
            <button onClick={() => scrollToSection("contact")} className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">Plan My Trip</button>
          </div>
          <button className="md:hidden z-50 p-2 text-gray-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <div className="space-y-1.5"><span className="block w-6 h-0.5 bg-current"></span><span className="block w-4 h-0.5 bg-current"></span><span className="block w-6 h-0.5 bg-current"></span></div>}
          </button>
        </div>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[100] bg-white flex flex-col pt-24 px-6">
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 text-3xl font-light text-gray-900">×</button>
            <div className="flex flex-col items-center gap-8">
              <button onClick={() => scrollToSection("about")} className="text-2xl font-semibold text-gray-900">About</button>
              <button onClick={() => scrollToSection("destinations")} className="text-2xl font-semibold text-gray-900">Destinations</button>
              <button onClick={() => scrollToSection("reviews")} className="text-2xl font-semibold text-gray-900">Reviews</button>
              <button onClick={() => scrollToSection("contact")} className="px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-full shadow-md hover:bg-blue-700 transition-colors">Plan My Trip</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-[72px] md:pt-[88px] w-full bg-white">
        <div className="w-full relative h-[50vh] md:h-[65vh] lg:h-[75vh] overflow-hidden bg-gray-900">
          {heroImages.map((img, index) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === heroActiveIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
              <div className={`absolute inset-0 transition-transform duration-[1400ms] ease-out ${index === heroActiveIndex ? "scale-[1.03]" : "scale-100"}`}>
                <img src={img.url} srcSet={`${img.url.replace("w=1080", "w=640")} 640w, ${img.url} 1080w, ${img.url.replace("w=1080", "w=1920")} 1920w`} sizes="100vw" alt={img.label} loading={index === 0 ? "eager" : "lazy"} decoding={index === 0 ? "sync" : "async"} width={1080} height={720} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/55" />
              <div className="absolute bottom-14 md:bottom-16 left-1/2 -translate-x-1/2 text-white z-20">
                <div className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 shadow-sm"><span className="text-sm md:text-base font-semibold tracking-wide drop-shadow">{img.label}</span></div>
              </div>
            </div>
          ))}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/25 backdrop-blur-md border border-white/10">
              {heroImages.map((_, index) => (
                <button key={index} onClick={() => setHeroActiveIndex(index)} className={`h-2.5 rounded-full transition-all duration-300 ${index === heroActiveIndex ? "w-8 bg-white" : "w-2.5 bg-white/60 hover:bg-white"}`} />
              ))}
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-8 py-16 md:py-20 text-center relative z-10">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#E6E8EF] rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#02A551] animate-pulse" />
              <span className="text-[#1F2328]/80 text-xs font-semibold tracking-widest uppercase">Premium Travel Experts</span>
            </div>
            <h1 className="mx-auto max-w-4xl text-4xl sm:text-5xl lg:text-6xl leading-tight sm:leading-[1.1] mb-8 text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, letterSpacing: "-0.02em" }}>
              Discover the world <span className="block sm:inline">with </span><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D3191] to-[#242875]">The Nomads Co.</span>
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-[#1F2328]/70 mb-10 max-w-xl mx-auto" style={{ letterSpacing: "0.01em" }}>
              At The Nomads Co., we believe that travel is not just about visiting new places, but about the stories you create and the memories you cherish forever. Whether you dream of walking through ancient streets, relaxing on pristine beaches, or exploring vibrant cultures, we are here to craft the perfect journey just for you.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 sm:px-12 bg-[#FAFAF8] relative">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#EEF0FF] rounded-[2.5rem] rotate-3 transition-transform duration-500 group-hover:rotate-6" />
            <img src={kirtiProfile} alt="Kirti Shah" width={600} height={750} loading="lazy" decoding="async" className="relative w-full aspect-[4/5] object-cover rounded-[2.5rem] shadow-lg" />
          </div>
          <div className="md:pl-2">
            <span className="text-[#2D3191] font-bold text-xs uppercase tracking-widest mb-4 block">The Founder</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2328] mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>Meet Kirti Shah</h2>
            <p className="text-base sm:text-lg text-[#1F2328]/70 leading-relaxed mb-5 max-w-xl">
              Kirti believes that travel should be happy, not stressful. That's why she treats every client like family, personally overseeing every trip to ensure you are safe, comfortable, and having the time of your life.
            </p>
            <p className="text-base sm:text-lg text-[#1F2328]/70 leading-relaxed max-w-xl">
              With over 10 years of experience, we handle visas, flights, and bookings, offering luxury stays at best-value prices with 24/7 support.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <RevealOnScroll className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold tracking-wider mb-4">WHAT WE DO</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Key Services Offered</h2>
          </RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyServices.map((service, index) => (
              <RevealOnScroll key={index} className={`delay-${index * 100}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow h-full border border-gray-100">
                  <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">{service.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Trigger Section */}
      <section id="destinations" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <RevealOnScroll>
            <div onClick={() => setShowDestinations(true)} className="group relative overflow-hidden rounded-[2.5rem] cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 bg-white border border-gray-100">
              <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&fm=webp&w=1080&q=65" alt="World Travel" loading="lazy" decoding="async" width={1080} height={540} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-white/70 z-10" />
              <div className="relative z-20 py-20 px-8 md:py-28 text-center flex flex-col items-center justify-center text-[#1F2328]">
                <Compass className="w-16 h-16 mb-6 opacity-80 group-hover:rotate-45 transition-transform duration-500" />
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Explore Trending Destinations</h2>
                <p className="text-lg md:text-xl text-[#1F2328]/70 max-w-2xl mb-8">Discover our handpicked selection of the world's most captivating spots, from international hotspots to hidden gems across India.</p>
                <button className="px-8 py-3 bg-[#1F2328] text-white font-semibold rounded-full transition-transform group-hover:-translate-y-1 group-hover:shadow-lg flex items-center">Discover Now <ChevronDown className="ml-2 w-5 h-5 group-hover:translate-y-0.5 transition-transform" /></button>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Destinations Popup */}
      {showDestinations && (
        <div className="fixed inset-0 z-50 flex animate-active-up">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDestinations(false)}></div>
          <div className="absolute inset-0 md:inset-10 bg-white md:rounded-[2rem] overflow-hidden flex flex-col shadow-2xl z-10">
            <div className="p-6 md:p-8 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-2xl md:text-3xl font-bold">Choose Your Adventure</h3>
              <button onClick={() => setShowDestinations(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex justify-center p-6 bg-white z-10 border-b border-gray-100 shadow-sm">
              <div className="inline-flex bg-gray-100 rounded-full p-1.5">
                {["International", "India"].map((category) => (
                  <button key={category} onClick={() => setActiveCategory(category)} className={`px-6 py-2.5 rounded-full text-sm md:text-base font-medium transition-all ${activeCategory === category ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>{category} <span className="ml-2 text-xs opacity-70">({destinations.filter((d) => d.category === category).length})</span></button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDestinations.map((dest) => (
                  <div key={dest.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1" onClick={() => handleDestinationClick(dest.title)}>
                    <div className="relative h-56 overflow-hidden">
                      <OptimizedImage src={dest.image} alt={dest.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        {dest.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="text-xs font-bold text-white bg-white/20 backdrop-blur-md px-2 py-1 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{dest.title}</h4>
                      <p className="text-gray-600 text-sm line-clamp-2">{dest.description}</p>
                      <div className="mt-4 pt-4 border-t flex justify-between items-center text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Design This Trip</span>
                        <ChevronDown className="w-4 h-4 -rotate-90" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      <section id="reviews" className="py-24 relative bg-blue-50/50">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <RevealOnScroll className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold tracking-wider mb-4">TESTIMONIALS</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Loved by Travelers</h2>
          </RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <RevealOnScroll key={testimonial.id} className={`delay-${index * 100}`}>
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all h-full flex flex-col relative overflow-hidden border border-gray-100">
                  <div className="flex items-center space-x-1 text-yellow-400 mb-6">{[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="w-5 h-5 fill-current" />))}</div>
                  <p className="text-gray-700 leading-relaxed italic mb-8 flex-grow whitespace-pre-line">"{testimonial.text}"</p>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    {!!testimonial.location && <p className="text-gray-500 text-sm">{testimonial.location}</p>}
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section (Redesigned completely - No tedious forms) */}
      <section id="contact" className="py-20 px-6 sm:px-12 bg-[#EEF0FF] relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <h2 className="text-4xl font-bold text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif" }}>Start Your Journey</h2>
            <p className="text-lg text-[#1F2328]/70">We are ready to craft your perfect trip. Reach out to us directly or launch our interactive planner to get started instantly.</p>
            <div className="space-y-6">
              <a href="tel:+919924399335" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#2D3191] shadow-sm group-hover:scale-110 transition-transform"><Phone size={24} /></div>
                <div><div className="text-sm text-[#1F2328]/50 font-bold">Call / WhatsApp</div><div className="text-lg font-medium text-[#1F2328]">+91 9924399335</div></div>
              </a>
              <a href="mailto:thenomadsco@gmail.com" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#02A551] shadow-sm group-hover:scale-110 transition-transform"><Mail size={24} /></div>
                <div><div className="text-sm text-[#1F2328]/50 font-bold">Email</div><div className="text-lg font-medium text-[#1F2328]">thenomadsco@gmail.com</div></div>
              </a>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#B45309] shadow-sm"><MapPin size={24} /></div>
                <div><div className="text-sm text-[#1F2328]/50 font-bold">Location</div><div className="text-lg font-medium text-[#1F2328]">Vadodara, Gujarat, India</div></div>
              </div>
            </div>
          </div>

          {/* Interactive Planner CTA (Replaced Form) */}
          <div className="lg:col-span-7 bg-white p-10 sm:p-14 rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center text-center border border-gray-100">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Skip the tedious forms.
            </h3>
            <p className="text-lg text-gray-600 mb-10 max-w-md leading-relaxed">
              Design your perfect trip in under 60 seconds with our new interactive planner. We'll send curated options directly to your WhatsApp.
            </p>
            <button 
              onClick={openGenericFunnel} 
              className="px-10 py-5 bg-[#2D3191] text-white text-lg font-bold rounded-2xl hover:bg-[#242875] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              Launch Interactive Planner
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black text-white py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <span className="text-3xl font-bold text-white mb-6 block">The Nomads Co.</span>
              <p className="text-gray-300 pr-6 leading-relaxed mb-8">Crafting unforgettable, personalized travel experiences. Your journey, our expertise. Let's explore the world together.</p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/thenomadsco/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Instagram className="w-5 h-5" /></a>
                <a href="https://www.facebook.com/Thenomadsco/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Facebook className="w-5 h-5" /></a>
                <a href="mailto:thenomadsco@gmail.com" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Mail className="w-5 h-5" /></a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3 font-medium text-gray-400">
                <li><button onClick={() => scrollToSection("about")} className="hover:text-blue-400 transition-colors">About Us</button></li>
                <li><button onClick={() => scrollToSection("destinations")} className="hover:text-blue-400 transition-colors">Destinations</button></li>
                <li><button onClick={() => scrollToSection("reviews")} className="hover:text-blue-400 transition-colors">Reviews</button></li>
                <li><button onClick={() => scrollToSection("contact")} className="hover:text-blue-400 transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Legal</h4>
              <ul className="space-y-3 font-medium text-gray-400">
                <li><Link to="/privacypolicy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 font-medium">
            <p className="text-sm">© {new Date().getFullYear()} The Nomads Co. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Render the new Funnel when state is true */}
      {showFunnel && (
        <DestinationFunnel 
          preselectedDest={funnelDest} 
          onClose={() => setShowFunnel(false)} 
        />
      )}

      {/* Persistent Chatbot */}
      <NomadsChatbot />
    </div>
  );
}
