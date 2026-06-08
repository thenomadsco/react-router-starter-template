import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/article";

// Native SVG System
function IconBase({ size = 24, className, strokeWidth = 2, fill = "none", children }: any) { 
  return <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>; 
}
function ArrowLeft(p: any) { 
  return <IconBase {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></IconBase>; 
}

export async function loader({ params }: Route.LoaderArgs) {
  const WP_API_URL = `https://dev-nomadsco-journal-backend.pantheonsite.io/wp-json/wp/v2/posts?slug=${params.slug}&_embed`;
  
  const response = await fetch(WP_API_URL);
  if (!response.ok) throw new Error("Article not found");
  const posts = await response.json();
  
  if (posts.length === 0) throw new Response("Not Found", { status: 404 });
  
  const post = posts[0];
  return {
    title: post.title.rendered,
    content: post.content.rendered,
    imageUrl: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || "/Sikkim.jpg",
    date: new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) return [{ title: "Article Not Found" }];
  return [{ title: `${data.title} | The Nomads Co.` }];
}

export default function Article() {
  const { title, content, imageUrl, date } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-white font-sans">
      
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
          <Link to="/journal" className="inline-flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white transition-colors mb-8 backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/20 w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>
          <span className="text-blue-300 font-bold text-xs uppercase tracking-widest mb-4 block">
            Published {date}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1] drop-shadow-xl" style={{ fontFamily: "'Playfair Display',serif" }}>
            {title}
          </h1>
        </div>
      </section>

      <section className="py-20 bg-[#FAFAF8]">
        <div className="container mx-auto px-4 md:px-8 flex justify-center">
          <article 
            className="prose prose-lg md:prose-xl prose-stone prose-headings:font-bold prose-headings:text-[#1F2328] prose-a:text-[#2D3191] prose-a:no-underline hover:prose-a:underline prose-img:rounded-[2rem] max-w-[800px] w-full"
            style={{ 
              '--tw-prose-headings': "'Playfair Display', serif",
              '--tw-prose-body': "'Inter', ui-sans-serif, system-ui, sans-serif"
            } as React.CSSProperties}
            dangerouslySetInnerHTML={{ __html: content }} 
          />
        </div>
      </section>
      
    </div>
  );
}
