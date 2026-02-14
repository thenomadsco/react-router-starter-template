import { Link } from "react-router";
import { useEffect, useState } from "react";
import nomadsLogo from "./the nomads logo.jpeg";

/**
 * Privacy Policy Page
 * Content adapted from user request, styled for The Nomads Co.
 */

// --- ICONS (Reuse for Navigation/Footer) ---
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

const customStyles = `
  html { scroll-behavior: smooth; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
  }
`;

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white antialiased selection:bg-[#2D3191]/10 selection:text-[#2D3191] pb-24 sm:pb-0">
      <style>{customStyles}</style>
      <Navigation />

      {/* HEADER */}
      <section className="bg-[#FAFAF8] py-20 px-6 sm:px-12 border-b border-[#E6E8EF]">
        <div className="max-w-[1000px] mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold text-[#1F2328] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Privacy Policy
          </h1>
          <p className="text-[#1F2328]/60 text-lg">
            We value your trust and respect your privacy.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16 px-6 sm:px-12">
        <div className="max-w-[1000px] mx-auto prose prose-lg text-[#1F2328]/80 leading-relaxed">
          
          <p className="mb-6">
            <strong>The Nomads Co.</strong> respects your privacy and recognizes the need to protect the personally identifiable information (any information by which you can be identified, such as name, address, E-mail, telephone number, and any other personal information) you share with us. We would like to assure you that we follow appropriate standards when it comes to protecting your privacy on our website.
          </p>

          <h3 className="text-2xl font-bold text-[#1F2328] mt-10 mb-4">Visiting Our Website</h3>
          <p className="mb-6">
            In general, you can visit <strong>www.thenomadsco.com</strong> without telling us who you are or revealing any personal information about yourself.
          </p>

          <h3 className="text-2xl font-bold text-[#1F2328] mt-10 mb-4">Collection of Information</h3>
          <p className="mb-6">
            There are times when we may collect personal information from you such as name, physical address, or telephone number. It is our intent to inform you before we do that and to tell you what we intend to do with the information. Generally, you will have the option not to provide the information, and in the future, you will be able to ‘opt out’ of certain uses of the information. If you choose not to provide the information we request, you can still visit our website, but you may be unable to access certain options, offers, and services.
          </p>

          <h3 className="text-2xl font-bold text-[#1F2328] mt-10 mb-4">Transaction Processing</h3>
          <p className="mb-6">
            We may also ask you for other personal information, such as your frequent traveler numbers. We require this information to process, fulfill, and confirm your reservations and transactions and keep you informed of each transaction's status. If you are making a reservation for one or more travelers other than yourself, you must confirm and represent that each of these other travelers has agreed, in advance, that you may disclose their personal information to us.
          </p>

          <h3 className="text-2xl font-bold text-[#1F2328] mt-10 mb-4">Member Profile & Preferences</h3>
          <p className="mb-6">
            As a site member, you can choose to complete your online profile by providing us with travel preferences, frequent-traveler or affinity numbers, credit card billing information, paper ticket delivery address, and other personal information. This information is primarily used to assist you in making reservations quickly without having to type in the same information repeatedly. For example, you can store your airline frequent-flyer numbers so that when you make a reservation on that airline, we may automatically pre-fill the input box for you.
          </p>

          <h3 className="text-2xl font-bold text-[#1F2328] mt-10 mb-4">Surveys</h3>
          <p className="mb-6">
            The Nomads Co. values opinions and comments from members, so we frequently conduct online surveys. Participation in these surveys is entirely optional. Typically, the information is aggregated and used to make improvements to the site and its services and to develop appealing content, features, and promotions for other site members. Survey participants are anonymous unless otherwise stated in the survey.
          </p>

          <h3 className="text-2xl font-bold text-[#1F2328] mt-10 mb-4">Sharing of Information</h3>
          <p className="mb-6">
            When you reserve or purchase travel services through The Nomads Co., we must provide certain of your personal information to the airline, hotel, car-rental agency, travel agency, or other involved third party to enable the successful fulfillment of your travel arrangements. However, we do not sell or rent individual customer names or other personal information to third parties (except as required by subpoena, search warrant, or other legal process or in the case of imminent physical harm to the user or others).
          </p>

          <h3 className="text-2xl font-bold text-[#1F2328] mt-10 mb-4">Service Enhancement</h3>
          <p className="mb-6">
            From time to time, we may add or enhance services available on the Website. To the extent these services are provided and used by you, we will use the information you provide to facilitate the service requested. For example, if you email us with a question, we will use your email address, name, nature of the question, etc., to respond to your question. We may also store such information to assist us in making the Website better and easier to use.
          </p>

          <h3 className="text-2xl font-bold text-[#1F2328] mt-10 mb-4">Security</h3>
          <p className="mb-6">
            The Nomads Co. will take appropriate steps to protect the information you share with us. We have implemented technology and security features and strict policy guidelines to safeguard the privacy of your personally identifiable information from unauthorized access and improper use or disclosure. We will continue to enhance our security procedures as new technology becomes available.
          </p>

          <h3 className="text-2xl font-bold text-[#1F2328] mt-10 mb-4">Policy Updates</h3>
          <p className="mb-6">
            If our privacy policy changes in the future, it will be posted here, and a new effective date will be shown. You should access our privacy policy regularly to ensure you understand our current policies. Please reference the privacy policy in your subject line.
          </p>
          
          <p className="mt-8 pt-8 border-t border-[#E6E8EF] text-sm text-[#1F2328]/60">
            The Nomads Co. will attempt to respond to all reasonable concerns or inquiries within seven business days of receipt. Thank you for using www.thenomadsco.com.
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
  useEffect(() => { document.body.style.overflow = isOpen ? "hidden" : ""; }, [isOpen]);

  const inPageLinks = [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contactus" },
  ];

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
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[80%] bg-white shadow-2xl p-6">
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setIsOpen(false)}><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium text-[#1F2328]">Home</Link>
              <Link to="/contactus" onClick={() => setIsOpen(false)} className="text-lg font-medium text-[#1F2328]">Contact</Link>
              <Link to="/contactus" className="mt-4 px-6 py-3 bg-[#2D3191] text-white text-center rounded-xl font-medium">Plan My Trip</Link>
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
          <Link to="/contactus" className="text-sm text-[#1F2328]/70 hover:text-[#2D3191]">Contact Us</Link>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          {/* Linked to the new page */}
          <Link to="/privacypolicy" className="text-sm text-[#1F2328]/70 hover:text-[#2D3191]">Privacy Policy</Link>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Social</h4>
          <div className="flex gap-4 justify-center sm:justify-start text-[#2D3191]">
             <a href="https://www.instagram.com/thenomadsco/"><Instagram /></a>
             <a href="https://www.facebook.com/Thenomadsco/"><Facebook /></a>
          </div>
        </div>
        <div>
          <p className="text-sm text-[#1F2328]/50">© {new Date().getFullYear()} The Nomads Co.</p>
        </div>
      </div>
    </footer>
  );
}
