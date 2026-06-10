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
    { tagName: "link", rel: "canonical", href: url }, // Ensures Google indexes this specific destination
    { property: "og:title", content: title },
    { property: "og:description", content: data.description },
    { property: "og:image", content: data.image },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" }
  ];
}

export default function DestinationPage() {
  const dest = useLoaderData<typeof loader>();
  const [scrolled, setScrolled] = useState(false);
  const [showFunnel, setShowFunnel] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-gray-900 font-sans">
      
      {/* Global Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img src={nomadsLogo} alt="The Nomads Co." width={40} height={40} className="h-10 w-auto rounded-md shadow-sm" />
            <span className={`font-bold tracking-tighter text-2xl ${scrolled ? "text-[#1F2328]" : "text-white"}`}>The Nomads Co.</span>
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hover:bg-white hover:text-[#2D3191] text-white">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </nav>

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

          <div className="bg-white rounded-[2rem] p-10 shadow-lg border border-gray-100 flex flex-col items-center">
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
              onClick={() => window.open(waLink(`Hi Kirti! ðŸ‘‹ I'm looking at your page for ${dest.title} and would love to plan a trip. Can you help me?`), "_blank")}
              className="mt-4 text-[#2D3191] font-bold text-sm hover:underline"
            >
              Or chat instantly on WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Re-use the Funnel but pre-fill it with this exact destination */}
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
