import { Link, useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import type { Route } from "./+types/journal";
import nomadsLogo from "./the nomads logo.jpeg";

function IconBase({ size = 24, className, strokeWidth = 2, fill = "none", children }: any) {
  return <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}
function ArrowLeft(p: any)  { return <IconBase {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></IconBase>; }
function Instagram(p: any)  { return <IconBase {...p}><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></IconBase>; }
function Facebook(p: any)   { return <IconBase {...p}><path d="M14 8h-2c-1.1 0-2 .9-2 2v2H8v3h2v5h3v-5h2.2l.8-3H13v-1.6c0-.4.3-.7.7-.7H16V8z"/></IconBase>; }
function Mail(p: any)       { return <IconBase {...p}><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/></IconBase>; }

export function headers() {
  return { "Cache-Control": "no-store" };
}

export async function loader() {
  // 1-minute cache bucket — same URL within a minute can be edge-cached;
  // fresh enough that new posts appear within 60 s of publishing.
  const cacheKey = Math.floor(Date.now() / 60000);
  const WP_API_URL = `https://dev-nomadsco-journal-backend.pantheonsite.io/wp-json/wp/v2/posts?_embed&_t=${cacheKey}`;
  try {
    const response = await fetch(WP_API_URL, { cf: { cacheTtl: 60 } } as any);
    if (!response.ok) throw new Error("Failed to fetch journal entries");
    const posts = await response.json();
    return posts.map((post: any) => {
      const media = post._embedded?.['wp:featuredmedia']?.[0];
      const sizes = media?.media_details?.sizes;
      const imageUrl = sizes?.large?.source_url
        || sizes?.medium_large?.source_url
        || media?.source_url
        || "/Sikkim.jpg";
      return {
        id: post.id,
        slug: post.slug,
        title: post.title.rendered,
        excerpt: post.excerpt.rendered.replace(/(<([^>]+)>)/gi, "").substring(0, 120) + "...",
        imageUrl,
        date: new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      };
    });
  } catch (error) { return []; }
}

export default function Journal() {
  const posts = useLoaderData<typeof loader>();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-gray-900 font-sans">
      {/* Navigation - Identical to Home */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img src={nomadsLogo} alt="The Nomads Co." width={40} height={40} className="h-10 w-auto rounded-md shadow-sm" />
            <span className={`font-bold tracking-tighter text-2xl ${scrolled ? "text-[#1F2328]" : "text-[#1F2328]"}`}>The Nomads Co.</span>
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#2D3191] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back Home
          </Link>
        </div>
      </nav>

      {/* Cinematic Editorial Hero */}
      <header className="pt-40 pb-20 px-4 text-center">
        <span className="text-[#2D3191] font-bold text-xs uppercase tracking-widest mb-6 block">Travel & Editorial</span>
        <h1 className="text-6xl md:text-8xl font-bold text-[#1F2328] mb-8 tracking-tight" style={{ fontFamily: "'Playfair Display',serif" }}>The Journal</h1>
        <div className="w-20 h-1 bg-[#2D3191] mx-auto rounded-full mb-8" />
        <p className="text-xl text-[#1F2328]/70 max-w-2xl mx-auto">Stories, insights, and behind-the-scenes glimpses from our journeys around the globe.</p>
      </header>

      {/* Grid */}
      <main className="container mx-auto px-4 md:px-8 pb-32">
        {posts.length === 0 ? (
          <div className="max-w-[1200px] mx-auto text-center py-24">
            <p className="text-4xl mb-4">✈️</p>
            <h3 className="text-2xl font-bold text-[#1F2328] mb-3" style={{ fontFamily: "'Playfair Display',serif" }}>Stories coming soon</h3>
            <p className="text-[#1F2328]/60 mb-8">We're working on some amazing travel stories. Check back shortly.</p>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#2D3191] text-white font-bold rounded-full hover:bg-[#242875] transition-all text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        ) : (
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
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[10px] font-bold text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 uppercase tracking-wide">
                    {post.date}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <h4 className="text-xl font-bold text-white leading-tight mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>
                    {post.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer — matches home.tsx */}
      <footer className="relative z-10 bg-[#111418] text-white py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div>
              <span className="text-2xl font-bold text-white mb-4 block" style={{ fontFamily: "'Playfair Display',serif" }}>The Nomads Co.</span>
              <p className="text-gray-400 max-w-xs leading-relaxed">Crafting unforgettable, personalized travel experiences. Your journey, our expertise.</p>
              <div className="flex space-x-4 mt-6">
                <a href="https://www.instagram.com/thenomadsco/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#2D3191] hover:scale-110 transition-all duration-300"><Instagram className="w-4 h-4" /></a>
                <a href="https://www.facebook.com/Thenomadsco/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#2D3191] hover:scale-110 transition-all duration-300"><Facebook className="w-4 h-4" /></a>
                <a href="mailto:thenomadsco@gmail.com" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#2D3191] hover:scale-110 transition-all duration-300"><Mail className="w-4 h-4" /></a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Navigate</h4>
              <ul className="space-y-3 font-medium text-gray-300">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/journal" className="hover:text-white transition-colors">Journal</Link></li>
                <li><a href="mailto:thenomadsco@gmail.com" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-gray-500 font-medium">
            <p className="text-sm">© {new Date().getFullYear()} The Nomads Co. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
