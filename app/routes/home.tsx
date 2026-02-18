import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import nomadsLogo from "./the nomads logo.jpeg";
import kirtiProfile from "./kirti-shah-profile.jpeg";
import type { Route } from "./+types/home";

// --- META ---
export function meta({}: Route.MetaArgs) {
  return [
    { title: "The Nomads Co. | Curated Journeys" },
    { name: "description", content: "Personalized premium travel planning by Kirti Shah." },
  ];
}

// --- ICONS ---
const iconDefaults = { size: 24, strokeWidth: 2 };

function IconBase({
  size = iconDefaults.size,
  className,
  strokeWidth = iconDefaults.strokeWidth,
  fill = "none",
  children,
}: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function ArrowRight(props: any) { return (<IconBase {...props}><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></IconBase>); }
function ArrowLeft(props: any) { return (<IconBase {...props}><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></IconBase>); }
function BadgeCheck(props: any) { return (<IconBase {...props}><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></IconBase>); }
function CheckCircle2(props: any) { return (<IconBase {...props}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></IconBase>); }
function Facebook(props: any) { return (<IconBase {...props}><path d="M14 8h-2c-1.1 0-2 .9-2 2v2H8v3h2v5h3v-5h2.2l.8-3H13v-1.6c0-.4.3-.7.7-.7H16V8z" /></IconBase>); }
function Instagram(props: any) { return (<IconBase {...props}><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></IconBase>); }
function Mail(props: any) { return (<IconBase {...props}><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></IconBase>); }
function MapPin(props: any) { return (<IconBase {...props}><path d="M12 21s6-6.2 6-11a6 6 0 0 0-12 0c0 4.8 6 11 6 11z" /><circle cx="12" cy="10" r="2.5" /></IconBase>); }
function Menu(props: any) { return (<IconBase {...props}><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></IconBase>); }
function Phone(props: any) { return (<IconBase {...props}><path d="M6.5 4.5h2l1.2 3-2 1.2c.9 2 2.5 3.6 4.5 4.5l1.2-2 3 1.2v2c0 .9-.7 1.6-1.6 1.6-6.3-.5-11.4-5.6-11.8-11.8 0-.9.7-1.6 1.5-1.6z" /></IconBase>); }
function Send(props: any) { return (<IconBase {...props}><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></IconBase>); }
function Sparkles(props: any) { return (<IconBase {...props}><path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" /><path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14z" /></IconBase>); }
function Star(props: any) { return (<IconBase {...props} fill={props.fill ?? "currentColor"}><path d="M12 3.5 14.7 9l5.8.8-4.2 4.1 1 5.9L12 17l-5.3 2.8 1-5.9L3.5 9.8 9.3 9z" /></IconBase>); }
function X(props: any) { return (<IconBase {...props}><path d="M18 6 6 18" /><path d="M6 6l12 12" /></IconBase>); }
function Robot(props: any) { return (<IconBase {...props}><rect width="18" height="10" x="3" y="11" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" x2="8" y1="16" y2="16" /><line x1="16" x2="16" y1="16" y2="16" /></IconBase>); }

// --- ASSETS ---
const logoImage = nomadsLogo;
const FALLBACK_IMG = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&fm=jpg&q=60&w=1200";

// --- DATASETS ---
type Destination = {
  name: string;
  descriptor: string;
  image: string;
  category: "beaches" | "cities" | "adventure" | "honeymoon" | "culture";
  region: "india" | "international";
  desc_short: string;
  best_time: string;
  ideal_days: string;
};

// FULL LIST: 18 INDIA + 18 INTERNATIONAL = 36 TOTAL
const allDestinations: Destination[] = [
  // --- 18 INDIA ---
  { name: "Jammu & Kashmir", descriptor: "Heaven on Earth", image: "https://images.unsplash.com/photo-1632231065530-f5fd55c62846?q=80&w=800", category: "honeymoon", region: "india", desc_short: "Experience the magic of Dal Lake and snow-capped Gulmarg.", best_time: "Apr - Oct", ideal_days: "6 Days" },
  { name: "Kerala", descriptor: "God's Own Country", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800", category: "honeymoon", region: "india", desc_short: "Tranquil backwaters, misty tea gardens, and authentic Ayurveda.", best_time: "Sep - Mar", ideal_days: "6 Days" },
  { name: "Andaman", descriptor: "Blue Waters", image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=800", category: "beaches", region: "india", desc_short: "Pristine beaches, world-class scuba diving, and history.", best_time: "Oct - May", ideal_days: "6 Days" },
  { name: "Ladakh", descriptor: "High Passes", image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=800", category: "adventure", region: "india", desc_short: "Rugged mountains, crystal blue lakes, and ancient monasteries.", best_time: "May - Sep", ideal_days: "7 Days" },
  { name: "Goa", descriptor: "Sun & Sand", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800", category: "beaches", region: "india", desc_short: "Portuguese heritage, vibrant nightlife, and relaxed beaches.", best_time: "Nov - Feb", ideal_days: "4 Days" },
  { name: "Rajasthan", descriptor: "Royal Heritage", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800", category: "culture", region: "india", desc_short: "Land of Kings, grand palaces, and desert safaris.", best_time: "Oct - Mar", ideal_days: "7 Days" },
  { name: "Gujarat", descriptor: "Culture & Rann", image: "https://images.unsplash.com/photo-1642841819300-20ed449c02a1?q=80&w=800", category: "culture", region: "india", desc_short: "The White Desert, Asiatic Lions, and vibrant festivals.", best_time: "Nov - Feb", ideal_days: "5 Days" },
  { name: "Madhya Pradesh", descriptor: "Heart of India", image: "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?q=80&w=800", category: "adventure", region: "india", desc_short: "Tiger reserves, ancient temples of Khajuraho, and forts.", best_time: "Oct - Mar", ideal_days: "6 Days" },
  { name: "Uttar Pradesh", descriptor: "Spiritual Heritage", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800", category: "culture", region: "india", desc_short: "The Taj Mahal, spiritual Varanasi, and historic Lucknow.", best_time: "Oct - Mar", ideal_days: "5 Days" },
  { name: "Himachal", descriptor: "Snow Abode", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800", category: "adventure", region: "india", desc_short: "Pine forests, apple orchards, and snowy peaks of Manali.", best_time: "Mar - Jun", ideal_days: "7 Days" },
  { name: "Meghalaya", descriptor: "Cloud Abode", image: "https://images.unsplash.com/photo-1591016422238-63cb5fb5ca50?q=80&w=800", category: "adventure", region: "india", desc_short: "Living root bridges, waterfalls, and the cleanest village.", best_time: "Oct - May", ideal_days: "5 Days" },
  { name: "Sikkim", descriptor: "Himalayan Gem", image: "https://images.unsplash.com/photo-1631643171709-626f69ca8be0?q=80&w=800", category: "honeymoon", region: "india", desc_short: "Views of Kanchenjunga, monasteries, and frozen lakes.", best_time: "Mar - Jun", ideal_days: "6 Days" },
  { name: "Uttarakhand", descriptor: "Land of Gods", image: "https://images.unsplash.com/photo-1589136777351-94344812280a?q=80&w=800", category: "adventure", region: "india", desc_short: "Rishikesh rafting, Nainital lakes, and Jim Corbett wildlife.", best_time: "Mar - Jun", ideal_days: "6 Days" },
  { name: "Karnataka", descriptor: "Heritage & Hills", image: "https://images.unsplash.com/photo-1582555620953-b413054c2596?q=80&w=800", category: "culture", region: "india", desc_short: "Ancient Hampi ruins, Coorg coffee estates, and Mysore Palace.", best_time: "Oct - Mar", ideal_days: "6 Days" },
  { name: "Tamil Nadu", descriptor: "Temple State", image: "https://images.unsplash.com/photo-1582510003544-bea4e1e9d571?q=80&w=800", category: "culture", region: "india", desc_short: "Great Living Chola Temples, Ooty hills, and Chennai coast.", best_time: "Nov - Feb", ideal_days: "6 Days" },
  { name: "Pondicherry", descriptor: "French Vibes", image: "https://images.unsplash.com/photo-1616053678083-d3434191c015?q=80&w=800", category: "beaches", region: "india", desc_short: "French colonial architecture, Promenade beach, and Auroville.", best_time: "Oct - Mar", ideal_days: "4 Days" },
  { name: "West Bengal", descriptor: "Tea & Culture", image: "https://images.unsplash.com/photo-1571679352932-f32734a3628e?q=80&w=800", category: "culture", region: "india", desc_short: "Darjeeling tea gardens, Kolkata heritage, and Sundarbans.", best_time: "Oct - Mar", ideal_days: "5 Days" },
  { name: "Odisha", descriptor: "Soul of India", image: "https://images.unsplash.com/photo-1629215037478-f6859dc0594f?q=80&w=800", category: "culture", region: "india", desc_short: "Jagannath Temple, Konark Sun Temple, and Chilika Lake.", best_time: "Oct - Mar", ideal_days: "5 Days" },

  // --- 18 INTERNATIONAL ---
  { name: "United States", descriptor: "The American Dream", image: "https://images.unsplash.com/photo-1550565118-3a1498d308cd?q=80&w=800", category: "cities", region: "international", desc_short: "Times Square, Grand Canyon, and Hollywood glam.", best_time: "All Year", ideal_days: "10 Days" },
  { name: "Canada", descriptor: "Nature's Glory", image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=800", category: "adventure", region: "international", desc_short: "Banff National Park, Niagara Falls, and vibrant Toronto.", best_time: "May - Oct", ideal_days: "9 Days" },
  { name: "Mexico", descriptor: "Fiesta & Beach", image: "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?q=80&w=800", category: "beaches", region: "international", desc_short: "Mayan ruins, Tulum beaches, and delicious tacos.", best_time: "Dec - Apr", ideal_days: "8 Days" },
  { name: "United Kingdom", descriptor: "Royalty & History", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800", category: "cities", region: "international", desc_short: "London icons, Scottish highlands, and Harry Potter magic.", best_time: "Apr - Sep", ideal_days: "7 Days" },
  { name: "Switzerland", descriptor: "Alpine Dream", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800", category: "honeymoon", region: "international", desc_short: "Snow-capped peaks, scenic trains, and chocolates.", best_time: "Apr - Oct", ideal_days: "7 Days" },
  { name: "France", descriptor: "Art & Romance", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800", category: "culture", region: "international", desc_short: "Parisian romance, Disneyland fun, and the Riviera.", best_time: "Apr - Oct", ideal_days: "7 Days" },
  { name: "Italy", descriptor: "La Dolce Vita", image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800", category: "culture", region: "international", desc_short: "Venice canals, Roman history, and delicious food.", best_time: "Apr - Oct", ideal_days: "7 Days" },
  { name: "Maldives", descriptor: "Island Paradise", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800", category: "honeymoon", region: "international", desc_short: "Overwater villas, turquoise lagoons, and pure luxury.", best_time: "Nov - Apr", ideal_days: "5 Days" },
  { name: "Indonesia", descriptor: "Tropical Culture", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800", category: "adventure", region: "international", desc_short: "Bali's temples, beaches, and Nusa Penida adventures.", best_time: "Apr - Oct", ideal_days: "7 Days" },
  { name: "Thailand", descriptor: "Beaches & Smiles", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=800", category: "beaches", region: "international", desc_short: "Bangkok shopping, Phuket beaches, and island hopping.", best_time: "Nov - Apr", ideal_days: "7 Days" },
  { name: "Vietnam", descriptor: "Timeless Charm", image: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800", category: "adventure", region: "international", desc_short: "Ha Long Bay cruise, Hoi An lanterns, and street food.", best_time: "Oct - Apr", ideal_days: "7 Days" },
  { name: "Dubai (UAE)", descriptor: "Future Now", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800", category: "cities", region: "international", desc_short: "Skyscrapers, desert safaris, and luxury shopping.", best_time: "Oct - Apr", ideal_days: "6 Days" },
  { name: "Singapore", descriptor: "Urban Garden", image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=800", category: "cities", region: "international", desc_short: "Gardens by the Bay, Sentosa Island, and cultural mix.", best_time: "All Year", ideal_days: "5 Days" },
  { name: "Japan", descriptor: "Tradition & Future", image: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=800", category: "culture", region: "international", desc_short: "Cherry blossoms, Mt. Fuji, and neon-lit Tokyo.", best_time: "Mar - May", ideal_days: "7 Days" },
  { name: "Australia", descriptor: "Great Outback", image: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?q=80&w=800", category: "adventure", region: "international", desc_short: "Sydney Opera House, Gold Coast surf, and kangaroos.", best_time: "Sep - May", ideal_days: "7 Days" },
  { name: "Turkey", descriptor: "East Meets West", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800", category: "culture", region: "international", desc_short: "Hot air balloons in Cappadocia and Istanbul's bazaars.", best_time: "Apr - May", ideal_days: "8 Days" },
  { name: "Greece", descriptor: "Ancient & Blue", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800", category: "honeymoon", region: "international", desc_short: "Santorini sunsets, Mykonos parties, and Athens history.", best_time: "May - Oct", ideal_days: "7 Days" },
  { name: "South Africa", descriptor: "Safari & Sea", image: "https://images.unsplash.com/photo-1553913861-c0fdd65522a5?q=80&w=800", category: "adventure", region: "international", desc_short: "Big 5 Safari, Cape Town sights, and wine tasting.", best_time: "May - Sep", ideal_days: "9 Days" },
];

const categories = ["All", "Beaches", "Cities", "Adventure", "Honeymoon", "Culture"];

const trustFeatures = [
  { icon: CheckCircle2, label: "Visa & Flight Support" },
  { icon: MapPin, label: "End-to-End Planning" },
  { icon: Sparkles, label: "Verified 4 & 5 Star Stays" },
];

const testimonials = [
  {
    name: "Priya & Raj",
    city: "Mumbai",
    image: "https://images.unsplash.com/photo-1623594675959-02360202d4d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHdvbWFuJTIwc21pbGluZ3xlbnwxfHx8fDE3Njk4NTE0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    quote: "We were worried about food in Bali, but The Nomads Co. suggested amazing places. Kirti ma'am made everything so smooth!",
    rating: 5,
  },
  {
    name: "Vikram Patel",
    city: "Bangalore",
    image: "https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMG1hbiUyMGJ1c2luZXNzfGVufDF8fHx8MTc2OTc5NDM1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    quote: "Flight got cancelled, but they sorted it out before we even reached the airport. True 24/7 support.",
    rating: 5,
  },
  {
    name: "The Mehra Family",
    city: "Delhi",
    image: "https://images.unsplash.com/photo-1605381942640-0a262ce59788?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxjb3VwbGUlMjBoYXBweSUyMHBvcnRyYWl0JTIwc21pbGluZ3xlbnwxfHx8fDE3Njk4NTg2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    quote: "The best family trip we've ever had. Hotels, transfers, everything was luxury but great value.",
    rating: 5,
  },
];

// --- STYLES & ANIMATIONS ---
const customStyles = `
  html { scroll-behavior: smooth; }
  @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(40px); } 100% { opacity: 1; transform: translateY(0); } }
  .animate-active-up { animation: fade-in-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
  .animate-ready { opacity: 0; transform: translateY(30px); transition: opacity 0.1s; }
  .animate-float { animation: float 6s ease-in-out infinite; }
  @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
  
  /* Chatbot Styles */
  .chat-slide-in { animation: slideIn 0.3s ease-out forwards; }
  @keyframes slideIn { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
  .typing-dot { animation: typing 1.4s infinite ease-in-out both; }
  .typing-dot:nth-child(1) { animation-delay: -0.32s; }
  .typing-dot:nth-child(2) { animation-delay: -0.16s; }
  @keyframes typing { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
`;

// --- HELPER COMPONENTS ---
const OptimizedImage = ({ src, alt, className, priority = false }: { src: string, alt: string, className?: string, priority?: boolean }) => {
  return (
    <div className="w-full h-full relative overflow-hidden bg-[#F0F0F0]">
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={`w-full h-full object-cover ${className ?? ""}`}
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG; }}
      />
    </div>
  );
};

function RevealOnScroll({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (<div ref={ref} className={`${className} ${isVisible ? "animate-active-up" : "animate-ready"}`} style={{ animationDelay: `${delay}ms` }}>{children}</div>);
}

// =================================================================================
// MAIN COMPONENT
// =================================================================================
export default function Home() {
  const [enquiryDestination, setEnquiryDestination] = useState("");
  const [showDestinationsPopup, setShowDestinationsPopup] = useState(false);

  const handlePlanThis = (destName: string) => {
    setShowDestinationsPopup(false); // Close popup
    setEnquiryDestination(destName); // Set form value
    // Smooth scroll to form
    setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white antialiased selection:bg-[#2D3191]/10 selection:text-[#2D3191]">
      <style>{customStyles}</style>
      <Navigation />
      
      {/* 1. HERO */}
      <Hero />
      
      {/* 2. FOUNDER */}
      <FounderSection />
      
      {/* 3. DESTINATIONS (Clickable Trigger) */}
      <DestinationsTrigger onOpen={() => setShowDestinationsPopup(true)} />
      
      {/* 4. TESTIMONIALS */}
      <StatsSection />
      
      {/* 5. CONTACT FORM + INFO */}
      <ContactSection prefilledDestination={enquiryDestination} />
      
      {/* 6. FOOTER */}
      <Footer />
      
      {/* 7. AI CHATBOT (Replaces WhatsApp) */}
      <ChatWidget />

      {/* 8. DESTINATION POPUP (Full Grid) */}
      {showDestinationsPopup && (
        <DestinationsPopup 
          onClose={() => setShowDestinationsPopup(false)} 
          onPlan={handlePlanThis} 
        />
      )}
    </div>
  );
}

// =================================================================================
// SECTIONS & SUB-COMPONENTS
// =================================================================================

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = isOpen ? "hidden" : ""; }, [isOpen]);
  
  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-[#E6E8EF]">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img src={logoImage} alt="The Nomads Co." className="h-10 w-auto" />
          <span className="font-semibold text-[#1F2328] hidden sm:inline">The Nomads Co.</span>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <button onClick={() => scrollToSection("founder")} className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">About</button>
          <button onClick={() => scrollToSection("destinations")} className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">Destinations</button>
          <button onClick={() => scrollToSection("testimonials")} className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">Reviews</button>
          <button onClick={() => scrollToSection("contact")} className="px-6 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-full hover:bg-[#242875] transition-all">Plan My Trip</button>
        </div>

        <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}><Menu size={24} /></button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden bg-white pt-24 px-6 space-y-6">
          <button className="absolute top-6 right-6" onClick={() => setIsOpen(false)}><X size={24} /></button>
          <button onClick={() => scrollToSection("founder")} className="block text-2xl font-bold text-[#1F2328]">About</button>
          <button onClick={() => scrollToSection("destinations")} className="block text-2xl font-bold text-[#1F2328]">Destinations</button>
          <button onClick={() => scrollToSection("testimonials")} className="block text-2xl font-bold text-[#1F2328]">Reviews</button>
          <button onClick={() => scrollToSection("contact")} className="block text-2xl font-bold text-[#1F2328]">Contact</button>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  const heroImage = "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1920&auto=format&fit=crop"; 
  const image1 = "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800&auto=format&fit=crop"; 
  const image2 = "https://images.unsplash.com/photo-1511739001486-6bfe10ce7859?q=80&w=800&auto=format&fit=crop"; 

  return (
    <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 px-6 sm:px-8 lg:px-12 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-white overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#E7F7EF]/60 rounded-full blur-[100px] opacity-70 animate-float" />
        <div className="absolute bottom-[0%] left-[-10%] w-[500px] h-[500px] bg-[#EEF0FF]/80 rounded-full blur-[80px] opacity-70" style={{ animationDelay: "2s" }} />
      </div>
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div className="order-2 lg:order-1 relative z-10">
            <RevealOnScroll delay={100}>
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#E6E8EF] rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#02A551] animate-pulse" />
                <span className="text-[#1F2328]/80 text-xs font-semibold tracking-widest uppercase">Premium Travel Experts</span>
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll delay={200}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.2] mb-8 text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, letterSpacing: "-0.02em" }}>
                Discover the world <br /> with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D3191] to-[#242875]">The Nomads Co.</span>
              </h1>
            </RevealOnScroll>
            <RevealOnScroll delay={300}>
              <p className="text-base sm:text-lg leading-relaxed text-[#1F2328]/70 mb-10 max-w-xl" style={{ letterSpacing: "0.01em" }}>
                At The Nomads Co., we believe that travel is not just about visiting new places, but about the stories you create and the memories you cherish forever. Whether you dream of walking through ancient streets, relaxing on pristine beaches, or exploring vibrant cultures, we are here to craft the perfect journey just for you. Sit back, relax, and let us handle every detail while you focus on the magic of discovery.
              </p>
            </RevealOnScroll>
            
            <RevealOnScroll delay={500}>
              <div className="mt-4 flex items-center gap-4 text-sm text-[#1F2328]/60">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (<div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">Use</div>))}
                </div>
                <p>Trusted by 1000+ happy families</p>
              </div>
            </RevealOnScroll>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="grid grid-cols-2 gap-4">
              <RevealOnScroll delay={300} className="col-span-2">
                <div className="rounded-2xl shadow-lg border-4 border-white group h-[300px] sm:h-[400px] overflow-hidden">
                  <OptimizedImage src={heroImage} alt="Taj Mahal" className="transition-transform duration-1000 ease-out group-hover:scale-105" priority={true} />
                </div>
              </RevealOnScroll>
              <RevealOnScroll delay={400}>
                <div className="rounded-2xl shadow-lg border-4 border-white group h-[200px] sm:h-[250px] overflow-hidden">
                  <OptimizedImage src={image1} alt="Santorini" className="transition-transform duration-1000 ease-out group-hover:scale-105" />
                </div>
              </RevealOnScroll>
              <RevealOnScroll delay={500}>
                <div className="rounded-2xl shadow-lg border-4 border-white group h-[200px] sm:h-[250px] overflow-hidden">
                  <OptimizedImage src={image2} alt="Eiffel Tower" className="transition-transform duration-1000 ease-out group-hover:scale-105" />
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FounderSection() {
  return (
    <section id="founder" className="py-20 px-6 sm:px-12 bg-[#FAFAF8]">
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="relative group">
          <div className="absolute inset-0 bg-[#EEF0FF] rounded-[2.5rem] rotate-3 transition-transform duration-500 group-hover:rotate-6" />
          <img src={kirtiProfile} alt="Kirti Shah" className="relative w-full aspect-[4/5] object-cover rounded-[2.5rem] shadow-lg" />
        </div>
        <div>
          <span className="text-[#2D3191] font-bold text-xs uppercase tracking-widest mb-4 block">The Founder</span>
          <h2 className="text-4xl font-bold text-[#1F2328] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Meet Kirti Shah</h2>
          <p className="text-lg text-[#1F2328]/70 leading-relaxed mb-6">
            Kirti believes that travel should be happy, not stressful. That's why she treats every client like family, personally overseeing every trip to ensure you are safe, comfortable, and having the time of your life.
          </p>
          <p className="text-lg text-[#1F2328]/70 leading-relaxed mb-6">
             With over 10 years of experience, we handle visas, flights, and bookings, offering luxury stays at best-value prices with 24/7 support.
          </p>
          <div className="grid grid-cols-2 gap-6 mt-8">
            {trustFeatures.map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E7F7EF] flex items-center justify-center text-[#02A551]">
                  <f.icon size={20} />
                </div>
                <span className="text-sm font-medium text-[#1F2328]">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Trigger ---
function DestinationsTrigger({ onOpen }: { onOpen: () => void }) {
  return (
    <section id="destinations" className="py-24 px-6 bg-white flex flex-col items-center justify-center text-center">
      <RevealOnScroll>
        <p className="text-[#2D3191] font-bold text-xs uppercase tracking-widest mb-6">Curated For You</p>
        <button 
          onClick={onOpen}
          className="group relative inline-block text-5xl md:text-7xl lg:text-8xl font-bold text-[#1F2328] hover:text-[#2D3191] transition-colors duration-500"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <span className="relative z-10">EXPLORE TRENDING<br />DESTINATIONS</span>
          <div className="absolute inset-0 bg-[#EEF0FF] rounded-full filter blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 scale-75 group-hover:scale-110" />
          <div className="mt-8 flex justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
             <span className="flex items-center gap-2 text-lg font-medium text-[#2D3191]">Click to view all <ArrowRight size={20}/></span>
          </div>
        </button>
      </RevealOnScroll>
    </section>
  );
}

// --- Full Screen Popup for Destinations ---
function DestinationsPopup({ onClose, onPlan }: { onClose: () => void, onPlan: (name: string) => void }) {
  const [activeRegion, setActiveRegion] = useState<"india" | "international">("international");
  const filtered = allDestinations.filter(d => d.region === activeRegion);

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-active-up">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E8EF] bg-white/90 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif" }}>All Destinations</h3>
            
            {/* Back Button */}
            <button 
                onClick={onClose}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 text-[#1F2328] rounded-full text-sm font-bold hover:bg-gray-200 transition-colors"
            >
                <ArrowLeft size={16} /> Back to Home
            </button>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={28} /></button>
      </div>

      {/* Filters */}
      <div className="py-6 px-6 flex justify-center bg-[#FAFAF8]">
        <div className="inline-flex bg-white p-1.5 rounded-full border border-[#E6E8EF] shadow-sm">
          <button onClick={() => setActiveRegion("india")} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeRegion === "india" ? "bg-[#2D3191] text-white shadow-md" : "text-[#1F2328]/70 hover:bg-gray-50"}`}>🇮🇳 India</button>
          <button onClick={() => setActiveRegion("international")} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeRegion === "international" ? "bg-[#2D3191] text-white shadow-md" : "text-[#1F2328]/70 hover:bg-gray-50"}`}>🌍 International</button>
        </div>
      </div>

      {/* Grid Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-20">
          {filtered.map((dest) => (
            <div key={dest.name} className="group relative h-[350px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300">
               <OptimizedImage src={dest.image} alt={dest.name} className="transition-transform duration-700 group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
               <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-xs font-bold text-white/80 uppercase tracking-wider mb-2 block">{dest.category}</span>
                  <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{dest.name}</h3>
                  <p className="text-white/70 text-sm mb-4 line-clamp-2">{dest.descriptor}</p>
                  
                  <button 
                    onClick={() => onPlan(dest.name)}
                    className="w-full py-2 bg-white/20 backdrop-blur-md rounded-lg text-white text-sm font-bold hover:bg-white hover:text-[#2D3191] transition-colors flex items-center justify-center gap-2"
                  >
                    Quick View & Plan <ArrowRight size={14} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactSection({ prefilledDestination }: { prefilledDestination: string }) {
  // Common style for inputs to ensure black text visibility
  const inputClass = "w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:ring-1 focus:ring-[#2D3191] outline-none text-[#1F2328] placeholder:text-gray-500";

  return (
    <section id="contact" className="py-20 px-6 sm:px-12 bg-[#EEF0FF]">
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-24">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-8">
          <h2 className="text-4xl font-bold text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif" }}>Start Your Journey</h2>
          <p className="text-lg text-[#1F2328]/70">We are ready to craft your perfect trip. Reach out to us directly or fill the form.</p>
          
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

        {/* Form */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl">
          <form action="https://formsubmit.co/thenomadsco@gmail.com" method="POST" className="space-y-6">
            <input type="hidden" name="_subject" value="New Website Inquiry" />
            <input type="hidden" name="_captcha" value="false" />
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1F2328]">Name</label>
                <input type="text" name="name" required className={inputClass} placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1F2328]">Phone</label>
                <input type="tel" name="phone" required className={inputClass} placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1F2328]">Email</label>
                <input type="email" name="email" required className={inputClass} placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1F2328]">Destination</label>
                <input 
                  type="text" 
                  name="destination" 
                  value={prefilledDestination}
                  readOnly={!!prefilledDestination} 
                  className={inputClass}
                  placeholder="Where do you want to go?" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1F2328]">Any specific requirements?</label>
              <textarea name="message" rows={4} className={`${inputClass} resize-none`} placeholder="Travel dates, number of people, budget..." />
            </div>

            <button type="submit" className="w-full py-4 bg-[#2D3191] text-white font-bold rounded-xl hover:bg-[#242875] transition-all shadow-lg flex items-center justify-center gap-2">
              Send Enquiry <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// --- SMART AI CHATBOT (WITH FALLBACK) ---
function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Namaste! 🙏 I am Kirti's AI assistant. How can I help you plan your dream trip today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --------------------------------------------------------
  // 🔑 KEY
  // --------------------------------------------------------
  const GEMINI_API_KEY = "AIzaSyAseoa-cPfc1cDhSg_DdbEtkPW5WOtRJOE"; 

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping, isOpen]);

  // --- LOCAL FALLBACK LOGIC ---
  const getLocalResponse = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("book") || lower.includes("reserve") || lower.includes("price") || lower.includes("cost")) {
      return "For bookings and packages, please fill out the 'Plan My Trip' form below or contact Kirti directly at +91 9924399335 for the best rates!";
    }
    if (lower.includes("bali") || lower.includes("indonesia")) {
      return "Bali is a wonderful choice! We have special packages for beaches, temples, and Nusa Penida tours. Shall I guide you to our enquiry form?";
    }
    if (lower.includes("cancel") || lower.includes("refund")) {
      return "Cancellation policies vary by airline and hotel. Please reach out to our support team on WhatsApp for immediate assistance with existing bookings.";
    }
    return "That sounds like a great plan! To get you the best personalized itinerary, could you please share your details in the enquiry form below? Kirti will get back to you personally.";
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      // 1. Try API Call
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `System: You are 'Ask Kirti', a polite travel assistant for 'The Nomads Co.'. Keep answers under 3 sentences. User: ${userMsg}` }] }]
        })
      });

      const data = await response.json();

      // 2. Check for API Errors or success
      if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
         const aiText = data.candidates[0].content.parts[0].text;
         setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
      } else {
         // API returned an error object (e.g. maintenance, quota, safety) -> USE FALLBACK
         console.warn("AI API Error, switching to fallback:", data);
         const fallbackText = getLocalResponse(userMsg);
         setMessages(prev => [...prev, { role: 'ai', text: fallbackText }]);
      }
    } catch (error) {
      // 3. Network/Fetch Error -> USE FALLBACK
      console.error("Network Error, switching to fallback", error);
      const fallbackText = getLocalResponse(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: fallbackText }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 ${isOpen ? "bg-[#2D3191] text-white" : "bg-white text-[#1F2328]"}`}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isOpen ? "bg-white/20" : "bg-[#2D3191] text-white"}`}>
          {isOpen ? <X size={20} /> : <Robot size={24} />}
        </div>
        <span className="font-bold pr-2">{isOpen ? "Close Chat" : "Ask Kirti AI"}</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-[350px] bg-white rounded-2xl shadow-2xl border border-[#E6E8EF] overflow-hidden flex flex-col chat-slide-in h-[500px]">
          <div className="bg-[#2D3191] p-4 flex items-center gap-3">
             <div className="relative">
               <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"><Robot size={20} /></div>
               <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#02A551] border-2 border-[#2D3191] rounded-full"></div>
             </div>
             <div>
               <h4 className="text-white font-bold text-sm">Ask Kirti</h4>
               <p className="text-white/60 text-xs">Interactive AI • Online</p>
             </div>
          </div>

          <div className="flex-1 bg-[#FAFAF8] p-4 overflow-y-auto space-y-4" ref={scrollRef}>
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? "justify-end" : "justify-start"}`}>
                 <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? "bg-[#2D3191] text-white rounded-tr-sm" : "bg-white border border-[#E6E8EF] text-[#1F2328] rounded-tl-sm shadow-sm"}`}>
                   {m.text}
                 </div>
               </div>
             ))}
             {isTyping && (
               <div className="flex justify-start">
                 <div className="bg-white border border-[#E6E8EF] p-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1">
                   <span className="w-2 h-2 bg-[#2D3191]/40 rounded-full typing-dot" />
                   <span className="w-2 h-2 bg-[#2D3191]/40 rounded-full typing-dot" />
                   <span className="w-2 h-2 bg-[#2D3191]/40 rounded-full typing-dot" />
                 </div>
               </div>
             )}
          </div>

          <div className="p-3 bg-white border-t border-[#E6E8EF] flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about trips..." 
              className="flex-1 bg-[#F0F0F0] rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2D3191] text-black"
            />
            <button 
              onClick={handleSend}
              className="w-10 h-10 bg-[#2D3191] text-white rounded-full flex items-center justify-center hover:bg-[#242875] transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function StatsSection() {
  return (
    <section id="testimonials" className="py-20 px-6 sm:px-12 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif" }}>Happy Families & Travelers</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <RevealOnScroll key={i} delay={i * 100}>
              <div className="bg-white p-8 rounded-2xl border border-[#E6E8EF] shadow-sm hover:shadow-lg transition-all">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} size={16} fill="#02A551" className="text-[#02A551]" />)}</div>
                <p className="text-[#1F2328] italic mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#E6E8EF]"><img src={t.image} alt={t.name} className="w-full h-full object-cover" /></div>
                  <div><h4 className="font-bold text-[#1F2328]">{t.name}</h4><p className="text-sm text-[#1F2328]/60">{t.city}</p></div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[#FAFAF8] text-[#1F2328] py-12 px-6 border-t border-[#E6E8EF]">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>The Nomads Co.</h3>
          <p className="text-sm text-[#1F2328]/60">© {currentYear} All rights reserved.</p>
        </div>
        <div className="flex gap-4">
          <a href="https://www.instagram.com/thenomadsco/" className="p-2 bg-white rounded-full shadow-sm hover:text-[#2D3191]"><Instagram size={20} /></a>
          <a href="https://www.facebook.com/Thenomadsco/" className="p-2 bg-white rounded-full shadow-sm hover:text-[#2D3191]"><Facebook size={20} /></a>
          <a href="mailto:thenomadsco@gmail.com" className="p-2 bg-white rounded-full shadow-sm hover:text-[#2D3191]"><Mail size={20} /></a>
        </div>
        <div className="flex gap-6 text-sm text-[#1F2328]/60">
           <Link to="/privacypolicy" className="hover:text-[#2D3191]">Privacy Policy</Link>
           <Link to="/terms" className="hover:text-[#2D3191]">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
