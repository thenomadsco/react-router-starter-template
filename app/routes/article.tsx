import { Link, useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import type { Route } from "./+types/article";
import nomadsLogo from "./the nomads logo.jpeg";

function IconBase({ size = 24, className, strokeWidth = 2, fill = "none", children }: any) {
  return <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}
function ArrowLeft(p: any) { return <IconBase {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></IconBase>; }
function Instagram(p: any) { return <IconBase {...p}><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></IconBase>; }
function Facebook(p: any)  { return <IconBase {...p}><path d="M14 8h-2c-1.1 0-2 .9-2 2v2H8v3h2v5h3v-5h2.2l.8-3H13v-1.6c0-.4.3-.7.7-.7H16V8z"/></IconBase>; }
function Mail(p: any)      { return <IconBase {...p}><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/></IconBase>; }

export function headers() {
  return { "Cache-Control": "no-store" };
}

export async function loader({ params }: Route.LoaderArgs) {
  const WP_API_URL = `https://dev-nomadsco-journal-backend.pantheonsite.io/wp-json/wp/v2/posts?slug=${params.slug}&_embed`;

  try {
    const response = await fetch(WP_API_URL, {
      cf: { cacheTtl: 300, cacheEverything: true }
    } as any);
    if (!response.ok) throw new Response("Article not found", { status: 404 });
    const posts = await response.json();
    if (posts.length === 0) throw new Response("Not Found", { status: 404 });

    const post = posts[0];
    return {
      title: post.title.rendered,
      content: post.content.rendered,
      imageUrl: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || "/Sikkim.jpg",
      date: new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    };
  } catch (err) {
    if (err instanceof Response) throw err;
    throw new Response("Article could not be loaded", { status: 503 });
  }
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) return [{ title: "Article Not Found | The Nomads Co." }];
  return [{ title: `${data.title} | The Nomads Co.` }];
}

export default function Article() {
  const { title, content, imageUrl, date } = useLoaderData<typeof loader>();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Navigation — matches journal.tsx / home.tsx */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img src={nomadsLogo} alt="The Nomads Co." width={40} height={40} className="h-10 w-auto rounded-md shadow-sm" />
            <span className={`font-bold tracking-tighter text-2xl transition-colors ${scrolled ? "text-[#1F2328]" : "text-white"}`}>The Nomads Co.</span>
          </Link>
          <Link
            to="/journal"
            className={`inline-flex items-center gap-2 text-sm font-bold transition-colors ${
              scrolled ? "text-gray-500 hover:text-[#2D3191]" : "text-white/90 hover:text-white"
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>
        </div>
      </nav>

      {/* Cinematic Hero */}
      <section className="relative h-[60vh] min-h-[500px] flex items-end justify-center w-full bg-[#1F2328] overflow-hidden pb-16">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-80 scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F2328] via-[#1F2328]/50 to-transparent z-10 pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-20 max-w-[800px]">
          <span className="text-blue-300 font-bold text-xs uppercase tracking-widest mb-4 block">
            Published {date}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1] drop-shadow-xl" style={{ fontFamily: "'Playfair Display',serif" }}>
            {title}
          </h1>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-20 bg-[#FAFAF8]">
        <div className="container mx-auto px-4 md:px-8 flex justify-center">
          <article
            className="prose prose-lg md:prose-xl prose-stone prose-headings:font-bold prose-headings:text-[#1F2328] prose-p:text-[#1F2328] prose-li:text-[#1F2328] prose-a:text-[#2D3191] prose-a:no-underline hover:prose-a:underline prose-img:rounded-[2rem] max-w-[800px] w-full wp-content"
            style={{
              '--tw-prose-headings': "'Playfair Display', serif",
              '--tw-prose-body': "'Inter', ui-sans-serif, system-ui, sans-serif"
            } as React.CSSProperties}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </section>

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
