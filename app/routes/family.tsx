import { Link } from "react-router";
import { useEffect, useState } from "react";
import nomadsLogo from "./the nomads logo.jpeg";

const PAGE_CONFIG = {
  title: "Family Vacations",
  subtitle: "Memories for a Lifetime",
  heroImage: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1920&auto=format&fit=crop",
};

export default function FamilyPage() {
  return (
    <div className="min-h-screen bg-white antialiased">
      <Navigation />
      
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px] flex items-end pb-16 px-6 sm:px-12 overflow-hidden">
        <img src={PAGE_CONFIG.heroImage} alt="Family Vacation" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="relative z-10 max-w-[1400px] mx-auto w-full text-white">
          <span className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest rounded-full mb-6 inline-block">
            Experiences
          </span>
          <h1 className="text-5xl sm:text-7xl font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {PAGE_CONFIG.title}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">{PAGE_CONFIG.subtitle}</p>
        </div>
      </section>

      {/* Intro Text (Adapted from your image) */}
      <section className="py-20 px-6 sm:px-12 max-w-[1000px] mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#1F2328] mb-8">The Perfect Family Holiday</h2>
        <p className="text-lg text-[#1F2328]/70 leading-relaxed mb-8">
          The Nomads Co. specializes in tailor-made travel itineraries for travelers seeking authentic experiences in India & around the world. Whether you want to concentrate on culture or spend time wildlife-watching, sample a city's hustle and bustle or relax in a secluded beauty spot, we will help you discover the joy of a unique trip designed specifically for you.
        </p>
        <p className="text-lg text-[#1F2328]/70 leading-relaxed">
          Treat the whole family to an unforgettable holiday of a lifetime. From intimate island resorts to fun-filled adventure parks, we ensure your trip caters to all needs—grandparents, parents, and kids alike.
        </p>
      </section>

      {/* Key Features Grid */}
      <section className="py-16 bg-[#EEF0FF] px-6 sm:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold text-[#1F2328] mb-3">Kid-Friendly Stays</h3>
              <p className="text-[#1F2328]/70">We handpick resorts with kids' clubs, shallow pools, and family suites so everyone rests easy.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold text-[#1F2328] mb-3">Relaxed Pace</h3>
              <p className="text-[#1F2328]/70">Itineraries designed with downtime. No rushing from spot to spot—enjoy quality time together.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold text-[#1F2328] mb-3">Safety First</h3>
              <p className="text-[#1F2328]/70">Trusted drivers, verified hotels, and 24/7 support ensure your family is safe at all times.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Family Destinations */}
      <section className="py-20 px-6 sm:px-12 max-w-[1200px] mx-auto">
        <h2 className="text-3xl font-bold text-[#1F2328] mb-10 text-center">Top Family Picks</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Singapore", desc: "Zoo, Sentosa & Universal Studios", link: "/singapore" },
            { name: "Kerala", desc: "Houseboats & Gentle Nature", link: "/kerala" },
            { name: "Dubai", desc: "Theme Parks & Desert Fun", link: "/uae" },
            { name: "London", desc: "Harry Potter & History", link: "/london" },
          ].map((dest) => (
            <Link key={dest.name} to={dest.link} className="block group">
              <div className="bg-[#F7F6F1] p-6 rounded-2xl border border-[#E6E8EF] hover:border-[#2D3191] transition-all h-full">
                <h3 className="text-xl font-bold text-[#1F2328] group-hover:text-[#2D3191]">{dest.name}</h3>
                <p className="text-sm text-[#1F2328]/60 mt-2">{dest.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <EnquiryForm subject="Family Vacation Inquiry" />
      <Footer />
    </div>
  );
}

// --- REUSABLE COMPONENTS (For consistency) ---
function EnquiryForm({ subject }: { subject: string }) {
  return (
    <section id="enquire" className="py-20 px-6 sm:px-12 bg-[#FAFAF8]">
      <div className="max-w-[800px] mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#1F2328] mb-4">Start Planning</h2>
        <p className="text-[#1F2328]/60 mb-8">Tell us about your family and we'll craft the perfect trip.</p>
        <form action="https://formsubmit.co/thenomadsco@gmail.com" method="POST" className="space-y-4 text-left">
          <input type="hidden" name="_subject" value={subject} />
          <input type="hidden" name="_captcha" value="false" />
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="text" name="name" required placeholder="Parent's Name" className="w-full px-4 py-3 bg-white rounded-xl border border-[#E6E8EF]" />
            <input type="tel" name="phone" required placeholder="Phone Number" className="w-full px-4 py-3 bg-white rounded-xl border border-[#E6E8EF]" />
          </div>
          <button type="submit" className="w-full py-4 bg-[#2D3191] text-white font-bold rounded-xl hover:bg-[#242875] transition-all">Get Quote</button>
        </form>
      </div>
    </section>
  );
}

function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-[#E6E8EF]">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3"><img src={nomadsLogo} alt="Logo" className="h-10 w-auto" /><span className="font-semibold text-[#1F2328]">The Nomads Co.</span></Link>
        <Link to="/contactus" className="px-6 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-full">Contact</Link>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-white py-12 px-6 border-t border-[#E6E8EF] text-center">
      <p className="text-[#1F2328]/50">© {new Date().getFullYear()} The Nomads Co.</p>
    </footer>
  );
}
