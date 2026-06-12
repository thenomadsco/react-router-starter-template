import { Link, useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import type { Route } from "./+types/journal";
import nomadsLogo from "./the nomads logo.webp";
import { ArrowRight } from "./home";

function IconBase({ size = 24, className, strokeWidth = 2, fill = "none", children }: any) {
  return <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}
function X(p: any) { return <IconBase {...p}><path d="M18 6 6 18"/><path d="M6 6l12 12"/></IconBase>; }

export async function loader() {
  const WP_API_URL = `https://dev-nomadsco-journal-backend.pantheonsite.io/wp-json/wp/v2/posts?_embed&t=${Date.now()}`;
  try {
    const response = await fetch(WP_API_URL, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Failed to fetch journal entries");
    const posts = await response.json();
    return posts.map((post: any) => ({
      id: post.id,
      slug: post.slug,
      title: post.title.rendered,
      excerpt: post.excerpt.rendered.replace(/(<([^>]+)>)/gi, "").substring(0, 120) + "...",
      imageUrl: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || "/Sikkim.jpg",
      date: new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }));
  } catch (error) { throw new Error("Failed to load journal"); }
}

export function meta() {
  return [
    { title: "The Journal | The Nomads Co." },
    { name: "description", content: "Travel stories, tips, and behind-the-scenes insights from The Nomads Co. journeys around the world." },
    { property: "og:title", content: "The Journal | The Nomads Co." },
    { property: "og:description", content: "Stories, insights, and behind-the-scenes glimpses from our journeys around the globe." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md py-4 shadow-sm" : "bg-white/90 backdrop-blur-md py-4 shadow-sm"}`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center gap-2 min-w-0">
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <img src={nomadsLogo} alt="The Nomads Co." width={40} height={40} className="h-10 w-auto rounded-md shadow-sm" />
          <span className="font-bold tracking-tighter text-lg sm:text-2xl text-[#1F2328] whitespace-nowrap">The Nomads Co.</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/#about"        className="text-sm font-medium text-[#1F2328] hover:text-blue-600 transition-colors">About</Link>
          <Link to="/#destinations" className="text-sm font-medium text-[#1F2328] hover:text-blue-600 transition-colors">Destinations</Link>
          <Link to="/#reviews"      className="text-sm font-medium text-[#1F2328] hover:text-blue-600 transition-colors">Reviews</Link>
          <Link to="/journal"       className="text-sm font-medium text-[#2D3191] font-bold transition-colors">Journal</Link>
          <Link to="/#contact"      className="text-sm font-medium text-[#1F2328] hover:text-blue-600 transition-colors">Contact</Link>
          <Link to="/?openFunnel=true" className="px-6 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-full hover:bg-[#242875] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 border border-white/20">Plan My Trip</Link>
        </div>

        <button
          aria-label="Open navigation menu"
          className="md:hidden z-50 p-2 text-gray-900"
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
            <Link to="/journal"       onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-[#2D3191] text-left transition-colors">Journal</Link>
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

export default function Journal() {
  const posts = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-gray-900 font-sans">
      <FullNav />

      <header className="pt-40 pb-20 px-4 text-center">
        <span className="text-[#2D3191] font-bold text-xs uppercase tracking-widest mb-6 block">Travel & Editorial</span>
        <h1 className="text-6xl md:text-8xl font-bold text-[#1F2328] mb-8 tracking-tight" style={{ fontFamily: "'Playfair Display',serif" }}>The Journal</h1>
        <div className="w-20 h-1 bg-[#2D3191] mx-auto rounded-full mb-8" />
        <p className="text-xl text-[#1F2328]/70 max-w-2xl mx-auto">Stories, insights, and behind-the-scenes glimpses from our journeys around the globe.</p>
      </header>

      <main className="container mx-auto px-4 md:px-8 pb-32">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post: any) => (
            <Link
              key={post.id}
              to={`/journal/${post.slug}`}
              className="group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-2 bg-black block"
              style={{ aspectRatio: "3/4" }}
            >
              <img
                src={post.imageUrl}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" loading="lazy" decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] font-bold text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 uppercase tracking-wide">
                  {post.date}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <h2 className="text-xl font-bold text-white leading-tight mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>
                  {post.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4 text-center">
      <div className="max-w-md">
        <h1 className="text-4xl font-bold text-[#1F2328] mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>Journal Maintenance</h1>
        <p className="text-gray-500 mb-8">Our editorial engine is currently syncing or undergoing brief maintenance. Please excuse the dust!</p>
        <Link to="/" className="inline-flex items-center justify-center px-8 py-3 bg-[#2D3191] text-white font-bold rounded-full hover:bg-[#242875] transition-all">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
