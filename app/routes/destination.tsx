import { Link, useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import nomadsLogo from "./the nomads logo.webp";
import type { Route } from "./+types/destination";

// Import central database and shared components from the homepage
import {
  destinations,
  DestinationFunnel,
  ArrowLeft,
  ArrowRight,
  waLink
} from "./home";

function IconBase({ size = 24, className, strokeWidth = 2, fill = "none", children }: any) {
  return <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}
function Menu(p: any) { return <IconBase {...p}><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></IconBase>; }
function X(p: any) { return <IconBase {...p}><path d="M18 6 6 18"/><path d="M6 6l12 12"/></IconBase>; }

export function loader({ params }: Route.LoaderArgs) {
  const dest = destinations.find(d => d.slug === params.slug);
  if (!dest) {
    throw new Response("Destination Not Found", { status: 404 });
  }
  return dest;
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) return [{ title: "Not Found | The Nomads Co." }];

  const url = `https://thenomadsco.in/destinations/${data.slug}`;
  const title = `Travel to ${data.title} | The Nomads Co.`;
  return [
    { title: title },
    { name: "description", content: data.description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:title", content: title },
    { property: "og:description", content: data.description },
    { property: "og:image", content: data.image },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" }
  ];
}

function FullNav() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"}`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center gap-2 min-w-0">
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <img src={nomadsLogo} alt="The Nomads Co." width={40} height={40} className="h-10 w-auto rounded-md shadow-sm" />
          <span className={`font-bold tracking-tighter text-lg sm:text-2xl transition-colors whitespace-nowrap ${scrolled ? "text-[#1F2328]" : "text-white"}`}>The Nomads Co.</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/#about"        className={`text-sm font-medium transition-colors ${scrolled ? "text-[#1F2328] hover:text-blue-600" : "text-white hover:text-blue-300"}`}>About</Link>
          <Link to="/#destinations" className={`text-sm font-medium transition-colors ${scrolled ? "text-[#1F2328] hover:text-blue-600" : "text-white hover:text-blue-300"}`}>Destinations</Link>
          <Link to="/#reviews"      className={`text-sm font-medium transition-colors ${scrolled ? "text-[#1F2328] hover:text-blue-600" : "text-white hover:text-blue-300"}`}>Reviews</Link>
          <Link to="/journal"       className={`text-sm font-medium transition-colors ${scrolled ? "text-[#1F2328] hover:text-blue-600" : "text-white hover:text-blue-300"}`}>Journal</Link>
          <Link to="/#contact"      className={`text-sm font-medium transition-colors ${scrolled ? "text-[#1F2328] hover:text-blue-600" : "text-white hover:text-blue-300"}`}>Contact</Link>
          <Link to="/?openFunnel=true" className="px-6 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-full hover:bg-[#242875] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 border border-white/20">Plan My Trip</Link>
        </div>

        <button
          aria-label="Open navigation menu"
          className={`md:hidden z-50 p-2 transition-colors ${isMenuOpen || scrolled ? "text-gray-900" : "text-white"}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="space-y-1.5">
            <span className="block w-6 h-0.5 bg-current" />
            <span className="block w-4 h-0.5 bg-current ml-auto" />
            <span className="block w-6 h-0.5 bg-current" />
          </div>
        </button>
      </div>

      <div className={`fixed inset-0 z-[100] transition-opacity duration-500 md:hidden ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
        <div className={`absolute top-0 right-0 bottom-0 w-[80%] max-w-[320px] bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-6 flex justify-end">
            <button aria-label="Close navigation menu" onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-900 transition-colors"><X size={28} /></button>
          </div>
          <div className="flex-1 flex flex-col px-8 py-4 gap-8 overflow-y-auto">
            <Link to="/#about"        onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-[#1F2328] text-left hover:text-[#2D3191] transition-colors">About</Link>
            <Link to="/#destinations" onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-[#1F2328] text-left hover:text-[#2D3191] transition-colors">Destinations</Link>
            <Link to="/#reviews"      onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-[#1F2328] text-left hover:text-[#2D3191] transition-colors">Reviews</Link>
            <Link to="/journal"       onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-[#1F2328] text-left hover:text-[#2D3191] transition-colors">Journal</Link>
            <Link to="/#contact"      onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-[#1F2328] text-left hover:text-[#2D3191] transition-colors">Contact</Link>
          </div>
          <div className="p-8 pb-12 border-t border-gray-100 bg-[#FAFAF8]">
            <Link to="/?openFunnel=true" onClick={() => setIsMenuOpen(false)} className="w-full py-4 bg-[#2D3191] text-white text-lg font-bold rounded-2xl shadow-lg hover:bg-[#242875] transition-colors flex items-center justify-center gap-2">
              Plan My Trip <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function DestinationPage() {
  const dest = useLoaderData<typeof loader>();
  const [showFunnel, setShowFunnel] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-gray-900 font-sans">

      <FullNav />

      {/* Cinematic Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end justify-center w-full bg-[#1F2328] overflow-hidden pb-16">
        <img
          src={dest.image}
          alt={dest.title}
          className="absolute inset-0 w-full h-full object-cover opacity-80 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F2328] via-[#1F2328]/50 to-transparent z-10 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-8 relative z-20 max-w-[800px] text-center">
          <span className="text-blue-300 font-bold text-xs uppercase tracking-widest mb-4 block">
            {dest.category} Destination
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1] drop-shadow-xl" style={{ fontFamily: "'Playfair Display',serif" }}>
            {dest.title}
          </h1>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {dest.tags.map((tag, i) => (
              <span key={i} className="text-xs font-bold text-white bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 uppercase tracking-wide">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Destination Content */}
      <section className="py-20 bg-[#FAFAF8]">
        <div className="container mx-auto px-4 md:px-8 max-w-[800px] text-center">
          <h2 className="text-3xl font-bold text-[#1F2328] mb-8" style={{ fontFamily: "'Playfair Display',serif" }}>
            Why visit {dest.title}?
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-16">
            {dest.description}
          </p>

          {/* Highlights */}
          {dest.highlights && dest.highlights.length > 0 && (
            <div className="mt-12 text-left">
              <h2 className="text-2xl font-bold text-[#1F2328] mb-6" style={{ fontFamily: "'Playfair Display',serif" }}>Top Highlights</h2>
              <ul className="space-y-3">
                {dest.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-[#2D3191] mt-2 flex-shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Best Time + Price */}
          {(dest.bestTime || dest.priceRange) && (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              {dest.bestTime && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-[#1F2328] mb-2">Best Time to Visit</h3>
                  <p className="text-gray-500">{dest.bestTime}</p>
                </div>
              )}
              {dest.priceRange && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-[#1F2328] mb-2">Price Range</h3>
                  <p className="text-gray-500">{dest.priceRange}</p>
                </div>
              )}
            </div>
          )}

          {/* Sample Itinerary */}
          {dest.sampleItinerary && dest.sampleItinerary.length > 0 && (
            <div className="mt-12 text-left">
              <h2 className="text-2xl font-bold text-[#1F2328] mb-6" style={{ fontFamily: "'Playfair Display',serif" }}>Sample Itinerary</h2>
              <div className="space-y-4">
                {dest.sampleItinerary.map((item, i) => (
                  <div key={i} className="flex gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <span className="text-xs font-bold text-[#2D3191] bg-[#EEF0FF] px-3 py-1 rounded-full self-start whitespace-nowrap">{item.day}</span>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.activities}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Why Kirti */}
          {dest.whyKirti && (
            <div className="mt-10 bg-[#EEF0FF] rounded-2xl p-8 text-left">
              <h3 className="font-bold text-[#2D3191] mb-3">Why book this with Kirti?</h3>
              <p className="text-[#1F2328]/80 leading-relaxed">{dest.whyKirti}</p>
            </div>
          )}

          <div className="mt-16 bg-white rounded-[2rem] p-10 shadow-lg border border-gray-100 flex flex-col items-center">
            <h3 className="text-2xl font-bold text-[#1F2328] mb-4">Ready to go?</h3>
            <p className="text-gray-500 mb-8 max-w-md">
              Let Kirti handle the visas, flights, and accommodations so you can focus on the memories.
            </p>
            <button
              onClick={() => setShowFunnel(true)}
              className="w-full sm:w-auto px-10 py-4 bg-[#2D3191] text-white text-lg font-bold rounded-full shadow-[0_10px_40px_rgba(45,49,145,0.4)] hover:bg-[#242875] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Design Your Escape <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.open(waLink(`Hi Kirti! 👋 I'm looking at your page for ${dest.title} and would love to plan a trip. Can you help me?`), "_blank")}
              className="mt-4 text-[#2D3191] font-bold text-sm hover:underline"
            >
              Or chat instantly on WhatsApp
            </button>
          </div>
        </div>
      </section>

      {showFunnel && (
        <DestinationFunnel
          preselectedDest={dest.title}
          onClose={() => setShowFunnel(false)}
          utmData={{ source: "direct", medium: "destination_page", campaign: dest.slug }}
        />
      )}
    </div>
  );
}
