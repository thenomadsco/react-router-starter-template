import { Link } from "react-router";
import nomadsLogo from './the nomads logo.jpeg';

type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
  fill?: string;
};

const iconDefaults = { size: 24, strokeWidth: 2 };

function IconBase({ size = iconDefaults.size, className, strokeWidth = iconDefaults.strokeWidth, fill = "none", children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
            <img src={logoImage} alt="The Nomads Co." className="h-10 w-auto transition-transform duration-300 ease-out hover:-translate-y-0.5" />
            <span className="text-lg font-semibold text-[#1F2328] tracking-tight" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}>
              The Nomads Co.
            </span>
          </div>
          <div className="hidden lg:flex items-center justify-center gap-10">
            <Link to="/aboutus" className="text-sm font-semibold text-[#2D3191]">About Us</Link>
            <Link to="/" className="text-sm font-medium text-[#1F2328]/80 hover:text-[#2D3191] transition-colors duration-300">Home</Link>
          </div>
          <div className="flex items-center justify-end gap-4">
            <Link to="/" className="hidden lg:block px-6 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-2xl hover:bg-[#242875] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg">
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

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white antialiased">
      <Navigation />
      <main className="pt-24 pb-32 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-[#F7F6F1] to-white">
        <div className="max-w-[1400px] mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl text-[#1F2328] mb-8" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "-0.03em" }}>
            About Us Page ✅
          </h1>
          <div className="bg-white rounded-2xl p-16 border border-[#E6E8EF] shadow-xl max-w-4xl mx-auto">
            <p className="text-2xl text-[#1F2328]/80 mb-8">
              🎉 <strong>ROUTING 100% FIXED!</strong>
            </p>
            <p className="text-xl text-[#1F2328]/70 leading-relaxed">
              Navigation from home.tsx → aboutus.tsx works perfectly on Cloudflare Pages.<br/>
              Ready to add your full About Us content here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
