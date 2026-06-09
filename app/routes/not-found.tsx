import { Link } from "react-router";
import { ArrowLeft } from "./home"; // Reusing your existing SVG

export function meta() {
  return [{ title: "Page Not Found | The Nomads Co." }];
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4 text-center">
      <div className="max-w-md">
        <h1 className="text-8xl font-bold text-[#2D3191] mb-6" style={{ fontFamily: "'Playfair Display',serif" }}>404</h1>
        <h2 className="text-3xl font-bold text-[#1F2328] mb-4">Wandered off the map?</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          It looks like the itinerary you are searching for has moved or doesn't exist. Let's get you back to the journey.
        </p>
        <Link to="/" className="inline-flex items-center justify-center px-8 py-4 bg-[#1F2328] text-white font-bold rounded-full hover:bg-black transition-all shadow-lg gap-2">
          <ArrowLeft className="w-5 h-5" /> Return to Homepage
        </Link>
      </div>
    </div>
  );
}
