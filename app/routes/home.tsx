import { Link } from "react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import nomadsLogo from "./the nomads logo.jpeg";
import kirtiProfile from "./kirti-shah-profile.jpeg";
import type { Route } from "./+types/home";

// --- META ---
export function meta({}: Route.MetaArgs) {
  const title = "The Nomads Co. | Curated Journeys";
  const description = "Personalized premium travel planning by Kirti Shah.";
  const url = "https://thenomadsco.in";
  const ogImage = "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2000&q=80";

  return [
    { title },
    { name: "description", content: description },

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

function MapPin(props: any) { return (<IconBase {...props}><path d="M12 21s6-6.2 6-11a6 6 0 0 0-12 0c0 4.8 6 11 6 11z" /><circle cx="12" cy="10" r="2.5" /></IconBase>); }
function Star(props: any) { return (<IconBase {...props} fill={props.fill ?? "currentColor"}><path d="M12 3.5 14.7 9l5.8.8-4.2 4.1 1 5.9L12 17l-5.3 2.8 1-5.9L3.5 9.8 9.3 9z" /></IconBase>); }
function Facebook(props: any) { return (<IconBase {...props}><path d="M14 8h-2c-1.1 0-2 .9-2 2v2H8v3h2v5h3v-5h2.2l.8-3H13v-1.6c0-.4.3-.7.7-.7H16V8z" /></IconBase>); }
function Instagram(props: any) { return (<IconBase {...props}><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></IconBase>); }
function Mail(props: any) { return (<IconBase {...props}><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></IconBase>); }
function Phone(props: any) { return (<IconBase {...props}><path d="M6.5 4.5h2l1.2 3-2 1.2c.9 2 2.5 3.6 4.5 4.5l1.2-2 3 1.2v2c0 .9-.7 1.6-1.6 1.6-6.3-.5-11.4-5.6-11.8-11.8 0-.9.7-1.6 1.5-1.6z" /></IconBase>); }
function MessageCircle(props: any) { return (<IconBase {...props}><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-2.9-.4-4.1-1l-4.4 1.2 1.3-4.1A8.5 8.5 0 1 1 21 11.5z" /><path d="M8 12h.01" /><path d="M12 12h.01" /><path d="M16 12h.01" /></IconBase>); }
function X(props: any) { return (<IconBase {...props}><path d="M18 6 6 18" /><path d="M6 6l12 12" /></IconBase>); }
function Calendar(props: any) { return (<IconBase {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></IconBase>); }
function ChevronDown(props: any) { return (<IconBase {...props}><polyline points="6 9 12 15 18 9" /></IconBase>); }
function Plane(props: any) { return (<IconBase {...props}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 5-3.2 3.2-2.3-.8L2 17l4 2 2 4 .8-1.5-.8-2.3L11 16l5 6 1.2-.7c.4-.2.7-.6.6-1.1z"/></IconBase>); }
function Compass(props: any) { return (<IconBase {...props}><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></IconBase>); }
function Headphones(props: any) { return (<IconBase {...props}><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></IconBase>); }
function MapIcon(props: any) { return (<IconBase {...props}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></IconBase>); }
function SlidersHorizontal(props: any) { return (<IconBase {...props}><line x1="21" y1="4" x2="14" y2="4" /><line x1="10" y1="4" x2="3" y2="4" /><line x1="21" y1="12" x2="12" y2="12" /><line x1="8" y1="12" x2="3" y2="12" /><line x1="21" y1="20" x2="16" y2="20" /><line x1="12" y1="20" x2="3" y2="20" /><line x1="14" y1="2" x2="14" y2="6" /><line x1="8" y1="10" x2="8" y2="14" /><line x1="16" y1="18" x2="16" y2="22" /></IconBase>); }
function Shield(props: any) { return (<IconBase {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></IconBase>); }
function Heart(props: any) { return (<IconBase {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></IconBase>); }

// --- HELPER COMPONENTS ---
const OptimizedImage = ({ src, alt, className, priority = false }: { src: string, alt: string, className?: string, priority?: boolean }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (priority) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setError(true);
    }
  }, [src, priority]);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setError(true);
  const finalSrc = error ? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&fm=jpg&q=60&w=1200" : src;

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className ?? ""}`}>
      <img
        src={finalSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      />
      {!isLoaded && !error && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
    </div>
  );
};

const RevealOnScroll = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-1000 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}>
      {children}
    </div>
  );
};

// --- DATASETS ---
const heroImages = [
  { url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2000&q=80", label: "Taj Mahal, India" },
  { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Santorini%2C_Oia.jpg?width=2400", label: "Santorini, Greece" },
  { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Eiffel_Tower_Paris.JPG?width=2400", label: "Eiffel Tower, Paris" }
];

// ✅ Color reverted to match home(5): primary #2D3191 theme
const keyServices = [
    { icon: <Plane className="w-8 h-8 text-[#2D3191]" />, title: "Visa & Flight Support", description: "Hassle-free documentation and booking assistance." },
    { icon: <MapIcon className="w-8 h-8 text-[#2D3191]" />, title: "End-to-End Planning", description: "From itinerary creation to returning home safely." },
    { icon: <Shield className="w-8 h-8 text-[#2D3191]" />, title: "Verified Premium Stays", description: "Handpicked 4 & 5 star accommodations for comfort." },
    { icon: <Headphones className="w-8 h-8 text-[#2D3191]" />, title: "24/7 On-Trip Support", description: "Always just a message away whenever you need us." },
    { icon: <Compass className="w-8 h-8 text-[#2D3191]" />, title: "Curated Local Experiences", description: "Authentic activities beyond standard tourist traps." },
    { icon: <SlidersHorizontal className="w-8 h-8 text-[#2D3191]" />, title: "Flexible Itineraries", description: "Plans that adapt to your pace and preferences." }
];

type Destination = { id: number; title: string; category: string; image: string; tags: string[]; description: string; };

const destinations: Destination[] = [
  // International
  { id: 1, title: "Bali, Indonesia", category: "International", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80", tags: ["Tropical", "Beaches", "Culture"], description: "Island of Gods with serene beaches and vibrant culture." },
  { id: 2, title: "Maldives", category: "International", image: "https://commons.wikimedia.org/wiki/Special:FilePath/MaldivesBungalows.jpg?width=1600", tags: ["Honeymoon", "Luxury", "Beaches"], description: "Overwater villas and crystal clear turquoise lagoons." },
  { id: 3, title: "Dubai, UAE", category: "International", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80", tags: ["Luxury", "City", "Desert"], description: "Futuristic architecture, luxury shopping, and desert safaris." },
  { id: 4, title: "Singapore", category: "International", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80", tags: ["City", "Family", "Modern"], description: "A blend of nature and modernity in a global metropolis." },
  { id: 5, title: "Thailand", category: "International", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80", tags: ["Beaches", "Culture", "Nightlife"], description: "Vibrant street life, ornate temples, and tropical beaches." },
  { id: 6, title: "Vietnam", category: "International", image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80", tags: ["Nature", "Culture", "Food"], description: "Bustling cities, serene limestone islands, and rich history." },
  { id: 7, title: "Sri Lanka", category: "International", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Srilanka_ella.jpg?width=1600", tags: ["Nature", "Wildlife", "Beaches"], description: "Diverse landscapes, wildlife, and ancient Buddhist ruins." },
  { id: 8, title: "Bhutan", category: "International", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80", tags: ["Mountains", "Culture", "Peace"], description: "The last great Himalayan kingdom, shrouded in mystery." },
  { id: 9, title: "Europe (Schengen)", category: "International", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80", tags: ["History", "Culture", "Romance"], description: "Explore diverse cultures, history, and architecture across Europe." },
  { id: 10, title: "Australia", category: "International", image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=800&q=80", tags: ["Adventure", "Wildlife", "Beaches"], description: "The Great Barrier Reef, outback adventures, and vibrant cities." },
  { id: 11, title: "New Zealand", category: "International", image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=800&q=80", tags: ["Adventure", "Nature", "Landscapes"], description: "Stunning natural landscapes, from mountains to fjords." },
  { id: 12, title: "Japan", category: "International", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80", tags: ["Culture", "Modern", "Food"], description: "A seamless blend of ancient traditions and cutting-edge technology." },
  { id: 13, title: "South Korea", category: "International", image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80", tags: ["Culture", "City", "Food"], description: "Dynamic cities, ancient palaces, and trendy pop culture." },
  { id: 14, title: "Turkey", category: "International", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80", tags: ["History", "Culture", "Landscapes"], description: "Where East meets West, featuring rich history and unique landscapes." },
  { id: 15, title: "USA", category: "International", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Grand_Canyon_South_Rim_at_Sunset.jpg?width=1600", tags: ["City", "Nature", "Diverse"], description: "Diverse experiences from bustling metropolises to vast national parks." },
  { id: 16, title: "South Africa", category: "International", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Table_mountain_cape_town.jpg?width=1600", tags: ["Wildlife", "Adventure", "Nature"], description: "Safari adventures, stunning coastlines, and vibrant culture." },
  { id: 17, title: "Kenya", category: "International", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80", tags: ["Wildlife", "Safari", "Nature"], description: "Home of the Great Migration and iconic African wildlife." },
  { id: 18, title: "Tanzania", category: "International", image: "https://commons.wikimedia.org/wiki/Special:FilePath/004_Sunrise_at_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg?width=1600", tags: ["Wildlife", "Safari", "Beaches"], description: "Mount Kilimanjaro, Serengeti safaris, and Zanzibar beaches." },

  // India
  { id: 19, title: "Kashmir", category: "India", image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80", tags: ["Mountains", "Nature", "Romance"], description: "Paradise on Earth with stunning valleys and Dal Lake." },
  { id: 20, title: "Leh-Ladakh", category: "India", image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80", tags: ["Adventure", "Mountains", "Road Trip"], description: "Stark mountain landscapes, monasteries, and high passes." },
  { id: 21, title: "Himachal Pradesh", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Spiti_Valley%2C_Himachal_Pradesh.jpg?width=1600", tags: ["Mountains", "Nature", "Adventure"], description: "Scenic hill stations, pine forests, and snow-capped peaks." },
  { id: 22, title: "Uttarakhand", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Valley_of_flowers%2C_Uttarakhand.jpg?width=1600", tags: ["Mountains", "Spiritual", "Nature"], description: "Land of Gods, featuring pilgrimage sites and Himalayan vistas." },
  { id: 23, title: "Rajasthan", category: "India", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80", tags: ["History", "Culture", "Desert"], description: "Royal palaces, vibrant culture, and vast desert landscapes." },
  { id: 24, title: "Goa", category: "India", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80", tags: ["Beaches", "Nightlife", "Relaxation"], description: "Sun, sand, beaches, and a relaxed coastal vibe." },
  { id: 25, title: "Kerala", category: "India", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80", tags: ["Nature", "Backwaters", "Wellness"], description: "God's Own Country with tranquil backwaters and lush greenery." },
  { id: 26, title: "Andaman Islands", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Radhanagar_Beach%2C_Andaman_1.jpg?width=1600", tags: ["Beaches", "Islands", "Adventure"], description: "Pristine beaches, clear waters, and water sports." },
  { id: 27, title: "North East India", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kaziranga_National_Park_%2C_Assam.jpg?width=1600", tags: ["Nature", "Culture", "Offbeat"], description: "Unexplored beauty, tribal culture, and biodiversity." },
  { id: 28, title: "Sikkim", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kanchenjunga_from_Zuluk%2C_Sikkim.jpg?width=1600", tags: ["Mountains", "Nature", "Monasteries"], description: "Home to Kanchenjunga, scenic landscapes, and monasteries." },
  { id: 29, title: "Meghalaya", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Living_Root_Bridge%2C_Meghalaya.jpg?width=1600", tags: ["Nature", "Waterfalls", "Offbeat"], description: "Abode of Clouds, known for living root bridges and waterfalls." },
  { id: 30, title: "Arunachal Pradesh", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Tawang_Monastery%2C_Arunachal_Pradesh.jpg?width=1600", tags: ["Mountains", "Culture", "Adventure"], description: "Land of the Dawn-Lit Mountains with rich tribal heritage." },
  { id: 31, title: "Karnataka", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Hampi_karnataka.jpg?width=1600", tags: ["History", "Nature", "Culture"], description: "Heritage sites like Hampi, coffee plantations in Coorg." },
  { id: 32, title: "Tamil Nadu", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Meenakshi_Amman_Temple%2C_Madurai.jpg?width=1600", tags: ["Culture", "Temples", "Beaches"], description: "Land of temples, rich culture, and coastal beauty." },
  { id: 33, title: "Pondicherry", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Beach_Promenade%2C_Pondicherry%2C_India.jpg?width=1600", tags: ["Beaches", "French Colony", "Relaxation"], description: "A touch of French culture on the Indian coast." },
  { id: 34, title: "West Bengal", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Victoria_Memorial_Kolkata.jpg?width=1600", tags: ["Culture", "History", "Mountains"], description: "Cultural richness of Kolkata to the tea gardens of Darjeeling." },
  { id: 35, title: "Odisha", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Konark_sun_temple%2C_Odisha.jpg?width=1600", tags: ["Culture", "Temples", "Beaches"], description: "Known for its ancient temples, beaches, and tribal culture." },
  { id: 36, title: "Gujarat", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Rann_of_Kutch.jpg?width=1600", tags: ["Culture", "Wildlife", "White Desert"], description: "Rann of Kutch, Asiatic Lions, and vibrant traditions." }
];

const testimonials = [
  { id: 1, name: "Priya & Rahul", location: "Mumbai", rating: 5, text: "Kirti planned our honeymoon to Maldives perfectly. Every detail was taken care of, from flights to the amazing water villa. Truly stress-free!", image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 2, name: "Amit Desai", location: "Bangalore", rating: 5, text: "The Nomads Co. helped me plan a solo trip to Vietnam. The itinerary was flexible yet comprehensive. Excellent local recommendations!", image: "https://randomuser.me/api/portraits/men/45.jpg" },
  { id: 3, name: "The Sharma Family", location: "Delhi", rating: 5, text: "A wonderful family vacation to Singapore. Kirti ensured activities for both kids and adults were included. Highly recommended!", image: "https://randomuser.me/api/portraits/women/68.jpg" }
];

// =================================================================================
// MAIN COMPONENT
// =================================================================================



  // --- SIMPLE CHATBOT (guided "AI-style" convo that drafts a WhatsApp message) ---
  type NomadsIntent = "enquiry" | "change" | "cancel";
  type NomadsChatState = {
    intent?: NomadsIntent;
    name?: string;
    phone?: string;
    destination?: string;
    dates?: string;
    bookingRef?: string;
    details?: string;
  };

  type NomadsMsg = { from: "bot" | "user"; text: string };

  const NOMADS_WHATSAPP_NUMBER_E164 = "919924399335"; // no +, no spaces

  function buildNomadsWhatsappText(s: NomadsChatState) {
    const name = (s.name || "").trim() || "—";
    const phone = (s.phone || "").trim() || "—";

    if (s.intent === "enquiry") {
      return `Hi The Nomads Co 👋
  I'm ${name} (${phone}). I'd like to enquire about a trip.

  Destination: ${s.destination || "—"}
  Dates: ${s.dates || "—"}

  Details:
  ${s.details || "—"}`;
    }

    if (s.intent === "change") {
      return `Hi The Nomads Co 👋
  I'm ${name} (${phone}). I want to modify my reservation.

  Booking Ref: ${s.bookingRef || "—"}
  New Destination: ${s.destination || "—"}
  New Dates: ${s.dates || "—"}

  Request:
  ${s.details || "—"}`;
    }

    return `Hi The Nomads Co 👋
  I'm ${name} (${phone}). I want to cancel my reservation.

  Booking Ref: ${s.bookingRef || "—"}

  Reason / Notes:
  ${s.details || "—"}`;
  }

  function nomadsWaLink(text: string) {
    return `https://wa.me/${NOMADS_WHATSAPP_NUMBER_E164}?text=${encodeURIComponent(text)}`;
  }

  function normalizeNomadsPhone(v: string) {
    return v.replace(/[^0-9+]/g, "");
  }

  function NomadsChatbot() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [input, setInput] = useState("");
    const [state, setState] = useState<NomadsChatState>({});
    const [msgs, setMsgs] = useState<NomadsMsg[]>([
      { from: "bot", text: "Hey 👋 I’m Nomads Assistant. What do you want to do today? (1/2/3)" },
      { from: "bot", text: "1) New enquiry  2) Change reservation  3) Cancel reservation" },
    ]);

    const steps = useMemo(() => {
      // Step list changes slightly based on intent (so it doesn't ask irrelevant stuff).
      const base: Array<{ key: keyof NomadsChatState | "done"; prompt: string; required?: boolean }> = [
        { key: "intent", prompt: "Cool — pick 1/2/3 (enquiry/change/cancel).", required: true },
        { key: "name", prompt: "What’s your name?", required: true },
        { key: "phone", prompt: "Phone number? (WhatsApp preferred)", required: true },
      ];

      const intent = state.intent;
      if (!intent) return base;

      const mid: Array<{ key: keyof NomadsChatState | "done"; prompt: string; required?: boolean }> = [];

      if (intent === "change" || intent === "cancel") {
        mid.push({ key: "bookingRef", prompt: "Booking reference (if you have one). If not, type NA." });
      }

      if (intent === "enquiry" || intent === "change") {
        mid.push({ key: "destination", prompt: "Which destination?", required: true });
        mid.push({ key: "dates", prompt: "What dates? (approx is fine)", required: true });
      }

      mid.push({ key: "details", prompt: "Tell me what you want in 1–2 lines.", required: true });

      return [...base, ...mid, { key: "done", prompt: "Done ✅ Tap below to send this on WhatsApp." }];
    }, [state.intent]);

    const current = steps[Math.min(step, steps.length - 1)];

    const whatsappText = useMemo(() => buildNomadsWhatsappText(state), [state]);
    const whatsappUrl = useMemo(() => nomadsWaLink(whatsappText), [whatsappText]);

    const pushBot = (t: string) => setMsgs((m) => [...m, { from: "bot", text: t }]);
    const pushUser = (t: string) => setMsgs((m) => [...m, { from: "user", text: t }]);

    const parseIntent = (v: string): NomadsIntent | undefined => {
      const s = v.trim().toLowerCase();
      if (s === "1" || s.includes("enq")) return "enquiry";
      if (s === "2" || s.includes("change") || s.includes("modify")) return "change";
      if (s === "3" || s.includes("cancel")) return "cancel";
      return undefined;
    };

    const looksLikePhone = (s: string) => {
      const digits = s.replace(/\D/g, "");
      return digits.length >= 10;
    };

    const monthLike = (s: string) =>
      /(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)/i.test(s);

    const validate = (key: typeof current.key, raw: string) => {
      const v = raw.trim();

      if (key === "intent") {
        const intent = parseIntent(v);
        if (!intent) return { ok: false as const, err: "Type 1 for Enquiry, 2 for Change, or 3 for Cancel 🙂" };
        return { ok: true as const, value: intent };
      }

      if (key === "name") {
        // Block obvious non-name junk (numbers/URLs)
        if (!/[a-zA-Z]/.test(v) || v.length < 2) {
          return { ok: false as const, err: "That doesn’t look like a name — type your name (2+ letters) 🙂" };
        }
        return { ok: true as const, value: v };
      }

      if (key === "phone") {
        const norm = normalizeNomadsPhone(v);
        const digits = norm.replace(/^\+/, "").replace(/\D/g, "");
        if (digits.length < 10) return { ok: false as const, err: "That phone looks short — re-check it?" };
        // Avoid people pasting emails/words here
        if (/[a-zA-Z]/.test(norm)) return { ok: false as const, err: "Phone number only here 🙂 (digits with optional +)" };
        return { ok: true as const, value: norm };
      }

      if (key === "bookingRef") {
        if (!v) return { ok: true as const, value: "" };
        if (v.toLowerCase() === "na" || v.toLowerCase() === "n/a") return { ok: true as const, value: "NA" };

        // Booking references are typically short alphanumeric strings
        if (!/^[a-zA-Z0-9_-]{4,24}$/.test(v)) {
          return {
            ok: false as const,
            err: "Booking ref should be 4–24 chars (letters/numbers, optional - or _). Or type NA.",
          };
        }
        return { ok: true as const, value: v };
      }

      if (key === "destination") {
        if (current.required && !v) return { ok: false as const, err: "Destination can’t be blank 🙂" };
        if (looksLikePhone(v)) return { ok: false as const, err: "That looks like a phone number — type a destination name 🙂" };
        if (!/[a-zA-Z]/.test(v) || v.length < 2) {
          return { ok: false as const, err: "Type a destination name (e.g., Dubai / Bali / Kashmir) 🙂" };
        }
        // Keep it permissive but block pure digits
        if (/^\d+$/.test(v)) return { ok: false as const, err: "Destination should be words, not just numbers 🙂" };
        return { ok: true as const, value: v };
      }

      if (key === "dates") {
        if (current.required && !v) return { ok: false as const, err: "Dates can’t be blank 🙂" };
        if (looksLikePhone(v)) return { ok: false as const, err: "That looks like a phone number — type dates (e.g., 10–14 Mar) 🙂" };

        // Accept "10-14 Mar", "March 10", "10/03/2026", "next weekend", etc.
        const hasDigit = /\d/.test(v);
        const hasDatePunct = /[-/]/.test(v);
        const hasRelative = /(today|tomorrow|weekend|next|this|coming)/i.test(v);

        if (!(monthLike(v) || hasRelative || (hasDigit && (hasDatePunct || v.length >= 4)))) {
          return { ok: false as const, err: "Give dates like “10–14 Mar”, “March 10”, or “next weekend” 🙂" };
        }
        return { ok: true as const, value: v };
      }

      if (key === "details") {
        if (current.required && !v) return { ok: false as const, err: "Quick one — please add a short message 🙂" };
        const cleaned = v.replace(/\s+/g, " ").trim();
        if (cleaned.length < 6) return { ok: false as const, err: "A bit more detail please (at least ~6 characters) 🙂" };
        if (/^(hi|hello|hey|test)$/i.test(cleaned)) {
          return { ok: false as const, err: "Tell me what you want (enquiry/change/cancel details) 🙂" };
        }
        return { ok: true as const, value: v };
      }

      if (current.required && !v) return { ok: false as const, err: "Quick one — this can’t be blank 🙂" };
      return { ok: true as const, value: v || "" };
    };

    const send = () => {
      if (!current || current.key === "done") return;
      const userText = input.trim();
      if (!userText) return;

      pushUser(userText);
      const res = validate(current.key, userText);
      setInput("");

      if (!res.ok) {
        pushBot(res.err);
        return;
      }

      setState((prev) => ({ ...prev, [current.key]: res.value } as NomadsChatState));

      const next = step + 1;
      setStep(next);
      const nextStep = steps[Math.min(next, steps.length - 1)];
      if (nextStep?.prompt) pushBot(nextStep.prompt);
    };

    const reset = () => {
      setOpen(false);
      setStep(0);
      setInput("");
      setState({});
      setMsgs([
        { from: "bot", text: "Hey 👋 I’m Nomads Assistant. What do you want to do today? (1/2/3)" },
        { from: "bot", text: "1) New enquiry  2) Change reservation  3) Cancel reservation" },
      ]);
      // reopen with a fresh state if user clicks chat again
      setTimeout(() => setOpen(true), 0);
    };

    return (
      <div className="fixed bottom-6 left-6 z-50 font-sans">
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-black text-white font-extrabold px-5 py-4 shadow-2xl hover:-translate-y-1 transition-all focus:outline-none focus:ring-4 focus:ring-black/10"
            aria-label="Open chat"
            type="button"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="hidden sm:inline">Chat</span>
          </button>
        ) : (
          <div className="w-[320px] sm:w-[360px] rounded-2xl shadow-2xl bg-white overflow-hidden border border-black/10">
            <div className="flex items-center justify-between px-4 py-3 bg-black text-white">
              <div className="text-sm font-semibold">Nomads Assistant</div>
              <div className="flex items-center gap-2">
                <button onClick={reset} className="text-xs opacity-90 hover:opacity-100" type="button">
                  Reset
                </button>
                <button onClick={() => setOpen(false)} className="text-lg leading-none" aria-label="Close chat" type="button">
                  ×
                </button>
              </div>
            </div>

            <div className="h-[320px] overflow-y-auto px-4 py-3 space-y-3">
              {msgs.map((m, idx) => (
                <div key={idx} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      m.from === "user" ? "bg-black text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {current?.key !== "done" ? (
              <div className="p-3 border-t border-black/10 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                  placeholder="Type here…"
                  className="flex-1 rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30"
                />
                <button onClick={send} className="rounded-xl px-4 py-2 bg-black text-white text-sm hover:opacity-90" type="button">
                  Send
                </button>
              </div>
            ) : (
              <div className="p-3 border-t border-black/10 space-y-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center rounded-xl px-4 py-3 bg-green-600 text-white text-sm font-semibold hover:opacity-90"
                >
                  Send on WhatsApp ✅
                </a>
                <details className="text-xs text-gray-600">
                  <summary className="cursor-pointer">Preview message</summary>
                  <pre className="whitespace-pre-wrap mt-2 bg-gray-50 p-2 rounded-xl border border-black/5">
{whatsappText}
                  </pre>
                </details>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDestinations, setShowDestinations] = useState(false);
  const [activeCategory, setActiveCategory] = useState("International");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [heroActiveIndex, setHeroActiveIndex] = useState(0);

  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    email: "",
    destination: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<{ [k: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | { type: "success" | "error"; message: string }>(null);

  const normalizePhone = (value: string) => value.replace(/[^0-9+]/g, "");

  const validateForm = () => {
    const errors: { [k: string]: string } = {};
    const name = formValues.name.trim();
    const phone = normalizePhone(formValues.phone).replace(/^\+/, "");
    const email = formValues.email.trim();
    const destination = formValues.destination.trim();
    const message = formValues.message.trim();

    if (!name) errors.name = "Please enter your name.";
    if (!phone) errors.phone = "Please enter your phone number.";
    else if (phone.length < 10) errors.phone = "Please enter a valid phone number.";
    if (!email) errors.email = "Please enter your email.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Please enter a valid email address.";
    if (!destination) errors.destination = "Please enter a destination.";
    if (!message) errors.message = "Please add a short message.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (field: keyof typeof formValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => {
      if (!prev[field]) return prev;
      const { [field]: _, ...rest } = prev;
      return rest;
    });
    if (submitStatus) setSubmitStatus(null);
  };

  const submitFormAjax = async () => {
    const formData = new FormData();
    formData.append("name", formValues.name);
    formData.append("phone", formValues.phone);
    formData.append("email", formValues.email);
    formData.append("destination", formValues.destination);
    formData.append("message", formValues.message);

    // FormSubmit options
    formData.append("_captcha", "false");
    formData.append("_template", "table");
    formData.append("_subject", "New enquiry via thenomadsco.in");
    formData.append("_replyto", formValues.email);
    formData.append("_url", "https://thenomadsco.in");

    const res = await fetch("https://formsubmit.co/ajax/thenomadsco@gmail.com", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to submit form");
    return res.json();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitStatus(null);

    const ok = validateForm();
    if (!ok) return;

    try {
      setIsSubmitting(true);
      await submitFormAjax();
      setSubmitStatus({ type: "success", message: "Sent! We’ll reach out shortly 🙂" });
      setFormValues({ name: "", phone: "", email: "", destination: "", message: "" });
      setFormErrors({});
    } catch (err) {
      setSubmitStatus({ type: "error", message: "Something went wrong. Please try again, or WhatsApp us directly." });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
        setHeroActiveIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 50); };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredDestinations = destinations.filter((dest) => dest.category === activeCategory);

  const handleDestinationClick = (destinationName: string) => {
    setSelectedDestination(destinationName);
    handleFormChange("destination", destinationName);
    setShowDestinations(false);
    setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-white to-teal-50 opacity-50"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md py-4 shadow-sm border-b border-gray-100" : "bg-white/50 backdrop-blur-sm py-6"}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
             <img src={nomadsLogo} alt="The Nomads Co." className="h-10 w-auto rounded-md shadow-sm" />
             <span className="font-bold tracking-tighter text-lg sm:text-2xl">The Nomads Co.</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection("about")} className="text-sm font-medium hover:text-blue-600 transition-colors">About</button>
            <button onClick={() => scrollToSection("destinations")} className="text-sm font-medium hover:text-blue-600 transition-colors">Destinations</button>
            <button onClick={() => scrollToSection("reviews")} className="text-sm font-medium hover:text-blue-600 transition-colors">Reviews</button>
            <button onClick={() => scrollToSection("contact")} className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">Plan My Trip</button>
          </div>

          <button className="md:hidden z-50 p-2 text-gray-900" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
             {isMenuOpen ? <X size={28} /> : <div className="space-y-1.5"><span className="block w-6 h-0.5 bg-current"></span><span className="block w-4 h-0.5 bg-current"></span><span className="block w-6 h-0.5 bg-current"></span></div>}
          </button>
        </div>

        {isMenuOpen && (
          <div className="fixed inset-0 z-[100] bg-white flex flex-col pt-24 px-6">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 text-3xl font-light text-gray-900"
              aria-label="Close menu"
            >
              ×
            </button>

            <div className="flex flex-col items-center gap-8">
              <button
                onClick={() => {
                  scrollToSection("about");
                  setIsMenuOpen(false);
                }}
                className="text-2xl font-semibold text-gray-900"
              >
                About
              </button>
              <button
                onClick={() => {
                  scrollToSection("destinations");
                  setIsMenuOpen(false);
                }}
                className="text-2xl font-semibold text-gray-900"
              >
                Destinations
              </button>
              <button
                onClick={() => {
                  scrollToSection("reviews");
                  setIsMenuOpen(false);
                }}
                className="text-2xl font-semibold text-gray-900"
              >
                Reviews
              </button>
              <button
                onClick={() => {
                  scrollToSection("contact");
                  setIsMenuOpen(false);
                }}
                className="px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-full shadow-md hover:bg-blue-700 transition-colors"
              >
                Plan My Trip
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Redesigned Edge-to-Edge Carousel */}
      <section className="relative pt-[72px] md:pt-[88px] w-full bg-white">
        {/* Full Width Carousel */}
        <div className="w-full relative h-[50vh] md:h-[65vh] lg:h-[75vh] overflow-hidden">
            {heroImages.map((img, index) => (
                <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === heroActiveIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
                    <div className={`absolute inset-0 transition-transform duration-[1400ms] ease-out ${index === heroActiveIndex ? "scale-[1.03]" : "scale-100"}`}>
                      <OptimizedImage src={img.url} alt={img.label} priority={index === 0} className="w-full h-full object-cover" />
                    </div>

                    {/* Soft overlays for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/55" />

                    {/* Minimal location pill */}
                    <div className="absolute bottom-14 md:bottom-16 left-1/2 -translate-x-1/2 text-white z-20">
                      <div className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 shadow-sm">
                        <span className="text-sm md:text-base font-semibold tracking-wide drop-shadow">{img.label}</span>
                      </div>
                    </div>
                </div>
            ))}

            {/* Simple dot indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/25 backdrop-blur-md border border-white/10">
                {heroImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setHeroActiveIndex(index)}
                    aria-label={`Show ${img.label}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${index === heroActiveIndex ? "w-8 bg-white" : "w-2.5 bg-white/60 hover:bg-white"}`}
                  />
                ))}
              </div>
            </div>
        </div>

        {/* Hero Text Content Below Carousel */}
        <div className="container mx-auto px-4 md:px-8 py-16 md:py-20 text-center relative z-10">
          <RevealOnScroll>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight tracking-tight mb-6">
              Your Next Great <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Adventure</span> Awaits.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10">
              Curating personalized, stress-free journeys for the modern explorer. Discover the world's most captivating destinations with expertly crafted itineraries.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button onClick={() => scrollToSection("contact")} className="px-10 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 inline-flex items-center justify-center group">
                  Start Planning <Calendar className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                </button>
                <a href="tel:+919924399335" aria-label="Call The Nomads Co" className="px-10 py-4 bg-white/90 backdrop-blur-sm text-gray-900 font-bold rounded-full hover:bg-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 inline-flex items-center justify-center border border-gray-200">
                  Call Now <Phone className="ml-2 w-5 h-5" />
                </a>
              </div>
              <div className="flex items-center text-sm font-medium text-gray-500 bg-gray-50/80 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-100">
                <div className="flex -space-x-3 mr-4">
                  {[1, 2, 3, 4].map((i) => (
                    <img key={i} src={`https://randomuser.me/api/portraits/${i % 2 ? "women" : "men"}/${30 + i}.jpg`} alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <span className="text-gray-600 text-xs mt-0.5 block">Trusted by 1000+ families</span>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Founder Section */}
      <section id="about" className="py-20 relative">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <RevealOnScroll className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold tracking-wider mb-4">THE FOUNDER</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Meet Kirti Shah</h2>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <RevealOnScroll className="order-2 md:order-1">
              <h3 className="text-3xl font-bold mb-6 leading-tight">"I believe travel should be personal, not packaged."</h3>
              <div className="space-y-6 text-lg text-gray-600 mb-8">
                <p>With over a decade of experience exploring the globe, I founded The Nomads Co. to bridge the gap between cookie-cutter tours and the desire for authentic, tailored experiences.</p>
                <p>My mission is to handle the complexities of planning so you can focus on the joy of discovery. From securing visas to finding hidden local gems, I'm your dedicated travel partner.</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-px bg-gray-300 flex-grow"></div>
                <span className="font-semibold text-2xl text-blue-600" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>Kirti Shah</span>
                <div className="h-px bg-gray-300 flex-grow"></div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll className="order-1 md:order-2 delay-200">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-200 rounded-[2.5rem] rotate-3 transition-transform duration-500 group-hover:rotate-6" />
                <img src={kirtiProfile} alt="Kirti Shah" className="relative w-full aspect-[4/5] object-cover rounded-[2.5rem] shadow-xl" />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Key Services Section (colors reverted to match home(5)) */}
      <section className="py-20 bg-[#FAFAF8]">
        <div className="container mx-auto px-4 md:px-8">
            <RevealOnScroll className="text-center mb-16">
                <span className="inline-block py-1 px-3 rounded-full bg-[#EEF0FF] text-[#2D3191] text-sm font-semibold tracking-wider mb-4">WHAT WE DO</span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1F2328]">Key Services Offered</h2>
            </RevealOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyServices.map((service, index) => (
                <RevealOnScroll key={index} className={`delay-${index * 100}`}>
                  <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow h-full border border-[#E6E8EF]">
                      <div className="bg-[#EEF0FF] w-16 h-16 rounded-xl flex items-center justify-center mb-6">{service.icon}</div>
                      <h3 className="text-xl font-bold mb-3 text-[#1F2328]">{service.title}</h3>
                      <p className="text-[#1F2328]/70 leading-relaxed">{service.description}</p>
                  </div>
                </RevealOnScroll>
            ))}
            </div>
        </div>
      </section>

      {/* Destinations Trigger Section (title glow reverted to match home(5)) */}
      <section id="destinations" className="py-24">
        <div className="container mx-auto px-4 md:px-8">
            <RevealOnScroll>
                <div onClick={() => setShowDestinations(true)} className="group relative overflow-hidden rounded-[2.5rem] cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-teal-700 opacity-90 z-10"></div>
                    <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80" alt="World Travel" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="relative z-20 py-20 px-8 md:py-28 text-center flex flex-col items-center justify-center text-white">
                        <Compass className="w-16 h-16 mb-6 opacity-80 group-hover:rotate-45 transition-transform duration-500" />

                        {/* ✅ Old-file style glow behind title */}
                        <div className="relative">
                          <h2 className="relative z-10 text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                            Explore Trending Destinations
                          </h2>
                          <div className="absolute inset-0 bg-[#EEF0FF] rounded-full filter blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 scale-75 group-hover:scale-110" />
                        </div>

                        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mb-8">Discover our handpicked selection of the world's most captivating spots, from international hotspots to hidden gems across India.</p>
                        <button className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-full transition-transform group-hover:-translate-y-1 group-hover:shadow-lg flex items-center">
                            Discover Now <ChevronDown className="ml-2 w-5 h-5 group-hover:translate-y-0.5 transition-transform"/>
                        </button>
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
                  <button key={category} onClick={() => setActiveCategory(category)} className={`px-6 py-2.5 rounded-full text-sm md:text-base font-medium transition-all ${activeCategory === category ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
                    {category} <span className="ml-2 text-xs opacity-70">({destinations.filter((d) => d.category === category).length})</span>
                  </button>
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
                        {dest.tags.slice(0, 2).map((tag, index) => <span key={index} className="text-xs font-bold text-white bg-white/20 backdrop-blur-md px-2 py-1 rounded-full">{tag}</span>)}
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{dest.title}</h4>
                      <p className="text-gray-600 text-sm line-clamp-2">{dest.description}</p>
                      <div className="mt-4 pt-4 border-t flex justify-between items-center text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Quick View & Plan</span><ChevronDown className="w-4 h-4 -rotate-90" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials */}
      <section id="reviews" className="py-24 relative bg-blue-50/50">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <RevealOnScroll className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold tracking-wider mb-4">TESTIMONIALS</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Loved by Travelers</h2>
          </RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <RevealOnScroll key={testimonial.id} className={`delay-${index * 100}`}>
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all h-full flex flex-col relative overflow-hidden border border-gray-100">
                  <div className="flex items-center space-x-1 text-yellow-400 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                  </div>
                  <p className="text-gray-700 leading-relaxed italic mb-8 flex-grow">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <img src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full mr-4 object-cover border-2 border-blue-100" />
                    <div><h4 className="font-bold">{testimonial.name}</h4><p className="text-gray-500 text-sm">{testimonial.location}</p></div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <RevealOnScroll className="text-center mb-16">
             <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold tracking-wider mb-4">GET IN TOUCH</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Start Your Journey</h2>
            <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">Tell us about your dream trip, and we'll make it a reality.</p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-start">
            <RevealOnScroll className="lg:col-span-2 space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div>
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">Reach out directly or fill the form. We're eager to hear from you!</p>
              </div>
              <div className="space-y-6">
                <a href="tel:+919924399335" className="flex items-center p-4 rounded-2xl hover:bg-blue-50 transition-colors group">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Phone className="w-5 h-5" /></div>
                  <div><p className="text-sm text-gray-500 font-medium">Call / WhatsApp</p><p className="text-lg font-bold group-hover:text-blue-600 transition-colors">+91 9924399335</p></div>
                </a>
                <a href="mailto:thenomadsco@gmail.com" className="flex items-center p-4 rounded-2xl hover:bg-blue-50 transition-colors group">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Mail className="w-5 h-5" /></div>
                  <div><p className="text-sm text-gray-500 font-medium">Email Us</p><p className="text-lg font-bold group-hover:text-blue-600 transition-colors">thenomadsco@gmail.com</p></div>
                </a>
                <div className="flex items-center p-4 rounded-2xl hover:bg-blue-50 transition-colors group">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors"><MapPin className="w-5 h-5" /></div>
                  <div><p className="text-sm text-gray-500 font-medium">Location</p><p className="text-lg font-bold group-hover:text-blue-600 transition-colors">Vadodara, Gujarat</p></div>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll className="lg:col-span-3 delay-200">
              <form onSubmit={handleSubmit} action="https://formsubmit.co/thenomadsco@gmail.com" method="POST" className="bg-white p-8 md:p-12 rounded-[2rem] shadow-lg border border-gray-100">
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_subject" value="New enquiry via thenomadsco.in" />
                <input type="hidden" name="_url" value="https://thenomadsco.in" />

                <input type="hidden" name="_subject" value="New enquiry via thenomadsco.in" />
                <input type="hidden" name="_url" value="https://thenomadsco.in" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input type="text" id="name" name="name" value={formValues.name} onChange={(e) => handleFormChange("name", e.target.value)} required className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                    <input type="tel" id="phone" name="phone" value={formValues.phone} onChange={(e) => handleFormChange("phone", e.target.value)} required className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input type="email" id="email" name="email" value={formValues.email} onChange={(e) => handleFormChange("email", e.target.value)} required className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="john@example.com" />
                </div>
                <div className="mb-6">
                  <label htmlFor="destination" className="block text-sm font-bold text-gray-700 mb-2">Destination in Mind</label>
                  <input type="text" id="destination" name="destination" defaultValue={selectedDestination} className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g., Maldives, Kerala, Europe..." />
                    {formErrors.destination && <p className="mt-2 text-sm font-semibold text-red-600">{formErrors.destination}</p>}
                </div>
                <div className="mb-8">
                  <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">Trip Details & Requirements</label>
                  <textarea id="message" name="message" rows={4} className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" placeholder="Tell us about your preferences, dates, travelers..."></textarea>
                    {formErrors.message && <p className="mt-2 text-sm font-semibold text-red-600">{formErrors.message}</p>}
                </div>
                {submitStatus && (
                  <div className={`mb-6 rounded-xl px-5 py-4 font-semibold ${submitStatus.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`} role="status">
                    {submitStatus.message}
                  </div>
                )}

                <button type="submit" disabled={isSubmitting} className="w-full px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-xl hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed">{isSubmitting ? "Sending..." : "Send Enquiry"}</button>
              </form>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Footer (reverted to home(5) palette while keeping structure/content same) */}
      <footer className="relative z-10 bg-[#FAFAF8] text-[#1F2328] py-16 border-t border-[#E6E8EF]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <span className="text-3xl font-bold text-[#1F2328] mb-6 block" style={{ fontFamily: "'Playfair Display', serif" }}>The Nomads Co.</span>
              <p className="text-[#1F2328]/70 pr-6 leading-relaxed mb-8">Crafting unforgettable, personalized travel experiences. Your journey, our expertise. Let's explore the world together.</p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/thenomadsco/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:text-[#2D3191] transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.facebook.com/Thenomadsco/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:text-[#2D3191] transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="mailto:thenomadsco@gmail.com" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:text-[#2D3191] transition-all">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#1F2328] mb-6">Quick Links</h4>
              <ul className="space-y-3 font-medium text-[#1F2328]/60">
                <li><button onClick={() => scrollToSection("about")} className="hover:text-[#2D3191] transition-colors">About Us</button></li>
                <li><button onClick={() => scrollToSection("destinations")} className="hover:text-[#2D3191] transition-colors">Destinations</button></li>
                <li><button onClick={() => scrollToSection("reviews")} className="hover:text-[#2D3191] transition-colors">Reviews</button></li>
                <li><button onClick={() => scrollToSection("contact")} className="hover:text-[#2D3191] transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#1F2328] mb-6">Legal</h4>
              <ul className="space-y-3 font-medium text-[#1F2328]/60">
                <li><Link to="/privacypolicy" className="hover:text-[#2D3191] transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-[#2D3191] transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#E6E8EF] pt-8 flex flex-col md:flex-row justify-between items-center text-[#1F2328]/60 font-medium">
            <p className="text-sm">© {new Date().getFullYear()} The Nomads Co. All rights reserved.</p>
            <p className="text-sm mt-4 md:mt-0 flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500" /> in India
            </p>
          </div>
        </div>
      </footer>

      <NomadsChatbot />
    </div>
  );
}
