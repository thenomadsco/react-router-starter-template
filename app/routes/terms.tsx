import { Link } from "react-router";
import { useEffect, useState } from "react";
import nomadsLogo from "./the nomads logo.webp";
import { ArrowRight } from "./home";

function IconBase({ size = 24, className, strokeWidth = 2, fill = "none", children }: any) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
function X(props: any) { return (<IconBase {...props}><path d="M18 6 6 18" /><path d="M6 6l12 12" /></IconBase>); }
function Facebook(props: any) { return (<IconBase {...props}><path d="M14 8h-2c-1.1 0-2 .9-2 2v2H8v3h2v5h3v-5h2.2l.8-3H13v-1.6c0-.4.3-.7.7-.7H16V8z" /></IconBase>); }
function Instagram(props: any) { return (<IconBase {...props}><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></IconBase>); }

const customStyles = `
  html { scroll-behavior: smooth; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
  }
`;

export function meta() {
  return [
    { title: "Terms & Conditions | The Nomads Co." },
    { name: "description", content: "Read the terms and conditions for using The Nomads Co. travel services and website." },
    { name: "robots", content: "noindex" },
  ];
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white antialiased selection:bg-[#2D3191]/10 selection:text-[#2D3191] pb-24 sm:pb-0">
      <style>{customStyles}</style>
      <Navigation />

      {/* HEADER */}
      <section className="bg-[#FAFAF8] py-20 px-6 sm:px-12 border-b border-[#E6E8EF]">
        <div className="max-w-[1000px] mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold text-[#1F2328] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Terms & Conditions
          </h1>
          <p className="text-[#1F2328]/60 text-lg">
            Please read these terms carefully before using our services.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16 px-6 sm:px-12">
        <div className="max-w-[1000px] mx-auto prose prose-lg text-[#1F2328]/80 leading-relaxed">

          <p className="mb-6">
            Welcome to <strong>The Nomads Co.</strong> By accessing or using this website, you agree to comply with and be bound by the following Terms and Conditions. These terms apply to all bookings made via the website, API, or manual methods. If you do not agree with any part of these terms, please do not use our services.
          </p>

          <h3 className="text-2xl font-bold text-[#1F2328] mt-10 mb-4">1. General Disclaimer & Warranties</h3>
          <p className="mb-6">
            All information provided on this website is offered on an "as is" basis without any warranty of any kind, either express or implied. The Nomads Co. does not guarantee the accuracy, completeness, or reliability of any information, software, products, or services contained herein. We expressly disclaim any warranties of merchantability, fitness for a particular purpose, or non-infringement.
          </p>

          <h3 className="text-2xl font-bold text-[#1F2328] mt-10 mb-4">2. Limitation of Liability</h3>
          <p className="mb-6">
            The Nomads Co. shall not be held responsible for any injury, loss, claim, damage, or any special, exemplary, punitive, indirect, incidental, or consequential damages of any kind, whether based in contract, tort, strict liability, or otherwise, which arises out of or is in any way connected with:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Any use of this site or content found herein.</li>
            <li>Any failure or delay (including the use of or inability to use any component of this site for reservations or ticketing).</li>
            <li>The performance or non-performance by The Nomads Co. or any third-party provider.</li>
            <li><strong>Strikes or Unutilized Services:</strong> We are not liable for any claims arising from labor strikes, force majeure, or services that remain unutilized by the user.</li>
            <li><strong>Errors:</strong> We are not responsible for technical, editorial, typographical, or other errors or omissions within the information accessible through this website.</li>
          </ul>

          <h3 className="text-2xl font-bold text-[#1F2328] mt-10 mb-4">3. User Responsibilities</h3>
          <p className="mb-6">
            The Nomads Co. serves as a facilitator. We are responsible only for transactions processed directly through our agency. We are not responsible for screening, censoring, or controlling transactions to ensure they are legal or valid under the laws of the user's jurisdiction.
          </p>
          <p className="mb-6">
            You warrant that you will abide by all additional procedures and guidelines, as modified from time to time, in connection with the use of the services. You further agree to comply with all applicable laws and regulations regarding the use of the services.
          </p>

          <h3 className="text-2xl font-bold text-[#1F2328] mt-10 mb-4">4. Intellectual Property & Content</h3>
          <p className="mb-6">
            You acknowledge and agree not to upload, post, reproduce, or distribute any content on or through our services that is protected by copyright or other proprietary rights of a third party, without obtaining the permission of the owner of such right. The unauthorized submission or distribution of copyrighted content is illegal and may subject you to personal liability.
          </p>

          <h3 className="text-2xl font-bold text-[#1F2328] mt-10 mb-4">5. Indemnification</h3>
          <p className="mb-6">
            You agree to indemnify, defend, and hold harmless The Nomads Co., its affiliates, partners, and their respective lawful successors and assigns from and against any losses, liabilities, claims, damages, costs, and expenses (including reasonable legal fees) arising out of or resulting from your breach of this agreement or your non-performance of any obligation.
          </p>

          <h3 className="text-2xl font-bold text-[#1F2328] mt-10 mb-4">6. Relationship of Parties</h3>
          <p className="mb-6">
            Nothing in this agreement shall be deemed to constitute a partnership, joint venture, or agency relationship between you and The Nomads Co. Neither party has the authority to bind the other in any way.
          </p>

          <h3 className="text-2xl font-bold text-[#1F2328] mt-10 mb-4">7. Map Usage</h3>
          <p className="mb-6">
            Maps and tabular data presented on this website are stylized for user convenience and demonstrative purposes only. They are not a legal or real representation of any state or regional boundaries. The Nomads Co. assumes no legal responsibility for the positional accuracy or completeness of any maps contained on this website.
          </p>

          <h3 className="text-2xl font-bold text-[#1F2328] mt-10 mb-4">8. Modifications</h3>
          <p className="mb-6">
            The Nomads Co. reserves the right to change or update these Terms and Conditions at any time without prior notice. The current version will be displayed on the site, and your continued use of the site constitutes your acceptance of such changes. We encourage you to review this page periodically.
          </p>

          <h3 className="text-2xl font-bold text-[#1F2328] mt-10 mb-4">9. Governing Law</h3>
          <p className="mb-6">
            Any conflict or claim arising out of or in connection with this website shall be governed by the laws of India. The courts in <strong>Vadodara, Gujarat</strong> shall have exclusive jurisdiction over any disputes.
          </p>

          <p className="mt-8 pt-8 border-t border-[#E6E8EF] text-sm text-[#1F2328]/60">
            Thank you for choosing The Nomads Co. for your travel needs.
          </p>

        </div>
      </section>

      <Footer />
    </div>
  );
}

// --- SUBCOMPONENTS ---

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = isOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [isOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-[#E6E8EF]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <img src={nomadsLogo} alt="The Nomads Co." className="h-10 w-auto group-hover:-translate-y-0.5 transition-transform" />
            <span className="font-semibold text-[#1F2328] hidden sm:inline whitespace-nowrap">The Nomads Co.</span>
          </Link>

          <div className="hidden lg:flex items-center justify-center gap-8">
            <Link to="/"              className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">Home</Link>
            <Link to="/#destinations" className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">Destinations</Link>
            <Link to="/#reviews"      className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">Reviews</Link>
            <Link to="/journal"       className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">Journal</Link>
            <Link to="/#contact"      className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors">Contact</Link>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link to="/?openFunnel=true" className="hidden lg:block px-6 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-full hover:bg-[#242875] hover:-translate-y-0.5 transition-all">
              Plan My Trip
            </Link>
            <button className="lg:hidden p-2 text-gray-700" onClick={() => setIsOpen(true)} aria-label="Open menu">
              <div className="space-y-1.5">
                <span className="block w-6 h-0.5 bg-current" />
                <span className="block w-4 h-0.5 bg-current ml-auto" />
                <span className="block w-6 h-0.5 bg-current" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[80%] max-w-[320px] bg-white shadow-2xl flex flex-col">
            <div className="p-6 flex justify-end">
              <button onClick={() => setIsOpen(false)} aria-label="Close menu" className="p-2 -mr-2 text-gray-400 hover:text-gray-900"><X size={28} /></button>
            </div>
            <div className="flex-1 flex flex-col px-8 py-4 gap-8 overflow-y-auto">
              <Link to="/"              onClick={() => setIsOpen(false)} className="text-3xl font-bold text-[#1F2328] hover:text-[#2D3191] transition-colors">Home</Link>
              <Link to="/#destinations" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-[#1F2328] hover:text-[#2D3191] transition-colors">Destinations</Link>
              <Link to="/#reviews"      onClick={() => setIsOpen(false)} className="text-3xl font-bold text-[#1F2328] hover:text-[#2D3191] transition-colors">Reviews</Link>
              <Link to="/journal"       onClick={() => setIsOpen(false)} className="text-3xl font-bold text-[#1F2328] hover:text-[#2D3191] transition-colors">Journal</Link>
              <Link to="/#contact"      onClick={() => setIsOpen(false)} className="text-3xl font-bold text-[#1F2328] hover:text-[#2D3191] transition-colors">Contact</Link>
            </div>
            <div className="p-8 pb-12 border-t border-gray-100 bg-[#FAFAF8]">
              <Link to="/?openFunnel=true" onClick={() => setIsOpen(false)} className="w-full py-4 bg-[#2D3191] text-white text-lg font-bold rounded-2xl shadow-lg hover:bg-[#242875] transition-colors flex items-center justify-center gap-2">
                Plan My Trip <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-[#FAFAF8] py-16 px-6 sm:px-12 border-t border-[#E6E8EF]">
      <div className="max-w-[1400px] mx-auto text-center sm:text-left grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>The Nomads Co.</h3>
          <p className="text-sm text-[#1F2328]/70">Crafting extraordinary journeys since 2015.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <Link to="/#contact" className="text-sm text-[#1F2328]/70 hover:text-[#2D3191]">Contact Us</Link>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <Link to="/privacypolicy" className="text-sm text-[#1F2328]/70 hover:text-[#2D3191] block mb-2">Privacy Policy</Link>
          <Link to="/terms"         className="text-sm text-[#1F2328]/70 hover:text-[#2D3191] block">Terms of Service</Link>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Social</h4>
          <div className="flex gap-4 justify-center sm:justify-start text-[#2D3191]">
            <a href="https://www.instagram.com/thenomadsco/" aria-label="Instagram"><Instagram /></a>
            <a href="https://www.facebook.com/Thenomadsco/" aria-label="Facebook"><Facebook /></a>
          </div>
        </div>
        <div>
          <p className="text-sm text-[#1F2328]/50">© {new Date().getFullYear()} The Nomads Co.</p>
        </div>
      </div>
    </footer>
  );
}
