import { Link } from "react-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import nomadsLogo from "./the nomads logo.jpeg";
import kirtiProfile from "./kirti-shah-profile.jpeg";
import type { Route } from "./+types/home";

// --- HEADERS ---
export function headers() {
  return {
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
  };
}

// --- META ---
export function meta({}: Route.MetaArgs) {
  const title = "The Nomads Co. | Curated Journeys";
  const description = "Personalized premium travel planning by Kirti Shah.";
  const url = "https://thenomadsco.in";
  const ogImage =
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&fm=jpg&w=1200&q=75";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: ogImage },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];
}

// --- ICONS (Zero-Dependency Custom SVGs) ---
const iconDefaults = { size: 24, strokeWidth: 2 };

function IconBase({ size = iconDefaults.size, className, strokeWidth = iconDefaults.strokeWidth, fill = "none", children }: any) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

function MapPin(props: any) { return <IconBase {...props}><path d="M12 21s6-6.2 6-11a6 6 0 0 0-12 0c0 4.8 6 11 6 11z" /><circle cx="12" cy="10" r="2.5" /></IconBase>; }
function Star(props: any) { return <IconBase {...props} fill={props.fill ?? "currentColor"}><path d="M12 3.5 14.7 9l5.8.8-4.2 4.1 1 5.9L12 17l-5.3 2.8 1-5.9L3.5 9.8 9.3 9z" /></IconBase>; }
function Facebook(props: any) { return <IconBase {...props}><path d="M14 8h-2c-1.1 0-2 .9-2 2v2H8v3h2v5h3v-5h2.2l.8-3H13v-1.6c0-.4.3-.7.7-.7H16V8z" /></IconBase>; }
function Instagram(props: any) { return <IconBase {...props}><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></IconBase>; }
function Mail(props: any) { return <IconBase {...props}><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></IconBase>; }
function Phone(props: any) { return <IconBase {...props}><path d="M6.5 4.5h2l1.2 3-2 1.2c.9 2 2.5 3.6 4.5 4.5l1.2-2 3 1.2v2c0 .9-.7 1.6-1.6 1.6-6.3-.5-11.4-5.6-11.8-11.8 0-.9.7-1.6 1.5-1.6z" /></IconBase>; }
function MessageCircle(props: any) { return <IconBase {...props}><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-2.9-.4-4.1-1l-4.4 1.2 1.3-4.1A8.5 8.5 0 1 1 21 11.5z" /><path d="M8 12h.01" /><path d="M12 12h.01" /><path d="M16 12h.01" /></IconBase>; }
function X(props: any) { return <IconBase {...props}><path d="M18 6 6 18" /><path d="M6 6l12 12" /></IconBase>; }
function Calendar(props: any) { return <IconBase {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></IconBase>; }
function ChevronDown(props: any) { return <IconBase {...props}><polyline points="6 9 12 15 18 9" /></IconBase>; }
function Plane(props: any) { return <IconBase {...props}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 5-3.2 3.2-2.3-.8L2 17l4 2 2 4 .8-1.5-.8-2.3L11 16l5 6 1.2-.7c.4-.2.7-.6.6-1.1z" /></IconBase>; }
function Compass(props: any) { return <IconBase {...props}><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></IconBase>; }
function Headphones(props: any) { return <IconBase {...props}><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></IconBase>; }
function MapIcon(props: any) { return <IconBase {...props}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></IconBase>; }
function SlidersHorizontal(props: any) { return <IconBase {...props}><line x1="21" y1="4" x2="14" y2="4" /><line x1="10" y1="4" x2="3" y2="4" /><line x1="21" y1="12" x2="12" y2="12" /><line x1="8" y1="12" x2="3" y2="12" /><line x1="21" y1="20" x2="16" y2="20" /><line x1="12" y1="20" x2="3" y2="20" /><line x1="14" y1="2" x2="14" y2="6" /><line x1="8" y1="10" x2="8" y2="14" /><line x1="16" y1="18" x2="16" y2="22" /></IconBase>; }
function Shield(props: any) { return <IconBase {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></IconBase>; }
function CheckCircle2(props: any) { return <IconBase {...props}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></IconBase>; }
function Sparkles(props: any) { return <IconBase {...props}><path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" /><path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14z" /></IconBase>; }
function ArrowLeft(props: any) { return <IconBase {...props}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></IconBase>; }

// --- HELPER COMPONENTS ---
const OptimizedImage = ({ src, alt, className, priority = false }: { src: string; alt: string; className?: string; priority?: boolean; }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const finalSrc = error ? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&fm=webp&q=55&w=600" : src;

  return (
    <div className={`relative overflow-hidden bg-[#FAFAF8] ${className ?? ""}`}>
      <img
        src={finalSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        // @ts-ignore
        fetchpriority={priority ? "high" : "auto"}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
};

const revealCallbacks = new Map<Element, () => void>();
let sharedObserver: IntersectionObserver | null = null;
function getObserver() {
  if (typeof window === "undefined") return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          revealCallbacks.get(e.target)?.();
          revealCallbacks.delete(e.target);
          sharedObserver?.unobserve(e.target);
        }
      }),
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
  }
  return sharedObserver;
}

const RevealOnScroll = ({ children, className = "" }: { children: React.ReactNode; className?: string; }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = getObserver();
    if (!obs) { setIsVisible(true); return; }
    revealCallbacks.set(el, () => setIsVisible(true));
    obs.observe(el);
    return () => { revealCallbacks.delete(el); obs.unobserve(el); };
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
};

// --- GLOBE HERO COMPONENT ---
// Destination coordinates: [lat, lng] for pinned dots on the globe
const GLOBE_DESTINATIONS = [
  { name: "Bali",        lat:  -8.34, lng: 115.09 },
  { name: "Maldives",    lat:   4.17, lng:  73.51 },
  { name: "Dubai",       lat:  25.20, lng:  55.27 },
  { name: "Singapore",   lat:   1.35, lng: 103.82 },
  { name: "Kashmir",     lat:  34.08, lng:  74.79 },
  { name: "Paris",       lat:  48.86, lng:   2.35 },
  { name: "Tokyo",       lat:  35.68, lng: 139.69 },
  { name: "Santorini",   lat:  36.39, lng:  25.46 },
  { name: "Bali",        lat:  -8.34, lng: 115.09 },
  { name: "New Zealand", lat: -40.90, lng: 174.89 },
  { name: "Kenya",       lat:  -1.29, lng:  36.82 },
  { name: "Turkey",      lat:  39.92, lng:  32.85 },
];

function latLngToVec3(lat: number, lng: number, radius: number): [number, number, number] {
  const phi   = (90 - lat)  * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
     (radius * Math.cos(phi)),
     (radius * Math.sin(phi) * Math.sin(theta)),
  ];
}

const GlobeHero = ({ onPlanTrip }: { onPlanTrip: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: 0, y: 0 });
  const frameRef  = useRef<number>(0);
  const threeRef  = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Dynamically load Three.js from CDN — no new files, no package install
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;

    script.onload = () => {
      const THREE = (window as any).THREE;
      if (!THREE || !canvasRef.current) return;

      // ── Scene setup ──────────────────────────────────────────────────────────
      const canvas   = canvasRef.current;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 3.2);

      // ── Globe wireframe ───────────────────────────────────────────────────────
      const RADIUS = 1;
      const globeGeo  = new THREE.SphereGeometry(RADIUS, 36, 36);
      const wireMat   = new THREE.MeshBasicMaterial({
        color:       0x2D3191,
        wireframe:   true,
        transparent: true,
        opacity:     0.18,
      });
      const globe = new THREE.Mesh(globeGeo, wireMat);
      scene.add(globe);

      // Slightly larger solid sphere as a subtle backing so the globe reads as a volume
      const backingGeo = new THREE.SphereGeometry(RADIUS * 0.995, 36, 36);
      const backingMat = new THREE.MeshBasicMaterial({
        color:       0xEEF1FF,
        transparent: true,
        opacity:     0.22,
        side:        THREE.BackSide,
      });
      scene.add(new THREE.Mesh(backingGeo, backingMat));

      // ── Destination dots ──────────────────────────────────────────────────────
      const dotGroup = new THREE.Group();
      const dotGeo   = new THREE.SphereGeometry(0.018, 8, 8);

      // Outer glow ring per dot
      const ringGeo  = new THREE.RingGeometry(0.022, 0.034, 16);

      GLOBE_DESTINATIONS.forEach(({ lat, lng }) => {
        const [x, y, z] = latLngToVec3(lat, lng, RADIUS + 0.012);

        // Core dot
        const dotMat = new THREE.MeshBasicMaterial({ color: 0x2D3191, transparent: true, opacity: 0.85 });
        const dot    = new THREE.Mesh(dotGeo, dotMat);
        dot.position.set(x, y, z);
        dotGroup.add(dot);

        // Pulsing ring (we'll animate scale in the loop)
        const ringMat  = new THREE.MeshBasicMaterial({ color: 0x2D3191, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
        const ring     = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(x, y, z);
        // Orient ring to face outward from globe center
        ring.lookAt(0, 0, 0);
        ring.rotateX(Math.PI / 2);
        dotGroup.add(ring);
      });

      scene.add(dotGroup);

      // Keep dotGroup in sync with globe rotation
      globe.add(dotGroup);

      // ── Resize handler ────────────────────────────────────────────────────────
      const resize = () => {
        if (!canvasRef.current) return;
        const w = canvasRef.current.clientWidth;
        const h = canvasRef.current.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener("resize", resize);

      // ── Mouse tracking ────────────────────────────────────────────────────────
      const onMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        // Normalise to [-1, 1]
        mouseRef.current.x = ((e.clientX - rect.left)  / rect.width)  * 2 - 1;
        mouseRef.current.y = ((e.clientY - rect.top)   / rect.height) * 2 - 1;
      };
      window.addEventListener("mousemove", onMouseMove);

      // ── Animation loop ────────────────────────────────────────────────────────
      let autoRotY  = 0;
      let camTargX  = 0;
      let camTargY  = 0;
      let camCurrX  = 0;
      let camCurrY  = 0;
      const MAX_TILT = 0.14; // radians (~8°)
      const LERP     = 0.04;

      const animate = (time: number) => {
        frameRef.current = requestAnimationFrame(animate);

        // Slow auto-rotation
        autoRotY += 0.0015;
        globe.rotation.y = autoRotY;

        // Camera parallax from mouse
        camTargX = -mouseRef.current.y * MAX_TILT;
        camTargY =  mouseRef.current.x * MAX_TILT;
        camCurrX += (camTargX - camCurrX) * LERP;
        camCurrY += (camTargY - camCurrY) * LERP;
        camera.position.x = Math.sin(camCurrY) * 3.2;
        camera.position.y = Math.sin(camCurrX) * 3.2;
        camera.position.z = Math.cos(Math.sqrt(camCurrX ** 2 + camCurrY ** 2)) * 3.2;
        camera.lookAt(0, 0, 0);

        // Pulse the dot rings
        const pulse = (Math.sin(time * 0.002) + 1) / 2; // 0 → 1
        dotGroup.children.forEach((child: any, i: number) => {
          if (i % 2 === 1) { // every second child is a ring
            child.scale.setScalar(1 + pulse * 0.5);
            child.material.opacity = 0.25 - pulse * 0.18;
          }
        });

        renderer.render(scene, camera);
      };
      frameRef.current = requestAnimationFrame(animate);

      // Store refs for cleanup
      threeRef.current = { renderer, scene, camera, resize, onMouseMove };
    };

    document.head.appendChild(script);

    return () => {
      cancelAnimationFrame(frameRef.current);
      if (threeRef.current) {
        window.removeEventListener("resize",      threeRef.current.resize);
        window.removeEventListener("mousemove",   threeRef.current.onMouseMove);
        threeRef.current.renderer.dispose();
      }
      // Remove the script tag on unmount to stay clean
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return (
    <section className="relative pt-[150px] md:pt-[200px] pb-20 md:pb-32 w-full bg-[#FAFAF8] overflow-hidden">
      {/* Soft abstract lighting — unchanged */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-100/50 via-transparent to-transparent blur-3xl rounded-full pointer-events-none" />

      {/* Globe canvas — full bleed, sits behind all content */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Content — unchanged grid, copy, buttons, images */}
      <div className="container mx-auto px-4 md:px-8 relative" style={{ zIndex: 2 }}>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left: Typography & CTA — untouched */}
          <div className="lg:col-span-5 lg:pr-8 text-center lg:text-left z-20">
            <RevealOnScroll>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#1F2328] mb-6 tracking-tight leading-[1.05]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Discover the world, beautifully curated.
              </h1>
              <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Zero-stress premium travel planning. We handle the details, you collect the memories.
              </p>
              <button
                onClick={onPlanTrip}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-[#2D3191] text-white text-lg font-bold rounded-full shadow-[0_10px_30px_rgba(45,49,145,0.3)] hover:bg-[#242875] hover:shadow-[0_15px_40px_rgba(45,49,145,0.4)] hover:-translate-y-1 transition-all duration-300"
              >
                Design Your Escape &rarr;
              </button>
            </RevealOnScroll>
          </div>

          {/* Right: Asymmetric Image Gallery — untouched */}
          <div className="lg:col-span-7 relative h-[500px] sm:h-[600px] lg:h-[700px] w-full mt-10 lg:mt-0">
            {/* Main Tall Image (Right aligned) */}
            <div className="absolute top-0 right-0 w-3/5 lg:w-[55%] h-[80%] lg:h-[85%] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-10 animate-slide-up-1">
              <img src="https://images.unsplash.com/photo-1504512485720-7d83a16ee930?auto=format&fit=crop&fm=webp&w=800&q=80" alt="Santorini" className="w-full h-full object-cover" />
            </div>

            {/* Wide Horizontal Image (Bottom left overlap) */}
            <div className="absolute bottom-0 left-0 w-[65%] lg:w-[60%] h-[45%] lg:h-[50%] rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.2)] z-20 animate-slide-up-2">
              <img src="https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&fm=webp&w=800&q=80" alt="Kashmir" className="w-full h-full object-cover" />
            </div>

            {/* Small Square Image (Top left overlap) */}
            <div className="absolute top-[10%] left-[10%] lg:left-[15%] w-[35%] lg:w-[30%] aspect-square rounded-[2rem] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.1)] z-30 animate-slide-up-3">
              <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&fm=webp&w=600&q=80" alt="Paris" className="w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// --- DATASETS ---
const keyServices = [
  { icon: <Plane className="w-8 h-8 text-blue-600" />, title: "Visa & Flight Support", description: "Hassle-free documentation and booking assistance." },
  { icon: <MapIcon className="w-8 h-8 text-blue-600" />, title: "End-to-End Planning", description: "From itinerary creation to returning home safely." },
  { icon: <Shield className="w-8 h-8 text-blue-600" />, title: "Verified Premium Stays", description: "Handpicked 4 & 5 star accommodations for comfort." },
  { icon: <Headphones className="w-8 h-8 text-blue-600" />, title: "24/7 On-Trip Support", description: "Always just a message away whenever you need us." },
  { icon: <Compass className="w-8 h-8 text-blue-600" />, title: "Curated Local Experiences", description: "Authentic activities beyond standard tourist traps." },
  { icon: <SlidersHorizontal className="w-8 h-8 text-blue-600" />, title: "Flexible Itineraries", description: "Plans that adapt to your pace and preferences." },
];

type Destination = { id: number; title: string; category: string; image: string; tags: string[]; description: string; };

const destinations: Destination[] = [
  { id: 1, title: "Bali, Indonesia", category: "International", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Tropical", "Beaches", "Culture"], description: "Island of Gods with serene beaches and vibrant culture." },
  { id: 2, title: "Maldives", category: "International", image: "https://commons.wikimedia.org/wiki/Special:FilePath/MaldivesBungalows.jpg?width=480", tags: ["Honeymoon", "Luxury", "Beaches"], description: "Overwater villas and crystal clear turquoise lagoons." },
  { id: 3, title: "Dubai, UAE", category: "International", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Luxury", "City", "Desert"], description: "Futuristic architecture, luxury shopping, and desert safaris." },
  { id: 4, title: "Singapore", category: "International", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["City", "Family", "Modern"], description: "A blend of nature and modernity in a global metropolis." },
  { id: 5, title: "Thailand", category: "International", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Beaches", "Culture", "Nightlife"], description: "Vibrant street life, ornate temples, and tropical beaches." },
  { id: 6, title: "Vietnam", category: "International", image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Nature", "Culture", "Food"], description: "Bustling cities, serene limestone islands, and rich history." },
  { id: 7, title: "Sri Lanka", category: "International", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Srilanka_ella.jpg?width=480", tags: ["Nature", "Wildlife", "Beaches"], description: "Diverse landscapes, wildlife, and ancient Buddhist ruins." },
  { id: 8, title: "Bhutan", category: "International", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Mountains", "Culture", "Peace"], description: "The last great Himalayan kingdom, shrouded in mystery." },
  { id: 9, title: "Europe (Schengen)", category: "International", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["History", "Culture", "Romance"], description: "Explore diverse cultures, history, and architecture across Europe." },
  { id: 10, title: "Australia", category: "International", image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Adventure", "Wildlife", "Beaches"], description: "The Great Barrier Reef, outback adventures, and vibrant cities." },
  { id: 11, title: "New Zealand", category: "International", image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Adventure", "Nature", "Landscapes"], description: "Stunning natural landscapes, from mountains to fjords." },
  { id: 12, title: "Japan", category: "International", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Culture", "Modern", "Food"], description: "A seamless blend of ancient traditions and cutting-edge technology." },
  { id: 13, title: "South Korea", category: "International", image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Culture", "City", "Food"], description: "Dynamic cities, ancient palaces, and trendy pop culture." },
  { id: 14, title: "Turkey", category: "International", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["History", "Culture", "Landscapes"], description: "Where East meets West, featuring rich history and unique landscapes." },
  { id: 15, title: "USA", category: "International", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Grand_Canyon_South_Rim_at_Sunset.jpg?width=480", tags: ["City", "Nature", "Diverse"], description: "Diverse experiences from bustling metropolises to vast national parks." },
  { id: 16, title: "South Africa", category: "International", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Table_mountain_cape_town.jpg?width=480", tags: ["Wildlife", "Adventure", "Nature"], description: "Safari adventures, stunning coastlines, and vibrant culture." },
  { id: 17, title: "Kenya", category: "International", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Wildlife", "Safari", "Nature"], description: "Home of the Great Migration and iconic African wildlife." },
  { id: 18, title: "Tanzania", category: "International", image: "https://commons.wikimedia.org/wiki/Special:FilePath/004_Sunrise_at_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg?width=480", tags: ["Wildlife", "Safari", "Beaches"], description: "Mount Kilimanjaro, Serengeti safaris, and Zanzibar beaches." },
  { id: 19, title: "Kashmir", category: "India", image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Mountains", "Nature", "Romance"], description: "Paradise on Earth with stunning valleys and Dal Lake." },
  { id: 20, title: "Leh-Ladakh", category: "India", image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Adventure", "Mountains", "Road Trip"], description: "Stark mountain landscapes, monasteries, and high passes." },
  { id: 21, title: "Himachal Pradesh", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Spiti_Valley%2C_Himachal_Pradesh.jpg?width=480", tags: ["Mountains", "Nature", "Adventure"], description: "Scenic hill stations, pine forests, and snow-capped peaks." },
  { id: 22, title: "Uttarakhand", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Valley_of_flowers%2C_Uttarakhand.jpg?width=480", tags: ["Mountains", "Spiritual", "Nature"], description: "Land of Gods, featuring pilgrimage sites and Himalayan vistas." },
  { id: 23, title: "Rajasthan", category: "India", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["History", "Culture", "Desert"], description: "Royal palaces, vibrant culture, and vast desert landscapes." },
  { id: 24, title: "Goa", category: "India", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Beaches", "Nightlife", "Relaxation"], description: "Sun, sand, beaches, and a relaxed coastal vibe." },
  { id: 25, title: "Kerala", category: "India", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&fm=webp&w=480&q=60", tags: ["Nature", "Backwaters", "Wellness"], description: "God's Own Country with tranquil backwaters and lush greenery." },
  { id: 26, title: "Andaman Islands", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Radhanagar_Beach%2C_Andaman_1.jpg?width=480", tags: ["Beaches", "Islands", "Adventure"], description: "Pristine beaches, clear waters, and water sports." },
  { id: 27, title: "North East India", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kaziranga_National_Park_%2C_Assam.jpg?width=480", tags: ["Nature", "Culture", "Offbeat"], description: "Unexplored beauty, tribal culture, and biodiversity." },
  { id: 28, title: "Sikkim", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kanchenjunga_from_Zuluk%2C_Sikkim.jpg?width=480", tags: ["Mountains", "Nature", "Monasteries"], description: "Home to Kanchenjunga, scenic landscapes, and monasteries." },
  { id: 29, title: "Meghalaya", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Living_Root_Bridge%2C_Meghalaya.jpg?width=480", tags: ["Nature", "Waterfalls", "Offbeat"], description: "Abode of Clouds, known for living root bridges and waterfalls." },
  { id: 30, title: "Arunachal Pradesh", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Tawang_Monastery%2C_Arunachal_Pradesh.jpg?width=480", tags: ["Mountains", "Culture", "Adventure"], description: "Land of the Dawn-Lit Mountains with rich tribal heritage." },
  { id: 31, title: "Karnataka", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Hampi_karnataka.jpg?width=480", tags: ["History", "Nature", "Culture"], description: "Heritage sites like Hampi, coffee plantations in Coorg." },
  { id: 32, title: "Tamil Nadu", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Meenakshi_Amman_Temple%2C_Madurai.jpg?width=480", tags: ["Culture", "Temples", "Beaches"], description: "Land of temples, rich culture, and coastal beauty." },
  { id: 33, title: "Pondicherry", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Beach_Promenade%2C_Pondicherry%2C_India.jpg?width=480", tags: ["Beaches", "French Colony", "Relaxation"], description: "A touch of French culture on the Indian coast." },
  { id: 34, title: "West Bengal", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Victoria_Memorial_Kolkata.jpg?width=480", tags: ["Culture", "History", "Mountains"], description: "Cultural richness of Kolkata to the tea gardens of Darjeeling." },
  { id: 35, title: "Odisha", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Konark_sun_temple%2C_Odisha.jpg?width=480", tags: ["Culture", "Temples", "Beaches"], description: "Known for its ancient temples, beaches, and tribal culture." },
  { id: 36, title: "Gujarat", category: "India", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Rann_of_Kutch.jpg?width=480", tags: ["Culture", "Wildlife", "White Desert"], description: "Rann of Kutch, Asiatic Lions, and vibrant traditions." },
];

const testimonials = [
  { id: 1, name: "Client Review", location: "", rating: 5, text: `We decided to go on a holiday to Greece.\nWe were 10 of us. The destination was all we were sure of. Rest was chaos.\nIn a large group the nitty gritties, the co ordination and convincing everyone to a workable plan is the worst part if travel planning.\nWe the smart people that we are gave the job to Kirti, a dear dear friend. The headache was hers. We were in the holiday mode that day onwards.\nNeedless to say she did a wonderful job and always. This made us enjoy the much needed and much awaited holiday all the more.\nNomads has never failed to be on point to everything, the reminders the information and looking after everyone's needs. Keep it up Kirti.\nThank you for this and all the ones we will put you through` },
  { id: 2, name: "Client Review", location: "", rating: 5, text: `Huge thanks for organizing such an incredible last-minute trip to Mauritius for my parents and relatives.\nDespite the short notice, everything was flawlessly planned and perfectly coordinated.\nThe hotels, transfers, and sightseeing were seamless and stress-free.\nMy parents felt well taken care of and absolutely loved the entire experience.\nTruly grateful for your professionalism, dedication, and ability to turn it into such a memorable holiday! 🌴✨` },
];

// =================================================================================
// CHATBOT & INTERACTIVE FUNNEL
// =================================================================================

const NOMADS_WHATSAPP_NUMBER_E164 = "919924399335";

type NomadsIntent = "enquiry" | "change" | "cancel";
type NomadsChatState = { intent?: NomadsIntent; name?: string; phone?: string; destination?: string; dates?: string; bookingRef?: string; details?: string; };
type NomadsMsg = { from: "bot" | "user"; text: string };

function buildNomadsWhatsappText(s: NomadsChatState) {
  const name = (s.name || "").trim() || "—";
  const phone = (s.phone || "").trim() || "—";
  if (s.intent === "enquiry") return `Hi The Nomads Co 👋\nI'm ${name} (${phone}). I'd like to enquire about a trip.\n\nDestination: ${s.destination || "—"}\nDates: ${s.dates || "—"}\n\nDetails:\n${s.details || "—"}`;
  if (s.intent === "change") return `Hi The Nomads Co 👋\nI'm ${name} (${phone}). I want to modify my reservation.\n\nBooking Ref: ${s.bookingRef || "—"}\nNew Destination: ${s.destination || "—"}\nNew Dates: ${s.dates || "—"}\n\nRequest:\n${s.details || "—"}`;
  return `Hi The Nomads Co 👋\nI'm ${name} (${phone}). I want to cancel my reservation.\n\nBooking Ref: ${s.bookingRef || "—"}\n\nReason / Notes:\n${s.details || "—"}`;
}

function nomadsWaLink(text: string) {
  const encodedText = encodeURIComponent(text);
  const isMobile = typeof window !== 'undefined' && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
  if (isMobile) return `https://wa.me/${NOMADS_WHATSAPP_NUMBER_E164}?text=${encodedText}`;
  return `https://web.whatsapp.com/send/?phone=${NOMADS_WHATSAPP_NUMBER_E164}&text=${encodedText}&type=phone_number&app_absent=1`;
}

function normalizeNomadsPhone(v: string) { return v.replace(/[^0-9+]/g, ""); }

function NomadsChatbot() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [state, setState] = useState<NomadsChatState>({});
  const [msgs, setMsgs] = useState<NomadsMsg[]>([{ from: "bot", text: "Hey 👋 I'm Nomads Assistant. What do you want to do today? (1/2/3)" }, { from: "bot", text: "1) New enquiry  2) Change reservation  3) Cancel reservation" }]);

  const steps = useMemo(() => {
    const base: any[] = [{ key: "intent", prompt: "Cool — pick 1/2/3 (enquiry/change/cancel).", required: true }, { key: "name", prompt: "What's your name?", required: true }, { key: "phone", prompt: "Phone number? (WhatsApp preferred)", required: true }];
    const intent = state.intent;
    if (!intent) return base;
    const mid: any[] = [];
    if (intent === "change" || intent === "cancel") mid.push({ key: "bookingRef", prompt: "Booking reference (if you have one). If not, type NA." });
    if (intent === "enquiry" || intent === "change") { mid.push({ key: "destination", prompt: "Which destination?", required: true }); mid.push({ key: "dates", prompt: "What dates? (approx is fine)", required: true }); }
    mid.push({ key: "details", prompt: "Tell me what you want in 1–2 lines.", required: true });
    return [...base, ...mid, { key: "done", prompt: "Done ✅ Tap below to send this on WhatsApp." }];
  }, [state.intent]);

  const current = steps[Math.min(step, steps.length - 1)];
  const whatsappText = useMemo(() => buildNomadsWhatsappText(state), [state]);
  const whatsappUrl  = useMemo(() => nomadsWaLink(whatsappText), [whatsappText]);

  const pushBot  = (t: string) => setMsgs((m) => [...m, { from: "bot",  text: t }]);
  const pushUser = (t: string) => setMsgs((m) => [...m, { from: "user", text: t }]);

  const validate = (key: string, v: string) => {
    v = v.trim();
    if (key === "intent") {
      const s = v.toLowerCase();
      const intent = (s === "1" || s.includes("enq")) ? "enquiry" : (s === "2" || s.includes("change")) ? "change" : (s === "3" || s.includes("cancel")) ? "cancel" : undefined;
      return intent ? { ok: true, value: intent } : { ok: false, err: "Type 1 for Enquiry, 2 for Change, or 3 for Cancel 🙂" };
    }
    if (key === "name"  && v.length < 2)                          return { ok: false, err: "Type your name (2+ letters) 🙂" };
    if (key === "phone" && normalizeNomadsPhone(v).length < 10)   return { ok: false, err: "Phone number only here (10+ digits) 🙂" };
    if (current.required && !v)                                    return { ok: false, err: "This can't be blank 🙂" };
    return { ok: true, value: v };
  };

  const send = () => {
    if (!current || current.key === "done" || !input.trim()) return;
    pushUser(input.trim());
    const res = validate(current.key, input);
    setInput("");
    if (!res.ok) return pushBot(res.err);
    setState((prev) => ({ ...prev, [current.key]: res.value }));
    const next = step + 1;
    setStep(next);
    if (steps[next]?.prompt) pushBot(steps[next].prompt);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!open ? (
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-black text-white font-extrabold px-5 py-4 shadow-2xl hover:-translate-y-1 transition-all">
          <MessageCircle className="w-6 h-6" />
        </button>
      ) : (
        <div className="w-[320px] sm:w-[360px] rounded-2xl shadow-2xl bg-white overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-black text-white">
            <div className="text-sm font-semibold">Nomads Assistant</div>
            <button onClick={() => setOpen(false)} className="text-lg leading-none">×</button>
          </div>
          <div className="h-[320px] overflow-y-auto px-4 py-3 space-y-3 bg-[#FAFAF8]">
            {msgs.map((m, idx) => (
              <div key={idx} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.from === "user" ? "bg-black text-white" : "bg-white border border-gray-100 shadow-sm text-gray-900"}`}>{m.text}</div>
              </div>
            ))}
          </div>
          {current?.key !== "done" ? (
            <div className="p-3 bg-white flex gap-2 border-t border-gray-100">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type here…" className="flex-1 rounded-xl bg-[#FAFAF8] px-4 py-2 text-sm outline-none" />
              <button onClick={send} className="rounded-xl px-4 py-2 bg-black text-white text-sm">Send</button>
            </div>
          ) : (
            <div className="p-3 bg-white border-t border-gray-100">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="block text-center rounded-xl px-4 py-3 bg-green-600 text-white text-sm font-semibold">Send on WhatsApp ✅</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DestinationFunnel({ preselectedDest, onClose }: { preselectedDest?: string, onClose: () => void }) {
  const [step, setStep]         = useState(preselectedDest ? 1 : 0);
  const [dest, setDest]         = useState(preselectedDest || "");
  const [timeline, setTimeline] = useState("");
  const [travelers, setTravelers] = useState("");
  const [vibe, setVibe]         = useState("");
  const [name, setName]         = useState("");

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const generatePayloadText = () => `Hi Kirti! 👋 I'm ${name}. I'd love to plan a trip${dest ? ` to ${dest}` : ""}.\n\n*Travelers:* ${travelers}\n*Timeline:* ${timeline}\n*Vibe:* ${vibe}\n\nCan you help me curate some ideas?`;

  const generateWhatsAppLink = () => {
    const encodedText = encodeURIComponent(generatePayloadText());
    const isMobile = typeof window !== 'undefined' && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
    if (isMobile) return `https://wa.me/${NOMADS_WHATSAPP_NUMBER_E164}?text=${encodedText}`;
    return `https://web.whatsapp.com/send/?phone=${NOMADS_WHATSAPP_NUMBER_E164}&text=${encodedText}&type=phone_number&app_absent=1`;
  };

  const generateEmailLink = () => {
    const plainTextBody = `Hi Kirti,\n\nI'm ${name}. I'd love to plan a trip${dest ? ` to ${dest}` : ""}.\n\nTravelers: ${travelers}\nTimeline: ${timeline}\nVibe: ${vibe}\n\nCan you help me curate some ideas?\n\nBest,\n${name}`;
    const subject = `New Trip Inquiry: ${dest || "Custom Trip"}`;
    return `mailto:thenomadsco@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainTextBody)}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[420px] flex flex-col animate-fade-up">
        <div className="px-6 py-4 flex items-center justify-between bg-[#FAFAF8]">
          <div className="flex items-center gap-2">
            {step > (preselectedDest ? 1 : 0) && (
              <button onClick={handleBack} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500"><ArrowLeft className="w-5 h-5" /></button>
            )}
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Step {preselectedDest ? step : step + 1} of {preselectedDest ? 4 : 5}</span>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-8 flex-1 flex flex-col justify-center">
          {step === 0 && !preselectedDest && (
            <div className="animate-fade-up">
              <h3 className="text-3xl font-bold mb-8 text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif" }}>Where are you dreaming of going?</h3>
              <input type="text" value={dest} onChange={e => setDest(e.target.value)} placeholder="e.g. Bali, Paris, or 'Not sure yet!'" className="w-full text-lg px-6 py-5 bg-[#FAFAF8] rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none mb-6 shadow-inner" autoFocus onKeyDown={e => e.key === 'Enter' && dest && handleNext()} />
              <button onClick={handleNext} disabled={!dest} className="w-full py-4 bg-[#2D3191] text-white font-bold rounded-2xl disabled:opacity-50 hover:bg-[#242875] transition-colors shadow-lg">Continue</button>
            </div>
          )}
          {step === 1 && (
            <div className="animate-fade-up">
              <h3 className="text-3xl font-bold mb-8 text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif" }}>When are you planning to travel?</h3>
              <div className="space-y-3">
                {["Within 30 Days", "1-3 Months", "3-6 Months", "Just dreaming for now"].map(opt => (
                  <button key={opt} onClick={() => { setTimeline(opt); handleNext(); }} className={`w-full text-left px-6 py-5 rounded-2xl transition-all font-medium shadow-sm ${timeline === opt ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-600' : 'bg-[#FAFAF8] hover:bg-gray-100 text-gray-700'}`}>{opt}</button>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="animate-fade-up">
              <h3 className="text-3xl font-bold mb-8 text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif" }}>Who is joining you on this journey?</h3>
              <div className="space-y-3">
                {["Solo Adventure", "Couples Retreat", "Family Vacation", "Group of Friends"].map(opt => (
                  <button key={opt} onClick={() => { setTravelers(opt); handleNext(); }} className={`w-full text-left px-6 py-5 rounded-2xl transition-all font-medium shadow-sm ${travelers === opt ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-600' : 'bg-[#FAFAF8] hover:bg-gray-100 text-gray-700'}`}>{opt}</button>
                ))}
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="animate-fade-up">
              <h3 className="text-3xl font-bold mb-8 text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif" }}>What defines your perfect trip?</h3>
              <div className="space-y-3">
                {["Total Relaxation & Beaches", "Adventure & Exploring", "Culture & History", "A mix of everything"].map(opt => (
                  <button key={opt} onClick={() => { setVibe(opt); handleNext(); }} className={`w-full text-left px-6 py-5 rounded-2xl transition-all font-medium shadow-sm ${vibe === opt ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-600' : 'bg-[#FAFAF8] hover:bg-gray-100 text-gray-700'}`}>{opt}</button>
                ))}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="animate-fade-up">
              <div className="w-16 h-16 bg-[#EEF0FF] text-[#2D3191] rounded-full flex items-center justify-center mb-6"><CheckCircle2 className="w-8 h-8" /></div>
              <h3 className="text-3xl font-bold mb-2 text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif" }}>Perfect. We know exactly what to do.</h3>
              <p className="text-gray-500 mb-8">Just drop your name below and choose how you'd like to send your inquiry.</p>
              <div className="space-y-4">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" className="w-full text-lg px-6 py-5 bg-[#FAFAF8] rounded-2xl focus:ring-2 focus:ring-[#2D3191] outline-none shadow-inner" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                  <button onClick={() => { window.open(generateWhatsAppLink(), "_blank"); onClose(); }} disabled={!name} className="w-full py-4 bg-[#25D366] text-white font-bold rounded-2xl disabled:opacity-50 hover:bg-[#1DA851] transition-colors shadow-lg flex items-center justify-center gap-2">WhatsApp 💬</button>
                  <button onClick={() => { window.location.href = generateEmailLink(); onClose(); }} disabled={!name} className="w-full py-4 bg-[#2D3191] text-white font-bold rounded-2xl disabled:opacity-50 hover:bg-[#242875] transition-colors shadow-lg flex items-center justify-center gap-2">Email ✉️</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fadeUp 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
}

// =================================================================================
// MAIN COMPONENT
// =================================================================================

export default function Home() {
  const [isMenuOpen, setIsMenuOpen]         = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [showDestinations, setShowDestinations] = useState(false);
  const [activeCategory, setActiveCategory] = useState("International");

  // Funnel State
  const [showFunnel, setShowFunnel] = useState(false);
  const [funnelDest, setFunnelDest] = useState("");

  // Glass Pill Hook State
  const [showPill, setShowPill]       = useState(false);
  const [randomDest, setRandomDest]   = useState<Destination | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hook Pill Logic
  useEffect(() => {
    setRandomDest(destinations[Math.floor(Math.random() * destinations.length)]);
    const t1 = setTimeout(() => setShowPill(true),  2000);
    const t2 = setTimeout(() => setShowPill(false), 12000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const filteredDestinations = destinations.filter((dest) => dest.category === activeCategory);

  const handleDestinationClick = (destinationName: string) => {
    setShowDestinations(false);
    setFunnelDest(destinationName);
    setShowFunnel(true);
  };

  const openGenericFunnel = () => {
    setFunnelDest("");
    setShowFunnel(true);
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <img src={nomadsLogo} alt="The Nomads Co." width={40} height={40} loading="eager" className="h-10 w-auto rounded-md shadow-sm" />
            <span className="font-bold tracking-tighter text-lg sm:text-2xl text-[#1F2328]">The Nomads Co.</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection("about")} className="text-sm font-medium text-[#1F2328] hover:text-blue-600 transition-colors">About</button>
            <button onClick={() => scrollToSection("destinations")} className="text-sm font-medium text-[#1F2328] hover:text-blue-600 transition-colors">Destinations</button>
            <button onClick={() => scrollToSection("reviews")} className="text-sm font-medium text-[#1F2328] hover:text-blue-600 transition-colors">Reviews</button>
            <button onClick={() => scrollToSection("contact")} className="px-6 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-full hover:bg-[#242875] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">Plan My Trip</button>
          </div>
          <button className="md:hidden z-50 p-2 text-gray-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <div className="space-y-1.5"><span className="block w-6 h-0.5 bg-current"></span><span className="block w-4 h-0.5 bg-current"></span><span className="block w-6 h-0.5 bg-current"></span></div>}
          </button>
        </div>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[100] bg-white flex flex-col pt-24 px-6">
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 text-3xl font-light text-gray-900">×</button>
            <div className="flex flex-col items-center gap-8">
              <button onClick={() => scrollToSection("about")} className="text-2xl font-semibold text-gray-900">About</button>
              <button onClick={() => scrollToSection("destinations")} className="text-2xl font-semibold text-gray-900">Destinations</button>
              <button onClick={() => scrollToSection("reviews")} className="text-2xl font-semibold text-gray-900">Reviews</button>
              <button onClick={() => scrollToSection("contact")} className="px-8 py-3 bg-[#2D3191] text-white text-lg font-medium rounded-full shadow-md hover:bg-[#242875] transition-colors">Plan My Trip</button>
            </div>
          </div>
        )}
      </nav>

      {/* Floating Glass Hook Pill */}
      {showPill && randomDest && (
        <div className="fixed top-24 right-4 md:right-8 z-50 animate-float-in">
          <div
            onClick={() => { setShowPill(false); document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl p-4 pr-6 flex items-center gap-4 cursor-pointer hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-inner">
              <img src={randomDest.image} className="w-full h-full object-cover" alt={randomDest.title} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#02A551] uppercase tracking-wider mb-0.5 flex items-center gap-1"><Sparkles size={12}/> Trending</p>
              <p className="text-sm font-semibold text-gray-900">Escape to {randomDest.title}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setShowPill(false); }} className="absolute top-2 right-2 text-gray-400 hover:text-gray-900">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── GLOBE HERO ────────────────────────────────────────────────────────── */}
      <GlobeHero onPlanTrip={openGenericFunnel} />

      {/* About Section */}
      <section id="about" className="py-32 px-6 sm:px-12 bg-white relative">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#EEF0FF] rounded-[2.5rem] rotate-3 transition-transform duration-700 group-hover:rotate-6" />
            <img src={kirtiProfile} alt="Kirti Shah" width={600} height={750} loading="lazy" decoding="async" className="relative w-full aspect-[4/5] object-cover rounded-[2.5rem] shadow-xl" />
          </div>
          <div className="md:pl-6">
            <span className="text-[#2D3191] font-bold text-xs uppercase tracking-widest mb-6 block">The Founder</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1F2328] mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Meet Kirti Shah</h2>
            <p className="text-lg text-[#1F2328]/70 leading-relaxed mb-6 max-w-xl">
              Kirti believes that travel should be happy, not stressful. That's why she treats every client like family, personally overseeing every trip to ensure you are safe, comfortable, and having the time of your life.
            </p>
            <p className="text-lg text-[#1F2328]/70 leading-relaxed max-w-xl">
              With over 10 years of experience, we handle visas, flights, and bookings, offering luxury stays at best-value prices with 24/7 support.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-[#FAFAF8]">
        <div className="container mx-auto px-4 md:px-8">
          <RevealOnScroll className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif" }}>Key Services Offered</h2>
          </RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyServices.map((service, index) => (
              <RevealOnScroll key={index}>
                <div className="group p-8 bg-white rounded-[2rem] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 border border-gray-100/80">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2328] mb-3">{service.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{service.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section id="destinations" className="py-32 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <RevealOnScroll className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1F2328] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Where Do You Want To Go?</h2>
            <p className="text-xl text-[#1F2328]/60 max-w-2xl mx-auto">From serene beaches to majestic mountains, explore our handpicked destinations for every kind of traveller.</p>
          </RevealOnScroll>

          {/* Category Filter */}
          <div className="flex justify-center gap-4 mb-12">
            {["International", "India"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-full font-semibold text-sm transition-all ${activeCategory === cat ? "bg-[#2D3191] text-white shadow-lg" : "bg-[#FAFAF8] text-gray-600 hover:bg-gray-100"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Destination Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(showDestinations ? filteredDestinations : filteredDestinations.slice(0, 8)).map((dest) => (
              <RevealOnScroll key={dest.id}>
                <div
                  onClick={() => handleDestinationClick(dest.title)}
                  className="group cursor-pointer bg-white rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="h-48 overflow-hidden">
                    <img src={dest.image} alt={dest.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[#1F2328] text-lg mb-2">{dest.title}</h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{dest.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {dest.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          {filteredDestinations.length > 8 && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowDestinations(!showDestinations)}
                className="px-10 py-4 bg-[#1F2328] text-white font-semibold rounded-full hover:bg-black transition-all shadow-lg hover:-translate-y-0.5"
              >
                {showDestinations ? "Show Less" : `View All ${filteredDestinations.length} Destinations`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="reviews" className="py-32 bg-[#FAFAF8]">
        <div className="container mx-auto px-4 md:px-8">
          <RevealOnScroll className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif" }}>What Our Travellers Say</h2>
          </RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial) => (
              <RevealOnScroll key={testimonial.id}>
                <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100/80">
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} size={20} className="text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-[#1F2328]/80 leading-relaxed text-lg mb-8 whitespace-pre-line">{testimonial.text}</p>
                  <div>
                    <h4 className="font-bold text-xl text-[#1F2328]">{testimonial.name}</h4>
                    {!!testimonial.location && <p className="text-gray-500 mt-1">{testimonial.location}</p>}
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section (Redesigned Interactive Bento Grid) */}
      <section id="contact" className="py-32 px-6 sm:px-12 bg-white relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto text-center mb-16">
           <h2 className="text-5xl md:text-6xl font-bold text-[#1F2328] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Let's talk travel.</h2>
           <p className="text-xl text-[#1F2328]/60 max-w-2xl mx-auto">We are ready to craft your perfect trip. Choose how you'd like to reach us.</p>
        </div>
        <div className="max-w-[1000px] mx-auto grid md:grid-cols-3 gap-8">

          {/* WhatsApp Bento */}
          <a href="https://wa.me/919924399335" target="_blank" rel="noreferrer" className="group relative bg-[#FAFAF8] rounded-[2rem] p-10 text-center hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(37,211,102,0.15)] transition-all duration-500 overflow-hidden cursor-pointer block">
             <div className="w-20 h-20 mx-auto bg-white rounded-[1.5rem] flex items-center justify-center text-[#25D366] shadow-[0_8px_20px_rgb(0,0,0,0.06)] mb-8 group-hover:scale-110 transition-transform duration-500">
               <MessageCircle size={36} />
             </div>
             <h3 className="text-2xl font-bold text-[#1F2328] mb-2 group-hover:hidden transition-all">WhatsApp</h3>
             <h3 className="text-2xl font-bold text-[#25D366] mb-2 hidden group-hover:block animate-fade-up">Start Chat</h3>
             <p className="text-gray-500 font-medium">+91 99243 99335</p>
             <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#25D366] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </a>

          {/* Email Bento */}
          <a href="mailto:thenomadsco@gmail.com" className="group relative bg-[#FAFAF8] rounded-[2rem] p-10 text-center hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(45,49,145,0.15)] transition-all duration-500 overflow-hidden cursor-pointer block">
             <div className="w-20 h-20 mx-auto bg-white rounded-[1.5rem] flex items-center justify-center text-[#2D3191] shadow-[0_8px_20px_rgb(0,0,0,0.06)] mb-8 group-hover:scale-110 transition-transform duration-500">
               <Mail size={36} />
             </div>
             <h3 className="text-2xl font-bold text-[#1F2328] mb-2 group-hover:hidden transition-all">Email</h3>
             <h3 className="text-2xl font-bold text-[#2D3191] mb-2 hidden group-hover:block animate-fade-up">Write to Us</h3>
             <p className="text-gray-500 font-medium truncate px-4">thenomadsco@gmail.com</p>
             <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#2D3191] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </a>

          {/* Location Bento */}
          <div className="group relative bg-[#FAFAF8] rounded-[2rem] p-10 text-center hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(2,165,81,0.15)] transition-all duration-500 overflow-hidden">
             <div className="w-20 h-20 mx-auto bg-white rounded-[1.5rem] flex items-center justify-center text-[#02A551] shadow-[0_8px_20px_rgb(0,0,0,0.06)] mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:animate-bounce">
               <MapPin size={36} />
             </div>
             <h3 className="text-2xl font-bold text-[#1F2328] mb-2">Location</h3>
             <p className="text-gray-500 font-medium leading-relaxed">Vadodara, Gujarat<br/>India</p>
             <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#02A551] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#1F2328] text-white py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div className="col-span-1 md:col-span-2">
              <span className="text-3xl font-bold text-white mb-8 block" style={{ fontFamily: "'Playfair Display', serif" }}>The Nomads Co.</span>
              <p className="text-gray-400 pr-6 leading-relaxed mb-10 text-lg">Crafting unforgettable, personalized travel experiences. Your journey, our expertise. Let's explore the world together.</p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/thenomadsco/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#2D3191] hover:scale-110 transition-all duration-300"><Instagram className="w-5 h-5" /></a>
                <a href="https://www.facebook.com/Thenomadsco/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#2D3191] hover:scale-110 transition-all duration-300"><Facebook className="w-5 h-5" /></a>
                <a href="mailto:thenomadsco@gmail.com" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#2D3191] hover:scale-110 transition-all duration-300"><Mail className="w-5 h-5" /></a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8">Quick Links</h4>
              <ul className="space-y-4 font-medium text-gray-300">
                <li><button onClick={() => scrollToSection("about")} className="hover:text-white transition-colors">About Us</button></li>
                <li><button onClick={() => scrollToSection("destinations")} className="hover:text-white transition-colors">Destinations</button></li>
                <li><button onClick={() => scrollToSection("reviews")} className="hover:text-white transition-colors">Reviews</button></li>
                <li><button onClick={() => scrollToSection("contact")} className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8">Legal</h4>
              <ul className="space-y-4 font-medium text-gray-300">
                <li><Link to="/privacypolicy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 font-medium">
            <p className="text-sm">© {new Date().getFullYear()} The Nomads Co. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Render the new Funnel when state is true */}
      {showFunnel && (
        <DestinationFunnel
          preselectedDest={funnelDest}
          onClose={() => setShowFunnel(false)}
        />
      )}

      {/* Persistent Chatbot */}
      <NomadsChatbot />

      {/* Global CSS animations */}
      <style>{`
        @keyframes floatIn {
          from { opacity: 0; transform: translateX(40px) translateY(20px); }
          to { opacity: 1; transform: translateX(0) translateY(0); }
        }
        .animate-float-in { animation: floatIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up-1 { animation: slideUpFade 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        .animate-slide-up-2 { animation: slideUpFade 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; opacity: 0; }
        .animate-slide-up-3 { animation: slideUpFade 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards; opacity: 0; }
      `}</style>
    </div>
  );
}
