import nomadsLogo from './the nomads logo.jpeg';
import kirtiProfile from './kirti-shah-profile.jpeg';
import { Link } from "react-router";

// Same icons as home.tsx (copy all IconBase, ArrowRight, Menu, etc.)
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

function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-[#E6E8EF]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6">
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

          <div className="hidden lg:flex items-center justify-center gap-10">
            {[
              { label: "About Us", href: "/aboutus" },
              { label: "Home", href: "/" },
              { label: "Destinations", href: "/" },
              { label: "Experiences", href: "/" },
              { label: "Testimonials", href: "/" },
              { label: "Contact", href: "/" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-[#1F2328]/80 hover:text-[#2D3191] transition-colors duration-300 ease-out"
                style={{ letterSpacing: "-0.01em" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-end gap-4">
            <a
              href="mailto:thenomadsco@gmail.com"
              className="hidden lg:block px-6 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-2xl hover:bg-[#242875] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg"
            >
              Plan My Trip
            </a>
            <button className="lg:hidden text-[#1F2328] transition-transform duration-300 ease-out hover:-translate-y-0.5">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white antialiased">
      <Navigation />
      {/* 👈 BLANK PAGE FOR TESTING - Same design system */}
      <div className="pt-24 pb-32 px-6 sm:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl text-[#1F2328] mb-8"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "-0.03em" }}>
            About Us Page
          </h1>
          <p className="text-xl text-[#1F2328]/70 max-w-2xl mx-auto">
            ✅ Navigation working! This is a blank page for testing.
            <br />Ready to add your About Us content here.
          </p>
        </div>
      </div>
    </div>
  );
}
