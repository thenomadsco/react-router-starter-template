import { Link, useLoaderData } from "react-router";
import { useEffect, useMemo, useState } from "react";
import nomadsLogo from "./the nomads logo.jpeg";
import type { Route } from "./+types/home";

/**
 * MASTER BLUEPRINT TEMPLATE (UK VERSION)
 * --------------------------------------
 * UPDATED: Replaced "Nomads Advantage" with "Vertical Timeline Itinerary"
 * DESIGN REF: Narmada Holidays (Day Box + Spine Line)
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

  // DETAILED VERTICAL ITINERARY DATA
  itinerary: [
    {
      day: "01",
      title: "Arrival in London: The Royal Welcome",
      desc: "Touch down at London Heathrow where your private chauffeur awaits. Enjoy a smooth transfer to your central hotel, passing iconic sights like Hyde Park and Harrods. After check-in, the evening is yours. We recommend a relaxed stroll through Covent Garden or Leicester Square to soak in the electric atmosphere of the capital.",
      stay: "The Strand Palace (or similar 4★)",
      meals: "Dinner included",
      travel: "Private Transfer: 1 hr",
    },
    {
      day: "02",
      title: "Icons of London: Palaces & Panoramas",
      desc: "After a hearty English breakfast, board the Hop-on Hop-off bus to witness Buckingham Palace, Big Ben, and the Tower of London at your own pace. In the late afternoon, skip the queues with our Fast-Track tickets to the London Eye. Witness the sun setting over the Thames—a truly magical perspective of the city skyline.",
      stay: "The Strand Palace (or similar 4★)",
      meals: "Breakfast & Dinner",
      travel: "Sightseeing: 6-8 hrs",
    },
    {
      day: "03",
      title: "Ancient Mysteries: Stonehenge & Bath",
      desc: "Escape the city for a journey back in time. We drive through the rolling English countryside to Stonehenge, the world's most famous prehistoric monument. Continue to the UNESCO city of Bath. Walk the cobblestone streets, visit the ancient Roman Baths, and admire the Georgian architecture before returning to London in the evening.",
      stay: "The Strand Palace (or similar 4★)",
      meals: "Breakfast",
      travel: "Coach Tour: Full Day",
    },
    {
      day: "04",
      title: "Wizardry & The North: London to Edinburgh",
      desc: "A treat for the fans—start your day with the Warner Bros. Harry Potter Studio Tour (transport included). Walk the Great Hall and Diagon Alley. In the afternoon, we transfer you to King's Cross for a scenic high-speed train journey to Edinburgh. Watch the landscape shift from urban sprawl to green hills as you enter Scotland.",
      stay: "Apex Grassmarket (or similar 4★)",
      meals: "Breakfast",
      travel: "Train: 4.5 hrs",
    },
    {
      day: "05",
      title: "The Old Town: Secrets of Edinburgh",
      desc: "Wake up in the medieval beauty of Edinburgh. Walk the Royal Mile, listening to bagpipers, up to the imposing Edinburgh Castle (entry included). See the Crown Jewels and the Stone of Destiny. The afternoon is free for whisky tasting or exploring the spooky underground vaults of the city.",
      stay: "Apex Grassmarket (or similar 4★)",
      meals: "Breakfast & Dinner",
      travel: "Walking Tour: 3-4 hrs",
    },
    {
      day: "06",
      title: "Highlands Safari: Loch Ness & Glencoe",
      desc: "The grand finale. A full-day guided adventure into the Scottish Highlands. Drive past the hauntingly beautiful Glencoe, see Britain's highest mountain (Ben Nevis), and cruise on the legendary Loch Ness. Keep an eye out for 'Nessie'! Return to Edinburgh with camera rolls full of memories.",
      stay: "Apex Grassmarket (or similar 4★)",
      meals: "Breakfast",
      travel: "Coach Tour: 9-10 hrs",
    },
    {
      day: "07",
      title: "Homeward Bound",
      desc: "Enjoy a final breakfast in Scotland. Your driver will pick you up for a transfer to Edinburgh Airport (EDI) for your flight back home. Bid farewell to the UK with a promise to return.",
      stay: "N/A",
      meals: "Breakfast",
      travel: "Airport Transfer: 45 mins",
    },
  ],

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
function Utensils(props: any) { return (<IconBase {...props}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></IconBase>); }
function Car(props: any) { return (<IconBase {...props}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></IconBase>); }
function BedDouble(props: any) { return (<IconBase {...props}><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" /><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" /><path d="M12 4v6" /><path d="M2 18h20" /></IconBase>); }

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

      {/* 2. OVERVIEW */}
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

      {/* 3. NEW VERTICAL TIMELINE ITINERARY */}
      <section id="itinerary" className="py-16 bg-white px-6 sm:px-12">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-[#1F2328] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Day-by-Day Journey
            </h2>
            <p className="text-[#1F2328]/60">A detailed breakdown of your trip.</p>
          </div>

          <div className="relative pl-8 sm:pl-10">
            {/* The Vertical Spine */}
            <div className="absolute left-0 top-2 bottom-4 w-[2px] bg-[#E6E8EF]"></div>

            <div className="space-y-12">
              {PAGE_CONFIG.itinerary.map((item, index) => (
                <div key={index} className="relative group">
                  {/* The Black Day Box */}
                  <div className="absolute -left-[42px] sm:-left-[50px] top-0 w-[24px] sm:w-auto bg-[#1F2328] text-white text-xs font-bold py-1.5 px-2 rounded-md shadow-md z-10 text-center leading-tight">
                    <span className="hidden sm:inline">Day </span>{item.day}
                  </div>
                  
                  {/* The Content Card */}
                  <div className="ml-4 sm:ml-8">
                    <h3 className="text-xl font-bold text-[#1F2328] mb-3 group-hover:text-[#2D3191] transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-[#1F2328]/70 leading-relaxed mb-6">
                      {item.desc}
                    </p>

                    {/* Micro Stats / Tags */}
                    <div className="flex flex-wrap gap-4 text-xs font-medium text-[#1F2328]/60 uppercase tracking-wide">
                      {item.travel && (
                        <div className="flex items-center gap-1.5 bg-[#F7F6F1] px-3 py-1.5 rounded-full border border-[#E6E8EF]">
                          <Car size={14} className="text-[#2D3191]" /> {item.travel}
                        </div>
                      )}
                      {item.stay && item.stay !== "N/A" && (
                         <div className="flex items-center gap-1.5 bg-[#F7F6F1] px-3 py-1.5 rounded-full border border-[#E6E8EF]">
                          <BedDouble size={14} className="text-[#2D3191]" /> {item.stay}
                        </div>
                      )}
                      {item.meals && (
                         <div className="flex items-center gap-1.5 bg-[#F7F6F1] px-3 py-1.5 rounded-full border border-[#E6E8EF]">
                          <Utensils size={14} className="text-[#2D3191]" /> {item.meals}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* End Dot */}
            <div className="absolute left-[-4px] bottom-0 w-3 h-3 bg-[#E6E8EF] rounded-full border-2 border-white"></div>
          </div>
        </div>
      </section>

      {/* 4. PRICING TRANSPARENCY */}
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

      {/* 5. FAQ */}
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

      {/* 6. ENQUIRY FORM */}
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
