import { Link } from "react-router";
import nomadsLogo from "./the nomads logo.jpeg";
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

const logoImage = nomadsLogo;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "The Nomads Co. | Contact" },
    {
      name: "description",
      content: "Contact The Nomads Co. to plan your next journey.",
    },
  ];
}

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-white antialiased">
      <Navigation />

      {/* Blank page content by request */}
      <main className="flex-1" />

      <Footer />
    </div>
  );
}

function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-[#E6E8EF]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <img
              src={logoImage}
              alt="The Nomads Co."
              className="h-10 w-auto transition-transform duration-300 ease-out hover:-translate-y-0.5"
            />
            <span
              className="text-lg font-semibold text-[#1F2328] tracking-tight"
              style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}
            >
              The Nomads Co.
            </span>
          </div>

          {/* Navigation Links */}
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
                className="text-sm font-medium text-[#1F2328]/80 hover:text-[#2D3191] transition-colors duration-300 ease-out"
                style={{ letterSpacing: "-0.01em" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA & Mobile Menu */}
          <div className="flex items-center justify-end gap-4">
            <Link
              to="/contactus"
              className="hidden lg:block px-6 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-2xl hover:bg-[#242875] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg"
            >
              Plan My Trip
            </Link>

            <button className="lg:hidden text-[#1F2328] transition-transform duration-300 ease-out hover:-translate-y-0.5">
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
              {[
                { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/thenomadsco/" },
                { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/Thenomadsco/" },
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
