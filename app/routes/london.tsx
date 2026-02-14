import { Link, useLoaderData } from "react-router";
import { useEffect, useMemo, useState } from "react";
import nomadsLogo from "./the nomads logo.jpeg";
import type { Route } from "./+types/home";

/**
 * MASTER BLUEPRINT TEMPLATE (UK VERSION)
 * --------------------------------------
 * Use this structure for all 23 destinations.
 *
 * KEY SECTIONS:
 * 1. Hero Slideshow (High-Quality Assets)
 * 2. Overview (The "Hook")
 * 3. The Nomads Advantage (Why Us? - Replaces generic details)
 * 4. Itinerary (The Product)
 * 5. Pricing Transparency (The Value)
 * 6. Smart FAQ (Objection Handling)
 * 7. Enquiry Form (Conversion)
 */

// --- 1) CONFIGURATION (Edit this for each destination) ---
const PAGE_CONFIG = {
  title: "United Kingdom",
  subtitle: "Royalty, Highlands & Heritage",
  badge: "Best Seller",
  durationLabel: "6 Nights / 7 Days",
  visaLabel: "UK Visa Assisted",
  seasonLabel: "Best: Apr - Sep",
  basePackageCostGBP: 1250,

  // Reliable Unsplash IDs
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

  // Activity Catalog (Live Pricing Calculation)
  activityCatalog: [
    { id: "london-eye", name: "London Eye (Fast Track)", baseGBP: 42 },
    { id: "warner-bros", name: "Warner Bros. Harry Potter Tour", baseGBP: 55 },
    { id: "stonehenge-bath", name: "Stonehenge & Bath Day Trip", baseGBP: 85 },
    { id: "edinburgh-castle", name: "Edinburgh Castle Entry", baseGBP: 22 },
    { id: "highlands-safari", name: "Loch Ness & Highlands Safari", baseGBP: 110 },
  ],

  // FAQs specific to this destination
  faqs: [
    {
      question: "How long does the UK Visa take?",
      answer: "Currently, UK standard visitor visas take about 15-20 working days. We recommend applying at least 2 months in advance. Our team handles the entire documentation process for you to minimize rejection risks."
    },
    {
      question: "Can I customize this itinerary?",
      answer: "Absolutely. This is a recommended 'Best of UK' route, but if you want to add 2 days in Manchester or skip the Highlands, we will tailor it exactly to your needs."
    },
    {
      question: "Is airfare included in the cost?",
      answer: "The package price covers hotels, transfers, and sightseeing. Flights are not included as prices fluctuate daily, but we can help you book the best connections from your city at net rates."
    },
    {
      question: "Will we get Indian food options?",
      answer: "Yes. The UK has excellent Indian cuisine. We specifically choose hotels that are within walking distance of top-rated Indian/Veg restaurants and provide a curated list in your travel guidebook."
    }
  ]
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
function FileCheck(props: any) { return (<IconBase {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="m9 15 2 2 4-4" /></IconBase>); }
function Facebook(props: any) { return (<IconBase {...props}><path d="M14 8h-2c-1.1 0-2 .9-2 2v2H8v3h2v5h3v-5h2.2l.8-3H13v-1.6c0-.4.3-.7.7-.7H16V8z" /></IconBase>); }
function Instagram(props: any) { return (<IconBase {...props}><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></IconBase>); }
function RefreshCw(props: any) { return (<IconBase {...props}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></IconBase>); }
function ChevronDown(props: any) { return (<IconBase {...props}><path d="m6 9 6 6 6-6" /></IconBase>); }
function ChevronUp(props: any) { return (<IconBase {...props}><path d="m18 15-6-6-6 6" /></IconBase>); }
function ShieldCheck(props: any) { return (<IconBase {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></IconBase>); }
function Headset(props: any) { return (<IconBase {...props}><path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" /><path d="M21 16v2a4 4 0 0 1-4 4h-5" /></IconBase>); }
function Wallet(props: any) { return (<IconBase {...props}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></IconBase>); }
function Sparkles(props: any) { return (<IconBase {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M9 3v4" /><path d="M3 5h4" /><path d="M3 9h4" /></IconBase>); }

const customStyles = `
  html { scroll-behavior: smooth; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
  }
  .accordion-content { transition: grid-template-rows 0.3s ease-out; }
  .accordion-open { grid-template-rows: 1fr; }
  .accordion-closed { grid-template-rows: 0fr; }
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

      {/* 1. HERO SECTION */}
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

      {/* 2. OVERVIEW (The Hook) */}
      <section id="overview" className="py-20 px-6 sm:px-12 max-w-[1000px] mx-auto text-center">
        <h2 className="text-3xl font-semibold text-[#1F2328] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
          The "Best of UK" Route
        </h2>
        <p className="text-lg text-[#1F2328]/70 leading-relaxed mb-12">
          This itinerary is engineered for the modern traveler. We've optimized the travel times to ensure you spend more time seeing Big Ben and the Highlands, and less time on trains.
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

      {/* 3. THE NOMADS ADVANTAGE (Trust & Value - Replaces details) */}
      <section className="py-20 bg-[#F7F6F1] px-6 sm:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-semibold text-[#1F2328] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Why Travel with The Nomads Co.?
            </h3>
            <p className="text-[#1F2328]/60 max-w-2xl mx-auto">
              You pack the bags. We handle the stress. Here is the Nomads promise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-2xl border border-[#E6E8EF] shadow-sm hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-[#E7F7EF] rounded-xl flex items-center justify-center text-[#02A551] mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <h4 className="text-lg font-bold text-[#1F2328] mb-3">No-Rejection Visa Protocol</h4>
              <p className="text-sm text-[#1F2328]/70 leading-relaxed">
                Visas can be scary. We don't just give you a checklist; our team reviews every document to ensure a near-perfect success rate.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-[#E6E8EF] shadow-sm hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-[#EEF0FF] rounded-xl flex items-center justify-center text-[#2D3191] mb-6 group-hover:scale-110 transition-transform">
                <Headset size={24} />
              </div>
              <h4 className="text-lg font-bold text-[#1F2328] mb-3">24/7 Human Support</h4>
              <p className="text-sm text-[#1F2328]/70 leading-relaxed">
                Stuck at a station? Flight delayed? We are one WhatsApp away. No bots, just your dedicated trip manager in your time zone.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-[#E6E8EF] shadow-sm hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-[#FFF4E5] rounded-xl flex items-center justify-center text-[#B45309] mb-6 group-hover:scale-110 transition-transform">
                <Sparkles size={24} />
              </div>
              <h4 className="text-lg font-bold text-[#1F2328] mb-3">Curated Experiences</h4>
              <p className="text-sm text-[#1F2328]/70 leading-relaxed">
                We don't just book hotels. We book memories. From VIP passes to hidden local gems, we ensure your trip stands out.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-[#E6E8EF] shadow-sm hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-[#F3F4F6] rounded-xl flex items-center justify-center text-[#374151] mb-6 group-hover:scale-110 transition-transform">
                <Wallet size={24} />
              </div>
              <h4 className="text-lg font-bold text-[#1F2328] mb-3">Zero Hidden Costs</h4>
              <p className="text-sm text-[#1F2328]/70 leading-relaxed">
                The price we quote is the price you pay. Taxes, resort fees, and internal transfers are calculated upfront. No nasty surprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ITINERARY (The Product) */}
      <section id="itinerary" className="py-20 bg-white px-6 sm:px-12">
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

      {/* 5. PRICING TRANSPARENCY (The Value) */}
      <section id="pricing" className="py-16 bg-[#EEF0FF] px-6 sm:px-12 border-t border-b border-[#E6E8EF]">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-semibold text-[#1F2328]">What's Included?</h3>
            <p className="text-sm text-[#1F2328]/50 mt-2">
              Full transparency. Here is the live value of your package.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-4">
               <ul className="space-y-3">
                {activities.map((item) => (
                  <li key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-[#E6E8EF]">
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
              <div className="mt-6 pt-6 border-t border-white/20 text-xs opacity-70">
                * Prices fluctuate with exchange rates. Lock your price today.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SMART FAQ (Objection Handling) */}
      <section className="py-20 bg-white px-6 sm:px-12">
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-semibold text-[#1F2328] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Frequently Asked Questions
            </h3>
          </div>
          <FAQSection faqs={PAGE_CONFIG.faqs} />
        </div>
      </section>

      {/* 7. ENQUIRY FORM (Conversion) */}
      <section id="enquire" className="py-20 px-6 sm:px-12 max-w-[800px] mx-auto scroll-mt-24">
        <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-[#E6E8EF] shadow-xl text-center">
          <h2 className="text-3xl font-bold text-[#1F2328] mb-4">Like this plan?</h2>
          <p className="text-[#1F2328]/60 mb-8">
            Get your final quote based on your travel dates.
          </p>

          <form action="https://formsubmit.co/thenomadsco@gmail.com" method="POST" className="space-y-4 text-left">
            <input type="hidden" name="_subject" value={`${PAGE_CONFIG.title} Package Inquiry`} />
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

// --- SUBCOMPONENTS ---

function FAQSection({ faqs }: { faqs: { question: string, answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="border border-[#E6E8EF] rounded-xl overflow-hidden bg-[#FAFAF8]">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-5 text-left font-medium text-[#1F2328] hover:bg-[#F3F4F6] transition-colors"
          >
            {faq.question}
            {openIndex === index ? <ChevronUp size={20} className="text-[#2D3191]" /> : <ChevronDown size={20} className="text-[#1F2328]/50" />}
          </button>
          <div className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
             <div className="overflow-hidden">
               <div className="p-5 pt-0 text-[#1F2328]/70 leading-relaxed text-sm">
                 {faq.answer}
               </div>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = isOpen ? "hidden" : ""; }, [isOpen]);

  const inPageLinks = [
    { label: "Overview", href: "#overview" },
    { label: "Itinerary", href: "#itinerary" },
    { label: "Pricing", href: "#pricing" },
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
