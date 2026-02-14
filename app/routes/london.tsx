import { Link, useLoaderData } from "react-router";
import { useEffect, useMemo, useState } from "react";
import nomadsLogo from "./the nomads logo.jpeg";
import type { Route } from "./+types/home";

/**
 * United Kingdom Package Page (Template-ready)
 * - Keeps real-time pricing + enquiry form intact
 * - Adds premium hero slideshow (crossfade + subtle zoom)
 * - Fixes mobile nav (hamburger now works)
 * - Uses in-page anchors that actually exist on this page
 */

// --- 1) CONFIGURATION (Swap these per destination) ---
const PAGE_CONFIG = {
  title: "United Kingdom",
  subtitle: "Royalty, Highlands & Heritage",
  badge: "Best Seller",
  durationLabel: "6 Nights / 7 Days",
  visaLabel: "UK Visa Assisted",
  seasonLabel: "Best: Apr - Sep",
  // Base package cost (hotels + transfers etc.) in GBP
  basePackageCostGBP: 1150,

  // Hero slideshow (5–6 key UK attractions). Replace these URLs if you prefer.
  heroSlides: [
    {
      label: "London",
      alt: "Big Ben & Westminster, London",
      src: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1920&auto=format&fit=crop",
    },
    {
      label: "Edinburgh",
      alt: "Edinburgh Castle, Scotland",
      src: "https://images.unsplash.com/photo-1541414772555-6c95f4d0fe31?q=80&w=1920&auto=format&fit=crop",
    },
    {
      label: "Scottish Highlands",
      alt: "Scottish Highlands landscape",
      src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1920&auto=format&fit=crop",
    },
    {
      label: "Lake District",
      alt: "Lake District scenery",
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1920&auto=format&fit=crop",
    },
    {
      label: "Bath",
      alt: "Historic Bath architecture",
      src: "https://images.unsplash.com/photo-1543340713-8e9d6d53ef7e?q=80&w=1920&auto=format&fit=crop",
    },
    {
      label: "Stonehenge",
      alt: "Stonehenge, England",
      src: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1920&auto=format&fit=crop",
    },
  ],

  // Activity catalog (base ticket prices in GBP). These are placeholders—adjust anytime.
  activityCatalog: [
    { id: "london-eye", name: "London Eye (Standard Ticket)", baseGBP: 35 },
    { id: "warner-bros", name: "Warner Bros. Studio Tour", baseGBP: 53 },
    { id: "stonehenge", name: "Stonehenge Entry Ticket", baseGBP: 28 },
    { id: "roman-baths", name: "Roman Baths (Bath) Entry", baseGBP: 26 },
    { id: "edinburgh-castle", name: "Edinburgh Castle Ticket", baseGBP: 20 },
    { id: "highlands-tour", name: "Scottish Highlands Day Tour", baseGBP: 110 },
  ],
};

// --- 2) SERVER LOADER (The Automation Engine) ---
// Runs on the server on every request.
export async function loader({ request }: Route.LoaderArgs) {
  // A) Defaults / fallbacks
  let exchangeRate = 109.5; // safe fallback if API fails
  const activityData = [...PAGE_CONFIG.activityCatalog];

  // Keep a deterministic server-side timestamp in IST for transparency
  const timestamp = new Date().toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  });

  // B) AUTOMATION 1: Fetch Live Currency (Frankfurter API)
  try {
    const currencyRes = await fetch("https://api.frankfurter.app/latest?from=GBP&to=INR");
    if (currencyRes.ok) {
      const data = await currencyRes.json();
      if (data?.rates?.INR) exchangeRate = data.rates.INR;
    }
  } catch (e) {
    console.error("Currency API Error, using fallback:", e);
  }

  // C) AUTOMATION 2: Calculate INR Prices in Real-Time (+3% safety buffer)
  const safeRate = exchangeRate * 1.03;

  const liveActivities = activityData.map((act) => {
    const priceINR = Math.ceil(act.baseGBP * safeRate);
    return {
      ...act,
      livePriceINR: priceINR,
      formattedINR: new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(priceINR),
    };
  });

  // D) Total package price
  const totalPackageINR = Math.ceil(PAGE_CONFIG.basePackageCostGBP * safeRate);
  const prettyPackagePrice = Math.ceil(totalPackageINR / 500) * 500; // clean rounding

  // E) Total value of inclusions
  const totalValueINR = liveActivities.reduce((acc, curr) => acc + curr.livePriceINR, 0);

  return {
    activities: liveActivities,
    packagePrice: prettyPackagePrice,
    exchangeRate: exchangeRate.toFixed(2),
    lastUpdated: timestamp,
    totalValue: totalValueINR,
  };
}

// --- 3) CACHE CONTROL (Force Fresh Data) ---
export function headers() {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  };
}

// --- 4) ICONS ---
const iconDefaults = { size: 24, strokeWidth: 2 };
function IconBase({ size = iconDefaults.size, className, strokeWidth = iconDefaults.strokeWidth, fill = "none", children }: any) {
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
function Menu(props: any) { return (<IconBase {...props}><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></IconBase>); }
function X(props: any) { return (<IconBase {...props}><path d="M18 6 6 18" /><path d="M6 6l12 12" /></IconBase>); }
function CheckCircle2(props: any) { return (<IconBase {...props}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></IconBase>); }
function XCircle(props: any) { return (<IconBase {...props}><circle cx="12" cy="12" r="9" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></IconBase>); }
function Clock(props: any) { return (<IconBase {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></IconBase>); }
function Calendar(props: any) { return (<IconBase {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></IconBase>); }
function Plane(props: any) { return (<IconBase {...props}><path d="M2 12h20" /><path d="M13 5v7" /><path d="M6 17l4-4" /><path d="M18 7l-4 4" /></IconBase>); }
function Utensils(props: any) { return (<IconBase {...props}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></IconBase>); }
function FileCheck(props: any) { return (<IconBase {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="m9 15 2 2 4-4" /></IconBase>); }
function Facebook(props: any) { return (<IconBase {...props}><path d="M14 8h-2c-1.1 0-2 .9-2 2v2H8v3h2v5h3v-5h2.2l.8-3H13v-1.6c0-.4.3-.7.7-.7H16V8z" /></IconBase>); }
function Instagram(props: any) { return (<IconBase {...props}><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></IconBase>); }
function RefreshCw(props: any) { return (<IconBase {...props}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></IconBase>); }

// --- 5) PREMIUM MOTION STYLES (tiny + safe) ---
const customStyles = `
  html { scroll-behavior: smooth; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
  }
`;

// --- 6) PAGE COMPONENT ---
export default function UnitedKingdomPage() {
  const { activities, packagePrice, exchangeRate, lastUpdated, totalValue } = useLoaderData<typeof loader>();

  // Helper: INR formatting
  const fmt = (val: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  // HERO SLIDESHOW (crossfade + subtle zoom)
  const slides = useMemo(() => PAGE_CONFIG.heroSlides, []);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    // Respect reduced motion
    const mql = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mql?.matches) return;

    const interval = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-white antialiased selection:bg-[#2D3191]/10 selection:text-[#2D3191] pb-24 sm:pb-0">
      <style>{customStyles}</style>
      <Navigation />

      {/* HERO: UK Slideshow */}
      <section className="relative h-[85vh] min-h-[620px] flex items-end pb-20 px-6 sm:px-12 overflow-hidden">
        {/* Stacked cross-fading images */}
        <div className="absolute inset-0">
          {slides.map((slide, i) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              className={[
                "absolute inset-0 w-full h-full object-cover",
                "transition-[opacity,transform] duration-[1200ms]",
                "ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
                i === activeSlide ? "opacity-100 scale-[1.06]" : "opacity-0 scale-100",
              ].join(" ")}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          ))}
        </div>

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />

        <div className="relative z-10 max-w-[1400px] mx-auto w-full grid lg:grid-cols-2 gap-10 items-end">
          <div>
            <span className="px-4 py-2 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest rounded-full mb-6 inline-flex items-center gap-2">
              {PAGE_CONFIG.badge}
              <span className="w-1.5 h-1.5 rounded-full bg-[#02A551]" />
              <span className="text-white/80 font-semibold">{slides[activeSlide]?.label}</span>
            </span>

            <h1
              className="text-5xl sm:text-7xl font-semibold text-white mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
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

            {/* Slide dots */}
            <div className="flex items-center gap-2 mt-8">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show hero image ${i + 1}`}
                  onClick={() => setActiveSlide(i)}
                  className={[
                    "h-2.5 rounded-full transition-all duration-300",
                    "bg-white/40 hover:bg-white/70",
                    i === activeSlide ? "w-10 bg-white" : "w-2.5",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>

          <div className="lg:text-right">
            <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg text-white/70 text-xs mb-2">
              <RefreshCw size={12} />
              <span>
                Prices updated live at {lastUpdated} (Rate: £1 = ₹{exchangeRate})
              </span>
            </div>

            <p className="text-white/80 text-lg mb-1">Starting from</p>
            <p className="text-5xl font-bold text-white mb-6">
              {fmt(packagePrice)}{" "}
              <span className="text-xl font-normal text-white/60">/ person</span>
            </p>

            <a
              href="#enquire"
              className="inline-flex px-8 py-4 bg-[#02A551] hover:bg-[#028f46] text-white font-medium rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 shadow-lg shadow-[#02A551]/30"
            >
              Get Custom Quote
            </a>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section id="overview" className="py-20 px-6 sm:px-12 max-w-[1000px] mx-auto text-center">
        <h2 className="text-3xl font-semibold text-[#1F2328] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
          A Perfect UK Mix: London, Heritage & Scenic Escapes
        </h2>
        <p className="text-lg text-[#1F2328]/70 leading-relaxed mb-12">
          The United Kingdom is a whole vibe—royal history, iconic cities, and unreal landscapes. This 7-day plan is designed
          for Indian travelers: smooth logistics, great hotels, and a balanced itinerary across London + a taste of Scotland
          (with time to shop, explore, and breathe).
        </p>

        <div className="grid sm:grid-cols-3 gap-8 text-left">
          {[
            { title: "Central Stays", desc: "Handpicked 4-star hotels in prime areas for easy sightseeing." },
            { title: "Top Tickets", desc: "Iconic attractions included so you don’t waste time in queues." },
            { title: "Smooth Logistics", desc: "We guide you on trains, day tours, and local travel cards." },
          ].map((item, i) => (
            <div key={i} className="bg-[#EEF0FF] p-6 rounded-2xl border border-[#E6E8EF]">
              <h3 className="font-semibold text-[#2D3191] mb-2">{item.title}</h3>
              <p className="text-sm text-[#1F2328]/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REAL-TIME ACTIVITY PRICING */}
      <section id="pricing" className="py-16 bg-white px-6 sm:px-12 border-t border-b border-[#E6E8EF]">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-semibold text-[#1F2328]">Real-Time Activity Costs</h3>
            <p className="text-sm text-[#1F2328]/50 mt-2">
              Prices below are automatically calculated based on today's GBP→INR exchange rate.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-[#1F2328]/70">
                Total transparency. Here’s the live INR breakdown for the tickets included in your package:
              </p>

              <ul className="space-y-3">
                {activities.map((item) => (
                  <li key={item.id} className="flex justify-between items-center p-3 bg-[#F7F6F1] rounded-lg">
                    <span className="font-medium text-[#1F2328]">{item.name}</span>
                    <div className="text-right">
                      <span className="block font-bold text-[#2D3191]">{item.formattedINR}</span>
                      <span className="text-xs text-[#1F2328]/40">£{item.baseGBP}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#2D3191] p-8 rounded-2xl text-white flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <h4 className="text-xl font-semibold mb-2">Total Activity Value</h4>
              <p className="text-4xl font-bold mb-4">{fmt(totalValue)}+</p>
              <p className="text-white/80 text-sm">per person included in your package price.</p>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm font-medium">
                  Plus: 6 Nights 4-Star Hotels + Breakfast + Visa Assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ITINERARY */}
      <section id="itinerary" className="py-20 bg-[#FAFAF8] px-6 sm:px-12">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-3xl font-semibold text-[#1F2328] mb-12 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            Day-by-Day Itinerary
          </h2>

          <div className="space-y-8">
            {[
              { day: 1, title: "Arrival in London", desc: "Arrive at Heathrow. Check-in to your hotel. Evening free for a relaxed walk around the city.", tag: "Leisure" },
              { day: 2, title: "Royal London", desc: "Hop-on Hop-off sightseeing across Buckingham Palace, Big Ben & Westminster. Optional Thames cruise.", tag: "Sightseeing" },
              { day: 3, title: "Icons + Views", desc: "London Eye + a curated city experience (museum / markets / Soho vibes depending on your style).", tag: "Attractions" },
              { day: 4, title: "Stonehenge + Bath", desc: "Day tour to Stonehenge and the beautiful heritage city of Bath. Return by evening.", tag: "Day Trip" },
              { day: 5, title: "Harry Potter Studios", desc: "Warner Bros Studio Tour (transport guidance included). Evening free for shopping on Oxford Street.", tag: "Must Do" },
              { day: 6, title: "Edinburgh / Scotland Taste", desc: "Travel to Edinburgh (train guidance). Explore Edinburgh Castle + old town vibes.", tag: "Scotland" },
              { day: 7, title: "Departure", desc: "Breakfast. Check-out and depart with unreal memories.", tag: "Travel" },
            ].map((day) => (
              <div key={day.day} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#2D3191] text-white flex items-center justify-center font-bold shadow-lg z-10">
                    {day.day}
                  </div>
                  <div className="w-0.5 h-full bg-[#E6E8EF] -mt-2 group-last:hidden" />
                </div>
                <div className="bg-white p-6 rounded-2xl border border-[#E6E8EF] flex-1 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h3 className="text-xl font-semibold text-[#1F2328]">{day.title}</h3>
                    <span className="px-3 py-1 bg-[#E7F7EF] text-[#02A551] text-xs font-bold uppercase rounded-full whitespace-nowrap">
                      {day.tag}
                    </span>
                  </div>
                  <p className="text-[#1F2328]/70">{day.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INCLUSIONS / EXCLUSIONS */}
      <section id="inclusions" className="py-20 px-6 sm:px-12 max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-3xl border border-[#E6E8EF] shadow-sm">
            <h3 className="text-xl font-bold text-[#1F2328] mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#02A551] rounded-full" /> What's Included
            </h3>
            <ul className="space-y-4">
              {[
                "6 Nights accommodation in 4-Star Hotels",
                "Daily Breakfast Buffet",
                "Warner Bros Studio Tour Ticket",
                "Stonehenge + Bath Day Trip",
                "London Eye + Edinburgh Castle Tickets",
                "UK Visa Application Assistance",
                "All Local Taxes (GST & TCS)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[#1F2328]/80">
                  <CheckCircle2 size={20} className="text-[#02A551] flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#E6E8EF] shadow-sm">
            <h3 className="text-xl font-bold text-[#1F2328] mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-red-500 rounded-full" /> What's Excluded
            </h3>
            <ul className="space-y-4">
              {[
                "International Airfare (We can book for you)",
                "Airport Transfers (Use Train/Uber)",
                "Visa Fees (payable to Embassy)",
                "Lunch & Dinner",
                "Travel Insurance",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[#1F2328]/80">
                  <XCircle size={20} className="text-red-500 flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* INDIAN TRAVELER SPECIAL */}
      <section className="py-16 bg-[#EEF0FF] px-6 sm:px-12">
        <div className="max-w-[1200px] mx-auto">
          <h3 className="text-2xl font-semibold text-center mb-10 text-[#1F2328]">Indian Traveler Special</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl flex items-start gap-4">
              <div className="bg-[#E7F7EF] p-3 rounded-xl text-[#02A551]"><Utensils /></div>
              <div>
                <h4 className="font-bold text-[#1F2328]">Indian Food?</h4>
                <p className="text-sm text-[#1F2328]/70 mt-1">
                  Yes. We pick hotels near top Indian restaurants and veg-friendly spots.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl flex items-start gap-4">
              <div className="bg-[#E7F7EF] p-3 rounded-xl text-[#02A551]"><FileCheck /></div>
              <div>
                <h4 className="font-bold text-[#1F2328]">Visa Help?</h4>
                <p className="text-sm text-[#1F2328]/70 mt-1">
                  We handle your checklist, forms, appointment guidance, and document prep.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl flex items-start gap-4">
              <div className="bg-[#E7F7EF] p-3 rounded-xl text-[#02A551]"><Plane /></div>
              <div>
                <h4 className="font-bold text-[#1F2328]">Flights?</h4>
                <p className="text-sm text-[#1F2328]/70 mt-1">
                  We can book flights from major Indian cities with best routing and baggage options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ENQUIRY FORM (kept intact) */}
      <section id="enquire" className="py-20 px-6 sm:px-12 max-w-[800px] mx-auto scroll-mt-24">
        <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-[#E6E8EF] shadow-xl text-center">
          <h2 className="text-3xl font-bold text-[#1F2328] mb-4">Like this UK plan?</h2>
          <p className="text-[#1F2328]/60 mb-8">
            Fill this form to get the final price based on your travel dates.
          </p>

          <form action="https://formsubmit.co/thenomadsco@gmail.com" method="POST" className="space-y-4 text-left">
            <input type="hidden" name="_subject" value="UK Package Inquiry" />
            <input type="hidden" name="_captcha" value="false" />

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-semibold ml-1 text-[#1F2328]">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:outline-none focus:border-[#2D3191] focus:ring-1 focus:ring-[#2D3191] transition-all"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="phone" className="text-sm font-semibold ml-1 text-[#1F2328]">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  required
                  className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:outline-none focus:border-[#2D3191] focus:ring-1 focus:ring-[#2D3191] transition-all"
                  placeholder="e.g. +91 98765 43210"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="dates" className="text-sm font-semibold ml-1 text-[#1F2328]">Travel Month</label>
                <input
                  id="dates"
                  type="text"
                  name="travel_dates"
                  className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:outline-none focus:border-[#2D3191] focus:ring-1 focus:ring-[#2D3191] transition-all"
                  placeholder="e.g. May 2026"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="travelers" className="text-sm font-semibold ml-1 text-[#1F2328]">Number of Travelers</label>
                <input
                  id="travelers"
                  type="text"
                  name="travelers"
                  className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:outline-none focus:border-[#2D3191] focus:ring-1 focus:ring-[#2D3191] transition-all"
                  placeholder="e.g. 2 Adults, 1 Child"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="notes" className="text-sm font-semibold ml-1 text-[#1F2328]">Any specific requirements?</label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:outline-none focus:border-[#2D3191] focus:ring-1 focus:ring-[#2D3191] transition-all resize-none"
                placeholder="e.g. Need Jain food, celebrating anniversary..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#2D3191] text-white font-bold rounded-xl hover:bg-[#242875] transition-all mt-4 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get My Free Quote
            </button>
          </form>
        </div>
      </section>

      <Footer />

      {/* STICKY BOTTOM BAR (Mobile) */}
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

// --- NAVIGATION & FOOTER (Mobile fixed) ---
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const inPageLinks = [
    { label: "Overview", href: "#overview" },
    { label: "Pricing", href: "#pricing" },
    { label: "Itinerary", href: "#itinerary" },
    { label: "Inclusions", href: "#inclusions" },
    { label: "Enquire", href: "#enquire" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-[#E6E8EF] transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={nomadsLogo} alt="The Nomads Co." className="h-10 w-auto transition-transform duration-300 ease-out group-hover:-translate-y-0.5" />
            <span className="text-lg font-semibold text-[#1F2328] tracking-tight" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}>
              The Nomads Co.
            </span>
          </Link>

          <div className="hidden lg:flex items-center justify-center gap-10">
            {inPageLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors duration-300 ease-out"
              >
                {link.label}
              </a>
            ))}
            <Link to="/contactus" className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors duration-300 ease-out">
              Contact
            </Link>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link
              to="/contactus"
              className="hidden lg:block px-6 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-full hover:bg-[#242875] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg"
            >
              Plan My Trip
            </Link>

            <button
              type="button"
              className="lg:hidden text-[#1F2328] p-2 rounded-xl hover:bg-[#F7F6F1] transition-colors"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={["fixed inset-0 z-[60] lg:hidden", isOpen ? "" : "pointer-events-none"].join(" ")} aria-hidden={!isOpen}>
        {/* Backdrop */}
        <button
          type="button"
          className={["absolute inset-0 bg-black/40 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0"].join(" ")}
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        />

        {/* Panel */}
        <div
          className={[
            "absolute right-0 top-0 h-full w-[86%] max-w-sm bg-white shadow-2xl",
            "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        >
          <div className="p-6 border-b border-[#E6E8EF] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={nomadsLogo} alt="The Nomads Co." className="h-9 w-auto" />
              <span className="font-semibold text-[#1F2328]">The Nomads Co.</span>
            </div>
            <button type="button" className="p-2 rounded-xl hover:bg-[#F7F6F1]" onClick={() => setIsOpen(false)} aria-label="Close menu">
              <X size={22} />
            </button>
          </div>

          <div className="p-6 space-y-2">
            {inPageLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl text-[#1F2328] font-medium hover:bg-[#F7F6F1] transition-colors"
              >
                {link.label}
              </a>
            ))}

            <Link
              to="/contactus"
              onClick={() => setIsOpen(false)}
              className="block mt-4 text-center px-4 py-3 rounded-xl bg-[#2D3191] text-white font-semibold hover:bg-[#242875] transition-colors"
            >
              Contact / Plan My Trip
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FAFAF8] text-[#1F2328] py-16 px-6 sm:px-12 border-t border-[#E6E8EF]">
      <div className="max-w-[1400px] mx-auto text-center sm:text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              The Nomads Co.
            </h3>
            <p className="text-sm text-[#1F2328]/70">Crafting extraordinary journeys since 2015.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-[#1F2328]/70">
              <li><Link to="/contactus" className="hover:text-[#2D3191] transition-colors">Contact Us</Link></li>
              <li><span>FAQs</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-[#1F2328]/70">
              <li><span>Privacy Policy</span></li>
              <li><span>Terms</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Social</h4>
            <div className="flex gap-4 justify-center sm:justify-start text-[#2D3191]">
              <a href="https://www.facebook.com/Thenomadsco/" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-[#242875] transition-colors">
                <Facebook />
              </a>
              <a href="https://www.instagram.com/thenomadsco/" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-[#242875] transition-colors">
                <Instagram />
              </a>
            </div>
          </div>
        </div>

        <div className="text-sm text-[#1F2328]/50 pt-8 border-t border-[#E6E8EF]">
          © {currentYear} The Nomads Co. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
