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
function IconBase({ size = iconDefaults.size, className, strokeWidth = iconDefaults.strokeWidth, fill = "none", children }: any) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>);
}
function ArrowRight(props: any) { return (<IconBase {...props}><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></IconBase>); }
function X(props: any) { return (<IconBase {...props}><path d="M18 6 6 18" /><path d="M6 6l12 12" /></IconBase>); }
function MapPin(props: any) { return (<IconBase {...props}><path d="M12 21s6-6.2 6-11a6 6 0 0 0-12 0c0 4.8 6 11 6 11z" /><circle cx="12" cy="10" r="2.5" /></IconBase>); }
function Phone(props: any) { return (<IconBase {...props}><path d="M6.5 4.5h2l1.2 3-2 1.2c.9 2 2.5 3.6 4.5 4.5l1.2-2 3 1.2v2c0 .9-.7 1.6-1.6 1.6-6.3-.5-11.4-5.6-11.8-11.8 0-.9.7-1.6 1.5-1.6z" /></IconBase>); }
function Mail(props: any) { return (<IconBase {...props}><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></IconBase>); }
function Send(props: any) { return (<IconBase {...props}><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></IconBase>); }
function CheckCircle2(props: any) { return (<IconBase {...props}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></IconBase>); }
function Sparkles(props: any) { return (<IconBase {...props}><path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" /><path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14z" /></IconBase>); }
function Facebook(props: any) { return (<IconBase {...props}><path d="M14 8h-2c-1.1 0-2 .9-2 2v2H8v3h2v5h3v-5h2.2l.8-3H13v-1.6c0-.4.3-.7.7-.7H16V8z" /></IconBase>); }
function Instagram(props: any) { return (<IconBase {...props}><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></IconBase>); }
function Menu(props: any) { return (<IconBase {...props}><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></IconBase>); }
// WhatsApp Icon
function WhatsApp(props: any) {
  return (
    <IconBase {...props} fill="currentColor" strokeWidth={0}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </IconBase>
  );
}

// --- DATASET: DESTINATIONS ---
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

const allDestinations: Destination[] = [
  // --- INDIA ---
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

  // --- INTERNATIONAL ---
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
];

const categories = ["All", "Beaches", "Cities", "Adventure", "Honeymoon", "Culture"];

const trustFeatures = [
  { icon: CheckCircle2, label: "Visa & Flight Support" },
  { icon: MapPin, label: "End-to-End Planning" },
  { icon: Sparkles, label: "Verified 4 & 5 Star Stays" },
];

// --- STYLES ---
const customStyles = `
  html { scroll-behavior: smooth; }
  @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(40px); } 100% { opacity: 1; transform: translateY(0); } }
  .animate-active-up { animation: fade-in-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
  .animate-ready { opacity: 0; transform: translateY(30px); transition: opacity 0.1s; }
`;

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

// --- MAIN COMPONENT ---
export default function Home() {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [enquiryDestination, setEnquiryDestination] = useState("");

  const handlePlanThis = (destName: string) => {
    setSelectedDestination(null); // Close modal
    setEnquiryDestination(destName); // Set form value
    // Smooth scroll to form
    document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white antialiased selection:bg-[#2D3191]/10 selection:text-[#2D3191]">
      <style>{customStyles}</style>
      <Navigation />
      <Hero />
      <FounderSection />
      <DestinationsGrid 
        onSelect={(d) => setSelectedDestination(d)} 
      />
      <EnquiryForm prefilledDestination={enquiryDestination} />
      <Footer />
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/919924399335?text=Hi%20Kirti!%20I'm%20interested%20in%20planning%20a%20trip..." 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-2"
      >
        <span className="hidden md:block bg-white text-[#1F2328] text-sm font-medium px-4 py-2 rounded-full shadow-lg border border-[#E6E8EF] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Ask Kirti
        </span>
        <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
          <WhatsApp size={32} color="white" />
        </div>
      </a>

      {/* Destination Modal */}
      {selectedDestination && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedDestination(null)} />
          <div className="relative bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-active-up">
            <button 
              onClick={() => setSelectedDestination(null)} 
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="w-full md:w-1/2 h-64 md:h-auto">
              <img src={selectedDestination.image} alt={selectedDestination.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
              <span className="text-[#2D3191] font-bold text-xs uppercase tracking-widest mb-2">{selectedDestination.region} • {selectedDestination.category}</span>
              <h3 className="text-3xl font-bold text-[#1F2328] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{selectedDestination.name}</h3>
              <p className="text-[#1F2328]/70 leading-relaxed mb-6">{selectedDestination.desc_short}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#F7F6F1] p-3 rounded-xl border border-[#E6E8EF]">
                  <p className="text-xs text-[#1F2328]/50 uppercase font-bold">Best Time</p>
                  <p className="text-[#1F2328] font-medium">{selectedDestination.best_time}</p>
                </div>
                <div className="bg-[#F7F6F1] p-3 rounded-xl border border-[#E6E8EF]">
                  <p className="text-xs text-[#1F2328]/50 uppercase font-bold">Ideal Duration</p>
                  <p className="text-[#1F2328] font-medium">{selectedDestination.ideal_days}</p>
                </div>
              </div>

              <button 
                onClick={() => handlePlanThis(selectedDestination.name)}
                className="w-full py-4 bg-[#2D3191] text-white font-bold rounded-xl hover:bg-[#242875] transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5"
              >
                Get Quote for {selectedDestination.name} <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-SECTIONS ---

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
          <button onClick={() => scrollToSection("destinations")} className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">Destinations</button>
          <button onClick={() => scrollToSection("founder")} className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">About</button>
          <button onClick={() => scrollToSection("enquire")} className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">Contact</button>
          <button onClick={() => scrollToSection("enquire")} className="px-6 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-full hover:bg-[#242875] transition-all">Plan My Trip</button>
        </div>

        <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}><Menu size={24} /></button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden bg-white pt-24 px-6 space-y-6">
          <button className="absolute top-6 right-6" onClick={() => setIsOpen(false)}><X size={24} /></button>
          <button onClick={() => scrollToSection("destinations")} className="block text-2xl font-bold text-[#1F2328]">Destinations</button>
          <button onClick={() => scrollToSection("founder")} className="block text-2xl font-bold text-[#1F2328]">About</button>
          <button onClick={() => scrollToSection("enquire")} className="block text-2xl font-bold text-[#1F2328]">Contact</button>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  const heroImage = "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1920&auto=format&fit=crop"; // Taj Mahal
  
  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <img src={heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <RevealOnScroll>
          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Discover the world <br/> with <span className="text-[#a5f3fc]">The Nomads Co.</span>
          </h1>
        </RevealOnScroll>
        <RevealOnScroll delay={200}>
          <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
            Travel is not just about moving; it's about being moved. From the silent valleys of the Himalayas to the vibrant streets of Paris, we craft journeys that become stories you'll tell forever. Sit back, and let us handle the details.
          </p>
        </RevealOnScroll>
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

function DestinationsGrid({ onSelect }: { onSelect: (d: Destination) => void }) {
  const [activeRegion, setActiveRegion] = useState<"india" | "international">("international");
  const filtered = allDestinations.filter(d => d.region === activeRegion);

  return (
    <section id="destinations" className="py-20 px-6 sm:px-12 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1F2328] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Trending Destinations</h2>
          <div className="inline-flex bg-[#F7F6F1] p-1.5 rounded-full border border-[#E6E8EF]">
            <button onClick={() => setActiveRegion("india")} className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${activeRegion === "india" ? "bg-[#2D3191] text-white shadow-md" : "text-[#1F2328]/70"}`}>🇮🇳 India</button>
            <button onClick={() => setActiveRegion("international")} className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${activeRegion === "international" ? "bg-[#2D3191] text-white shadow-md" : "text-[#1F2328]/70"}`}>🌍 International</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map((dest, i) => (
            <RevealOnScroll key={dest.name} delay={i * 50}>
              <div 
                onClick={() => onSelect(dest)}
                className="group cursor-pointer relative h-[400px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-xs font-bold text-white/80 uppercase tracking-wider mb-2 block">{dest.category}</span>
                  <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{dest.name}</h3>
                  <p className="text-white/70 text-sm mb-4 line-clamp-2">{dest.descriptor}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold group-hover:bg-white group-hover:text-[#2D3191] transition-colors">
                    Quick View <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function EnquiryForm({ prefilledDestination }: { prefilledDestination: string }) {
  return (
    <section id="enquire" className="py-20 px-6 sm:px-12 bg-[#EEF0FF]">
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-24">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-8">
          <h2 className="text-4xl font-bold text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif" }}>Start Your Journey</h2>
          <p className="text-lg text-[#1F2328]/70">We are ready to craft your perfect trip. Reach out to us directly or fill the form.</p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#2D3191] shadow-sm"><Phone size={24} /></div>
              <div><div className="text-sm text-[#1F2328]/50 font-bold">Call / WhatsApp</div><div className="text-lg font-medium text-[#1F2328]">+91 9924399335</div></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#02A551] shadow-sm"><Mail size={24} /></div>
              <div><div className="text-sm text-[#1F2328]/50 font-bold">Email</div><div className="text-lg font-medium text-[#1F2328]">thenomadsco@gmail.com</div></div>
            </div>
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
                <input type="text" name="name" required className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:ring-1 focus:ring-[#2D3191] outline-none" placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1F2328]">Phone</label>
                <input type="tel" name="phone" required className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:ring-1 focus:ring-[#2D3191] outline-none" placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1F2328]">Email</label>
                <input type="email" name="email" required className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:ring-1 focus:ring-[#2D3191] outline-none" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1F2328]">Destination</label>
                <input 
                  type="text" 
                  name="destination" 
                  defaultValue={prefilledDestination} 
                  className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:ring-1 focus:ring-[#2D3191] outline-none" 
                  placeholder="Where do you want to go?" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1F2328]">Any specific requirements?</label>
              <textarea name="message" rows={4} className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:ring-1 focus:ring-[#2D3191] outline-none resize-none" placeholder="Travel dates, number of people, budget..." />
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
      </div>
    </footer>
  );
}
