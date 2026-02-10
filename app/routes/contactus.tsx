import { Link } from "react-router";
import kirtiProfile from "./kirti-shah-profile.jpeg";
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

function Menu(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
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

function Phone(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6.5 4.5h2l1.2 3-2 1.2c.9 2 2.5 3.6 4.5 4.5l1.2-2 3 1.2v2c0 .9-.7 1.6-1.6 1.6-6.3-.5-11.4-5.6-11.8-11.8 0-.9.7-1.6 1.5-1.6z" />
    </IconBase>
  );
}

function Send(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </IconBase>
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact Us | The Nomads Co." },
    {
      name: "description",
      content: "Get in touch with The Nomads Co. in Vadodara to plan your perfect journey.",
    },
  ];
}

// --- Custom Animations ---
const customStyles = `
  @keyframes fade-in-up {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
`;

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] antialiased selection:bg-[#2D3191]/10 selection:text-[#2D3191]">
      <style>{customStyles}</style>
      <Navigation />
      
      <main className="pt-20">
        <Header />
        <AboutSection />
        <FormSection />
      </main>

      <Footer />
    </div>
  );
}

function Header() {
  return (
    <section className="px-6 sm:px-8 lg:px-12 py-20 sm:py-28 max-w-[1400px] mx-auto text-center">
      <h1 
        className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-[#1F2328] mb-6 tracking-tight animate-fade-in opacity-0"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Let's plan your <br className="hidden sm:block" />
        <span className="text-[#2D3191]">next escape.</span>
      </h1>
      <p className="text-xl text-[#1F2328]/60 max-w-2xl mx-auto leading-relaxed animate-fade-in delay-100 opacity-0">
        Whether you have a destination in mind or need inspiration, 
        our team in Vadodara is ready to craft your perfect itinerary.
      </p>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="px-6 sm:px-8 lg:px-12 py-12 sm:py-20 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-32 animate-fade-in delay-200 opacity-0">
        {/* Founder Block */}
        <div className="relative group order-2 md:order-1">
          <div className="absolute inset-0 bg-[#EEF0FF] rounded-[2.5rem] rotate-3 transition-transform duration-500 group-hover:rotate-6" />
          <img 
            src={kirtiProfile} 
            alt="Kirti Shah" 
            className="relative w-full aspect-[4/5] object-cover rounded-[2.5rem] shadow-lg transition-transform duration-500 group-hover:-translate-y-2"
          />
        </div>
        <div className="order-1 md:order-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E7F7EF] text-[#02A551] text-xs font-bold uppercase tracking-widest mb-6">
            The Founder
          </div>
          <h2 className="text-4xl font-semibold text-[#1F2328] mb-6 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Meet Kirti Shah
          </h2>
          <p className="text-lg text-[#1F2328]/70 leading-relaxed mb-6">
            Since founding The Nomads Co. in 2015, Kirti has been the driving force behind hundreds of unforgettable journeys. Based in Vadodara, she brings a personal touch to travel planning that algorithms simply cannot match.
          </p>
          <p className="text-lg text-[#1F2328]/70 leading-relaxed">
            With an eye for detail and a heart for hospitality, Kirti ensures that every trip is not just a vacation, but a curated experience tailored to your unique story.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center animate-fade-in delay-300 opacity-0">
        {/* Company Block */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EEF0FF] text-[#2D3191] text-xs font-bold uppercase tracking-widest mb-6">
            The Company
          </div>
          <h2 className="text-4xl font-semibold text-[#1F2328] mb-6 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            The Nomads Co.
          </h2>
          <p className="text-lg text-[#1F2328]/70 leading-relaxed mb-6">
            We are more than just a travel agency; we are your partners in discovery. Specializing in premium international and domestic packages, we handle the complexities of travel so you can focus on the memories.
          </p>
          <ul className="space-y-4 text-[#1F2328]/80 font-medium">
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D3191]" />
              End-to-end itinerary planning
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D3191]" />
              Luxury & 5-Star hotel partnerships
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D3191]" />
              24/7 support during your trip
            </li>
          </ul>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-[#F7F6F1] rounded-[2.5rem] -rotate-3 transition-transform duration-500 group-hover:-rotate-6" />
          <div className="relative bg-white p-12 rounded-[2.5rem] shadow-lg flex items-center justify-center border border-[#E6E8EF] aspect-square transition-transform duration-500 group-hover:-translate-y-2">
            <img 
              src={nomadsLogo} 
              alt="The Nomads Co. Logo" 
              className="w-48 h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FormSection() {
  return (
    <section className="px-6 sm:px-8 lg:px-12 py-20 bg-white border-t border-[#E6E8EF]">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Contact Info */}
          <div className="lg:col-span-4 space-y-10 animate-fade-in delay-200 opacity-0">
            <div>
              <h3 className="text-2xl font-semibold text-[#1F2328] mb-2">Get in touch</h3>
              <p className="text-[#1F2328]/60">We'd love to hear from you. Our team is always here to chat.</p>
            </div>

            <div className="space-y-8">
              <a href="mailto:thenomadsco@gmail.com" className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-[#EEF0FF] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail size={20} className="text-[#2D3191]" />
                </div>
                <div>
                  <div className="text-sm text-[#1F2328]/50 font-medium mb-1">Email</div>
                  <div className="text-base text-[#1F2328] font-medium group-hover:text-[#2D3191] transition-colors">thenomadsco@gmail.com</div>
                </div>
              </a>

              <a href="tel:+919924399335" className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-[#EEF0FF] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Phone size={20} className="text-[#2D3191]" />
                </div>
                <div>
                  <div className="text-sm text-[#1F2328]/50 font-medium mb-1">Phone / WhatsApp</div>
                  <div className="text-base text-[#1F2328] font-medium group-hover:text-[#2D3191] transition-colors">+91 9924399335</div>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#EEF0FF] rounded-2xl flex items-center justify-center">
                  <MapPin size={20} className="text-[#2D3191]" />
                </div>
                <div>
                  <div className="text-sm text-[#1F2328]/50 font-medium mb-1">Office</div>
                  <address className="text-base text-[#1F2328] font-medium not-italic leading-relaxed">
                    A 49, Nutan Maheshwar Society,<br />
                    Subhanpura, Vadodara,<br />
                    Gujarat 390021
                  </address>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-8 animate-fade-in delay-300 opacity-0">
            <form 
              action="https://formsubmit.co/thenomadsco@gmail.com" 
              method="POST"
              className="bg-[#FAFAF8] p-8 sm:p-12 rounded-[2.5rem] border border-[#E6E8EF] shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <input type="hidden" name="_subject" value="New Website Inquiry" />
              <input type="hidden" name="_captcha" value="false" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#1F2328] ml-1">Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="Jane Doe"
                    className="w-full px-6 py-4 bg-white border border-[#E6E8EF] rounded-2xl text-[#1F2328] placeholder:text-[#1F2328]/30 focus:outline-none focus:ring-2 focus:ring-[#2D3191]/20 focus:border-[#2D3191] transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#1F2328] ml-1">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder="jane@example.com"
                    className="w-full px-6 py-4 bg-white border border-[#E6E8EF] rounded-2xl text-[#1F2328] placeholder:text-[#1F2328]/30 focus:outline-none focus:ring-2 focus:ring-[#2D3191]/20 focus:border-[#2D3191] transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-sm font-semibold text-[#1F2328] ml-1">Message</label>
                <textarea 
                  name="message" 
                  rows={4}
                  placeholder="Tell us about your dream trip..."
                  className="w-full px-6 py-4 bg-white border border-[#E6E8EF] rounded-2xl text-[#1F2328] placeholder:text-[#1F2328]/30 focus:outline-none focus:ring-2 focus:ring-[#2D3191]/20 focus:border-[#2D3191] transition-all duration-300 resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="hidden sm:block text-sm text-[#1F2328]/50">
                  We typically reply within 24 hours.
                </p>
                <button 
                  type="submit"
                  className="w-full sm:w-auto px-10 py-4 bg-[#2D3191] text-white font-medium rounded-2xl hover:bg-[#242875] hover:-translate-y-1 hover:shadow-lg active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Send Message
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}

function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E6E8EF]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={nomadsLogo}
              alt="The Nomads Co."
              className="h-10 w-auto transition-transform duration-300 group-hover:-translate-y-0.5"
            />
            <span
              className="text-lg font-semibold text-[#1F2328] tracking-tight"
              style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}
            >
              The Nomads Co.
            </span>
          </Link>

          <div className="hidden lg:flex items-center justify-center gap-10">
            {[
              { label: "Destinations", to: "/#destinations" },
              { label: "Experiences", to: "/#experiences" },
              { label: "Testimonials", to: "/#testimonials" },
              { label: "Contact", to: "/contactus" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link
              to="/contactus"
              className="hidden lg:block px-6 py-2.5 bg-[#1F2328] text-white text-sm font-medium rounded-full hover:bg-[#000000] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Plan My Trip
            </Link>
            <button className="lg:hidden text-[#1F2328]">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[#FAFAF8] text-[#1F2328] py-16 sm:py-20 px-6 sm:px-8 lg:px-12 border-t border-[#E6E8EF]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-16 pb-16 border-b border-[#E6E8EF]">
          <div>
            <h3 className="text-2xl font-semibold mb-5 text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif" }}>
              The Nomads Co.
            </h3>
            <p className="text-sm text-[#1F2328]/70 leading-relaxed mb-8">
              Crafting extraordinary journeys for extraordinary people since 2015.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/thenomadsco/" },
                { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/Thenomadsco/" },
                { icon: Mail, label: "Email", href: "mailto:thenomadsco@gmail.com" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="w-10 h-10 bg-[#EEF0FF] hover:bg-[#2D3191] rounded-xl flex items-center justify-center group transition-all duration-300 hover:-translate-y-0.5"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon size={18} className="text-[#2D3191] group-hover:text-white transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#1F2328]">Destinations</h4>
            <ul className="space-y-3 text-sm">
              {["Europe", "Asia Pacific", "Middle East", "Americas", "Africa"].map((link) => (
                <li key={link}><a href="#" className="text-[#1F2328]/70 hover:text-[#2D3191]">{link}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#1F2328]">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/contactus" className="text-[#1F2328]/70 hover:text-[#2D3191]">Contact Us</Link></li>
              {["FAQs", "Travel Blog", "About Us", "Careers"].map((link) => (
                <li key={link}><a href="#" className="text-[#1F2328]/70 hover:text-[#2D3191]">{link}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#1F2328]">Newsletter</h4>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email" className="flex-1 px-4 py-2.5 bg-white border border-[#E6E8EF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D3191]" />
              <button className="px-4 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-xl hover:bg-[#242875]">Join</button>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#1F2328]/60">
          <div>© {currentYear} The Nomads Co. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#2D3191]">Privacy</a>
            <a href="#" className="hover:text-[#2D3191]">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
