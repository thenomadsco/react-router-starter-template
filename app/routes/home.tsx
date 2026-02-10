import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import nomadsLogo from "./the nomads logo.jpeg";
import type { Route } from "./+types/home";

// --- Icons & Assets ---
type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
  fill?: string;
};

const iconDefaults = { size: 24, strokeWidth: 2 };

function IconBase({
  size = iconDefaults.size,
  className,
  strokeWidth = iconDefaults.strokeWidth,
  fill = "none",
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function ArrowRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </IconBase>
  );
}

function BadgeCheck(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </IconBase>
  );
}

function CheckCircle2(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </IconBase>
  );
}

function Facebook(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M14 8h-2c-1.1 0-2 .9-2 2v2H8v3h2v5h3v-5h2.2l.8-3H13v-1.6c0-.4.3-.7.7-.7H16V8z" />
    </IconBase>
  );
}

function Instagram(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

function Mail(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </IconBase>
  );
}

function MapPin(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 21s6-6.2 6-11a6 6 0 0 0-12 0c0 4.8 6 11 6 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </IconBase>
  );
}

function Menu(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </IconBase>
  );
}

function Phone(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6.5 4.5h2l1.2 3-2 1.2c.9 2 2.5 3.6 4.5 4.5l1.2-2 3 1.2v2c0 .9-.7 1.6-1.6 1.6-6.3-.5-11.4-5.6-11.8-11.8 0-.9.7-1.6 1.5-1.6z" />
    </IconBase>
  );
}

function Sparkles(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
      <path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14z" />
    </IconBase>
  );
}

function Star(props: IconProps) {
  return (
    <IconBase {...props} fill={props.fill ?? "currentColor"}>
      <path d="M12 3.5 14.7 9l5.8.8-4.2 4.1 1 5.9L12 17l-5.3 2.8 1-5.9L3.5 9.8 9.3 9z" />
    </IconBase>
  );
}

const logoImage = nomadsLogo;

const destinations = [
  {
    name: "Santorini",
    descriptor: "Iconic white cliffs",
    image:
      "https://images.unsplash.com/photo-1655304672403-dd84529b4735?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW50b3JpbmklMjBncmVlY2UlMjBzdW5ueXxlbnwxfHx8fDE3Njk4NTg2MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "beaches",
  },
  {
    name: "Maldives",
    descriptor: "Overwater paradise",
    image:
      "https://images.unsplash.com/photo-1643856554673-5c34857c8231?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtYWxkaXZlcyUyMGJlYWNoJTIwdHJvcGljYWwlMjB3YXJtfGVufDF8fHx8MTc2OTg1ODYxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "honeymoon",
  },
  {
    name: "Paris",
    descriptor: "Timeless elegance",
    image:
      "https://images.unsplash.com/photo-1637050087981-13fcadf46d8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGNpdHklMjB0cmF2ZWwlMjBkYXlsaWdodHxlbnwxfHx8fDE3Njk4NTg2MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "cities",
  },
  {
    name: "Bali",
    descriptor: "Spiritual serenity",
    image:
      "https://images.unsplash.com/photo-1591326272816-0bd479a5cb20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiYWxpJTIwaW5kb25lc2lhJTIwdGVtcGxlJTIwc3Vubnl8ZW58MXx8fHwxNzY5ODU4NjI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "adventure",
  },
  {
    name: "Swiss Alps",
    descriptor: "Mountain majesty",
    image:
      "https://images.unsplash.com/photo-1612638945907-1cb1d758f2d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxzd2lzcyUyMGFscHMlMjBtb3VudGFpbnMlMjBzbm93fGVufDF8fHx8MTc2OTg1ODYyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "adventure",
  },
  {
    name: "Tokyo",
    descriptor: "Modern tradition",
    image:
      "https://images.unsplash.com/photo-1629020770453-d3d15182474c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx0b2t5byUyMGphcGFuJTIwY2l0eSUyMHN0cmVldHxlbnwxfHx8fDE3Njk4NTg2Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "cities",
  },
];

const categories = ["All", "Beaches", "Cities", "Adventure", "Honeymoon"];

const experiences = [
  {
    title: "Wildlife Safari",
    description:
      "Witness Africa's majestic creatures in their natural habitat with expert guides and luxury lodges.",
    image:
      "https://images.unsplash.com/photo-1673667617327-325f96464955?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzYWZhcmklMjBhZnJpY2ElMjB3aWxkbGlmZXxlbnwxfHx8fDE3Njk4NTg2NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ctaType: "primary",
  },
  {
    title: "Private Yacht Cruises",
    description:
      "Sail the azure waters of the Mediterranean with personalized itineraries and world-class service.",
    image:
      "https://images.unsplash.com/photo-1648997934392-7213a9ce50b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx5YWNodCUyMGNydWlzZSUyMGx1eHVyeSUyMG9jZWFufGVufDF8fHx8MTc2OTg1ODY1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ctaType: "secondary",
  },
  {
    title: "Culinary Journeys",
    description:
      "Savor Michelin-starred dining and authentic local cuisines curated by top chefs worldwide.",
    image:
      "https://images.unsplash.com/photo-1616671276441-2f2c277b8bf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtaWNoZWxpbiUyMHJlc3RhdXJhbnQlMjBmaW5lJTIwZGluaW5nfGVufDF8fHx8MTc2OTg1ODY1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ctaType: "primary",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    city: "Mumbai, India",
    image:
      "https://images.unsplash.com/photo-1623594675959-02360202d4d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHdvbWFuJTIwc21pbGluZ3xlbnwxfHx8fDE3Njk4NTE0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    quote:
      "Every detail was perfected. Our Maldives honeymoon exceeded all expectations.",
    rating: 5,
  },
  {
    name: "Vikram Patel",
    city: "Bangalore, India",
    image:
      "https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMG1hbiUyMGJ1c2luZXNzfGVufDF8fHx8MTc2OTc5NDM1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    quote: "Seamless planning from start to finish. Worth every rupee and more.",
    rating: 5,
  },
  {
    name: "Ananya & Rahul",
    city: "Delhi, India",
    image:
      "https://images.unsplash.com/photo-1605381942640-0a262ce59788?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxjb3VwbGUlMjBoYXBweSUyMHBvcnRyYWl0JTIwc21pbGluZ3xlbnwxfHx8fDE3Njk4NTg2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    quote:
      "The Nomads Co. turned our anniversary into an unforgettable journey.",
    rating: 5,
  },
];

const trustFeatures = [
  { icon: CheckCircle2, label: "Personalized itineraries" },
  { icon: MapPin, label: "End-to-end planning" },
  { icon: Sparkles, label: "Premium stays & experiences" },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "The Nomads Co. | Curated Journeys" },
    {
      name: "description",
      content:
        "Personalized premium travel with seamless planning and curated destinations.",
    },
  ];
}

// --- Animation Components & Styles ---

const customStyles = `
  html { scroll-behavior: smooth; }
  
  @keyframes fade-in-up {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fade-in {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  .animate-ready { opacity: 0; }
  
  .animate-active-up {
    animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  
  .animate-active-fade {
    animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;

function RevealOnScroll({ 
  children, 
  className = "", 
  animation = "up", 
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string; 
  animation?: "up" | "fade";
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const animClass = animation === "up" ? "animate-active-up" : "animate-active-fade";

  return (
    <div 
      ref={ref} 
      className={`${className} ${isVisible ? animClass : "animate-ready"}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white antialiased selection:bg-[#2D3191]/10 selection:text-[#2D3191]">
      <style>{customStyles}</style>
      <Navigation />
      <Hero />
      <TrustStrip />
      <DiagonalDestinations />
      <ExperienceSection />
      <StatsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-[#E6E8EF] transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logoImage}
              alt="The Nomads Co."
              className="h-10 w-auto transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
            />
            <span
              className="text-lg font-semibold text-[#1F2328] tracking-tight"
              style={{
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              The Nomads Co.
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center justify-center gap-10">
            {[
              { label: "Destinations", href: "#destinations" },
              { label: "Experiences", href: "#experiences" },
              { label: "Testimonials", href: "#testimonials" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors duration-300 ease-out"
                style={{ letterSpacing: "-0.01em" }}
              >
                {link.label}
              </a>
            ))}

            <Link
              to="/contactus"
              className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors duration-300 ease-out"
              style={{ letterSpacing: "-0.01em" }}
            >
              Contact
            </Link>
          </div>

          {/* CTA & Mobile Menu */}
          <div className="flex items-center justify-end gap-4">
            <Link
              to="/contactus"
              className="hidden lg:block px-6 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-full hover:bg-[#242875] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg active:scale-95 active:translate-y-0"
            >
              Plan My Trip
            </Link>

            <button className="lg:hidden text-[#1F2328] transition-transform duration-300 ease-out hover:scale-110">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const heroImage =
    "https://images.unsplash.com/photo-1520190282873-1c9808f1f512?q=80&w=1080&auto=format&fit=crop";
  const image1 =
    "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1080&auto=format&fit=crop";
  const image2 =
    "https://images.unsplash.com/photo-1589979481223-deb89306920f?q=80&w=1080&auto=format&fit=crop";

  return (
    <section className="relative bg-white pt-32 pb-24 sm:pt-40 sm:pb-32 px-6 sm:px-8 lg:px-12 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <RevealOnScroll delay={100}>
              <div className="inline-block mb-8">
                <span className="px-5 py-2 bg-[#E7F7EF] text-[#02A551] text-[0.6875rem] font-semibold tracking-[0.15em] uppercase rounded-full">
                  Creative Travel
                </span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl leading-[1.1] mb-8 text-[#1F2328]"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                }}
              >
                Curated journeys,
                <br />
                flawlessly planned.
              </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={300}>
              <p
                className="text-lg sm:text-xl text-[#1F2328]/60 leading-relaxed mb-10 max-w-xl"
                style={{ letterSpacing: "-0.01em" }}
              >
                Personalized premium travel with seamless planning. We design
                extraordinary experiences tailored to your dreams, handling every
                detail from start to finish.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={400}>
              <div className="flex flex-col sm:flex-row gap-5">
                <Link
                  to="/contactus"
                  className="group px-10 py-4 bg-[#2D3191] text-white text-sm font-medium tracking-wide rounded-full hover:bg-[#242875] flex items-center justify-center gap-2 shadow-lg shadow-[#2D3191]/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:scale-95 active:translate-y-0"
                >
                  Get a custom itinerary
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <a
                  href="#destinations"
                  className="px-10 py-4 bg-transparent border border-[#02A551] text-[#02A551] text-sm font-medium tracking-wide rounded-full hover:bg-[#E7F7EF] transition-all duration-300 ease-out hover:-translate-y-1 active:scale-95 active:translate-y-0"
                >
                  Explore destinations
                </a>
              </div>
            </RevealOnScroll>
          </div>

          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-4">
              <RevealOnScroll delay={300} className="col-span-2">
                <div className="overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src={heroImage}
                    alt="St. Moritz, Switzerland"
                    className="w-full h-[300px] sm:h-[400px] object-cover transition-transform duration-1000 ease-out hover:scale-105"
                  />
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={400}>
                <div className="overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src={image1}
                    alt="Monaco Harbor"
                    className="w-full h-[200px] sm:h-[250px] object-cover transition-transform duration-1000 ease-out hover:scale-105"
                  />
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={500}>
                <div className="overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src={image2}
                    alt="Playa Juanillo, Cap Cana"
                    className="w-full h-[200px] sm:h-[250px] object-cover transition-transform duration-1000 ease-out hover:scale-105"
                  />
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="bg-[#EEF0FF] py-12 border-t border-[#E6E8EF]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        <RevealOnScroll delay={200}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3
                className="text-xl sm:text-2xl text-[#1F2328]"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  letterSpacing: "-0.02em",
                }}
              >
                Curated since 2015
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-8 lg:gap-12">
              {trustFeatures.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.label} className="flex items-center gap-2 group cursor-default">
                    <div className="relative transition-transform duration-300 group-hover:scale-110">
                      <Icon size={20} className="text-[#2D3191]" strokeWidth={2} />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#02A551] rounded-full" />
                    </div>
                    <span className="text-sm font-medium text-[#1F2328]">
                      {feature.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

function DiagonalDestinations() {
  return (
    <section id="destinations" className="py-20 sm:py-32 px-6 sm:px-8 lg:px-12 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-16 sm:mb-20">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl text-[#1F2328] mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                letterSpacing: "-0.025em",
              }}
            >
              Featured Destinations
            </h2>
            <p
              className="text-lg sm:text-xl text-[#1F2328]/60 max-w-2xl mx-auto"
              style={{ letterSpacing: "-0.01em" }}
            >
              Handpicked places that inspire wonder
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className="px-6 py-2.5 text-sm font-medium rounded-full border-2 bg-transparent border-[#E6E8EF] text-[#1F2328] hover:border-[#2D3191] hover:text-[#2D3191] transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-95"
              >
                {category}
              </button>
            ))}
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {destinations.map((destination, index) => (
            <RevealOnScroll key={destination.name} delay={index * 100}>
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl shadow-md transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-[320px] object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                    <h3
                      className="text-2xl font-semibold text-white mb-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {destination.name}
                    </h3>
                    <p className="text-white/90 text-sm mb-4 font-light">
                      {destination.descriptor}
                    </p>
                    <div className="inline-flex items-center gap-2 text-white text-sm font-medium border-b border-white/30 pb-1 group-hover:border-white transition-colors">
                      Explore
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section id="experiences" className="py-20 sm:py-32 px-6 sm:px-8 lg:px-12 bg-[#EEF0FF]">
      <div className="max-w-[1400px] mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-16 sm:mb-20">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl text-[#1F2328] mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                letterSpacing: "-0.025em",
              }}
            >
              Signature Experiences
            </h2>
            <p
              className="text-lg sm:text-xl text-[#1F2328]/60 max-w-2xl mx-auto"
              style={{ letterSpacing: "-0.01em" }}
            >
              Thoughtfully crafted journeys for discerning travelers
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          {experiences.map((experience, index) => (
            <RevealOnScroll key={experience.title} delay={index * 150}>
              <div className="group h-full flex flex-col">
                <div className="relative overflow-hidden rounded-2xl mb-6 shadow-md transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl">
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className="w-full h-[300px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                <h3
                  className="text-2xl font-semibold text-[#1F2328] mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {experience.title}
                </h3>
                <p className="text-[#1F2328]/70 leading-relaxed mb-6 flex-grow">
                  {experience.description}
                </p>

                <div>
                  {experience.ctaType === "primary" ? (
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#2D3191] text-white text-sm font-medium rounded-full hover:bg-[#242875] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg active:scale-95">
                      Learn more
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-[#02A551] text-[#02A551] text-sm font-medium rounded-full hover:bg-[#E7F7EF] transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-95">
                      Learn more
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section id="testimonials" className="py-20 sm:py-32 px-6 sm:px-8 lg:px-12 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-16 sm:mb-20">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl text-[#1F2328] mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                letterSpacing: "-0.025em",
              }}
            >
              Loved by travellers who want it effortless
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((testimonial, index) => (
            <RevealOnScroll key={testimonial.name} delay={index * 150}>
              <div
                className="bg-white p-8 rounded-2xl border border-[#E6E8EF] shadow-sm hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 h-full flex flex-col"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={`${testimonial.name}-${i}`}
                      size={16}
                      fill="#02A551"
                      className="text-[#02A551]"
                    />
                  ))}
                </div>

                <p className="text-[#1F2328] leading-relaxed mb-6 italic flex-grow">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#E6E8EF]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-[#1F2328]">
                        {testimonial.name}
                      </h4>
                      <BadgeCheck size={16} className="text-[#02A551]" />
                    </div>
                    <p className="text-sm text-[#1F2328]/60">
                      {testimonial.city}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#E6E8EF]">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E7F7EF] text-[#02A551] text-xs font-medium rounded-full">
                    <BadgeCheck size={12} />
                    Verified trip
                  </span>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="py-20 sm:py-32 px-6 sm:px-8 lg:px-12 bg-[#EEF0FF]">
      <div className="max-w-[1400px] mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-16 sm:mb-20">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl text-[#1F2328] mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                letterSpacing: "-0.025em",
              }}
            >
              Plan your trip
            </h2>
            <p
              className="text-lg sm:text-xl text-[#1F2328]/60 max-w-2xl mx-auto"
              style={{ letterSpacing: "-0.01em" }}
            >
              Share your travel dreams with us and let our experts craft your perfect
              journey
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-2">
            <RevealOnScroll delay={200}>
              <div className="space-y-8">
                <div>
                  <h3
                    className="text-2xl font-semibold text-[#1F2328] mb-6"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Get in touch
                  </h3>
                  <p className="text-[#1F2328]/70 leading-relaxed">
                    Our team is ready to help you create the journey of a lifetime.
                    Reach out through any channel below.
                  </p>
                </div>

                <div className="space-y-6">
                  <a href="mailto:thenomadsco@gmail.com" className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-[#EEF0FF] rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-[#2D3191] group-hover:scale-110">
                      <Mail size={20} className="text-[#2D3191] group-hover:text-white transition-colors" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-sm text-[#1F2328]/60 font-medium mb-1">Email</div>
                      <div className="text-base text-[#1F2328] font-medium group-hover:text-[#2D3191] transition-colors">thenomadsco@gmail.com</div>
                    </div>
                  </a>

                  <a href="tel:+919924399335" className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-[#EEF0FF] rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-[#2D3191] group-hover:scale-110">
                      <Phone size={20} className="text-[#2D3191] group-hover:text-white transition-colors" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-sm text-[#1F2328]/60 font-medium mb-1">Phone / WhatsApp</div>
                      <div className="text-base text-[#1F2328] font-medium group-hover:text-[#2D3191] transition-colors">+91 9924399335</div>
                    </div>
                  </a>

                  <a
                    href="https://www.google.com/maps/search/?api=1&query=A%2F49%2C%20Nutan%20Maheshwar%20Society%2C%20Subhanpura%2C%20Gotri%2C%20Vadodara%2C%20Gujarat%2C%20India"
                    className="flex items-start gap-4 group"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="w-12 h-12 bg-[#EEF0FF] rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110">
                      <MapPin size={20} className="text-[#2D3191]" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-sm text-[#1F2328]/60 font-medium mb-1">Location</div>
                      <div className="text-base text-[#1F2328] font-medium">Vadodara, Gujarat, India</div>
                    </div>
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          <div className="lg:col-span-3">
            <RevealOnScroll delay={400}>
              <form
                className="bg-[#F7F6F1] p-8 sm:p-10 rounded-2xl border border-[#E6E8EF] shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                action="https://formsubmit.co/thenomadsco@gmail.com"
                method="post"
              >
                <input type="hidden" name="_subject" value="New Nomads Co. inquiry" />
                <input type="hidden" name="_captcha" value="false" />
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1F2328] mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      name="name"
                      className="w-full px-4 py-3 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent transition-shadow duration-300"
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1F2328] mb-2">
                        Email / WhatsApp *
                      </label>
                      <input
                        type="email"
                        required
                        name="email"
                        className="w-full px-4 py-3 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent transition-shadow duration-300"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1F2328] mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full px-4 py-3 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent transition-shadow duration-300"
                        placeholder="+91 XXX XXX XXXX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1F2328] mb-2">
                        Destination idea
                      </label>
                      <input
                        type="text"
                        name="destination"
                        className="w-full px-4 py-3 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent transition-shadow duration-300"
                        placeholder="e.g., Santorini"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1F2328] mb-2">
                        Travel month
                      </label>
                      <input
                        type="text"
                        name="travel_month"
                        className="w-full px-4 py-3 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent transition-shadow duration-300"
                        placeholder="e.g., June 2026"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1F2328] mb-2">Budget range</label>
                    <select
                      name="budget"
                      className="w-full px-4 py-3 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent transition-shadow duration-300"
                    >
                      <option value="">Select your budget</option>
                      <option value="under-2lakh">Under ₹2 Lakh</option>
                      <option value="2-5lakh">₹2-5 Lakh</option>
                      <option value="5-10lakh">₹5-10 Lakh</option>
                      <option value="10lakh-plus">₹10 Lakh+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1F2328] mb-2">Notes</label>
                    <textarea
                      rows={5}
                      name="notes"
                      className="w-full px-4 py-3 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent transition-shadow duration-300 resize-none"
                      placeholder="Tell us about your ideal trip..."
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full px-8 py-4 bg-[#2D3191] text-white text-base font-medium rounded-xl hover:bg-[#242875] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg active:scale-95 active:translate-y-0"
                    >
                      Send inquiry
                    </button>
                    <p className="text-sm text-[#1F2328]/60 text-center mt-4">
                      We reply within 24 hours
                    </p>
                  </div>
                </div>
              </form>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FAFAF8] text-[#1F2328] py-16 sm:py-20 px-6 sm:px-8 lg:px-12 border-t border-[#E6E8EF]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-16 pb-16 border-b border-[#E6E8EF]">
          <div>
            <h3
              className="text-2xl font-semibold mb-5 text-[#1F2328]"
              style={{
                fontFamily: "'Playfair Display', serif",
                letterSpacing: "-0.02em",
              }}
            >
              The Nomads Co.
            </h3>
            <p
              className="text-sm text-[#1F2328]/70 leading-relaxed mb-8"
              style={{ letterSpacing: "-0.01em" }}
            >
              Crafting extraordinary journeys for extraordinary people since 2015.
            </p>
            <div className="flex gap-3">
              {[
                {
                  icon: Instagram,
                  label: "Instagram",
                  href: "https://www.instagram.com/thenomadsco/",
                },
                {
                  icon: Facebook,
                  label: "Facebook",
                  href: "https://www.facebook.com/Thenomadsco/",
                },
                { icon: Mail, label: "Email", href: "mailto:thenomadsco@gmail.com" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="w-10 h-10 bg-[#EEF0FF] hover:bg-[#2D3191] rounded-xl flex items-center justify-center group transition-all duration-300 ease-out hover:-translate-y-0.5"
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                >
                  <Icon
                    size={18}
                    className="text-[#2D3191] group-hover:text-white transition-colors duration-300 ease-out"
                  />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#1F2328]">
              Destinations
            </h4>
            <ul className="space-y-3 text-sm">
              {["Europe", "Asia Pacific", "Middle East", "Americas", "Africa"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#1F2328]">
              Support
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/contactus" className="text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">
                  Contact Us
                </Link>
              </li>
              {["FAQs", "Travel Blog", "About Us", "Careers"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#1F2328]">
              Newsletter
            </h4>
            <p className="text-sm text-[#1F2328]/70 mb-4">
              Get travel inspiration and exclusive deals
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent text-sm transition-shadow duration-300"
              />
              <button className="px-4 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-xl hover:bg-[#242875] transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#1F2328]/60">
          <div>© {currentYear} The Nomads Co. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#2D3191] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#2D3191] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-[#2D3191] transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
