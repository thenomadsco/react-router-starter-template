import { Link } from "react-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import nomadsLogo from "./the nomads logo.jpeg";
import kirtiProfile from "./kirti-shah-profile.jpeg";
import type { Route } from "./+types/home";

export function headers() {
  return { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" };
}

export function meta({}: Route.MetaArgs) {
  const title = "The Nomads Co. | Curated Journeys";
  const description = "Personalized premium travel planning by Kirti Shah.";
  const url = "https://thenomadsco.in";
  const ogImage = "https://placehold.co/1200x630/2D3191/FFFFFF?text=The+Nomads+Co";
  return [
    { title }, { name: "description", content: description },
    { property: "og:title", content: title }, { property: "og:description", content: description },
    { property: "og:type", content: "website" }, { property: "og:url", content: url },
    { property: "og:image", content: ogImage }, { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title }, { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];
}

function IconBase({ size = 24, className, strokeWidth = 2, fill = "none", children }: any) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
  );
}
function MapPin(p: any)           { return <IconBase {...p}><path d="M12 21s6-6.2 6-11a6 6 0 0 0-12 0c0 4.8 6 11 6 11z"/><circle cx="12" cy="10" r="2.5"/></IconBase>; }
function Star(p: any)             { return <IconBase {...p} fill={p.fill ?? "currentColor"}><path d="M12 3.5 14.7 9l5.8.8-4.2 4.1 1 5.9L12 17l-5.3 2.8 1-5.9L3.5 9.8 9.3 9z"/></IconBase>; }
function Facebook(p: any)         { return <IconBase {...p}><path d="M14 8h-2c-1.1 0-2 .9-2 2v2H8v3h2v5h3v-5h2.2l.8-3H13v-1.6c0-.4.3-.7.7-.7H16V8z"/></IconBase>; }
function Instagram(p: any)        { return <IconBase {...p}><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></IconBase>; }
function Mail(p: any)             { return <IconBase {...p}><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/></IconBase>; }
function MessageCircle(p: any)    { return <IconBase {...p}><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-2.9-.4-4.1-1l-4.4 1.2 1.3-4.1A8.5 8.5 0 1 1 21 11.5z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></IconBase>; }
function X(p: any)                { return <IconBase {...p}><path d="M18 6 6 18"/><path d="M6 6l12 12"/></IconBase>; }
function ChevronDown(p: any)      { return <IconBase {...p}><polyline points="6 9 12 15 18 9"/></IconBase>; }
function Plane(p: any)            { return <IconBase {...p}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 5-3.2 3.2-2.3-.8L2 17l4 2 2 4 .8-1.5-.8-2.3L11 16l5 6 1.2-.7c.4-.2.7-.6.6-1.1z"/></IconBase>; }
function Compass(p: any)          { return <IconBase {...p}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></IconBase>; }
function Headphones(p: any)       { return <IconBase {...p}><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></IconBase>; }
function MapIcon(p: any)          { return <IconBase {...p}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></IconBase>; }
function SlidersHorizontal(p: any){ return <IconBase {...p}><line x1="21" y1="4" x2="14" y2="4"/><line x1="10" y1="4" x2="3" y2="4"/><line x1="21" y1="12" x2="12" y2="12"/><line x1="8" y1="12" x2="3" y2="12"/><line x1="21" y1="20" x2="16" y2="20"/><line x1="12" y1="20" x2="3" y2="20"/><line x1="14" y1="2" x2="14" y2="6"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="16" y1="18" x2="16" y2="22"/></IconBase>; }
function Shield(p: any)           { return <IconBase {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></IconBase>; }
function CheckCircle2(p: any)     { return <IconBase {...p}><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></IconBase>; }
function Sparkles(p: any)         { return <IconBase {...p}><path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z"/><path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14z"/></IconBase>; }
function ArrowLeft(p: any)        { return <IconBase {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></IconBase>; }
function ArrowRight(p: any)       { return <IconBase {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></IconBase>; }
function Quote(p: any)            { return <IconBase {...p} fill="currentColor" stroke="none"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></IconBase>; }

const OptimizedImage = ({ src, alt, className, priority = false }: { src: string; alt: string; className?: string; priority?: boolean }) => {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);
  const finalSrc = err ? "https://placehold.co/600x800/FF0000/FFFFFF?text=IMAGE+ERROR" : src;
  return (
    <div className={`relative overflow-hidden bg-[#FAFAF8] ${className ?? ""}`}>
      <img src={finalSrc} alt={alt} loading={priority ? "eager" : "lazy"} decoding={priority ? "sync" : "async"}
        onLoad={() => setLoaded(true)} onError={() => setErr(true)}
        className={`w-full h-full object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
};

const revealCbs = new Map<Element, () => void>();
let sharedObs: IntersectionObserver | null = null;
function getObs() {
  if (typeof window === "undefined") return null;
  if (!sharedObs) sharedObs = new IntersectionObserver(
    (es) => es.forEach(e => { if (e.isIntersecting) { revealCbs.get(e.target)?.(); revealCbs.delete(e.target); sharedObs?.unobserve(e.target); } }),
    { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
  );
  return sharedObs;
}
const RevealOnScroll = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = getObs(); if (!obs) { setVis(true); return; }
    revealCbs.set(el, () => setVis(true)); obs.observe(el);
    return () => { revealCbs.delete(el); obs.unobserve(el); };
  }, []);
  return <div ref={ref} className={`transition-all duration-1000 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>{children}</div>;
};

// Particle Hero
const ParticleHero = ({ onExplore }: { onExplore: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    type P = { x: number; y: number; vx: number; vy: number; r: number; alpha: number; depth: number; phase: number; speed: number };
    const pts: P[] = [];
    const make = (w: number, h: number): P => {
      const d = 0.2 + Math.random() * 0.8;
      return { x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .18 * d, vy: (Math.random() - .5) * .12 * d, r: .8 + d * 2.2, alpha: .06 + d * .22, depth: d, phase: Math.random() * Math.PI * 2, speed: .6 + Math.random() * .8 };
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
      pts.length = 0; for (let i = 0; i < 100; i++) pts.push(make(w, h));
    };
    resize();
    window.addEventListener("resize", resize);
    const onMM = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouseRef.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }; };
    window.addEventListener("mousemove", onMM);
    let t = 0, smx = .5, smy = .5;
    const CDIST = 90, PAR = 28;
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw); t += .008;
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      smx += (mouseRef.current.x - smx) * .05; smy += (mouseRef.current.y - smy) * .05;
      const mx = smx - .5, my = smy - .5;
      for (const p of pts) {
        p.x += p.vx * p.speed; p.y += p.vy * p.speed;
        if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
        const px = p.x + mx * PAR * p.depth, py = p.y + my * PAR * p.depth;
        const a = p.alpha * (.7 + .3 * Math.sin(t * 1.2 + p.phase));
        ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(45,49,145,${a})`; ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], ax = a.x + mx * PAR * a.depth, ay = a.y + my * PAR * a.depth;
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j], bx = b.x + mx * PAR * b.depth, by = b.y + my * PAR * b.depth;
          const d = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
          if (d < CDIST) { ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.strokeStyle = `rgba(45,49,145,${(1 - d / CDIST) * .07})`; ctx.lineWidth = .6; ctx.stroke(); }
        }
      }
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMM); };
  }, []);

  return (
    <section className="relative pt-[150px] md:pt-[200px] pb-20 md:pb-32 w-full bg-[#FAFAF8] overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-100/50 via-transparent to-transparent blur-3xl rounded-full pointer-events-none" />
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />
      <div className="container mx-auto px-4 md:px-8 relative flex flex-col items-center text-center" style={{ zIndex: 2 }}>
        <div className="animate-hero-1 inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border border-[#2D3191]/20 bg-white/60 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2D3191] inline-block" />
          <span className="text-xs font-bold text-[#2D3191] uppercase tracking-widest">Personal Travel Planning by Kirti Shah</span>
        </div>
        <h1 className="animate-hero-2 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#1F2328] mb-6 tracking-tight leading-[1.05] max-w-4xl" style={{ fontFamily: "'Playfair Display',serif" }}>
          Discover the world, <em className="not-italic text-[#2D3191]">beautifully curated.</em>
        </h1>
        <p className="animate-hero-3 text-lg md:text-xl text-gray-500 mb-10 max-w-xl leading-relaxed">
          Zero-stress premium travel planning. We handle every detail — you collect the memories.
        </p>
        <div className="animate-hero-4">
          <button onClick={onExplore} className="inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-[#2D3191] text-white text-lg font-bold rounded-full shadow-[0_10px_30px_rgba(45,49,145,0.3)] hover:bg-[#242875] hover:shadow-[0_15px_40px_rgba(45,49,145,0.4)] hover:-translate-y-1 transition-all duration-300">
            Design Your Escape &rarr;
          </button>
        </div>
        <div className="animate-hero-5 flex flex-wrap items-center justify-center gap-6 mt-12">
          <div className="flex items-center gap-1.5"><div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-yellow-400" />)}</div><span className="text-sm font-semibold text-[#1F2328]/70">5.0 rated</span></div>
          <span className="text-[#1F2328]/20 hidden sm:block">|</span><span className="text-sm font-semibold text-[#1F2328]/70">500+ trips planned</span>
          <span className="text-[#1F2328]/20 hidden sm:block">|</span><span className="text-sm font-semibold text-[#1F2328]/70">10+ years experience</span>
          <span className="text-[#1F2328]/20 hidden sm:block">|</span><span className="text-sm font-semibold text-[#1F2328]/70">24/7 on-trip support</span>
        </div>
        <div className="animate-hero-5 w-full mt-16 overflow-hidden" aria-hidden="true">
          <div className="flex gap-0">
            {[0, 1].map(k => (
              <ul key={k} className={`flex shrink-0 gap-10 items-center whitespace-nowrap pr-10 ${k === 1 ? "animate-marquee2" : "animate-marquee"}`} aria-hidden={k === 1}>
                {["Bali", "Maldives", "Kashmir", "Paris", "Santorini", "Dubai", "Tokyo", "Bhutan", "Rajasthan", "New Zealand", "Kenya", "Turkey", "Goa", "Vietnam", "Singapore"].map(n => (
                  <li key={n} className="flex items-center gap-10">
                    <span className="text-sm font-semibold text-[#1F2328]/35 uppercase tracking-[0.2em]">{n}</span>
                    <span className="w-1 h-1 rounded-full bg-[#2D3191]/25 inline-block flex-shrink-0" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const SocialProofStrip = ({ onWhatsApp }: { onWhatsApp: () => void }) => (
  <section className="bg-white py-16 border-y border-gray-100">
    <div className="container mx-auto px-4 md:px-8">
      <RevealOnScroll>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex-1 text-center md:text-left">
            <Quote size={32} className="text-[#2D3191]/20 mb-4 mx-auto md:mx-0" />
            <p className="text-xl md:text-2xl text-[#1F2328]/80 leading-relaxed italic font-medium mb-4">
              "Kirti handled everything. We were in holiday mode from day one. She has never failed to be on point — the reminders, the information, looking after everyone's needs."
            </p>
            <p className="text-sm font-bold text-[#2D3191] uppercase tracking-wider">— Greece Group Trip, 10 Travellers</p>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={20} className="text-yellow-400" />)}</div>
            <button onClick={onWhatsApp} className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold rounded-full shadow-lg hover:bg-[#1DA851] hover:-translate-y-0.5 transition-all text-sm whitespace-nowrap">
              <MessageCircle size={16} /> Chat with Kirti
            </button>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  </section>
);

const keyServices = [
  { icon: <Plane className="w-8 h-8 text-[#2D3191]" />, title: "Visa & Flight Support", description: "Hassle-free documentation and booking assistance." },
  { icon: <MapIcon className="w-8 h-8 text-[#2D3191]" />, title: "End-to-End Planning", description: "From itinerary creation to returning home safely." },
  { icon: <Shield className="w-8 h-8 text-[#2D3191]" />, title: "Verified Premium Stays", description: "Handpicked 4 & 5 star accommodations for comfort." },
  { icon: <Headphones className="w-8 h-8 text-[#2D3191]" />, title: "24/7 On-Trip Support", description: "Always just a message away whenever you need us." },
  { icon: <Compass className="w-8 h-8 text-[#2D3191]" />, title: "Curated Local Experiences", description: "Authentic activities beyond standard tourist traps." },
  { icon: <SlidersHorizontal className="w-8 h-8 text-[#2D3191]" />, title: "Flexible Itineraries", description: "Plans that adapt to your pace and preferences." },
];

type Destination = { id: number; title: string; category: string; image: string; tags: string[]; description: string };
const destinations: Destination[] = [
  // ── INTERNATIONAL ──────────────────────────────────────────────────────────
  { id: 1,  title: "Bali, Indonesia",      category: "International", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",  tags: ["Tropical","Beaches","Culture"],         description: "Island of Gods with serene beaches and vibrant culture." },
  { id: 2,  title: "Maldives",             category: "International", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80",  tags: ["Honeymoon","Luxury","Beaches"],         description: "Overwater villas and crystal clear turquoise lagoons." },
  { id: 3,  title: "Dubai, UAE",           category: "International", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",  tags: ["Luxury","City","Desert"],               description: "Futuristic architecture, luxury shopping, and desert safaris." },
  { id: 4,  title: "Singapore",            category: "International", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80",  tags: ["City","Family","Modern"],               description: "A blend of nature and modernity in a global metropolis." },
  { id: 5,  title: "Thailand",             category: "International", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=600&q=80",  tags: ["Beaches","Culture","Nightlife"],        description: "Vibrant street life, ornate temples, and tropical beaches." },
  { id: 6,  title: "Vietnam",              category: "International", image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80",                        tags: ["Nature","Culture","Food"],              description: "Bustling cities, serene limestone islands, and rich history." },
  { id: 7,  title: "Sri Lanka",            category: "International", image: "https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?auto=format&fit=crop&w=600&q=80",  tags: ["Nature","Wildlife","Beaches"],          description: "Diverse landscapes, wildlife, and ancient Buddhist ruins." },
  { id: 8,  title: "Bhutan",               category: "International", image: "https://images.unsplash.com/photo-1578556881786-851d4b79cb73?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",                        tags: ["Mountains","Culture","Peace"],          description: "The last great Himalayan kingdom, shrouded in mystery." },
  { id: 9,  title: "Europe (Schengen)",    category: "International", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80",  tags: ["History","Culture","Romance"],          description: "Explore diverse cultures, history, and architecture across Europe." },
  { id: 10, title: "Australia",            category: "International", image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=600&q=80",  tags: ["Adventure","Wildlife","Beaches"],       description: "The Great Barrier Reef, outback adventures, and vibrant cities." },
  { id: 11, title: "New Zealand",          category: "International", image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=600&q=80",  tags: ["Adventure","Nature","Landscapes"],      description: "Stunning natural landscapes, from mountains to fjords." },
  { id: 12, title: "Japan",                category: "International", image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80",  tags: ["Culture","Modern","Food"],              description: "A seamless blend of ancient traditions and cutting-edge technology." },
  { id: 13, title: "South Korea",          category: "International", image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=600&q=80",                        tags: ["Culture","City","Food"],                description: "Dynamic cities, ancient palaces, and trendy pop culture." },
  { id: 14, title: "Turkey",               category: "International", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80",  tags: ["History","Culture","Landscapes"],       description: "Where East meets West, featuring rich history and unique landscapes." },
  { id: 15, title: "USA",                  category: "International", image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=600&q=80",  tags: ["City","Nature","Diverse"],              description: "Diverse experiences from bustling metropolises to vast national parks." },
  { id: 16, title: "South Africa",         category: "International", image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=600&q=80",  tags: ["Wildlife","Adventure","Nature"],        description: "Safari adventures, stunning coastlines, and vibrant culture." },
  { id: 17, title: "Kenya",                category: "International", image: "https://unsplash.com/photos/60XLoOgwkfA/download?force=true",                        tags: ["Wildlife","Safari","Nature"],           description: "Home of the Great Migration and iconic African wildlife." },
  { id: 18, title: "Tanzania",             category: "International", image: "https://unsplash.com/photos/qs4E9t0hJc0/download?force=true",                        tags: ["Wildlife","Safari","Beaches"],          description: "Mount Kilimanjaro, Serengeti safaris, and Zanzibar beaches." },

  // ── INDIA ──────────────────────────────────────────────────────────────────
  { id: 19, title: "Kashmir",              category: "India",         image: "https://images.unsplash.com/photo-1643449416258-5c8e7ec598b1?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",                        tags: ["Mountains","Nature","Romance"],         description: "Paradise on Earth with stunning valleys and Dal Lake." },
  { id: 20, title: "Leh-Ladakh",           category: "India",         image: "https://images.unsplash.com/photo-1706013997636-29354e064ccc?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",                        tags: ["Adventure","Mountains","Road Trip"],    description: "Stark mountain landscapes, monasteries, and high passes." },
  { id: 21, title: "Himachal Pradesh",     category: "India",         image: "https://images.unsplash.com/photo-1621232082074-1a7750ecc557?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",                        tags: ["Mountains","Nature","Adventure"],       description: "Scenic hill stations, pine forests, and snow-capped peaks." },
  { id: 22, title: "Uttarakhand",          category: "India",         image: "https://images.unsplash.com/photo-1742281412128-5832da2ddce3?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",                        tags: ["Mountains","Spiritual","Nature"],       description: "Land of Gods, featuring pilgrimage sites and Himalayan vistas." },
  { id: 23, title: "Rajasthan",            category: "India",         image: "https://images.unsplash.com/photo-1757168896276-607112de366b?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",                        tags: ["History","Culture","Desert"],           description: "Royal palaces, vibrant culture, and vast desert landscapes." },
  { id: 24, title: "Goa",                  category: "India",         image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",  tags: ["Beaches","Nightlife","Relaxation"],     description: "Sun, sand, beaches, and a relaxed coastal vibe." },
  { id: 25, title: "Kerala",               category: "India",         image: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=600&q=80",  tags: ["Nature","Backwaters","Wellness"],       description: "God's Own Country with tranquil backwaters and lush greenery." },
  { id: 26, title: "Andaman Islands",      category: "India",         image: "https://images.unsplash.com/photo-1709623244452-f690c1fc8f2f?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",                        tags: ["Beaches","Islands","Adventure"],        description: "Pristine beaches, clear waters, and water sports." },
  { id: 27, title: "North East India",     category: "India",         image: "https://images.unsplash.com/photo-1568644577260-0568ed0217e0?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",                        tags: ["Nature","Culture","Offbeat"],           description: "Unexplored beauty, tribal culture, and biodiversity." },
  { id: 28, title: "Sikkim",               category: "India",         image: "https://images.unsplash.com/photo-1706465416840-85482d841da7?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",                        tags: ["Mountains","Nature","Monasteries"],     description: "Home to Kanchenjunga, scenic landscapes, and monasteries." },
  { id: 29, title: "Meghalaya",            category: "India",         image: "https://images.unsplash.com/photo-1685271567656-84a60da957d9?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",                        tags: ["Nature","Waterfalls","Offbeat"],        description: "Abode of Clouds, known for living root bridges and waterfalls." },
  { id: 30, title: "Arunachal Pradesh",    category: "India",         image: "https://images.unsplash.com/photo-1648963799576-b225d65eb10c?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",                        tags: ["Mountains","Culture","Adventure"],      description: "Land of the Dawn-Lit Mountains with rich tribal heritage." },
  { id: 31, title: "Karnataka",            category: "India",         image: "https://plus.unsplash.com/premium_photo-1697730504977-26847b1f1f91?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8a2FybmF0YWthfGVufDB8fDB8fHww&ixlib=rb-4.1.0&q=60&w=3000",                        tags: ["History","Nature","Culture"],           description: "Heritage sites like Hampi, coffee plantations in Coorg." },
  { id: 32, title: "Tamil Nadu",           category: "India",         image: "https://images.unsplash.com/photo-1742277296187-1cc2f783d792?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",                        tags: ["Culture","Temples","Beaches"],          description: "Land of temples, rich culture, and coastal beauty." },
  { id: 33, title: "Pondicherry",          category: "India",         image: "https://images.unsplash.com/photo-1706465416840-85482d841da7?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",                        tags: ["Beaches","French Colony","Relaxation"], description: "A touch of French culture on the Indian coast." },
  { id: 34, title: "West Bengal",          category: "India",         image: "https://plus.unsplash.com/premium_photo-1697730497487-7bda47e4baff?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2VzdCUyMGJlbmdhbHxlbnwwfHwwfHx8MA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",                        tags: ["Culture","History","Mountains"],        description: "Cultural richness of Kolkata to the tea gardens of Darjeeling." },
  { id: 35, title: "Odisha",               category: "India",         image: "https://unsplash.com/photos/a4KEI6SYy10/download?force=true",                        tags: ["Culture","Temples","Beaches"],          description: "Known for its ancient temples, beaches, and tribal culture." },
  { id: 36, title: "Gujarat",              category: "India",         image: "https://images.unsplash.com/photo-1670406312373-6d4d1776e4aa?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",                        tags: ["Culture","Wildlife","White Desert"],    description: "Rann of Kutch, Asiatic Lions, and vibrant traditions." },
  { id: 37, title: "Andhra Pradesh",       category: "India",         image: "https://unsplash.com/photos/eQhFAilXCJ4/download?force=true",                        tags: ["Nature","Rivers","Culture"],            description: "Scenic Godavari rivers, paddy fields, and lush greenery." },
];

const testimonials = [
  { id: 1, name: "Client Review", location: "", rating: 5, text: "We decided to go on a holiday to Greece.\nWe were 10 of us. The destination was all we were sure of. Rest was chaos.\nIn a large group the nitty gritties, the co ordination and convincing everyone to a workable plan is the worst part if travel planning.\nWe the smart people that we are gave the job to Kirti, a dear dear friend. The headache was hers. We were in the holiday mode that day onwards.\nNeedless to say she did a wonderful job and always. This made us enjoy the much needed and much awaited holiday all the more.\nNomads has never failed to be on point to everything, the reminders the information and looking after everyone's needs. Keep it up Kirti.\nThank you for this and all the ones we will put you through" },
  { id: 2, name: "Client Review", location: "", rating: 5, text: "Huge thanks for organizing such an incredible last-minute trip to Mauritius for my parents and relatives.\nDespite the short notice, everything was flawlessly planned and perfectly coordinated.\nThe hotels, transfers, and sightseeing were seamless and stress-free.\nMy parents felt well taken care of and absolutely loved the entire experience.\nTruly grateful for your professionalism, dedication, and ability to turn it into such a memorable holiday! 🌴✨" },
];

const NOMADS_WA = "919924399335";
function isMobile() { return typeof window !== "undefined" && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)); }
function waLink(text: string) { const enc = encodeURIComponent(text); return isMobile() ? `https://wa.me/${NOMADS_WA}?text=${enc}` : `https://web.whatsapp.com/send/?phone=${NOMADS_WA}&text=${enc}&type=phone_number&app_absent=1`; }
function openWhatsApp(dest?: string) { window.open(waLink(dest ? `Hi Kirti! 👋 I'd love to plan a trip to ${dest}. Can you help me?` : `Hi Kirti! 👋 I'd love to plan a trip. Can you help me?`), "_blank"); }

type NomadsIntent = "enquiry" | "change" | "cancel";
type ChatState = { intent?: NomadsIntent; name?: string; phone?: string; destination?: string; dates?: string; bookingRef?: string; details?: string };
type Msg = { from: "bot" | "user"; text: string };

function buildWAText(s: ChatState) {
  const name = ((s.name || "").trim() || "—"), phone = ((s.phone || "").trim() || "—");
  if (s.intent === "enquiry") return `Hi The Nomads Co 👋\nI'm ${name} (${phone}). I'd like to enquire about a trip.\n\nDestination: ${s.destination || "—"}\nDates: ${s.dates || "—"}\n\nDetails:\n${s.details || "—"}`;
  if (s.intent === "change")  return `Hi The Nomads Co 👋\nI'm ${name} (${phone}). I want to modify my reservation.\n\nBooking Ref: ${s.bookingRef || "—"}\nNew Destination: ${s.destination || "—"}\nNew Dates: ${s.dates || "—"}\n\nRequest:\n${s.details || "—"}`;
  return `Hi The Nomads Co 👋\nI'm ${name} (${phone}). I want to cancel my reservation.\n\nBooking Ref: ${s.bookingRef || "—"}\n\nReason / Notes:\n${s.details || "—"}`;
}

function NomadsChatbot() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [state, setState] = useState<ChatState>({});
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: "Hey 👋 I'm Nomads Assistant. What do you want to do today? (1/2/3)" }, { from: "bot", text: "1) New enquiry  2) Change reservation  3) Cancel reservation" }]);

  const steps = useMemo(() => {
    const base: any[] = [{ key: "intent", prompt: "Cool — pick 1/2/3.", required: true }, { key: "name", prompt: "What's your name?", required: true }, { key: "phone", prompt: "Phone number? (WhatsApp preferred)", required: true }];
    const intent = state.intent; if (!intent) return base;
    const mid: any[] = [];
    if (intent === "change" || intent === "cancel") mid.push({ key: "bookingRef", prompt: "Booking reference? If not, type NA." });
    if (intent === "enquiry" || intent === "change") { mid.push({ key: "destination", prompt: "Which destination?", required: true }); mid.push({ key: "dates", prompt: "What dates? (approx is fine)", required: true }); }
    mid.push({ key: "details", prompt: "Tell me what you want in 1–2 lines.", required: true });
    return [...base, ...mid, { key: "done", prompt: "Done ✅ Tap below to send on WhatsApp." }];
  }, [state.intent]);

  const cur = steps[Math.min(step, steps.length - 1)];
  const waText = useMemo(() => buildWAText(state), [state]);
  const waUrl = useMemo(() => waLink(waText), [waText]);
  const pb = (t: string) => setMsgs(m => [...m, { from: "bot", text: t }]);
  const pu = (t: string) => setMsgs(m => [...m, { from: "user", text: t }]);

  const validate = (key: string, v: string) => {
    v = v.trim();
    if (key === "intent") { const s = v.toLowerCase(); const i = (s === "1" || s.includes("enq")) ? "enquiry" : (s === "2" || s.includes("change")) ? "change" : (s === "3" || s.includes("cancel")) ? "cancel" : undefined; return i ? { ok: true, value: i } : { ok: false, err: "Type 1, 2, or 3 🙂" }; }
    if (key === "name" && v.length < 2) return { ok: false, err: "Type your name (2+ letters) 🙂" };
    if (key === "phone" && v.replace(/[^0-9+]/g, "").length < 10) return { ok: false, err: "10+ digit number only 🙂" };
    if (cur.required && !v) return { ok: false, err: "This can't be blank 🙂" };
    return { ok: true, value: v };
  };

  const send = () => {
    if (!cur || cur.key === "done" || !input.trim()) return;
    pu(input.trim()); const res = validate(cur.key, input); setInput("");
    if (!res.ok) return pb(res.err);
    setState(p => ({ ...p, [cur.key]: res.value })); const next = step + 1; setStep(next);
    if (steps[next]?.prompt) pb(steps[next].prompt);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!open ? (
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-black text-white font-extrabold px-5 py-4 shadow-2xl hover:-translate-y-1 transition-all"><MessageCircle className="w-6 h-6" /></button>
      ) : (
        <div className="w-[320px] sm:w-[360px] rounded-2xl shadow-2xl bg-white overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-black text-white"><div className="text-sm font-semibold">Nomads Assistant</div><button onClick={() => setOpen(false)} className="text-lg leading-none">×</button></div>
          <div className="h-[320px] overflow-y-auto px-4 py-3 space-y-3 bg-[#FAFAF8]">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.from === "user" ? "bg-black text-white" : "bg-white border border-gray-100 shadow-sm text-gray-900"}`}>{m.text}</div>
              </div>
            ))}
          </div>
          {cur?.key !== "done" ? (
            <div className="p-3 bg-white flex gap-2 border-t border-gray-100">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Type here…" className="flex-1 rounded-xl bg-[#FAFAF8] px-4 py-2 text-sm outline-none" />
              <button onClick={send} className="rounded-xl px-4 py-2 bg-black text-white text-sm">Send</button>
            </div>
          ) : (
            <div className="p-3 bg-white border-t border-gray-100">
              <a href={waUrl} target="_blank" rel="noreferrer" className="block text-center rounded-xl px-4 py-3 bg-green-600 text-white text-sm font-semibold">Send on WhatsApp ✅</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DestinationFunnel({ preselectedDest, onClose }: { preselectedDest?: string; onClose: () => void }) {
  const [step, setStep] = useState(preselectedDest ? 1 : 0);
  const [dest, setDest] = useState(preselectedDest || "");
  const [timeline, setTimeline] = useState("");
  const [travelers, setTravelers] = useState("");
  const [vibe, setVibe] = useState("");
  const [name, setName] = useState("");

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);
  const TOTAL = preselectedDest ? 4 : 5;

  const waURL = () => {
    const body = `Hi Kirti! 👋 I'm ${name}. I'd love to plan a trip${dest ? ` to ${dest}` : ""}.\n\n*Travelers:* ${travelers}\n*Timeline:* ${timeline}\n*Vibe:* ${vibe}\n\nCan you help me curate some ideas?`;
    return waLink(body);
  };
  const emailURL = () => {
    const b = `Hi Kirti,\n\nI'm ${name}. I'd love to plan a trip${dest ? ` to ${dest}` : ""}.\n\nTravelers: ${travelers}\nTimeline: ${timeline}\nVibe: ${vibe}\n\nCan you help me?\n\nBest, ${name}`;
    return `mailto:thenomadsco@gmail.com?subject=${encodeURIComponent(`New Trip Inquiry: ${dest || "Custom Trip"}`)}&body=${encodeURIComponent(b)}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[460px] flex flex-col animate-fade-in-up">
        <div className="px-6 py-4 flex items-center justify-between bg-[#FAFAF8]">
          <div className="flex items-center gap-2">
            {step > (preselectedDest ? 1 : 0) && <button onClick={back} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500"><ArrowLeft className="w-5 h-5" /></button>}
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Step {preselectedDest ? step : step + 1} of {TOTAL}</span>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500"><X className="w-5 h-5" /></button>
        </div>
        <div className="h-1 bg-gray-100"><div className="h-full bg-[#2D3191] transition-all duration-500" style={{ width: `${((preselectedDest ? step : step + 1) / TOTAL) * 100}%` }} /></div>
        <div className="p-8 flex-1 flex flex-col justify-center">

          {step === 0 && !preselectedDest && (
            <div className="animate-fade-in-up">
              <h3 className="text-3xl font-bold mb-2 text-[#1F2328]" style={{ fontFamily: "'Playfair Display',serif" }}>Where are you dreaming of going?</h3>
              <p className="text-gray-400 mb-5 text-sm">Tap a quick pick or type your destination</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Bali", "Maldives", "Dubai", "Kashmir", "Goa", "Paris", "Singapore", "Thailand"].map(d => (
                  <button key={d} onClick={() => { setDest(d); setTimeout(next, 150); }} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${dest === d ? "bg-[#2D3191] text-white border-[#2D3191]" : "bg-[#FAFAF8] text-gray-600 border-gray-200 hover:border-[#2D3191] hover:text-[#2D3191]"}`}>{d}</button>
                ))}
              </div>
              <input type="text" value={dest} onChange={e => setDest(e.target.value)} placeholder="Or type any destination…" className="w-full text-base px-5 py-4 bg-[#FAFAF8] rounded-2xl focus:ring-2 focus:ring-[#2D3191] outline-none mb-4 shadow-inner" onKeyDown={e => e.key === "Enter" && dest && next()} />
              <button onClick={next} disabled={!dest} className="w-full py-4 bg-[#2D3191] text-white font-bold rounded-2xl disabled:opacity-40 hover:bg-[#242875] transition-colors shadow-lg">Continue →</button>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in-up">
              <h3 className="text-3xl font-bold mb-8 text-[#1F2328]" style={{ fontFamily: "'Playfair Display',serif" }}>When are you planning to travel?</h3>
              <div className="space-y-3">
                {["Within 30 Days", "1-3 Months", "3-6 Months", "Just dreaming for now"].map(opt => (
                  <button key={opt} onClick={() => { setTimeline(opt); next(); }} className="w-full text-left px-6 py-5 rounded-2xl font-medium bg-[#FAFAF8] hover:bg-[#EEF0FF] hover:text-[#2D3191] text-gray-700 flex items-center justify-between group transition-all shadow-sm">
                    <span>{opt}</span><ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#2D3191]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up">
              <h3 className="text-3xl font-bold mb-8 text-[#1F2328]" style={{ fontFamily: "'Playfair Display',serif" }}>Who is joining you?</h3>
              <div className="space-y-3">
                {["Solo Adventure", "Couples Retreat", "Family Vacation", "Group of Friends"].map(opt => (
                  <button key={opt} onClick={() => { setTravelers(opt); next(); }} className="w-full text-left px-6 py-5 rounded-2xl font-medium bg-[#FAFAF8] hover:bg-[#EEF0FF] hover:text-[#2D3191] text-gray-700 flex items-center justify-between group transition-all shadow-sm">
                    <span>{opt}</span><ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#2D3191]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in-up">
              <h3 className="text-3xl font-bold mb-8 text-[#1F2328]" style={{ fontFamily: "'Playfair Display',serif" }}>What's your travel vibe?</h3>
              <div className="space-y-3">
                {["Total Relaxation & Beaches", "Adventure & Exploring", "Culture & History", "A mix of everything"].map(opt => (
                  <button key={opt} onClick={() => { setVibe(opt); next(); }} className="w-full text-left px-6 py-5 rounded-2xl font-medium bg-[#FAFAF8] hover:bg-[#EEF0FF] hover:text-[#2D3191] text-gray-700 flex items-center justify-between group transition-all shadow-sm">
                    <span>{opt}</span><ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#2D3191]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in-up">
              <div className="w-14 h-14 bg-[#EEF0FF] text-[#2D3191] rounded-full flex items-center justify-center mb-5"><CheckCircle2 className="w-7 h-7" /></div>
              <h3 className="text-2xl font-bold mb-1 text-[#1F2328]" style={{ fontFamily: "'Playfair Display',serif" }}>Perfect. We know exactly what to do.</h3>
              <p className="text-gray-400 mb-5 text-sm">Just your first name, then hit send.</p>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your first name" className="w-full text-base px-5 py-4 bg-[#FAFAF8] rounded-2xl focus:ring-2 focus:ring-[#2D3191] outline-none mb-4 shadow-inner" autoFocus />
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { window.open(waURL(), "_blank"); onClose(); }} disabled={!name} className="w-full py-4 bg-[#25D366] text-white font-bold rounded-2xl disabled:opacity-40 hover:bg-[#1DA851] transition-colors shadow-lg flex items-center justify-center gap-2 text-sm">WhatsApp 💬</button>
                <button onClick={() => { window.location.href = emailURL(); onClose(); }} disabled={!name} className="w-full py-4 bg-[#2D3191] text-white font-bold rounded-2xl disabled:opacity-40 hover:bg-[#242875] transition-colors shadow-lg flex items-center justify-center gap-2 text-sm">Email ✉️</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const ClosingCTA = ({ onWhatsApp }: { onWhatsApp: () => void }) => (
  <section className="bg-[#1F2328] py-20 px-6">
    <RevealOnScroll>
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-[#2D3191] text-xs font-bold uppercase tracking-widest mb-4">Ready when you are</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Playfair Display',serif" }}>Your next trip is one message away.</h2>
        <p className="text-gray-400 mb-10 text-lg max-w-xl mx-auto">No forms, no waiting. Kirti personally handles every inquiry and replies fast.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onWhatsApp} className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white font-bold rounded-full shadow-lg hover:bg-[#1DA851] hover:-translate-y-0.5 transition-all text-lg">
            <MessageCircle size={22} /> WhatsApp Kirti now
          </button>
          <a href="mailto:thenomadsco@gmail.com" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 hover:-translate-y-0.5 transition-all text-lg border border-white/20">
            <Mail size={22} /> Send an email
          </a>
        </div>
      </div>
    </RevealOnScroll>
  </section>
);

export default function Home() {
  const [isMenuOpen,       setIsMenuOpen]       = useState(false);
  const [scrolled,         setScrolled]         = useState(false);
  const [pastHero,         setPastHero]         = useState(false);
  const [showDestinations, setShowDestinations] = useState(false);
  const [activeCategory,   setActiveCategory]   = useState("International");
  const [showFunnel,       setShowFunnel]       = useState(false);
  const [funnelDest,       setFunnelDest]       = useState("");
  const [showPill,         setShowPill]         = useState(false);
  const [randomDest,       setRandomDest]       = useState<Destination | null>(null);

  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 50); setPastHero(window.scrollY > 500); };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setRandomDest(destinations[Math.floor(Math.random() * destinations.length)]);
    const t1 = setTimeout(() => setShowPill(true), 2500);
    const t2 = setTimeout(() => setShowPill(false), 12000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const filteredDests   = destinations.filter(d => d.category === activeCategory);
  const handleDestClick = (title: string) => { setShowDestinations(false); setFunnelDest(title); setShowFunnel(true); };
  const goToDestinations= () => document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" });
  const scrollTo        = (id: string) => { setIsMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const handleWA        = () => openWhatsApp();

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">

      {/* Nav */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <img src={nomadsLogo} alt="The Nomads Co." width={40} height={40} loading="eager" className="h-10 w-auto rounded-md shadow-sm" />
            <span className="font-bold tracking-tighter text-lg sm:text-2xl text-[#1F2328]">The Nomads Co.</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollTo("about")}        className="text-sm font-medium text-[#1F2328] hover:text-blue-600 transition-colors">About</button>
            <button onClick={() => scrollTo("destinations")} className="text-sm font-medium text-[#1F2328] hover:text-blue-600 transition-colors">Destinations</button>
            <button onClick={() => scrollTo("reviews")}      className="text-sm font-medium text-[#1F2328] hover:text-blue-600 transition-colors">Reviews</button>
            <button onClick={goToDestinations} className="px-6 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-full hover:bg-[#242875] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">Plan My Trip</button>
          </div>
          <button className="md:hidden z-50 p-2 text-gray-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <div className="space-y-1.5"><span className="block w-6 h-0.5 bg-current" /><span className="block w-4 h-0.5 bg-current" /><span className="block w-6 h-0.5 bg-current" /></div>}
          </button>
        </div>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[100] bg-white flex flex-col pt-24 px-6">
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 text-3xl font-light text-gray-900">×</button>
            <div className="flex flex-col items-center gap-8">
              <button onClick={() => scrollTo("about")}        className="text-2xl font-semibold text-gray-900">About</button>
              <button onClick={() => scrollTo("destinations")} className="text-2xl font-semibold text-gray-900">Destinations</button>
              <button onClick={() => scrollTo("reviews")}      className="text-2xl font-semibold text-gray-900">Reviews</button>
              <button onClick={() => { setIsMenuOpen(false); goToDestinations(); }} className="px-8 py-3 bg-[#2D3191] text-white text-lg font-medium rounded-full shadow-md hover:bg-[#242875] transition-colors">Plan My Trip</button>
            </div>
          </div>
        )}
      </nav>

      {/* Sticky bottom bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-500 md:hidden ${pastHero ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-4 py-3 flex items-center gap-3 justify-end">
          <button onClick={goToDestinations} className="px-5 py-2.5 bg-[#2D3191] text-white text-sm font-bold rounded-full hover:bg-[#242875] transition-all shadow-md">Explore Destinations</button>
          <button onClick={handleWA} className="px-5 py-2.5 bg-[#25D366] text-white text-sm font-bold rounded-full hover:bg-[#1DA851] transition-all shadow-md flex items-center gap-1.5"><MessageCircle size={14} /> WhatsApp</button>
        </div>
      </div>

      {/* Desktop sticky bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-500 hidden md:block ${pastHero ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-8 py-3 flex items-center gap-4 justify-between">
          <p className="text-sm font-semibold text-[#1F2328]">Ready to travel?</p>
          <div className="flex gap-3">
            <button onClick={goToDestinations} className="px-5 py-2.5 bg-[#2D3191] text-white text-sm font-bold rounded-full hover:bg-[#242875] transition-all shadow-md">Explore Destinations</button>
            <button onClick={handleWA} className="px-5 py-2.5 bg-[#25D366] text-white text-sm font-bold rounded-full hover:bg-[#1DA851] transition-all shadow-md flex items-center gap-1.5"><MessageCircle size={14} /> WhatsApp Kirti</button>
          </div>
        </div>
      </div>

      {/* Glass pill hook */}
      {showPill && randomDest && (
        <div className="fixed top-24 right-4 md:right-8 z-50 animate-float-in">
          <div onClick={() => { setShowPill(false); goToDestinations(); }} className="bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl p-4 pr-6 flex items-center gap-4 cursor-pointer hover:-translate-y-1 transition-all relative">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-inner"><img src={randomDest.image} className="w-full h-full object-cover" alt={randomDest.title} /></div>
            <div>
              <p className="text-xs font-bold text-[#02A551] uppercase tracking-wider mb-0.5 flex items-center gap-1"><Sparkles size={12} /> Trending</p>
              <p className="text-sm font-semibold text-gray-900">Escape to {randomDest.title}</p>
            </div>
            <button onClick={e => { e.stopPropagation(); setShowPill(false); }} className="absolute top-2 right-2 text-gray-400 hover:text-gray-900"><X size={14} /></button>
          </div>
        </div>
      )}

      {/* 1. Hero */}
      <ParticleHero onExplore={goToDestinations} />

      {/* 2. Social proof strip — right after hero */}
      <SocialProofStrip onWhatsApp={handleWA} />

      {/* 3. Destinations — primary conversion point */}
      <section id="destinations" className="py-32 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <RevealOnScroll>
            <div onClick={() => setShowDestinations(true)} className="group relative overflow-hidden rounded-[3rem] cursor-pointer shadow-2xl hover:shadow-[0_30px_60px_rgb(0,0,0,0.2)] transition-all duration-700 bg-white">
              <img src="https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000" alt="World Travel" loading="lazy" decoding="async" width={1080} height={540} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-white/70 z-10" />
              <div className="relative z-20 py-24 px-8 md:py-36 text-center flex flex-col items-center justify-center text-[#1F2328]">
                <Compass className="w-20 h-20 mb-8 opacity-80 group-hover:rotate-45 transition-transform duration-700 text-[#2D3191]" />
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8" style={{ fontFamily: "'Playfair Display',serif" }}>Explore Destinations</h2>
                <p className="text-xl md:text-2xl text-[#1F2328]/70 max-w-2xl mb-10">Discover our handpicked selection of the world's most captivating spots, from international hotspots to hidden gems across India.</p>
                <button className="px-10 py-5 bg-[#1F2328] text-white text-lg font-bold rounded-full transition-transform group-hover:-translate-y-2 shadow-xl flex items-center">Discover Now <ChevronDown className="ml-3 w-5 h-5 group-hover:translate-y-1 transition-transform" /></button>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Destinations popup */}
      {showDestinations && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setShowDestinations(false)} />
          <div className="absolute inset-0 md:inset-10 bg-[#FAFAF8] md:rounded-[2rem] overflow-hidden flex flex-col shadow-2xl z-10">
            <div className="p-6 md:p-8 flex justify-between items-center bg-white shadow-sm z-20">
              <h3 className="text-2xl md:text-3xl font-bold text-[#1F2328]" style={{ fontFamily: "'Playfair Display',serif" }}>Choose Your Adventure</h3>
              <button onClick={() => setShowDestinations(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6 text-gray-500" /></button>
            </div>
            <div className="flex justify-center p-6 bg-white z-10 shadow-sm relative">
              <div className="inline-flex bg-[#FAFAF8] rounded-full p-1.5 shadow-inner">
                {["International", "India"].map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-3 rounded-full text-sm md:text-base font-bold transition-all ${activeCategory === cat ? "bg-white text-[#2D3191] shadow-md" : "text-gray-500 hover:text-gray-900"}`}>{cat} <span className="ml-2 text-xs opacity-60">({destinations.filter(d => d.category === cat).length})</span></button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredDests.map(dest => (
                  <div
                    key={dest.id}
                    onClick={() => handleDestClick(dest.title)}
                    className="group relative rounded-[1.75rem] overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-2 bg-black"
                    style={{ aspectRatio: "3/4" }}
                  >
                    {/* Full-bleed image */}
                    <OptimizedImage
                      src={dest.image}
                      alt={dest.title}
                      className="absolute inset-0 w-full h-full transition-transform duration-[3s] group-hover:scale-110"
                    />

                    {/* Always-on bottom gradient — ensures title is always readable */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                    {/* Tags — top left, always visible */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10">
                      {dest.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-[10px] font-bold text-white bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 uppercase tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Plan this trip pill — appears on hover top right */}
                    <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1F2328] bg-white px-3 py-1.5 rounded-full shadow-md">
                        Plan this trip →
                      </span>
                    </div>

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                      {/* Title always visible */}
                      <h4 className="text-lg font-bold text-white leading-tight mb-1 drop-shadow-sm">{dest.title}</h4>

                      {/* Description slides up on hover */}
                      <p className="text-white/75 text-xs leading-relaxed max-h-0 overflow-hidden group-hover:max-h-12 transition-all duration-500 ease-out">
                        {dest.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. About Kirti */}
      <section id="about" className="py-32 px-6 sm:px-12 bg-[#FAFAF8] relative">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#EEF0FF] rounded-[2.5rem] rotate-3 transition-transform duration-700 group-hover:rotate-6" />
            <img src={kirtiProfile} alt="Kirti Shah" width={600} height={750} loading="lazy" decoding="async" className="relative w-full aspect-[4/5] object-cover rounded-[2.5rem] shadow-xl" />
          </div>
          <div className="md:pl-6">
            <span className="text-[#2D3191] font-bold text-xs uppercase tracking-widest mb-6 block">The Founder</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1F2328] mb-8" style={{ fontFamily: "'Playfair Display',serif" }}>Meet Kirti Shah</h2>
            <p className="text-lg text-[#1F2328]/70 leading-relaxed mb-6 max-w-xl">Kirti believes that travel should be happy, not stressful. That's why she treats every client like family, personally overseeing every trip to ensure you are safe, comfortable, and having the time of your life.</p>
            <p className="text-lg text-[#1F2328]/70 leading-relaxed max-w-xl">With over 10 years of experience, we handle visas, flights, and bookings, offering luxury stays at best-value prices with 24/7 support.</p>
            <button onClick={handleWA} className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[#2D3191] text-white font-bold rounded-full hover:bg-[#242875] transition-all shadow-md text-sm hover:-translate-y-0.5">
              <MessageCircle size={16} /> Chat with Kirti
            </button>
          </div>
        </div>
      </section>

      {/* 5. Services */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <RevealOnScroll className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1F2328]" style={{ fontFamily: "'Playfair Display',serif" }}>Key Services Offered</h2>
          </RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyServices.map((s, i) => (
              <RevealOnScroll key={i}>
                <div className="bg-[#FAFAF8] rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 h-full">
                  <div className="bg-[#EEF0FF] text-[#2D3191] w-16 h-16 rounded-2xl flex items-center justify-center mb-8">{s.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 text-[#1F2328]">{s.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-lg">{s.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Reviews */}
      <section id="reviews" className="py-32 relative bg-[#FAFAF8]">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <RevealOnScroll className="text-center mb-20">
            <span className="inline-block text-[#2D3191] text-xs font-bold uppercase tracking-widest mb-4">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1F2328]" style={{ fontFamily: "'Playfair Display',serif" }}>Loved by Travelers</h2>
          </RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {testimonials.map((t) => (
              <RevealOnScroll key={t.id}>
                <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 h-full flex flex-col relative overflow-hidden">
                  <div className="flex items-center space-x-1 text-yellow-400 mb-8">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-6 h-6 fill-current" />)}</div>
                  <p className="text-[#1F2328]/80 leading-relaxed italic text-lg mb-10 flex-grow whitespace-pre-line">"{t.text}"</p>
                  <div>
                    <h4 className="font-bold text-xl text-[#1F2328]">{t.name}</h4>
                    {!!t.location && <p className="text-gray-500 mt-1">{t.location}</p>}
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Contact */}
      <section id="contact" className="py-32 px-6 sm:px-12 bg-white relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-[#1F2328] mb-6" style={{ fontFamily: "'Playfair Display',serif" }}>Let's talk travel.</h2>
          <p className="text-xl text-[#1F2328]/60 max-w-2xl mx-auto">We are ready to craft your perfect trip. Choose how you'd like to reach us.</p>
        </div>
        <div className="max-w-[1000px] mx-auto grid md:grid-cols-3 gap-8">
          <a href="https://wa.me/919924399335" target="_blank" rel="noreferrer" className="group relative bg-[#FAFAF8] rounded-[2rem] p-10 text-center hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(37,211,102,0.15)] transition-all duration-500 overflow-hidden cursor-pointer block">
            <div className="w-20 h-20 mx-auto bg-white rounded-[1.5rem] flex items-center justify-center text-[#25D366] shadow-[0_8px_20px_rgb(0,0,0,0.06)] mb-8 group-hover:scale-110 transition-transform duration-500"><MessageCircle size={36} /></div>
            <h3 className="text-2xl font-bold text-[#1F2328] mb-2 group-hover:hidden">WhatsApp</h3>
            <h3 className="text-2xl font-bold text-[#25D366] mb-2 hidden group-hover:block animate-fade-in-up">Start Chat</h3>
            <p className="text-gray-500 font-medium">+91 99243 99335</p>
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#25D366] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </a>
          <a href="mailto:thenomadsco@gmail.com" className="group relative bg-[#FAFAF8] rounded-[2rem] p-10 text-center hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(45,49,145,0.15)] transition-all duration-500 overflow-hidden cursor-pointer block">
            <div className="w-20 h-20 mx-auto bg-white rounded-[1.5rem] flex items-center justify-center text-[#2D3191] shadow-[0_8px_20px_rgb(0,0,0,0.06)] mb-8 group-hover:scale-110 transition-transform duration-500"><Mail size={36} /></div>
            <h3 className="text-2xl font-bold text-[#1F2328] mb-2 group-hover:hidden">Email</h3>
            <h3 className="text-2xl font-bold text-[#2D3191] mb-2 hidden group-hover:block animate-fade-in-up">Write to Us</h3>
            <p className="text-gray-500 font-medium truncate px-4">thenomadsco@gmail.com</p>
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#2D3191] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </a>
          <div className="group relative bg-[#FAFAF8] rounded-[2rem] p-10 text-center hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(2,165,81,0.15)] transition-all duration-500 overflow-hidden">
            <div className="w-20 h-20 mx-auto bg-white rounded-[1.5rem] flex items-center justify-center text-[#02A551] shadow-[0_8px_20px_rgb(0,0,0,0.06)] mb-8 group-hover:scale-110 transition-transform duration-500"><MapPin size={36} /></div>
            <h3 className="text-2xl font-bold text-[#1F2328] mb-2">Location</h3>
            <p className="text-gray-500 font-medium leading-relaxed">Vadodara, Gujarat<br />India</p>
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#02A551] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </div>
        </div>
      </section>

      {/* 8. Closing CTA — last emotional beat */}
      <ClosingCTA onWhatsApp={handleWA} />

      {/* Footer */}
      <footer className="relative z-10 bg-[#111418] text-white py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div className="col-span-1 md:col-span-2">
              <span className="text-3xl font-bold text-white mb-8 block" style={{ fontFamily: "'Playfair Display',serif" }}>The Nomads Co.</span>
              <p className="text-gray-400 pr-6 leading-relaxed mb-10 text-lg">Crafting unforgettable, personalized travel experiences. Your journey, our expertise.</p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/thenomadsco/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#2D3191] hover:scale-110 transition-all duration-300"><Instagram className="w-5 h-5" /></a>
                <a href="https://www.facebook.com/Thenomadsco/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#2D3191] hover:scale-110 transition-all duration-300"><Facebook className="w-5 h-5" /></a>
                <a href="mailto:thenomadsco@gmail.com" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#2D3191] hover:scale-110 transition-all duration-300"><Mail className="w-5 h-5" /></a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8">Quick Links</h4>
              <ul className="space-y-4 font-medium text-gray-300">
                <li><button onClick={() => scrollTo("about")}        className="hover:text-white transition-colors">About Us</button></li>
                <li><button onClick={() => scrollTo("destinations")} className="hover:text-white transition-colors">Destinations</button></li>
                <li><button onClick={() => scrollTo("reviews")}      className="hover:text-white transition-colors">Reviews</button></li>
                <li><button onClick={() => scrollTo("contact")}      className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8">Legal</h4>
              <ul className="space-y-4 font-medium text-gray-300">
                <li><Link to="/privacypolicy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms"         className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 font-medium">
            <p className="text-sm">© {new Date().getFullYear()} The Nomads Co. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {showFunnel && <DestinationFunnel preselectedDest={funnelDest} onClose={() => setShowFunnel(false)} />}
      <NomadsChatbot />

      <style>{`
        @keyframes floatIn { from{opacity:0;transform:translateX(40px) translateY(20px)} to{opacity:1;transform:translateX(0) translateY(0)} }
        .animate-float-in { animation: floatIn .8s cubic-bezier(.16,1,.3,1) forwards; }

        @keyframes heroFade { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .animate-hero-1 { animation: heroFade .8s cubic-bezier(.16,1,.3,1) .1s both; }
        .animate-hero-2 { animation: heroFade .9s cubic-bezier(.16,1,.3,1) .25s both; }
        .animate-hero-3 { animation: heroFade .9s cubic-bezier(.16,1,.3,1) .4s both; }
        .animate-hero-4 { animation: heroFade .9s cubic-bezier(.16,1,.3,1) .55s both; }
        .animate-hero-5 { animation: heroFade .9s cubic-bezier(.16,1,.3,1) .7s both; }

        @keyframes marquee  { from{transform:translateX(0)} to{transform:translateX(-100%)} }
        @keyframes marquee2 { from{transform:translateX(0)} to{transform:translateX(-100%)} }
        .animate-marquee  { animation: marquee  28s linear infinite; will-change:transform; }
        .animate-marquee2 { animation: marquee2 28s linear infinite; will-change:transform; }
        .animate-marquee:hover,.animate-marquee2:hover { animation-play-state:paused; }

        @keyframes fadeInUp { from{opacity:0;transform:translateY(15px)} to{opacity:1;transform:translateY(0)} }
        .animate-fade-in-up { animation: fadeInUp .4s ease-out forwards; }
      `}</style>
    </div>
  );
}
