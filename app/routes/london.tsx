import { Link, useLoaderData } from "react-router";
import { useEffect, useMemo, useState } from "react";
import nomadsLogo from "./the nomads logo.jpeg";
import type { Route } from "./+types/home";

/**
 * United Kingdom Package Page
 * - FLIGHT CONNECTIVITY: Added robust routing info for Indian cities.
 * - SMART ITINERARY: Optimized for "Open-Jaw" flights (LHR In / EDI Out).
 * - RELIABLE ASSETS: Used stable Unsplash IDs and vector icons.
 */

// --- 1) CONFIGURATION ---
const PAGE_CONFIG = {
  title: "United Kingdom",
  subtitle: "Royalty, Highlands & Heritage",
  badge: "Best Seller",
  durationLabel: "6 Nights / 7 Days",
  visaLabel: "UK Visa Assisted",
  seasonLabel: "Best: Apr - Sep",
  basePackageCostGBP: 1250, 

  // High-reliability Unsplash IDs (Direct IDs to prevent redirect chains)
  heroSlides: [
    {
      label: "London",
      alt: "Big Ben & Westminster Bridge",
      src: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=1920&auto=format&fit=crop",
    },
    {
      label: "Edinburgh",
      alt: "Edinburgh Old Town & Castle",
      src: "https://images.unsplash.com/photo-1563693976-5596489436e0?q=80&w=1920&auto=format&fit=crop",
    },
    {
      label: "Scottish Highlands",
      alt: "Glencoe & Highlands",
      src: "https://images.unsplash.com/photo-1506368083636-6defb67639a7?q=80&w=1920&auto=format&fit=crop",
    },
    {
      label: "Bath",
      alt: "The Roman Baths",
      src: "https://images.unsplash.com/photo-1588669704627-c1d09e51922c?q=80&w=1920&auto=format&fit=crop",
    },
  ],

  activityCatalog: [
    { id: "london-eye", name: "London Eye (Fast Track)", baseGBP: 42 },
    { id: "warner-bros", name: "Warner Bros. Harry Potter Tour", baseGBP: 55 },
    { id: "stonehenge-bath", name: "Stonehenge & Bath Day Trip", baseGBP: 85 },
    { id: "edinburgh-castle", name: "Edinburgh Castle Entry", baseGBP: 22 },
    { id: "highlands-safari", name: "Loch Ness & Highlands Safari", baseGBP: 110 },
  ],
};

// --- 2) SERVER LOADER ---
export async function loader({ request }: Route.LoaderArgs) {
  let exchangeRate = 109.5;
  const activityData = [...PAGE_CONFIG.activityCatalog];

  const timestamp = new Date().toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  });

  try {
    const currencyRes = await fetch("https://api.frankfurter.app/latest?from=GBP&to=INR");
    if (currencyRes.ok) {
      const data = await currencyRes.json();
      if (data?.rates?.INR) exchangeRate = data.rates.INR;
    }
  } catch (e) {
    console.error("Currency API Error, using fallback:", e);
  }

  const safeRate = exchangeRate * 1.03;

  const liveActivities = activityData.map((act) => {
    const priceINR = Math.ceil(act.baseGBP * safeRate);
    return {
      ...act,
      livePriceINR: priceINR,
      formattedINR: act.baseGBP === 0 ? "Free" : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(priceINR),
    };
  });

  const totalPackageINR = Math.ceil(PAGE_CONFIG.basePackageCostGBP * safeRate);
  const prettyPackagePrice = Math.ceil(totalPackageINR / 500) * 500;
  const totalValueINR = liveActivities.reduce((acc, curr) => acc + curr.livePriceINR, 0);

  return {
    activities: liveActivities,
    packagePrice: prettyPackagePrice,
    exchangeRate: exchangeRate.toFixed(2),
    lastUpdated: timestamp,
    totalValue: totalValueINR,
  };
}

export function headers() {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  };
}

// --- 3) ICONS ---
const iconDefaults = { size: 24, strokeWidth: 2 };
function IconBase({ size = iconDefaults.size, className, strokeWidth = iconDefaults.strokeWidth, fill = "none", children }: any) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
function Menu(props: any) { return (<IconBase {...props}><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></IconBase>); }
function X(props: any) { return (<IconBase {...props}><path d="M18 6 6 18" /><path d="M6 6l12 12" /></IconBase>); }
function CheckCircle2(props: any) { return (<IconBase {...props}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></IconBase>); }
function Clock(props: any) { return (<IconBase {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></IconBase>); }
function Calendar(props: any) { return (<IconBase {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></IconBase>); }
function Plane(props: any) { return (<IconBase {...props}><path d="M2 12h20" /><path d="M13 5v7" /><path d="M6 17l4-4" /><path d="M18 7l-4 4" /></IconBase>); }
function FileCheck(props: any) { return (<IconBase {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="m9 15 2 2 4-4" /></IconBase>); }
function Facebook(props: any) { return (<IconBase {...props}><path d="M14 8h-2c-1.1 0-2 .9-2 2v2H8v3h2v5h3v-5h2.2l.8-3H13v-1.6c0-.4.3-.7.7-.7H16V8z" /></IconBase>); }
function Instagram(props: any) { return (<IconBase {...props}><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></IconBase>); }
function RefreshCw(props: any) { return (<IconBase {...props}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></IconBase>); }
function Globe(props: any) { return (<IconBase {...props}><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></IconBase>); }
function MapPin(props: any) { return (<IconBase {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></IconBase>); }
function TrendingUp(props: any) { return (<IconBase {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></IconBase>); }

const customStyles = `
  html { scroll-behavior: smooth; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
  }
`;

export default function UnitedKingdomPage() {
  const { activities, packagePrice, exchangeRate, lastUpdated, totalValue } = useLoaderData<typeof loader>();

  const fmt = (val: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  const slides = useMemo(() => PAGE_CONFIG.heroSlides, []);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const mql = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mql?.matches) return;
    const interval = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-white antialiased selection:bg-[#2D3191]/10 selection:text-[#2D3191] pb-24 sm:pb-0">
      <style>{customStyles}</style>
      <Navigation />

      {/* HERO */}
      <section className="relative h-[85vh] min-h-[620px] flex items-end pb-20 px-6 sm:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-[#2D3191]">
          {slides.map((slide, i) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              className={[
                "absolute inset-0 w-full h-full object-cover",
                "transition-[opacity,transform] duration-[1500ms]",
                "ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
                i === activeSlide ? "opacity-100 scale-[1.05]" : "opacity-0 scale-100",
              ].join(" ")}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="relative z-10 max-w-[1400px] mx-auto w-full grid lg:grid-cols-2 gap-10 items-end">
          <div>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-6 inline-flex items-center gap-2">
              {PAGE_CONFIG.badge}
              <span className="w-1.5 h-1.5 rounded-full bg-[#02A551]" />
              <span className="text-white/90 font-semibold">{slides[activeSlide]?.label}</span>
            </span>

            <h1 className="text-5xl sm:text-7xl font-semibold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              {PAGE_CONFIG.title}: <br /> {PAGE_CONFIG.subtitle}
            </h1>

            <div className="flex flex-wrap gap-6 text-white/90 font-medium">
              <div className="flex items-center gap-2">
                <Clock size={20} /> {PAGE_CONFIG.durationLabel}
              </div>
              <div className="flex items-center gap-2">
                <FileCheck size={20} /> {PAGE_CONFIG.visaLabel}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={20} /> {PAGE_CONFIG.seasonLabel}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-8">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveSlide(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 bg-white/40 hover:bg-white/70 ${i === activeSlide ? "w-10 bg-white" : "w-2.5"}`}
                />
              ))}
            </div>
          </div>

          <div className="lg:text-right">
            <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg text-white/70 text-xs mb-2">
              <RefreshCw size={12} />
              <span>Prices updated live at {lastUpdated} (Rate: £1 = ₹{exchangeRate})</span>
            </div>

            <p className="text-white/80 text-lg mb-1">Starting from</p>
            <p className="text-5xl font-bold text-white mb-6">
              {fmt(packagePrice)} <span className="text-xl font-normal text-white/60">/ person</span>
            </p>

            <a
              href="#enquire"
              className="inline-flex px-8 py-4 bg-[#02A551] hover:bg-[#028f46] text-white font-medium rounded-full transition-all duration-300 ease-out hover:-translate-y-1 shadow-lg shadow-[#02A551]/30"
            >
              Get Custom Quote
            </a>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section id="overview" className="py-20 px-6 sm:px-12 max-w-[1000px] mx-auto text-center">
        <h2 className="text-3xl font-semibold text-[#1F2328] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
          The "Best of UK" Route
        </h2>
        <p className="text-lg text-[#1F2328]/70 leading-relaxed mb-12">
          This itinerary is engineered for the Indian traveler. We've optimized the travel times to ensure you spend more time seeing Big Ben and the Highlands, and less time on trains.
        </p>

        <div className="grid sm:grid-cols-3 gap-8 text-left">
          {[
            { title: "Central Hotels", desc: "4-star stays near tube stations and Indian restaurants." },
            { title: "Smart Logistics", desc: "We use evening trains for long distances to save your daylight hours." },
            { title: "No Hidden Costs", desc: "All major entry tickets (London Eye, Castle, etc.) are pre-booked." },
          ].map((item, i) => (
            <div key={i} className="bg-[#EEF0FF] p-6 rounded-2xl border border-[#E6E8EF]">
              <h3 className="font-semibold text-[#2D3191] mb-2">{item.title}</h3>
              <p className="text-sm text-[#1F2328]/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FLIGHT CONNECTIVITY & ROUTES (Replaces Desi Comforts) */}
      <section className="py-20 bg-[#EEF0FF] px-6 sm:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-semibold text-[#1F2328] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Getting There: Flight Connectivity
            </h3>
            <p className="text-[#1F2328]/60">
              We recommend specific routes to maximize your holiday time.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* The "Smart Route" Box */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6E8EF] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#E7F7EF] p-3 rounded-xl text-[#02A551]">
                     <TrendingUp size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-[#1F2328]">Pro Tip: The "Open-Jaw" Ticket</h4>
                </div>
                <p className="text-[#1F2328]/70 leading-relaxed mb-6">
                  Instead of a round-trip to London, book a <strong>Multi-City</strong> ticket:
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF]">
                    <span className="font-bold text-[#2D3191]">IN</span>
                    <span className="text-sm text-[#1F2328]/80">India ➔ London Heathrow (LHR)</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF]">
                    <span className="font-bold text-[#02A551]">OUT</span>
                    <span className="text-sm text-[#1F2328]/80">Edinburgh (EDI) ➔ India</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 p-4 bg-[#FFF4E5] rounded-xl text-[#B45309] text-sm font-medium border border-[#FED7AA]">
                ⚡ Saves you 6-8 hours of backtracking to London!
              </div>
            </div>

            {/* Hub Connections */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6E8EF]">
              <div className="flex items-center gap-3 mb-6">
                 <div className="bg-[#EEF0FF] p-3 rounded-xl text-[#2D3191]">
                     <Plane size={24} />
                 </div>
                 <h4 className="text-xl font-bold text-[#1F2328]">Direct & Best Connections</h4>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-[#1F2328]">Delhi (DEL)</span>
                    <span className="text-xs font-bold px-2 py-1 bg-[#E7F7EF] text-[#02A551] rounded">DIRECT</span>
                  </div>
                  <p className="text-sm text-[#1F2328]/60">~9h 30m • Air India, Virgin Atlantic, British Airways</p>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-[#1F2328]">Mumbai (BOM)</span>
                    <span className="text-xs font-bold px-2 py-1 bg-[#E7F7EF] text-[#02A551] rounded">DIRECT</span>
                  </div>
                  <p className="text-sm text-[#1F2328]/60">~10h 15m • Air India, Virgin Atlantic, British Airways</p>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-[#1F2328]">Bengaluru (BLR) / Hyderabad (HYD)</span>
                    <span className="text-xs font-bold px-2 py-1 bg-[#EEF0FF] text-[#2D3191] rounded">DIRECT / 1-STOP</span>
                  </div>
                  <p className="text-sm text-[#1F2328]/60">~11h • British Airways (Direct) or Emirates/Qatar (via Dubai/Doha)</p>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-[#1F2328]">Ahmedabad (AMD)</span>
                    <span className="text-xs font-bold px-2 py-1 bg-[#F3F4F6] text-[#6B7280] rounded">1-STOP</span>
                  </div>
                  <p className="text-sm text-[#1F2328]/60">~14h • Emirates, Etihad, Qatar Airways (Best connections)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16 bg-white px-6 sm:px-12 border-t border-b border-[#E6E8EF]">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-semibold text-[#1F2328]">Activity Costs</h3>
            <p className="text-sm text-[#1F2328]/50 mt-2">
              Live INR costs for activities included in your package.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-4">
               <ul className="space-y-3">
                {activities.map((item) => (
                  <li key={item.id} className="flex justify-between items-center p-3 bg-[#F7F6F1] rounded-lg">
                    <span className="font-medium text-[#1F2328]">{item.name}</span>
                    <div className="text-right">
                      <span className="block font-bold text-[#2D3191]">{item.formattedINR}</span>
                      {item.baseGBP > 0 && <span className="text-xs text-[#1F2328]/40">£{item.baseGBP}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#2D3191] p-8 rounded-2xl text-white flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <h4 className="text-xl font-semibold mb-2">Total Activity Value</h4>
              <p className="text-4xl font-bold mb-4">{fmt(totalValue)}+</p>
              <p className="text-white/80 text-sm">per person included in your package.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ITINERARY */}
      <section id="itinerary" className="py-20 bg-[#FAFAF8] px-6 sm:px-12">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-3xl font-semibold text-[#1F2328] mb-12 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            Your 7-Day Journey
          </h2>

          <div className="space-y-8">
            {[
              { day: 1, title: "Namaste London", desc: "Arrive at Heathrow. Private transfer to your central hotel. Evening walk at Piccadilly Circus & Leicester Square.", tag: "Arrival" },
              { day: 2, title: "Icons of London", desc: "Hop-on Hop-off Tour: Buckingham Palace, Big Ben, Tower Bridge. Includes Fast-Track entry to the London Eye for sunset views.", tag: "Sightseeing" },
              { day: 3, title: "History & Heritage", desc: "Full day trip to the mysterious Stonehenge and the Roman Baths. Return to London by evening.", tag: "Day Trip" },
              { day: 4, title: "Wizardry & Travel", desc: "Morning: Warner Bros. Harry Potter Tour OR Bicester Village Shopping. Evening: Relaxing train journey to Edinburgh (4.5 hrs). Check-in to Edinburgh hotel.", tag: "Travel" },
              { day: 5, title: "Royal Edinburgh", desc: "Explore the Royal Mile and Edinburgh Castle (Tickets included). Evening ghost tour or whisky tasting experience.", tag: "Culture" },
              { day: 6, title: "Highlands Safari", desc: "A full-day guided tour to Loch Ness, Glencoe, and the Highlands. See the 'Harry Potter Bridge' (Glenfinnan) if season permits.", tag: "Adventure" },
              { day: 7, title: "Homeward Bound", desc: "Breakfast. Fly out directly from Edinburgh (Recommended) or train back to London for your flight.", tag: "Departure" },
            ].map((day) => (
              <div key={day.day} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#2D3191] text-white flex items-center justify-center font-bold shadow-lg z-10">{day.day}</div>
                  <div className="w-0.5 h-full bg-[#E6E8EF] -mt-2 group-last:hidden" />
                </div>
                <div className="bg-white p-6 rounded-2xl border border-[#E6E8EF] flex-1 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h3 className="text-xl font-semibold text-[#1F2328]">{day.title}</h3>
                    <span className="px-3 py-1 bg-[#E7F7EF] text-[#02A551] text-xs font-bold uppercase rounded-full whitespace-nowrap">{day.tag}</span>
                  </div>
                  <p className="text-[#1F2328]/70">{day.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENQUIRY FORM */}
      <section id="enquire" className="py-20 px-6 sm:px-12 max-w-[800px] mx-auto scroll-mt-24">
        <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-[#E6E8EF] shadow-xl text-center">
          <h2 className="text-3xl font-bold text-[#1F2328] mb-4">Like this plan?</h2>
          <p className="text-[#1F2328]/60 mb-8">
            Get your final quote based on your travel dates.
          </p>

          <form action="https://formsubmit.co/thenomadsco@gmail.com" method="POST" className="space-y-4 text-left">
            <input type="hidden" name="_subject" value="UK Package Inquiry" />
            <input type="hidden" name="_captcha" value="false" />

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold ml-1 text-[#1F2328]">Full Name</label>
                <input type="text" name="name" required className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:ring-1 focus:ring-[#2D3191] outline-none" placeholder="e.g. Rahul Sharma" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold ml-1 text-[#1F2328]">Phone Number</label>
                <input type="tel" name="phone" required className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:ring-1 focus:ring-[#2D3191] outline-none" placeholder="e.g. +91 98765 43210" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold ml-1 text-[#1F2328]">Travel Month</label>
                <input type="text" name="travel_dates" className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] outline-none" placeholder="e.g. May 2026" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold ml-1 text-[#1F2328]">Travelers</label>
                <input type="text" name="travelers" className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] outline-none" placeholder="e.g. 2 Adults, 1 Child" />
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-[#2D3191] text-white font-bold rounded-xl hover:bg-[#242875] transition-all mt-4 shadow-lg hover:-translate-y-0.5">
              Get My Free Quote
            </button>
          </form>
        </div>
      </section>

      <Footer />

      {/* MOBILE STICKY BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E6E8EF] p-4 sm:hidden flex items-center justify-between z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div>
          <p className="text-xs text-[#1F2328]/60">Starting from</p>
          <p className="text-lg font-bold text-[#2D3191]">{fmt(packagePrice)}</p>
        </div>
        <a href="#enquire" className="px-6 py-2.5 bg-[#02A551] text-white text-sm font-bold rounded-full shadow-md">
          Enquire Now
        </a>
      </div>
    </div>
  );
}

// --- NAVIGATION & FOOTER ---
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = isOpen ? "hidden" : ""; }, [isOpen]);

  const inPageLinks = [
    { label: "Overview", href: "#overview" },
    { label: "Flights", href: "#flights" }, // Point to new section (approx)
    { label: "Pricing", href: "#pricing" },
    { label: "Itinerary", href: "#itinerary" },
    { label: "Enquire", href: "#enquire" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-[#E6E8EF]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={nomadsLogo} alt="The Nomads Co." className="h-10 w-auto group-hover:-translate-y-0.5 transition-transform" />
            <span className="font-semibold text-[#1F2328] hidden sm:inline">The Nomads Co.</span>
          </Link>

          <div className="hidden lg:flex items-center justify-center gap-10">
            {inPageLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">
                {link.label}
              </a>
            ))}
             <Link to="/contactus" className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">Contact</Link>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link to="/contactus" className="hidden lg:block px-6 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-full hover:bg-[#242875] hover:-translate-y-0.5 transition-all">
              Plan My Trip
            </Link>
            <button className="lg:hidden p-2" onClick={() => setIsOpen(true)}><Menu size={24} /></button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[80%] bg-white shadow-2xl p-6">
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setIsOpen(false)}><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-4">
              {inPageLinks.map((link) => (
                <a key={link.label} href={link.href} onClick={() => setIsOpen(false)} className="text-lg font-medium text-[#1F2328]">{link.label}</a>
              ))}
              <Link to="/contactus" className="mt-4 px-6 py-3 bg-[#2D3191] text-white text-center rounded-xl font-medium">Plan My Trip</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-[#FAFAF8] py-16 px-6 sm:px-12 border-t border-[#E6E8EF]">
      <div className="max-w-[1400px] mx-auto text-center sm:text-left grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>The Nomads Co.</h3>
          <p className="text-sm text-[#1F2328]/70">Crafting extraordinary journeys since 2015.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <Link to="/contactus" className="text-sm text-[#1F2328]/70 hover:text-[#2D3191]">Contact Us</Link>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Social</h4>
          <div className="flex gap-4 justify-center sm:justify-start text-[#2D3191]">
             <a href="https://www.instagram.com/thenomadsco/"><Instagram /></a>
             <a href="https://www.facebook.com/Thenomadsco/"><Facebook /></a>
          </div>
        </div>
        <div>
          <p className="text-sm text-[#1F2328]/50">© {new Date().getFullYear()} The Nomads Co.</p>
        </div>
      </div>
    </footer>
  );
}
