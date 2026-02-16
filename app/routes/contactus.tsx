import { Link } from "react-router";
import { useEffect, useState } from "react";
import nomadsLogo from "./the nomads logo.jpeg";

// --- ICONS ---
const iconDefaults = { size: 24, strokeWidth: 2 };
function IconBase({ size = iconDefaults.size, className, strokeWidth = iconDefaults.strokeWidth, fill = "none", children }: any) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
function Menu(props: any) { return (<IconBase {...props}><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></IconBase>); }
function X(props: any) { return (<IconBase {...props}><path d="M18 6 6 18" /><path d="M6 6l12 12" /></IconBase>); }
function Facebook(props: any) { return (<IconBase {...props}><path d="M14 8h-2c-1.1 0-2 .9-2 2v2H8v3h2v5h3v-5h2.2l.8-3H13v-1.6c0-.4.3-.7.7-.7H16V8z" /></IconBase>); }
function Instagram(props: any) { return (<IconBase {...props}><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></IconBase>); }
function Mail(props: any) { return (<IconBase {...props}><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></IconBase>); }
function Phone(props: any) { return (<IconBase {...props}><path d="M6.5 4.5h2l1.2 3-2 1.2c.9 2 2.5 3.6 4.5 4.5l1.2-2 3 1.2v2c0 .9-.7 1.6-1.6 1.6-6.3-.5-11.4-5.6-11.8-11.8 0-.9.7-1.6 1.5-1.6z" /></IconBase>); }
function MapPin(props: any) { return (<IconBase {...props}><path d="M12 21s6-6.2 6-11a6 6 0 0 0-12 0c0 4.8 6 11 6 11z" /><circle cx="12" cy="10" r="2.5" /></IconBase>); }

const customStyles = `
  html { scroll-behavior: smooth; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
  }
`;

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-white antialiased selection:bg-[#2D3191]/10 selection:text-[#2D3191] pb-24 sm:pb-0">
      <style>{customStyles}</style>
      <Navigation />

      {/* HEADER */}
      <section className="bg-[#FAFAF8] py-20 px-6 sm:px-12 border-b border-[#E6E8EF]">
        <div className="max-w-[1000px] mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold text-[#1F2328] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Get in Touch
          </h1>
          <p className="text-[#1F2328]/60 text-lg max-w-2xl mx-auto">
            Ready to plan your next adventure? We're here to help you craft the perfect itinerary.
          </p>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="py-20 px-6 sm:px-12">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Details */}
          <div className="space-y-10">
            <div>
              <h3 className="text-2xl font-bold text-[#1F2328] mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#EEF0FF] rounded-xl flex items-center justify-center flex-shrink-0 text-[#2D3191]">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1F2328]">Phone / WhatsApp</h4>
                    <p className="text-[#1F2328]/70 mt-1">+91 9924399335</p>
                    <p className="text-xs text-[#1F2328]/50 mt-1">Mon-Sat, 10am - 7pm IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#E7F7EF] rounded-xl flex items-center justify-center flex-shrink-0 text-[#02A551]">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1F2328]">Email</h4>
                    <p className="text-[#1F2328]/70 mt-1">thenomadsco@gmail.com</p>
                    <p className="text-xs text-[#1F2328]/50 mt-1">We usually reply within 24 hours.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FFF4E5] rounded-xl flex items-center justify-center flex-shrink-0 text-[#B45309]">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1F2328]">Office Location</h4>
                    <p className="text-[#1F2328]/70 mt-1">
                      Vadodara, Gujarat, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-64 bg-[#F7F6F1] rounded-2xl border border-[#E6E8EF] flex items-center justify-center text-[#1F2328]/40">
              <span className="flex items-center gap-2"><MapPin size={20} /> View on Google Maps</span>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-[#E6E8EF] shadow-xl">
            <h3 className="text-2xl font-bold text-[#1F2328] mb-6">Send us a Message</h3>
            <form action="https://formsubmit.co/thenomadsco@gmail.com" method="POST" className="space-y-4">
              <input type="hidden" name="_subject" value="Website Contact Form" />
              <input type="hidden" name="_captcha" value="false" />

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold ml-1 text-[#1F2328]">Full Name</label>
                  <input type="text" name="name" required className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:ring-1 focus:ring-[#2D3191] outline-none" placeholder="Rahul Sharma" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold ml-1 text-[#1F2328]">Phone Number</label>
                  <input type="tel" name="phone" required className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:ring-1 focus:ring-[#2D3191] outline-none" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold ml-1 text-[#1F2328]">Email Address</label>
                <input type="email" name="email" required className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:ring-1 focus:ring-[#2D3191] outline-none" placeholder="rahul@example.com" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold ml-1 text-[#1F2328]">Message</label>
                <textarea name="message" rows={4} className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:ring-1 focus:ring-[#2D3191] outline-none resize-none" placeholder="Tell us about your travel plans..." />
              </div>

              <button type="submit" className="w-full py-4 bg-[#2D3191] text-white font-bold rounded-xl hover:bg-[#242875] transition-all mt-2 shadow-lg hover:-translate-y-0.5">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}

// --- NAVIGATION & FOOTER (Synced with Home) ---
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = isOpen ? "hidden" : ""; }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-[#E6E8EF]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={nomadsLogo} alt="The Nomads Co." className="h-10 w-auto group-hover:-translate-y-0.5 transition-transform" />
            <span className="font-semibold text-[#1F2328] hidden sm:inline">The Nomads Co.</span>
          </Link>

          <div className="hidden lg:flex items-center justify-center gap-10">
             <Link to="/" className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">Home</Link>
             <Link to="/contactus" className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">Contact</Link>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link to="/contactus" className="hidden lg:block px-6 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-full hover:bg-[#242875] hover:-translate-y-0.5 transition-all">
              Plan My Trip
            </Link>
            <button className="lg:hidden p-2" onClick={() => setIsOpen(true)}><Menu size={24} /></button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={closeMenu} />
          <div className="absolute right-0 top-0 h-full w-[80%] bg-white shadow-2xl p-6">
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={closeMenu}><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <Link to="/" onClick={closeMenu} className="text-lg font-medium text-[#1F2328]">Home</Link>
              <Link to="/contactus" onClick={closeMenu} className="text-lg font-medium text-[#1F2328]">Contact</Link>
              <Link to="/contactus" className="mt-4 px-6 py-3 bg-[#2D3191] text-white text-center rounded-xl font-medium">Plan My Trip</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[#FAFAF8] text-[#1F2328] py-16 sm:py-20 px-6 sm:px-8 lg:px-12 border-t border-[#E6E8EF]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16 mb-16 pb-16 border-b border-[#E6E8EF]">
          <div>
            <h3 className="text-2xl font-semibold mb-5 text-[#1F2328]" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.02em" }}>The Nomads Co.</h3>
            <p className="text-sm text-[#1F2328]/70 leading-relaxed mb-8">Crafting extraordinary journeys for extraordinary people since 2015.</p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/thenomadsco/" className="w-10 h-10 bg-[#EEF0FF] hover:bg-[#2D3191] rounded-xl flex items-center justify-center group transition-all hover:-translate-y-0.5"><Instagram size={18} className="text-[#2D3191] group-hover:text-white transition-colors" /></a>
              <a href="https://www.facebook.com/Thenomadsco/" className="w-10 h-10 bg-[#EEF0FF] hover:bg-[#2D3191] rounded-xl flex items-center justify-center group transition-all hover:-translate-y-0.5"><Facebook size={18} className="text-[#2D3191] group-hover:text-white transition-colors" /></a>
              <a href="mailto:thenomadsco@gmail.com" className="w-10 h-10 bg-[#EEF0FF] hover:bg-[#2D3191] rounded-xl flex items-center justify-center group transition-all hover:-translate-y-0.5"><Mail size={18} className="text-[#2D3191] group-hover:text-white transition-colors" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#1F2328]">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/contactus" className="text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#1F2328]">Newsletter</h4>
            <p className="text-sm text-[#1F2328]/70 mb-4">Get travel inspiration and exclusive deals</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email" className="flex-1 px-4 py-2.5 bg-white border border-[#E6E8EF] text-[#1F2328] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3191] text-sm" />
              <button className="px-4 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-xl hover:bg-[#242875] transition-colors">Join</button>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#1F2328]/60">
          <div>© {currentYear} The Nomads Co. All rights reserved.</div>
          <div className="flex gap-6">
            <Link to="/privacypolicy" className="hover:text-[#2D3191] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#2D3191] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
