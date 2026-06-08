import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/journal";

// Native SVG System
function IconBase({ size = 24, className, strokeWidth = 2, fill = "none", children }: any) { 
  return <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>; 
}
function ArrowLeft(p: any) { 
  return <IconBase {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></IconBase>; 
}

export async function loader() {
  const WP_API_URL = "https://dev-nomadsco-journal-backend.pantheonsite.io/wp-json/wp/v2/posts?_embed";
  try {
    const response = await fetch(WP_API_URL);
    if (!response.ok) throw new Error("Failed to fetch journal entries");
    const posts = await response.json();
    
    return posts.map((post: any) => ({
      id: post.id,
      slug: post.slug,
      title: post.title.rendered,
      excerpt: post.excerpt.rendered.replace(/(<([^>]+)>)/gi, "").substring(0, 120) + "...",
      // Local repo fallback for unmatched assets
      imageUrl: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || "/Sikkim.jpg", 
      date: new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }));
  } catch (error) {
    return [];
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Journal | The Nomads Co." },
    { name: "description", content: "Curated travel stories, guides, and itineraries." },
  ];
}

export default function Journal() {
  const posts = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-gray-900 font-sans pt-32 pb-32">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="max-w-[1200px] mx-auto mb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#2D3191] transition-colors mb-10">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <span className="text-[#2D3191] font-bold text-xs uppercase tracking-widest mb-6 block">
            Travel & Editorial
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1F2328] mb-8 tracking-tight" style={{ fontFamily: "'Playfair Display',serif" }}>
            The Nomads Journal
          </h1>
          <p className="text-lg md:text-xl text-[#1F2328]/70 leading-relaxed max-w-2xl">
            Discover our handpicked selection of narratives, insider guides, and visual stories from around the globe.
          </p>
        </div>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {posts.map((post: any) => (
            <Link 
              key={post.id} 
              to={`/journal/${post.slug}`}
              className="group relative rounded-[1.75rem] overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-2 bg-black block"
              style={{ aspectRatio: "3/4", contentVisibility: "auto", contain: "paint layout style" }}
            >
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10">
                <span className="text-[10px] font-bold text-white bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 uppercase tracking-wide">
                  {post.date}
                </span>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                <h4 className="text-lg font-bold text-white leading-tight mb-1 drop-shadow-sm" style={{ fontFamily: "'Playfair Display',serif" }}>
                  {post.title}
                </h4>
                <p className="text-white/75 text-xs leading-relaxed max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-500 ease-out mt-2">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
