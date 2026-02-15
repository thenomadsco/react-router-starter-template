import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";
import nomadsLogo from "./the nomads logo.jpeg";
import type { Route } from "./+types/home";

const PAGE_CONFIG = {
  title: "Ladakh",
  subtitle: "Land of High Passes",
  badge: "Adventure",
  durationLabel: "5 Nights / 6 Days",
  visaLabel: "No Visa Required",
  seasonLabel: "Best: May - Sep",
  heroSlides: [
    { label: "Pangong Lake", alt: "Blue Pangong Lake", src: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1920&auto=format&fit=crop" },
    { label: "Monasteries", alt: "Thiksey Monastery", src: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1920&auto=format&fit=crop" },
  ],
  itinerary: [
    { day: "01", title: "Arrival in Leh", desc: "Fly over the Himalayas to reach Leh. Rest completely to acclimatize to the high altitude." },
    { day: "02", title: "Sham Valley Tour", desc: "Visit the Hall of Fame, Magnetic Hill, and the confluence of Indus and Zanskar rivers." },
    { day: "03", title: "Nubra Valley via Khardung La", desc: "Drive over the world's highest motorable pass, Khardung La. Ride the double-humped camels in Hunder sand dunes." },
    { day: "04", title: "Pangong Lake", desc: "Drive to the famous color-changing Pangong Lake. The view of the blue water against arid mountains is surreal." },
    { day: "05", title: "Return to Leh", desc: "Drive back to Leh via Chang La pass. Visit Thiksey Monastery on the way. Departure next morning." },
  ],
};

export function headers() {
  return { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" };
}

// --- ICONS ---
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
function Clock(props: any) { return (<IconBase {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></IconBase>); }
function Calendar(props: any) { return (<IconBase {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></IconBase>); }
function FileCheck(props: any) { return (<IconBase {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="m9 15 2 2 4-4" /></IconBase>); }
function Facebook(props: any) { return (<IconBase {...props}><path d="M14 8h-2c-1.1 0-2 .9-2 2v2H8v3h2v5h3v-5h2.2l.8-3H13v-1.6c0-.4.3-.7.7-.7H16V8z" /></IconBase>); }
function Instagram(props: any) { return (<IconBase {...props}><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></IconBase>); }

const customStyles = `
  html { scroll-behavior: smooth; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
  }
`;

export default function DestinationPage() {
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
            <p className="text-white/80 text-lg mb-6">
              "Every journey tells a story. Let's write yours."
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

      {/* ITINERARY */}
      <section id="itinerary" className="py-20 bg-white px-6 sm:px-12">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-[#1F2328] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Day-by-Day Journey
            </h2>
            <p className="text-[#1F2328]/60">A curated experience, just for you.</p>
          </div>
          <div className="relative pl-8 sm:pl-10">
            <div className="absolute left-0 top-2 bottom-4 w-[2px] bg-[#E6E8EF]"></div>
            <div className="space-y-12">
              {PAGE_CONFIG.itinerary.map((item, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -left-[42px] sm:-left-[50px] top-0 w-[24px] sm:w-auto bg-[#1F2328] text-white text-xs font-bold py-1.5 px-2 rounded-md shadow-md z-10 text-center leading-tight">
                    <span className="hidden sm:inline">Day </span>{item.day}
                  </div>
                  <div className="ml-4 sm:ml-8">
                    <h3 className="text-xl font-bold text-[#1F2328] mb-3 group-hover:text-[#2D3191] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[#1F2328]/80 leading-relaxed whitespace-pre-line">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute left-[-4px] bottom-0 w-3 h-3 bg-[#E6E8EF] rounded-full border-2 border-white"></div>
          </div>
        </div>
      </section>

      {/* ENQUIRY FORM */}
      <section id="enquire" className="py-20 px-6 sm:px-12 max-w-[800px] mx-auto scroll-mt-24">
        <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-[#E6E8EF] shadow-xl text-center">
          <h2 className="text-3xl font-bold text-[#1F2328] mb-4">Start Your Journey</h2>
          <p className="text-[#1F2328]/60 mb-8">
            Get a personalized quote for {PAGE_CONFIG.title}.
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E6E8EF] p-4 sm:hidden flex items-center justify-between z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div>
          <p className="text-xs text-[#1F2328]/60">Interested?</p>
          <p className="text-lg font-bold text-[#2D3191]">Get a Quote</p>
        </div>
        <a href="#enquire" className="px-6 py-2.5 bg-[#02A551] text-white text-sm font-bold rounded-full shadow-md">
          Enquire Now
        </a>
      </div>
    </div>
  );
}

// --- NAVIGATION & FOOTER (Standard) ---
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = isOpen ? "hidden" : ""; }, [isOpen]);
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-[#E6E8EF]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={nomadsLogo} alt="The Nomads Co." className="h-10 w-auto group-hover:-translate-y-0.5 transition-transform" />
            <span className="font-semibold text-[#1F2328] hidden sm:inline">The Nomads Co.</span>
          </Link>
          <div className="hidden lg:flex items-center justify-center gap-10">
             <Link to="/" className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">Home</Link>
             <Link to="/contactus" className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">Contact</Link>
          </div>
          <div className="flex items-center justify-end gap-4">
            <Link to="/contactus" className="hidden lg:block px-6 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-full hover:bg-[#242875] hover:-translate-y-0.5 transition-all">Plan My Trip</Link>
            <button className="lg:hidden p-2" onClick={() => setIsOpen(true)}><Menu size={24} /></button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[80%] bg-white shadow-2xl p-6">
            <div className="flex justify-between items-center mb-8"><span className="font-bold text-lg">Menu</span><button onClick={() => setIsOpen(false)}><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium text-[#1F2328]">Home</Link>
              <Link to="/contactus" onClick={() => setIsOpen(false)} className="text-lg font-medium text-[#1F2328]">Contact</Link>
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
        <div><h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>The Nomads Co.</h3><p className="text-sm text-[#1F2328]/70">Crafting extraordinary journeys since 2015.</p></div>
        <div><h4 className="font-semibold mb-4">Support</h4><Link to="/contactus" className="text-sm text-[#1F2328]/70 hover:text-[#2D3191]">Contact Us</Link></div>
        <div><h4 className="font-semibold mb-4">Social</h4><div className="flex gap-4 justify-center sm:justify-start text-[#2D3191]"><a href="https://www.instagram.com/thenomadsco/"><Instagram /></a><a href="https://www.facebook.com/Thenomadsco/"><Facebook /></a></div></div>
        <div><p className="text-sm text-[#1F2328]/50">© {new Date().getFullYear()} The Nomads Co.</p></div>
      </div>
    </footer>
  );
}
