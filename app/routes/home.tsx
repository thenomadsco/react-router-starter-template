import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import nomadsLogo from "./the nomads logo.jpeg";
import type { Route } from "./+types/home";

// --- Icons & Assets ---
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
function BadgeCheck(props: any) { return (<IconBase {...props}><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></IconBase>); }
function CheckCircle2(props: any) { return (<IconBase {...props}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></IconBase>); }
function Facebook(props: any) { return (<IconBase {...props}><path d="M14 8h-2c-1.1 0-2 .9-2 2v2H8v3h2v5h3v-5h2.2l.8-3H13v-1.6c0-.4.3-.7.7-.7H16V8z" /></IconBase>); }
function Instagram(props: any) { return (<IconBase {...props}><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></IconBase>); }
function Mail(props: any) { return (<IconBase {...props}><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></IconBase>); }
function MapPin(props: any) { return (<IconBase {...props}><path d="M12 21s6-6.2 6-11a6 6 0 0 0-12 0c0 4.8 6 11 6 11z" /><circle cx="12" cy="10" r="2.5" /></IconBase>); }
function Menu(props: any) { return (<IconBase {...props}><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></IconBase>); }
function Phone(props: any) { return (<IconBase {...props}><path d="M6.5 4.5h2l1.2 3-2 1.2c.9 2 2.5 3.6 4.5 4.5l1.2-2 3 1.2v2c0 .9-.7 1.6-1.6 1.6-6.3-.5-11.4-5.6-11.8-11.8 0-.9.7-1.6 1.5-1.6z" /></IconBase>); }
function Sparkles(props: any) { return (<IconBase {...props}><path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" /><path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14z" /></IconBase>); }
function Star(props: any) { return (<IconBase {...props} fill={props.fill ?? "currentColor"}><path d="M12 3.5 14.7 9l5.8.8-4.2 4.1 1 5.9L12 17l-5.3 2.8 1-5.9L3.5 9.8 9.3 9z" /></IconBase>); }

const logoImage = nomadsLogo;

// --- DATASET ---
type Destination = {
  name: string;
  descriptor: string;
  image: string;
  category: "beaches" | "cities" | "adventure" | "honeymoon";
  region: "india" | "international";
  link?: string;
};

const allDestinations: Destination[] = [
  // --- INDIA (Fixed broken images + requested updates) ---
  { 
    name: "Jammu & Kashmir", 
    descriptor: "Heaven on Earth", 
    image: "https://images.unsplash.com/photo-1632231065530-f5fd55c62846?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000", 
    category: "honeymoon", 
    region: "india" 
  },
  { 
    name: "Kerala", 
    descriptor: "God's Own Country", 
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop", 
    category: "honeymoon", 
    region: "india" 
  },
  { 
    name: "Andaman & Nicobar", 
    descriptor: "Blue Waters & Coral Reefs", 
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=800&auto=format&fit=crop", 
    category: "beaches", 
    region: "india" 
  },
  { 
    name: "Ladakh", 
    descriptor: "Land of High Passes", 
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=800&auto=format&fit=crop", 
    category: "adventure", 
    region: "india" 
  },
  { 
    name: "Goa", 
    descriptor: "Beaches & Susegad Life", 
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop", 
    category: "beaches", 
    region: "india" 
  },
  { 
    name: "Rajasthan", 
    descriptor: "Land of Kings", 
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800&auto=format&fit=crop", 
    category: "cities", 
    region: "india" 
  },
  { 
    name: "Gujarat", 
    descriptor: "Heritage & Culture", 
    image: "https://images.unsplash.com/photo-1642841819300-20ed449c02a1?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3VqYXJhdHxlbnwwfHwwfHx8MA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000", 
    category: "adventure", 
    region: "india" 
  },
  { 
    name: "Madhya Pradesh", 
    descriptor: "Heart of Incredible India", 
    image: "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?q=80&w=800&auto=format&fit=crop", 
    category: "adventure", 
    region: "india" 
  },
  { 
    name: "Uttar Pradesh", 
    descriptor: "Spiritual & Timeless", 
    image: "https://images.unsplash.com/photo-1748433069358-831b8a154c71?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000", 
    category: "cities", 
    region: "india" 
  },
  { 
    name: "Himachal Pradesh", 
    descriptor: "Abode of Snow", 
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop", 
    category: "adventure", 
    region: "india" 
  },
  { 
    name: "Meghalaya", 
    descriptor: "Abode of Clouds", 
    image: "https://images.unsplash.com/photo-1742494267580-e026d3737f65?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000", 
    category: "adventure", 
    region: "india" 
  },
  { 
    name: "Sikkim", 
    descriptor: "Organic Mystical Land", 
    image: "https://images.unsplash.com/photo-1631643171709-626f69ca8be0?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000", 
    category: "honeymoon", 
    region: "india" 
  },

  // --- INTERNATIONAL (Fixed broken images) ---
  { name: "United Kingdom", descriptor: "Royalty & History", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop", category: "cities", region: "international", link: "/london" },
  { name: "Switzerland", descriptor: "The Alpine Dream", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop", category: "honeymoon", region: "international" },
  { name: "France", descriptor: "Art & Romance", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop", category: "cities", region: "international" },
  { name: "Italy", descriptor: "Dolce Vita", image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop", category: "cities", region: "international" },
  { name: "Maldives", descriptor: "Island Paradise", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800&auto=format&fit=crop", category: "honeymoon", region: "international" },
  { name: "Indonesia", descriptor: "Tropical Culture", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop", category: "adventure", region: "international" },
  { name: "Thailand", descriptor: "Beaches & Smiles", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=800&auto=format&fit=crop", category: "beaches", region: "international" },
  { 
    name: "Vietnam", 
    descriptor: "Timeless Charm", 
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlldG5hbXxlbnwwfHwwfHx8MA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000", 
    category: "adventure", 
    region: "international" 
  },
  { 
    name: "United Arab Emirates", 
    descriptor: "Future Now", 
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dW5pdGVkJTIwYXJhYiUyMGVtaXJhdGVzfGVufDB8fDB8fHww&ixlib=rb-4.1.0&q=60&w=3000", 
    category: "cities", 
    region: "international" 
  },
  { name: "Singapore", descriptor: "Urban Garden", image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=800&auto=format&fit=crop", category: "cities", region: "international" },
  { name: "Japan", descriptor: "Tradition Meets Future", image: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=800&auto=format&fit=crop", category: "cities", region: "international" },
  { 
    name: "Australia", 
    descriptor: "The Great Outback", 
    image: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXVzdHJhbGlhfGVufDB8fDB8fHww&ixlib=rb-4.1.0&q=60&w=3000", 
    category: "adventure", 
    region: "international" 
  },
];

const categories = ["All", "Beaches", "Cities", "Adventure", "Honeymoon"];

const experiences = [
  {
    title: "Luxury Safaris",
    description: "Witness the wildlife in comfort. We arrange the best lodges and guides.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop",
    ctaType: "primary",
  },
  {
    title: "Private Cruises",
    description: "Relax on the open sea with your family on a private boat tour.",
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=800&auto=format&fit=crop",
    ctaType: "secondary",
  },
  {
    title: "Gourmet Dining",
    description: "From local flavors to fine dining, we find the best spots (including vegetarian options).",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop",
    ctaType: "primary",
  },
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

const trustFeatures = [
  { icon: CheckCircle2, label: "Visa & Flight Support" },
  { icon: MapPin, label: "End-to-End Planning" },
  { icon: Sparkles, label: "Verified 4 & 5 Star Stays" },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "The Nomads Co. | Curated Journeys" },
    { name: "description", content: "Personalized premium travel with seamless planning and curated destinations." },
  ];
}

// --- Animation Components & Styles ---
const customStyles = `
  html { scroll-behavior: smooth; }

  @keyframes fade-in-up {
    0% { opacity: 0; transform: translateY(40px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  .animate-ready { opacity: 0; transform: translateY(30px); transition: opacity 0.1s; }

  /* Snappier 0.8s duration for better feel */
  .animate-active-up {
    animation: fade-in-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
`;

// --- Simplified Optimized Image Component (WITH FALLBACK) ---
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&fm=jpg&q=60&w=1200";

const OptimizedImage = ({ src, alt, className, priority = false }: { src: string, alt: string, className?: string, priority?: boolean }) => {
  return (
    <div className="w-full h-full relative overflow-hidden bg-[#F0F0F0]">
      {/* Native Browser Loading - The smoothest way */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={`w-full h-full object-cover ${className ?? ""}`}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
        }}
      />
    </div>
  );
};

function RevealOnScroll({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${className} ${isVisible ? "animate-active-up" : "animate-ready"}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white antialiased selection:bg-[#2D3191]/10 selection:text-[#2D3191]">
      <style>{customStyles}</style>
      <Navigation />
      <Hero />
      <TrustStrip />
      <DiagonalDestinations />
      <ExperienceSection />
      <StatsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-[#E6E8EF] transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logoImage} alt="The Nomads Co." className="h-10 w-auto transition-transform duration-300 ease-out group-hover:-translate-y-0.5" />
            <span className="text-lg font-semibold text-[#1F2328] tracking-tight" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}>The Nomads Co.</span>
          </Link>
          <div className="hidden lg:flex items-center justify-center gap-10">
            {[{ label: "Destinations", href: "#destinations" }, { label: "Experiences", href: "#experiences" }, { label: "Testimonials", href: "#testimonials" }].map((link) => (
              <a key={link.label} href={link.href} className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors duration-300 ease-out">{link.label}</a>
            ))}
            <Link to="/contactus" className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors duration-300 ease-out">Contact</Link>
          </div>
          <div className="flex items-center justify-end gap-4">
            <Link to="/contactus" className="hidden lg:block px-6 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-full hover:bg-[#242875] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg active:scale-95 active:translate-y-0">Plan My Trip</Link>
            <button className="lg:hidden text-[#1F2328] transition-transform duration-300 ease-out hover:scale-110"><Menu size={24} /></button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const heroImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop";
  const image1 = "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop";
  const image2 = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop";

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
              <h1 className="text-5xl sm:text-6xl lg:text-7xl leading-[1.1] mb-8 text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "-0.03em" }}>
                Your dream holiday, <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D3191] to-[#242875]">flawlessly planned.</span>
              </h1>
            </RevealOnScroll>
            <RevealOnScroll delay={300}>
              <p className="text-lg sm:text-xl text-[#1F2328]/70 leading-relaxed mb-10 max-w-xl" style={{ letterSpacing: "-0.01em" }}>
                Experience the world with zero stress. From visas and flights to luxury stays and Indian meals, we handle every detail so you can just make memories.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={400}>
              <div className="flex flex-col sm:flex-row gap-5">
                <Link to="/contactus" className="group px-10 py-4 bg-[#2D3191] text-white text-sm font-medium tracking-wide rounded-full hover:bg-[#242875] flex items-center justify-center gap-2 shadow-lg shadow-[#2D3191]/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:scale-95 active:translate-y-0">
                  Plan My Holiday <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a href="#destinations" className="px-10 py-4 bg-white/50 backdrop-blur-sm border border-[#02A551]/30 text-[#02A551] text-sm font-medium tracking-wide rounded-full hover:bg-[#E7F7EF] transition-all duration-300 ease-out hover:-translate-y-1 active:scale-95 active:translate-y-0">See Destinations</a>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={500}>
              <div className="mt-8 flex items-center gap-4 text-sm text-[#1F2328]/60">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (<div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">Use</div>))}
                </div>
                <p>Trusted by 1000+ happy families</p>
              </div>
            </RevealOnScroll>
          </div>
          <div className="order-1 lg:order-2 relative">
            <div className="absolute top-10 -right-6 z-20 animate-float" style={{ animationDelay: "1s" }}>
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3">
                <div className="bg-[#E7F7EF] p-2 rounded-full text-[#02A551]"><BadgeCheck size={24} /></div>
                <div><div className="text-xs text-[#1F2328]/60 font-medium">Trip Rating</div><div className="text-sm font-bold text-[#1F2328]">4.9/5 Excellent</div></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <RevealOnScroll delay={300} className="col-span-2">
                <div className="rounded-2xl shadow-lg border-4 border-white group h-[300px] sm:h-[400px] overflow-hidden">
                  <OptimizedImage src={heroImage} alt="Luxury Beach Escape" className="transition-transform duration-1000 ease-out group-hover:scale-105" priority={true} />
                </div>
              </RevealOnScroll>
              <RevealOnScroll delay={400}>
                <div className="rounded-2xl shadow-lg border-4 border-white group h-[200px] sm:h-[250px] overflow-hidden">
                  <OptimizedImage src={image1} alt="Private Pool Villa" className="transition-transform duration-1000 ease-out group-hover:scale-105" />
                </div>
              </RevealOnScroll>
              <RevealOnScroll delay={500}>
                <div className="rounded-2xl shadow-lg border-4 border-white group h-[200px] sm:h-[250px] overflow-hidden">
                  <OptimizedImage src={image2} alt="Fine Dining" className="transition-transform duration-1000 ease-out group-hover:scale-105" />
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="bg-white py-12 border-t border-[#E6E8EF]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        <RevealOnScroll delay={200}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 bg-[#EEF0FF]/50 rounded-3xl border border-[#EEF0FF]">
            <div><h3 className="text-xl sm:text-2xl text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.02em" }}>Vadodara's Trusted Experts</h3></div>
            <div className="flex flex-wrap items-center gap-8 lg:gap-12">
              {trustFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.label} className="flex items-center gap-2 group cursor-default">
                    <div className="relative transition-transform duration-300 group-hover:scale-110">
                      <Icon size={20} className="text-[#2D3191]" strokeWidth={2} />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#02A551] rounded-full" />
                    </div>
                    <span className="text-sm font-medium text-[#1F2328]">{feature.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

function DiagonalDestinations() {
  const [activeRegion, setActiveRegion] = useState<"india" | "international">("international");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredDestinations = allDestinations.filter((dest) => {
    if (dest.region !== activeRegion) return false;
    if (activeCategory !== "All" && dest.category !== activeCategory.toLowerCase()) return false;
    return true;
  });

  return (
    <section id="destinations" className="py-20 sm:py-32 px-6 sm:px-8 lg:px-12 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-[#1F2328] mb-6" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "-0.025em" }}>Trending Destinations</h2>
            <p className="text-lg sm:text-xl text-[#1F2328]/60 max-w-2xl mx-auto" style={{ letterSpacing: "-0.01em" }}>Handpicked places that are perfect for Indian travelers</p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-[#F7F6F1] p-1.5 rounded-full border border-[#E6E8EF] shadow-inner">
              <button onClick={() => { setActiveRegion("india"); setActiveCategory("All"); }} className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${activeRegion === "india" ? "bg-[#2D3191] text-white shadow-md" : "text-[#1F2328]/70 hover:text-[#1F2328]"}`}>🇮🇳 India</button>
              <button onClick={() => { setActiveRegion("international"); setActiveCategory("All"); }} className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${activeRegion === "international" ? "bg-[#2D3191] text-white shadow-md" : "text-[#1F2328]/70 hover:text-[#1F2328]"}`}>🌍 International</button>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((category) => (
              <button key={category} onClick={() => setActiveCategory(category)} type="button" className={`px-5 py-2 text-sm font-medium rounded-full border-2 transition-all duration-300 ease-out active:scale-95 ${activeCategory === category ? "border-[#2D3191] bg-[#2D3191] text-white" : "bg-transparent border-[#E6E8EF] text-[#1F2328] hover:border-[#2D3191] hover:text-[#2D3191]"}`}>{category}</button>
            ))}
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredDestinations.map((destination, index) => {
            const Wrapper = Link;
            const linkTo = destination.link ? destination.link : "/contactus";
            return (
              <RevealOnScroll key={destination.name} delay={index * 50}>
                <Wrapper to={linkTo} className="group cursor-pointer block h-full">
                  <div className="relative rounded-2xl shadow-md transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-2 hover:shadow-2xl h-[320px] overflow-hidden">
                    <OptimizedImage 
                      src={destination.image} 
                      alt={destination.name} 
                      className="transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110" 
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="transform transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-y-[-8px]">
                        <h3
                          className="text-2xl font-semibold text-white mb-2"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {destination.name}
                        </h3>
                        <p className="text-white/90 text-sm mb-4 font-light">
                          {destination.descriptor}
                        </p>
                      </div>

                      {/* Magnifying Explore Button */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium mt-2 transition-all duration-500 group-hover:bg-white group-hover:text-[#2D3191] group-hover:scale-110 group-hover:shadow-lg origin-left">
                        Explore <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Wrapper>
              </RevealOnScroll>
            );
          })}

          {filteredDestinations.length === 0 && (
             <div className="col-span-full text-center py-20 text-[#1F2328]/50">
               <p>No destinations found in this category yet. Try "All".</p>
             </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section id="experiences" className="py-20 sm:py-32 px-6 sm:px-8 lg:px-12 bg-[#EEF0FF]">
      <div className="max-w-[1400px] mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-16 sm:mb-20">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl text-[#1F2328] mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                letterSpacing: "-0.025em",
              }}
            >
              Experiences You'll Love
            </h2>
            <p
              className="text-lg sm:text-xl text-[#1F2328]/60 max-w-2xl mx-auto"
              style={{ letterSpacing: "-0.01em" }}
            >
              Tailored activities for families, couples, and groups
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          {experiences.map((experience, index) => (
            <RevealOnScroll key={experience.title} delay={index * 150}>
              <div className="group h-full flex flex-col">
                <div className="relative rounded-2xl mb-6 shadow-md transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-xl h-[300px] overflow-hidden">
                  <OptimizedImage 
                    src={experience.image} 
                    alt={experience.title} 
                    className="transition-transform duration-1000 ease-out group-hover:scale-105" 
                  />
                </div>

                <h3
                  className="text-2xl font-semibold text-[#1F2328] mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {experience.title}
                </h3>
                <p className="text-[#1F2328]/70 leading-relaxed mb-6 flex-grow">
                  {experience.description}
                </p>

                <div>
                  {experience.ctaType === "primary" ? (
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#2D3191] text-white text-sm font-medium rounded-full hover:bg-[#242875] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg active:scale-95">
                      Learn more
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-[#02A551] text-[#02A551] text-sm font-medium rounded-full hover:bg-[#E7F7EF] transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-95">
                      Learn more
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section id="testimonials" className="py-20 sm:py-32 px-6 sm:px-8 lg:px-12 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-16 sm:mb-20">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl text-[#1F2328] mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                letterSpacing: "-0.025em",
              }}
            >
              Happy Families & Travelers
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((testimonial, index) => (
            <RevealOnScroll key={testimonial.name} delay={index * 150}>
              <div
                className="bg-white p-8 rounded-2xl border border-[#E6E8EF] shadow-sm hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 h-full flex flex-col group"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={`${testimonial.name}-${i}`}
                      size={16}
                      fill="#02A551"
                      className="text-[#02A551]"
                    />
                  ))}
                </div>

                <p className="text-[#1F2328] leading-relaxed mb-6 italic flex-grow">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#E6E8EF] flex-shrink-0">
                     <OptimizedImage 
                       src={testimonial.image} 
                       alt={testimonial.name} 
                       className="transition-transform duration-500 group-hover:scale-110" 
                     />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-[#1F2328]">
                        {testimonial.name}
                      </h4>
                      <BadgeCheck size={16} className="text-[#02A551]" />
                    </div>
                    <p className="text-sm text-[#1F2328]/60">
                      {testimonial.city}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#E6E8EF]">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E7F7EF] text-[#02A551] text-xs font-medium rounded-full">
                    <BadgeCheck size={12} />
                    Verified Client
                  </span>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="py-20 sm:py-32 px-6 sm:px-8 lg:px-12 bg-[#EEF0FF]">
      <div className="max-w-[1400px] mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-16 sm:mb-20">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl text-[#1F2328] mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                letterSpacing: "-0.025em",
              }}
            >
              Start Your Journey
            </h2>
            <p
              className="text-lg sm:text-xl text-[#1F2328]/60 max-w-2xl mx-auto"
              style={{ letterSpacing: "-0.01em" }}
            >
              Share your travel dreams with us and let our experts craft your perfect
              itinerary.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-2">
            <RevealOnScroll delay={200}>
              <div className="space-y-8">
                <div>
                  <h3
                    className="text-2xl font-semibold text-[#1F2328] mb-6"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Contact Us
                  </h3>
                  <p className="text-[#1F2328]/70 leading-relaxed">
                    Our team is ready to help you create the journey of a lifetime.
                    Reach out through any channel below.
                  </p>
                </div>

                <div className="space-y-6">
                  <a href="mailto:thenomadsco@gmail.com" className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-[#EEF0FF] rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-[#2D3191] group-hover:scale-110">
                      <Mail size={20} className="text-[#2D3191] group-hover:text-white transition-colors" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-sm text-[#1F2328]/60 font-medium mb-1">Email</div>
                      <div className="text-base text-[#1F2328] font-medium group-hover:text-[#2D3191] transition-colors">thenomadsco@gmail.com</div>
                    </div>
                  </a>

                  <a href="tel:+919924399335" className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-[#EEF0FF] rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-[#2D3191] group-hover:scale-110">
                      <Phone size={20} className="text-[#2D3191] group-hover:text-white transition-colors" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-sm text-[#1F2328]/60 font-medium mb-1">Phone / WhatsApp</div>
                      <div className="text-base text-[#1F2328] font-medium group-hover:text-[#2D3191] transition-colors">+91 9924399335</div>
                    </div>
                  </a>

                  <a
                    href="https://www.google.com/maps/search/?api=1&query=A%2F49%2C%20Nutan%20Maheshwar%20Society%2C%20Subhanpura%2C%20Gotri%2C%20Vadodara%2C%20Gujarat%2C%20India"
                    className="flex items-start gap-4 group"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="w-12 h-12 bg-[#EEF0FF] rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110">
                      <MapPin size={20} className="text-[#2D3191]" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-sm text-[#1F2328]/60 font-medium mb-1">Location</div>
                      <div className="text-base text-[#1F2328] font-medium">Vadodara, Gujarat, India</div>
                    </div>
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          <div className="lg:col-span-3">
            <RevealOnScroll delay={400}>
              <form
                className="bg-[#F7F6F1] p-8 sm:p-10 rounded-2xl border border-[#E6E8EF] shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                action="https://formsubmit.co/thenomadsco@gmail.com"
                method="post"
              >
                <input type="hidden" name="_subject" value="New Nomads Co. inquiry" />
                <input type="hidden" name="_captcha" value="false" />
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1F2328] mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      name="name"
                      className="w-full px-4 py-3 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent transition-shadow duration-300"
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1F2328] mb-2">
                        Email / WhatsApp *
                      </label>
                      <input
                        type="email"
                        required
                        name="email"
                        className="w-full px-4 py-3 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent transition-shadow duration-300"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1F2328] mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full px-4 py-3 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent transition-shadow duration-300"
                        placeholder="+91 XXX XXX XXXX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1F2328] mb-2">
                        Destination idea
                      </label>
                      <input
                        type="text"
                        name="destination"
                        className="w-full px-4 py-3 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent transition-shadow duration-300"
                        placeholder="e.g., Santorini"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1F2328] mb-2">
                        Travel month
                      </label>
                      <input
                        type="text"
                        name="travel_month"
                        className="w-full px-4 py-3 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent transition-shadow duration-300"
                        placeholder="e.g., June 2026"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1F2328] mb-2">Budget range</label>
                    <select
                      name="budget"
                      className="w-full px-4 py-3 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent transition-shadow duration-300"
                    >
                      <option value="">Select your budget</option>
                      <option value="under-2lakh">Under ₹2 Lakh</option>
                      <option value="2-5lakh">₹2-5 Lakh</option>
                      <option value="5-10lakh">₹5-10 Lakh</option>
                      <option value="10lakh-plus">₹10 Lakh+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1F2328] mb-2">Notes</label>
                    <textarea
                      rows={5}
                      name="notes"
                      className="w-full px-4 py-3 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent transition-shadow duration-300 resize-none"
                      placeholder="Tell us about your ideal trip..."
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full px-8 py-4 bg-[#2D3191] text-white text-base font-medium rounded-xl hover:bg-[#242875] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg active:scale-95 active:translate-y-0"
                    >
                      Send inquiry
                    </button>
                    <p className="text-sm text-[#1F2328]/60 text-center mt-4">
                      We reply within 24 hours
                    </p>
                  </div>
                </div>
              </form>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FAFAF8] text-[#1F2328] py-16 sm:py-20 px-6 sm:px-8 lg:px-12 border-t border-[#E6E8EF]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-16 pb-16 border-b border-[#E6E8EF]">
          <div>
            <h3
              className="text-2xl font-semibold mb-5 text-[#1F2328]"
              style={{
                fontFamily: "'Playfair Display', serif",
                letterSpacing: "-0.02em",
              }}
            >
              The Nomads Co.
            </h3>
            <p
              className="text-sm text-[#1F2328]/70 leading-relaxed mb-8"
              style={{ letterSpacing: "-0.01em" }}
            >
              Crafting extraordinary journeys for extraordinary people since 2015.
            </p>
            <div className="flex gap-3">
              {[
                {
                  icon: Instagram,
                  label: "Instagram",
                  href: "https://www.instagram.com/thenomadsco/",
                },
                {
                  icon: Facebook,
                  label: "Facebook",
                  href: "https://www.facebook.com/Thenomadsco/",
                },
                { icon: Mail, label: "Email", href: "mailto:thenomadsco@gmail.com" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="w-10 h-10 bg-[#EEF0FF] hover:bg-[#2D3191] rounded-xl flex items-center justify-center group transition-all duration-300 ease-out hover:-translate-y-0.5"
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                >
                  <Icon
                    size={18}
                    className="text-[#2D3191] group-hover:text-white transition-colors duration-300 ease-out"
                  />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#1F2328]">
              Destinations
            </h4>
            <ul className="space-y-3 text-sm">
              {["Europe", "Asia Pacific", "Middle East", "Americas", "Africa"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#1F2328]">
              Support
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/contactus" className="text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">
                  Contact Us
                </Link>
              </li>
              {["FAQs", "Travel Blog", "About Us", "Careers"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#1F2328]">
              Newsletter
            </h4>
            <p className="text-sm text-[#1F2328]/70 mb-4">
              Get travel inspiration and exclusive deals
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent text-sm transition-shadow duration-300"
              />
              <button className="px-4 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-xl hover:bg-[#242875] transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#1F2328]/60">
          <div>© {currentYear} The Nomads Co. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#2D3191] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#2D3191] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-[#2D3191] transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
