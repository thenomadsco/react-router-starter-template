import { Link } from "react-router";
import nomadsLogo from "./the nomads logo.jpeg";

const PAGE_CONFIG = {
  title: "Honeymoon Specials",
  subtitle: "Begin Your Forever",
  heroImage: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1920&auto=format&fit=crop",
};

export default function HoneymoonPage() {
  return (
    <div className="min-h-screen bg-white antialiased">
      <Navigation />
      
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px] flex items-end pb-16 px-6 sm:px-12 overflow-hidden">
        <img src={PAGE_CONFIG.heroImage} alt="Honeymoon" className="absolute inset-0 w-full h-full object-cover" />
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
        <h2 className="text-3xl font-bold text-[#1F2328] mb-8">Your Romantic Getaway</h2>
        <p className="text-lg text-[#1F2328]/70 leading-relaxed mb-8">
          Looking for the perfect honeymoon? From intimate and romantic resorts to thrilling cities and adventure safaris, The Nomads Co. has a honeymoon trip to suit you.
        </p>
        <p className="text-lg text-[#1F2328]/70 leading-relaxed">
          Many of our hotels offer complimentary honeymoon offers, including <strong>room upgrades, candlelit dinners, and spa treatments</strong>. Our experts can tailor-make your perfect honeymoon from scratch.
        </p>
      </section>

      {/* Destinations List (From Image) */}
      <section className="py-20 bg-[#FDF2F8] px-6 sm:px-12">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-bold text-[#1F2328] mb-12 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>Top Honeymoon Destinations</h2>
          
          <div className="grid md:grid-cols-2 gap-16">
            {/* India */}
            <div>
              <h3 className="text-xl font-bold text-[#2D3191] mb-6 uppercase tracking-wider">In India</h3>
              <ul className="space-y-4 text-[#1F2328]/80 text-lg">
                <li className="border-b border-black/5 pb-2">Kashmir (Srinagar, Gulmarg, Pahalgam)</li>
                <li className="border-b border-black/5 pb-2">Kerala (Munnar, Thekkady, Kumarakom)</li>
                <li className="border-b border-black/5 pb-2">Andaman (Port Blair & Havelock)</li>
                <li className="border-b border-black/5 pb-2">Darjeeling & Sikkim</li>
                <li className="border-b border-black/5 pb-2">Himachal (Shimla & Manali)</li>
                <li className="border-b border-black/5 pb-2">Goa</li>
                <li>Ooty & Kodaikanal</li>
              </ul>
            </div>

            {/* International */}
            <div>
              <h3 className="text-xl font-bold text-[#2D3191] mb-6 uppercase tracking-wider">Worldwide</h3>
              <ul className="space-y-4 text-[#1F2328]/80 text-lg">
                <li className="border-b border-black/5 pb-2">Maldives</li>
                <li className="border-b border-black/5 pb-2">Thailand (Phuket & Krabi)</li>
                <li className="border-b border-black/5 pb-2">Switzerland</li>
                <li className="border-b border-black/5 pb-2">France (Paris & French Riviera)</li>
                <li className="border-b border-black/5 pb-2">Italy (Rome & Venice)</li>
                <li className="border-b border-black/5 pb-2">Mauritius & Sri Lanka</li>
                <li>New Zealand & Bhutan</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <EnquiryForm subject="Honeymoon Special Inquiry" />
      <Footer />
    </div>
  );
}

// Reuse similar simple components as Family page to keep file self-contained
function EnquiryForm({ subject }: { subject: string }) {
  return (
    <section id="enquire" className="py-20 px-6 sm:px-12 bg-[#FAFAF8]">
      <div className="max-w-[800px] mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#1F2328] mb-4">Plan Your Honeymoon</h2>
        <p className="text-[#1F2328]/60 mb-8">Let us make your first trip as a married couple magical.</p>
        <form action="https://formsubmit.co/thenomadsco@gmail.com" method="POST" className="space-y-4 text-left">
          <input type="hidden" name="_subject" value={subject} />
          <input type="hidden" name="_captcha" value="false" />
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="text" name="name" required placeholder="Name" className="w-full px-4 py-3 bg-white rounded-xl border border-[#E6E8EF]" />
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
