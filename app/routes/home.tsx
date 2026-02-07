import { Link } from "react-router";

import type { Route } from "./+types/home";

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
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

function ArrowRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </IconBase>
  );
}

function Plane(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </IconBase>
  );
}

function MapPin(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </IconBase>
  );
}

function Heart(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </IconBase>
  );
}

function Phone(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </IconBase>
  );
}

function Mail(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </IconBase>
  );
}

function Instagram(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </IconBase>
  );
}

function Check(props: IconProps) {
  return (
    <IconBase {...props}>
      <polyline points="20 6 9 17 4 12" />
    </IconBase>
  );
}

const destinationData = [
  {
    id: 1,
    name: "Santorini",
    descriptor: "Greece",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Bali",
    descriptor: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Paris",
    descriptor: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Maldives",
    descriptor: "Indian Ocean",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
  },
];

const experienceData = [
  {
    id: 1,
    title: "Island Hopping in the Aegean",
    description:
      "An exclusive 10-day journey through Santorini, Mykonos, and Crete with private yacht transfers and handpicked boutique accommodations.",
    cta: "Explore",
    ctaType: "primary",
  },
  {
    id: 2,
    title: "Alpine Luxury Escape",
    description:
      "Experience the Swiss Alps in ultimate comfort with private chalet stays, helicopter tours, and Michelin-starred dining.",
    cta: "Discover",
    ctaType: "primary",
  },
  {
    id: 3,
    title: "Safari & Serenity",
    description:
      "A bespoke African safari followed by relaxation on pristine beaches, blending adventure with tranquility.",
    cta: "Learn More",
    ctaType: "secondary",
  },
];

const testimonialData = [
  {
    id: 1,
    name: "Aisha Patel",
    city: "Mumbai",
    quote:
      "Kirti made our Maldives honeymoon unforgettable. Every detail was perfectly planned, and we felt truly cared for.",
  },
  {
    id: 2,
    name: "Rajiv & Priya Sharma",
    city: "Delhi",
    quote:
      "From flights to experiences, everything was seamless. The Nomads Co. turned our family vacation into a cherished memory.",
  },
  {
    id: 3,
    name: "Neha Gupta",
    city: "Bangalore",
    quote:
      "As a solo traveler, I felt supported every step of the way. Kirti's recommendations were spot-on and enriched my journey.",
  },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "The Nomads Co. — Curated Travel Experiences" },
    {
      name: "description",
      content:
        "Personalized premium travel planning by Kirti Shah. From romantic getaways to family adventures, we craft journeys with care and attention to detail.",
    },
  ];
}

export default function Home() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <nav className="border-b border-[#E6E8EF] bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Plane size={28} className="text-[#02A551]" strokeWidth={2} />
            <h1
              className="text-2xl sm:text-3xl text-[#1F2328]"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              The Nomads Co.
            </h1>
          </div>
          <ul className="flex gap-6 sm:gap-8 text-[#1F2328]/80 font-medium text-sm sm:text-base">
            <li>
              <a href="#destinations" className="hover:text-[#02A551] transition-colors">
                Destinations
              </a>
            </li>
            <li>
              <a href="#experiences" className="hover:text-[#02A551] transition-colors">
                Experiences
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-[#02A551] transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-[#02A551] transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <main>
        <section className="relative h-[70vh] sm:h-[80vh] bg-gradient-to-br from-[#1F2328] to-[#0D1117] flex items-center justify-center text-center px-6 overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative z-10 max-w-4xl">
            <h2
              className="text-5xl sm:text-6xl lg:text-7xl text-white mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: "-0.03em" }}
            >
              Journey Beyond the Ordinary
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
              Personalized premium travel with seamless planning. We design extraordinary experiences tailored to your
              dreams, handling every detail from start to finish.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 bg-[#02A551] hover:bg-[#028A43] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Plan Your Journey
              <ArrowRight size={20} strokeWidth={2.5} />
            </a>
          </div>
        </section>

        <section
          id="destinations"
          className="py-20 sm:py-28 px-6 sm:px-8 lg:px-12 bg-white"
        >
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 text-[#02A551] font-semibold text-sm uppercase tracking-[0.2em] mb-3">
                <MapPin size={18} strokeWidth={2.5} />
                Destinations
              </div>
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl text-[#1F2328] mb-4"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "-0.025em" }}
              >
                Handpicked places that inspire wonder
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinationData.map((destination) => (
                <div
                  key={destination.id}
                  className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300"
                >
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
                    <h3
                      className="text-3xl text-white mb-1"
                      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
                    >
                      {destination.name}
                    </h3>
                    <p className="text-white/90 text-base">{destination.descriptor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-20 sm:py-28 px-6 sm:px-8 lg:px-12 bg-[#F7F6F1]">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-14">
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl text-[#1F2328] mb-6"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "-0.025em" }}
              >
                About The Nomads Co.
              </h2>
              <p className="text-lg sm:text-xl text-[#1F2328]/70 max-w-3xl mx-auto">
                Ready for a holiday that feels effortless and totally yours?
                <br /><br />
                Meet Kirti Shah from The NomadsCo.—your personal travel consultant who designs every
                itinerary with care, comfort, and serious attention to detail. Whether it&apos;s a
                romantic escape, a friends&apos; trip, a family vacation, or a solo adventure, Kirti
                tailors everything to your vibe—stays on top of the planning, and supports you
                throughout the journey.
                <br /><br />
                Book a one-on-one with Kirti and let The NomadsCo. handle the details—flights, stays,
                experiences, and the little things that make a trip feel premium—so you can just pack,
                show up, and enjoy.
                <br /><br />
                Your next destination deserves to be unforgettable. Connect now.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
              <div className="bg-white rounded-2xl border border-[#E6E8EF] p-8 shadow-sm">
                <h3
                  className="text-2xl font-semibold text-[#1F2328] mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Meet the Founder
                </h3>
                <p className="text-[#1F2328]/70 leading-relaxed mb-4">
                  Mrs. Kirti Shah brings a warm, detail-first approach to every itinerary. Known for her
                  calm guidance and intuitive understanding of traveler needs, she curates journeys that
                  feel both luxurious and deeply personal.
                </p>
                <p className="text-[#1F2328]/70 leading-relaxed">
                  From family escapes to once-in-a-lifetime celebrations, Kirti ensures every step feels
                  seamless — so clients can focus on the joy of the journey.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#E6E8EF] p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
                <img
                  src="/kirti-shah-profile.jpg"
                  alt="Portrait of Mrs. Kirti Shah"
                  className="w-40 h-40 rounded-2xl object-cover"
                />
                <div>
                  <div className="text-sm uppercase tracking-[0.2em] text-[#02A551] font-semibold mb-2">
                    Founder
                  </div>
                  <h4 className="text-2xl font-semibold text-[#1F2328] mb-2">Mrs. Kirti Shah</h4>
                  <p className="text-[#1F2328]/70 leading-relaxed">
                    Passionate about handcrafted travel and authentic experiences, Kirti leads The
                    Nomads Co. with empathy, precision, and a love for exploring the world.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="experiences" className="py-20 sm:py-28 px-6 sm:px-8 lg:px-12 bg-white">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 text-[#02A551] font-semibold text-sm uppercase tracking-[0.2em] mb-3">
                <Heart size={18} strokeWidth={2.5} />
                Experiences
              </div>
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl text-[#1F2328] mb-4"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "-0.025em" }}
              >
                Thoughtfully crafted journeys for discerning travelers
              </h2>
            </div>

            <div className="space-y-8">
              {experienceData.map((experience) => (
                <div
                  key={experience.id}
                  className="bg-[#F7F6F1] rounded-2xl p-8 sm:p-10 border border-[#E6E8EF] shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="flex-1">
                      <h3
                        className="text-3xl text-[#1F2328] mb-3"
                        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
                      >
                        {experience.title}
                      </h3>
                      <p className="text-[#1F2328]/70 text-lg leading-relaxed">{experience.description}</p>
                    </div>
                    {experience.ctaType === "primary" ? (
                      <a
                        href="#contact"
                        className="inline-flex items-center gap-2 bg-[#02A551] hover:bg-[#028A43] text-white px-6 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                      >
                        {experience.cta}
                        <ArrowRight size={18} strokeWidth={2.5} />
                      </a>
                    ) : (
                      <a
                        href="#contact"
                        className="inline-flex items-center gap-2 border-2 border-[#1F2328] text-[#1F2328] hover:bg-[#1F2328] hover:text-white px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap"
                      >
                        {experience.cta}
                        <ArrowRight size={18} strokeWidth={2.5} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28 px-6 sm:px-8 lg:px-12 bg-[#F7F6F1]">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-14">
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl text-[#1F2328] mb-4"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "-0.025em" }}
              >
                Voices of Delight
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonialData.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-[#E6E8EF] hover:shadow-md transition-shadow"
                >
                  <div className="mb-6">
                    <svg className="w-10 h-10 text-[#02A551] opacity-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="text-[#1F2328] text-lg leading-relaxed mb-6 italic">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#02A551] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-[#1F2328]">{testimonial.name}</div>
                      <div className="text-sm text-[#1F2328]/60">{testimonial.city}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 sm:py-28 px-6 sm:px-8 lg:px-12 bg-white">
          <div className="max-w-[1000px] mx-auto text-center">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl text-[#1F2328] mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "-0.025em" }}
            >
              Share your travel dreams with us and let our experts craft your perfect journey
            </h2>
            <p className="text-lg sm:text-xl text-[#1F2328]/70 mb-12 max-w-2xl mx-auto">
              Our team is ready to help you create the journey of a lifetime. Reach out through any channel below.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <a
                href="tel:+919876543210"
                className="flex flex-col items-center gap-4 p-8 bg-[#F7F6F1] rounded-2xl border border-[#E6E8EF] hover:shadow-lg transition-all group"
              >
                <div className="w-14 h-14 bg-[#02A551] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone size={24} className="text-white" strokeWidth={2} />
                </div>
                <div>
                  <div className="text-sm text-[#1F2328]/60 mb-1">Call Us</div>
                  <div className="text-[#1F2328] font-semibold">+91 98765 43210</div>
                </div>
              </a>

              <a
                href="mailto:contact@thenomadsco.com"
                className="flex flex-col items-center gap-4 p-8 bg-[#F7F6F1] rounded-2xl border border-[#E6E8EF] hover:shadow-lg transition-all group"
              >
                <div className="w-14 h-14 bg-[#02A551] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail size={24} className="text-white" strokeWidth={2} />
                </div>
                <div>
                  <div className="text-sm text-[#1F2328]/60 mb-1">Email</div>
                  <div className="text-[#1F2328] font-semibold">contact@thenomadsco.com</div>
                </div>
              </a>

              <a
                href="https://instagram.com/thenomadsco"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-4 p-8 bg-[#F7F6F1] rounded-2xl border border-[#E6E8EF] hover:shadow-lg transition-all group"
              >
                <div className="w-14 h-14 bg-[#02A551] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Instagram size={24} className="text-white" strokeWidth={2} />
                </div>
                <div>
                  <div className="text-sm text-[#1F2328]/60 mb-1">Follow Us</div>
                  <div className="text-[#1F2328] font-semibold">@thenomadsco</div>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#1F2328] text-white py-10 px-6 sm:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Plane size={24} className="text-[#02A551]" strokeWidth={2} />
            <span
              className="text-xl"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
            >
              The Nomads Co.
            </span>
          </div>
          <div className="text-white/70 text-sm">
            © 2025 The Nomads Co. All rights reserved. Crafted with care by Mrs. Kirti Shah.
          </div>
        </div>
      </footer>
    </div>
  );
}
