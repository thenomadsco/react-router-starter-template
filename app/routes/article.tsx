import { Link, useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import type { Route } from "./+types/article";
import nomadsLogo from "./the nomads logo.webp";
import { ArrowRight } from "./home";

function IconBase({ size = 24, className, strokeWidth = 2, fill = "none", children }: any) {
  return <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}
function ArrowLeft(p: any) { return <IconBase {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></IconBase>; }
function X(p: any) { return <IconBase {...p}><path d="M18 6 6 18"/><path d="M6 6l12 12"/></IconBase>; }

export async function loader({ params }: Route.LoaderArgs) {
  const WP_API_URL = `https://dev-nomadsco-journal-backend.pantheonsite.io/wp-json/wp/v2/posts?slug=${params.slug}&_embed&t=${Date.now()}`;

  const response = await fetch(WP_API_URL, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error("Article not found");
  const posts = await response.json();

  if (posts.length === 0) throw new Response("Not Found", { status: 404 });

  const post = posts[0];
  const cleanExcerpt = post.excerpt.rendered.replace(/(<([^>]+)>)/gi, "").substring(0, 150) + "...";

  let relatedPosts: any[] = [];
  try {
    const relatedRes = await fetch(
      `https://dev-nomadsco-journal-backend.pantheonsite.io/wp-json/wp/v2/posts?_embed&per_page=4&t=${Date.now()}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (relatedRes.ok) {
      const allPosts = await relatedRes.json();
      relatedPosts = allPosts
        .filter((p: any) => p.slug !== params.slug)
        .slice(0, 3)
        .map((p: any) => ({
          slug: p.slug,
          title: p.title.rendered,
          imageUrl: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || "/Sikkim.jpg",
          date: new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        }));
    }
  } catch (_) {}

  return {
    title: post.title.rendered,
    content: post.content.rendered,
    excerpt: cleanExcerpt,
    imageUrl: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || "/Sikkim.jpg",
    date: new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    slug: params.slug,
    relatedPosts
  };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) return [{ title: "Article Not Found | The Nomads Co." }];

  const url = `https://thenomadsco.in/journal/${data.slug}`;
  return [
    { title: `${data.title} | The Nomads Co.` },
    { name: "description", content: data.excerpt },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:title", content: data.title },
    { property: "og:description", content: data.excerpt },
    { property: "og:image", content: data.imageUrl },
    { property: "og:url", content: url },
    { property: "og:type", content: "article" },
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

export default function Article() {
  const { title, content, imageUrl, date, excerpt, relatedPosts } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Dynamic SEO Article Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "image": imageUrl,
        "datePublished": new Date(date).toISOString(),
        "description": excerpt,
        "author": { "@type": "Person", "name": "Kirti Shah" },
        "publisher": { "@type": "Organization", "name": "The Nomads Co." }
      })}} />

      <FullNav />

      <section className="relative h-[60vh] min-h-[500px] flex items-end justify-center w-full bg-[#1F2328] overflow-hidden pb-16">
        {imageUrl && (
          <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-80 scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F2328] via-[#1F2328]/50 to-transparent z-10 pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-20 max-w-[800px]">
          <Link to="/journal" className="inline-flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white transition-colors mb-8 backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/20 w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>
          <span className="text-blue-300 font-bold text-xs uppercase tracking-widest mb-4 block">Published {date}</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1] drop-shadow-xl" style={{ fontFamily: "'Playfair Display',serif" }}>{title}</h1>
        </div>
      </section>

      <section className="py-20 bg-[#FAFAF8]">
        <div className="container mx-auto px-4 md:px-8 flex justify-center">
          <article
            className="wp-content prose prose-lg md:prose-xl prose-stone prose-headings:font-bold prose-headings:text-[#1F2328] prose-a:text-[#2D3191] prose-a:no-underline hover:prose-a:underline prose-img:rounded-[2rem] max-w-[800px] w-full"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </section>

      {/* Related posts + CTA */}
      <section className="bg-white border-t border-gray-100 py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-[800px]">

          {relatedPosts && relatedPosts.length > 0 && (
            <div className="mb-20">
              <h2 className="text-2xl font-bold text-[#1F2328] mb-8" style={{ fontFamily: "'Playfair Display',serif" }}>More from the Journal</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedPosts.map((post: any) => (
                  <Link
                    key={post.slug}
                    to={`/journal/${post.slug}`}
                    className="group relative rounded-[1.5rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-black block"
                    style={{ aspectRatio: "3/4" }}
                  >
                    <img src={post.imageUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold text-white bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 uppercase tracking-wide">{post.date}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-sm font-bold text-white leading-tight" style={{ fontFamily: "'Playfair Display',serif" }}>{post.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="text-center bg-[#FAFAF8] rounded-[2rem] p-12 border border-gray-100">
            <p className="text-sm font-bold text-[#2D3191] uppercase tracking-widest mb-4">Ready to Travel?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2328] mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>Design Your Own Escape</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Let Kirti plan the perfect trip, tailored exactly to you. Visas, flights, stays — all handled.</p>
            <Link
              to="/?openFunnel=true"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#2D3191] text-white font-bold rounded-full hover:bg-[#242875] hover:-translate-y-1 transition-all shadow-lg"
            >
              Start Planning →
            </Link>
            <p className="mt-6 text-sm text-gray-400"><span className="font-semibold text-[#1F2328]">Kirti Shah</span> · Founder, The Nomads Co. · Vadodara</p>
          </div>

        </div>
      </section>
    </div>
  );
}

// Headless CMS Fallback
export function ErrorBoundary() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4 text-center">
      <div className="max-w-md">
        <h1 className="text-4xl font-bold text-[#1F2328] mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>Post Unavailable</h1>
        <p className="text-gray-500 mb-8">This article is currently being updated or the journal is undergoing quick maintenance. Please check back shortly.</p>
        <Link to="/journal" className="inline-flex items-center justify-center px-8 py-3 bg-[#2D3191] text-white font-bold rounded-full hover:bg-[#242875] transition-all">
          Return to Journal
        </Link>
      </div>
    </div>
  );
}
