import type { Route } from "./+types/home";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Phone,
  Sparkles,
  Star,
  Twitter,
} from "lucide-react";

const logoImage =
  "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='80'%20height='80'%20viewBox='0%200%2080%2080'%3E%3Crect%20width='80'%20height='80'%20rx='20'%20fill='%232D3191'/%3E%3Cpath%20d='M20%2046V28h10l10%2024%2010-24h10v18c0%209-7%2016-16%2016H36c-9%200-16-7-16-16Z'%20fill='%23FFFFFF'/%3E%3C/svg%3E";

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
    quote:
      "Seamless planning from start to finish. Worth every rupee and more.",
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

export default function Home() {
  return (
    <div className="min-h-screen bg-white antialiased">
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-[#E6E8EF]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="The Nomads Co." className="h-10 w-auto" />
            <span
              className="text-lg font-semibold text-[#1F2328] tracking-tight"
              style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}
            >
              The Nomads Co.
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
            {["Destinations", "Experiences", "Testimonials", "Contact"].map(
              (label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase()}`}
                  className="text-sm font-medium text-[#1F2328]/80 hover:text-[#2D3191]"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {label}
                </a>
              )
            )}
          </div>

          <a
            href="#contact"
            className="hidden lg:block px-6 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-2xl hover:bg-[#242875]"
          >
            Plan My Trip
          </a>

          <button className="lg:hidden text-[#1F2328]">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const heroImage =
    "https://images.unsplash.com/photo-1701279678695-10108e560da8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwd2FybSUyMHN1bmxpZ2h0fGVufDF8fHx8MTc2OTg1ODU4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  const image1 =
    "https://images.unsplash.com/photo-1547064663-a07e03f25fca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHBvb2wlMjB2aWV3fGVufDF8fHx8MTc2OTg1ODU4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  const image2 =
    "https://images.unsplash.com/photo-1760344477133-9f62fc52be22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiZWF1dGlmdWwlMjB0cmF2ZWwlMjBkZXN0aW5hdGlvbiUyMGNpdHlzY2FwZXxlbnwxfHx8fDE3Njk4NTg1ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  return (
    <section className="relative bg-white pt-32 pb-24 sm:pt-40 sm:pb-32 px-6 sm:px-8 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-block mb-8">
              <span className="px-5 py-2 bg-[#E7F7EF] text-[#02A551] text-[0.6875rem] font-semibold tracking-[0.15em] uppercase rounded-full">
                Creative Travel
              </span>
            </div>

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

            <p
              className="text-lg sm:text-xl text-[#1F2328]/60 leading-relaxed mb-10 max-w-xl"
              style={{ letterSpacing: "-0.01em" }}
            >
              Personalized premium travel with seamless planning. We design extraordinary
              experiences tailored to your dreams, handling every detail from start to
              finish.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <a
                href="#contact"
                className="group px-10 py-4 bg-[#2D3191] text-white text-sm font-medium tracking-wide rounded-full hover:bg-[#242875] flex items-center justify-center gap-2 shadow-sm"
              >
                Get a custom itinerary
                <ArrowRight size={18} />
              </a>

              <a
                href="#destinations"
                className="px-10 py-4 bg-transparent border border-[#02A551] text-[#02A551] text-sm font-medium tracking-wide rounded-full hover:bg-[#E7F7EF]"
              >
                Explore destinations
              </a>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <img
                  src={heroImage}
                  alt="Beautiful travel destination"
                  className="w-full h-[300px] sm:h-[400px] object-cover rounded-2xl shadow-lg"
                />
              </div>

              <img
                src={image1}
                alt="Luxury hotel pool"
                className="w-full h-[200px] sm:h-[250px] object-cover rounded-2xl shadow-lg"
              />

              <img
                src={image2}
                alt="Beautiful cityscape"
                className="w-full h-[200px] sm:h-[250px] object-cover rounded-2xl shadow-lg"
              />
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3
              className="text-xl sm:text-2xl text-[#1F2328]"
              style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.02em" }}
            >
              Curated since 2015
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-8 lg:gap-12">
            {trustFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.label} className="flex items-center gap-2">
                  <div className="relative">
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
      </div>
    </section>
  );
}

function DiagonalDestinations() {
  return (
    <section id="destinations" className="py-20 sm:py-32 px-6 sm:px-8 lg:px-12 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl text-[#1F2328] mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "-0.025em" }}
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

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className="px-6 py-2.5 text-sm font-medium rounded-full border-2 bg-transparent border-[#E6E8EF] text-[#1F2328] hover:border-[#2D3191]"
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {destinations.map((destination) => (
            <div key={destination.name} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-[320px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3
                    className="text-2xl font-semibold text-white mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {destination.name}
                  </h3>
                  <p className="text-white/90 text-sm mb-3">
                    {destination.descriptor}
                  </p>
                  <div className="flex items-center text-[#2D3191] bg-white px-3 py-1.5 rounded-lg inline-flex gap-1 text-sm font-medium">
                    Explore
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </div>
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
        <div className="text-center mb-16 sm:mb-20">
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl text-[#1F2328] mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "-0.025em" }}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          {experiences.map((experience) => (
            <div key={experience.title} className="group">
              <div className="relative overflow-hidden rounded-2xl mb-6 shadow-md">
                <img
                  src={experience.image}
                  alt={experience.title}
                  className="w-full h-[300px] object-cover"
                />
              </div>

              <h3
                className="text-2xl font-semibold text-[#1F2328] mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {experience.title}
              </h3>
              <p className="text-[#1F2328]/70 leading-relaxed mb-6">
                {experience.description}
              </p>

              {experience.ctaType === "primary" ? (
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#2D3191] text-white text-sm font-medium rounded-2xl hover:bg-[#242875]">
                  Learn more
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-[#02A551] text-[#02A551] text-sm font-medium rounded-2xl hover:bg-[#E7F7EF]">
                  Learn more
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
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
        <div className="text-center mb-16 sm:mb-20">
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl text-[#1F2328] mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "-0.025em" }}
          >
            Loved by travellers who want it effortless
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white p-8 rounded-2xl border border-[#E6E8EF] shadow-sm hover:shadow-md"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={`${testimonial.name}-${i}`} size={16} fill="#02A551" className="text-[#02A551]" />
                ))}
              </div>

              <p className="text-[#1F2328] leading-relaxed mb-6 italic">
                &quot;{testimonial.quote}&quot;
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#E6E8EF]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-[#1F2328]">{testimonial.name}</h4>
                    <BadgeCheck size={16} className="text-[#02A551]" />
                  </div>
                  <p className="text-sm text-[#1F2328]/60">{testimonial.city}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#E6E8EF]">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E7F7EF] text-[#02A551] text-xs font-medium rounded-full">
                  <BadgeCheck size={12} />
                  Verified trip
                </span>
              </div>
            </div>
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
        <div className="text-center mb-16 sm:mb-20">
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl text-[#1F2328] mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "-0.025em" }}
          >
            Plan your trip
          </h2>
          <p
            className="text-lg sm:text-xl text-[#1F2328]/60 max-w-2xl mx-auto"
            style={{ letterSpacing: "-0.01em" }}
          >
            Share your travel dreams with us and let our experts craft your perfect journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-2">
            <div className="space-y-8">
              <div>
                <h3
                  className="text-2xl font-semibold text-[#1F2328] mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Get in touch
                </h3>
                <p className="text-[#1F2328]/70 leading-relaxed">
                  Our team is ready to help you create the journey of a lifetime. Reach out
                  through any channel below.
                </p>
              </div>

              <div className="space-y-6">
                <a href="mailto:hello@thenomadsco.travel" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-[#EEF0FF] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#2D3191]">
                    <Mail size={20} className="text-[#2D3191] group-hover:text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm text-[#1F2328]/60 font-medium mb-1">Email</div>
                    <div className="text-base text-[#1F2328] font-medium">hello@thenomadsco.travel</div>
                  </div>
                </a>

                <a href="tel:+915551234567" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-[#EEF0FF] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#2D3191]">
                    <Phone size={20} className="text-[#2D3191] group-hover:text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm text-[#1F2328]/60 font-medium mb-1">Phone / WhatsApp</div>
                    <div className="text-base text-[#1F2328] font-medium">+91 (555) 123-4567</div>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#EEF0FF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-[#2D3191]" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm text-[#1F2328]/60 font-medium mb-1">Location</div>
                    <div className="text-base text-[#1F2328] font-medium">Mumbai, India</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <form className="bg-[#F7F6F1] p-8 sm:p-10 rounded-2xl border border-[#E6E8EF]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#1F2328] mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent"
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
                      className="w-full px-4 py-3 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1F2328] mb-2">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent"
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
                      className="w-full px-4 py-3 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent"
                      placeholder="e.g., Santorini"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1F2328] mb-2">
                      Travel month
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent"
                      placeholder="e.g., June 2026"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2328] mb-2">Budget range</label>
                  <select className="w-full px-4 py-3 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent">
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
                    className="w-full px-4 py-3 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent resize-none"
                    placeholder="Tell us about your ideal trip..."
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-[#2D3191] text-white text-base font-medium rounded-xl hover:bg-[#242875]"
                  >
                    Send inquiry
                  </button>
                  <p className="text-sm text-[#1F2328]/60 text-center mt-4">We reply within 24 hours</p>
                </div>
              </div>
            </form>
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
              style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.02em" }}
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
              {[Instagram, Facebook, Twitter, Linkedin, Mail].map((Icon, index) => (
                <a
                  key={`${Icon.displayName ?? "social"}-${index}`}
                  href="#"
                  className="w-10 h-10 bg-[#EEF0FF] hover:bg-[#2D3191] rounded-xl flex items-center justify-center group"
                >
                  <Icon size={18} className="text-[#2D3191] group-hover:text-white" />
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
                  <a href="#" className="text-[#1F2328]/70 hover:text-[#2D3191]">
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
              {["Contact Us", "FAQs", "Travel Blog", "About Us", "Careers"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[#1F2328]/70 hover:text-[#2D3191]">
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
            <p className="text-sm text-[#1F2328]/70 mb-4">Get travel inspiration and exclusive deals</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] focus:border-transparent text-sm"
              />
              <button className="px-4 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-xl hover:bg-[#242875]">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#1F2328]/60">
          <div>© {currentYear} The Nomads Co. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#2D3191]">Privacy Policy</a>
            <a href="#" className="hover:text-[#2D3191]">Terms of Service</a>
            <a href="#" className="hover:text-[#2D3191]">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
