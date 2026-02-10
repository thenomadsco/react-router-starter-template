import { Link } from "react-router";
import nomadsLogo from "./the nomads logo.jpeg";
import type { Route } from "./+types/home";

// --- Icons ---
const iconDefaults = { size: 24, strokeWidth: 2 };
function IconBase({ size = iconDefaults.size, className, strokeWidth = iconDefaults.strokeWidth, fill = "none", children }: any) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
function Menu(props: any) { return (<IconBase {...props}><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></IconBase>); }
function CheckCircle2(props: any) { return (<IconBase {...props}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></IconBase>); }
function XCircle(props: any) { return (<IconBase {...props}><circle cx="12" cy="12" r="9" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></IconBase>); }
function Clock(props: any) { return (<IconBase {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></IconBase>); }
function Calendar(props: any) { return (<IconBase {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></IconBase>); }
function Plane(props: any) { return (<IconBase {...props}><path d="M2 12h20" /><path d="M13 5v7" /><path d="M6 17l4-4" /><path d="M18 7l-4 4" /></IconBase>); }
function ArrowRight(props: any) { return (<IconBase {...props}><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></IconBase>); }
function Utensils(props: any) { return (<IconBase {...props}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></IconBase>); }
function FileCheck(props: any) { return (<IconBase {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="m9 15 2 2 4-4" /></IconBase>); }
function MapPin(props: any) { return (<IconBase {...props}><path d="M12 21s6-6.2 6-11a6 6 0 0 0-12 0c0 4.8 6 11 6 11z" /><circle cx="12" cy="10" r="2.5" /></IconBase>); }
function Facebook(props: any) { return (<IconBase {...props}><path d="M14 8h-2c-1.1 0-2 .9-2 2v2H8v3h2v5h3v-5h2.2l.8-3H13v-1.6c0-.4.3-.7.7-.7H16V8z" /></IconBase>); }
function Instagram(props: any) { return (<IconBase {...props}><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></IconBase>); }
function Mail(props: any) { return (<IconBase {...props}><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></IconBase>); }
function PoundSterling(props: any) { return (<IconBase {...props}><path d="M18 7c0-5.333-8-5.333-8 0" /><path d="M10 7v14" /><path d="M6 21h12" /><path d="M6 13h10" /></IconBase>); }

export function meta({}: Route.MetaArgs) {
  return [
    { title: "London Package | The Nomads Co." },
    { name: "description", content: "6 Night / 7 Days London Tour Package from Vadodara." },
  ];
}

export default function LondonPage() {
  return (
    <div className="min-h-screen bg-white antialiased selection:bg-[#2D3191]/10 selection:text-[#2D3191]">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-end pb-20 px-6 sm:px-12">
        <img 
          src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1920&auto=format&fit=crop" 
          alt="London Big Ben" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="relative z-10 max-w-[1400px] mx-auto w-full grid lg:grid-cols-2 gap-10 items-end">
          <div>
            <span className="px-4 py-2 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest rounded-full mb-6 inline-block">
              Best Seller
            </span>
            <h1 className="text-5xl sm:text-7xl font-semibold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              London: <br /> The Royal Capital
            </h1>
            <div className="flex flex-wrap gap-6 text-white/90 font-medium">
              <div className="flex items-center gap-2">
                <Clock size={20} /> 6 Nights / 7 Days
              </div>
              <div className="flex items-center gap-2">
                <FileCheck size={20} /> UK Visa Assisted
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={20} /> Best: Apr - Sep
              </div>
            </div>
          </div>

          <div className="lg:text-right">
             <p className="text-white/80 text-lg mb-2">Starting from</p>
             <p className="text-5xl font-bold text-white mb-6">₹1,25,000 <span className="text-xl font-normal text-white/60">/ person</span></p>
             <a href="#enquire" className="inline-flex px-8 py-4 bg-[#02A551] hover:bg-[#028f46] text-white font-medium rounded-full transition-all hover:-translate-y-1 shadow-lg shadow-[#02A551]/30">
               Get Custom Quote
             </a>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 px-6 sm:px-12 max-w-[1000px] mx-auto text-center">
        <h2 className="text-3xl font-semibold text-[#1F2328] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
          Royalty, History & Modern Vibes
        </h2>
        <p className="text-lg text-[#1F2328]/70 leading-relaxed mb-12">
          London isn't just a city; it's a world on its own. From the historic Tower of London to the bustling streets of Soho, every corner tells a story. We’ve designed this itinerary to give you the perfect mix of iconic sightseeing (like the London Eye) and relaxed leisure time for shopping on Oxford Street. Perfect for families and couples alike.
        </p>

        <div className="grid sm:grid-cols-3 gap-8 text-left">
          {[
            { title: "Central Stay", desc: "4-star hotel in Zone 1, walking distance to the Tube." },
            { title: "VIP Access", desc: "Skip-the-line tickets to Madame Tussauds & Eye." },
            { title: "Day Trips Included", desc: "Full day excursion to Windsor & Stonehenge." }
          ].map((item, i) => (
             <div key={i} className="bg-[#EEF0FF] p-6 rounded-2xl border border-[#E6E8EF]">
               <h3 className="font-semibold text-[#2D3191] mb-2">{item.title}</h3>
               <p className="text-sm text-[#1F2328]/70">{item.desc}</p>
             </div>
          ))}
        </div>
      </section>

      {/* Ticket Price Breakdown (New Section) */}
      <section className="py-16 bg-white px-6 sm:px-12 border-t border-b border-[#E6E8EF]">
        <div className="max-w-[1000px] mx-auto">
           <h3 className="text-2xl font-semibold text-center mb-10 text-[#1F2328]">Included Activity Breakdown (2025/26)</h3>
           <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <p className="text-[#1F2328]/70">We believe in transparency. Here is the approximate cost of the tickets we have already included in your package:</p>
                 <ul className="space-y-3">
                    <li className="flex justify-between items-center p-3 bg-[#F7F6F1] rounded-lg">
                       <span className="font-medium text-[#1F2328]">London Eye (Standard)</span>
                       <span className="font-bold text-[#2D3191]">~£35 (₹3,700)</span>
                    </li>
                    <li className="flex justify-between items-center p-3 bg-[#F7F6F1] rounded-lg">
                       <span className="font-medium text-[#1F2328]">Madame Tussauds</span>
                       <span className="font-bold text-[#2D3191]">~£38 (₹4,000)</span>
                    </li>
                    <li className="flex justify-between items-center p-3 bg-[#F7F6F1] rounded-lg">
                       <span className="font-medium text-[#1F2328]">Warner Bros Studio Tour</span>
                       <span className="font-bold text-[#2D3191]">~£56 (₹6,000)</span>
                    </li>
                    <li className="flex justify-between items-center p-3 bg-[#F7F6F1] rounded-lg">
                       <span className="font-medium text-[#1F2328]">Windsor & Stonehenge Tour</span>
                       <span className="font-bold text-[#2D3191]">~£130 (₹13,800)</span>
                    </li>
                    <li className="flex justify-between items-center p-3 bg-[#F7F6F1] rounded-lg">
                       <span className="font-medium text-[#1F2328]">24hr Hop-on Hop-off Bus</span>
                       <span className="font-bold text-[#2D3191]">~£35 (₹3,700)</span>
                    </li>
                 </ul>
              </div>
              <div className="bg-[#2D3191] p-8 rounded-2xl text-white flex flex-col justify-center">
                 <h4 className="text-xl font-semibold mb-2">Total Activity Value</h4>
                 <p className="text-4xl font-bold mb-4">~₹31,000+</p>
                 <p className="text-white/80 text-sm">per person included in your package price.</p>
                 <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="text-sm font-medium">Plus: 6 Nights 4-Star Hotel + Breakfast + Visa Assistance.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Itinerary */}
      <section className="py-20 bg-[#FAFAF8] px-6 sm:px-12">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-3xl font-semibold text-[#1F2328] mb-12 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            Day-by-Day Itinerary
          </h2>
          
          <div className="space-y-8">
            {[
              { day: 1, title: "Arrival & Leisure", desc: "Arrive at Heathrow. Take the Elizabeth Line or Express train to Paddington (easy & fast). Check-in to your central hotel. Evening free to explore local cafes.", tag: "Leisure" },
              { day: 2, title: "The Royal Tour", desc: "Start with a 24hr Hop-on Hop-off bus tour covering Buckingham Palace, Big Ben, and Westminster Abbey. Change of Guard ceremony included.", tag: "Sightseeing" },
              { day: 3, title: "Icons of London", desc: "Morning at Madame Tussauds to meet the stars. Afternoon ride on the London Eye for iconic skyline views.", tag: "Attractions" },
              { day: 4, title: "Windsor & Stonehenge", desc: "A full-day guided coach tour. Visit the Queen's weekend home (Windsor Castle) and the ancient mystery of Stonehenge.", tag: "Day Trip" },
              { day: 5, title: "Harry Potter Studios", desc: "The Making of Harry Potter at Warner Bros Studios. See the Great Hall, Diagon Alley and try Butterbeer. (Transport from Victoria included).", tag: "Must Do" },
              { day: 6, title: "Shopping at Oxford St.", desc: "A free day for shopping at Selfridges, Primark, and Oxford Street. Enjoy a nice Indian dinner at Dishoom in the evening.", tag: "Shopping" },
              { day: 7, title: "Departure", desc: "Breakfast at hotel. Check-out and take the train to the airport with happy memories.", tag: "Travel" }
            ].map((day) => (
              <div key={day.day} className="flex gap-6 group">
                 <div className="flex flex-col items-center">
                   <div className="w-10 h-10 rounded-full bg-[#2D3191] text-white flex items-center justify-center font-bold shadow-lg z-10">
                     {day.day}
                   </div>
                   <div className="w-0.5 h-full bg-[#E6E8EF] -mt-2 group-last:hidden" />
                 </div>
                 <div className="bg-white p-6 rounded-2xl border border-[#E6E8EF] flex-1 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-xl font-semibold text-[#1F2328]">{day.title}</h3>
                       <span className="px-3 py-1 bg-[#E7F7EF] text-[#02A551] text-xs font-bold uppercase rounded-full">{day.tag}</span>
                    </div>
                    <p className="text-[#1F2328]/70">{day.desc}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inclusions / Exclusions */}
      <section className="py-20 px-6 sm:px-12 max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-3xl border border-[#E6E8EF] shadow-sm">
             <h3 className="text-xl font-bold text-[#1F2328] mb-6 flex items-center gap-2">
               <span className="w-2 h-6 bg-[#02A551] rounded-full" /> What's Included
             </h3>
             <ul className="space-y-4">
               {["6 Nights accommodation in 4-Star Central Hotel", "Daily Breakfast Buffet", "Warner Bros Studio Tour Ticket", "Windsor & Stonehenge Day Trip", "London Eye & Madame Tussauds Tickets", "UK Visa Application Assistance", "All Local Taxes (GST & TCS)"].map((item) => (
                 <li key={item} className="flex items-start gap-3 text-[#1F2328]/80">
                   <CheckCircle2 size={20} className="text-[#02A551] flex-shrink-0" /> {item}
                 </li>
               ))}
             </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#E6E8EF] shadow-sm">
             <h3 className="text-xl font-bold text-[#1F2328] mb-6 flex items-center gap-2">
               <span className="w-2 h-6 bg-red-500 rounded-full" /> What's Excluded
             </h3>
             <ul className="space-y-4">
               {["International Airfare (We can book for you)", "Airport Transfers (We recommend Train/Uber)", "Visa Fees (payable to Embassy)", "Lunch & Dinner", "Travel Insurance"].map((item) => (
                 <li key={item} className="flex items-start gap-3 text-[#1F2328]/80">
                   <XCircle size={20} className="text-red-500 flex-shrink-0" /> {item}
                 </li>
               ))}
             </ul>
          </div>
        </div>
      </section>

      {/* Indian Traveler Checklist */}
      <section className="py-16 bg-[#EEF0FF] px-6 sm:px-12">
        <div className="max-w-[1200px] mx-auto">
           <h3 className="text-2xl font-semibold text-center mb-10 text-[#1F2328]">Indian Traveler Special</h3>
           <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl flex items-start gap-4">
                 <div className="bg-[#E7F7EF] p-3 rounded-xl text-[#02A551]"><Utensils /></div>
                 <div>
                   <h4 className="font-bold text-[#1F2328]">Indian Food?</h4>
                   <p className="text-sm text-[#1F2328]/70 mt-1">Yes! We book hotels near top Indian restaurants like Dishoom & Saravana Bhavan.</p>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-2xl flex items-start gap-4">
                 <div className="bg-[#E7F7EF] p-3 rounded-xl text-[#02A551]"><FileCheck /></div>
                 <div>
                   <h4 className="font-bold text-[#1F2328]">Visa Help?</h4>
                   <p className="text-sm text-[#1F2328]/70 mt-1">UK Visas are tricky. We handle the forms, appointment booking, and checklist for you.</p>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-2xl flex items-start gap-4">
                 <div className="bg-[#E7F7EF] p-3 rounded-xl text-[#02A551]"><Plane /></div>
                 <div>
                   <h4 className="font-bold text-[#1F2328]">Flights?</h4>
                   <p className="text-sm text-[#1F2328]/70 mt-1">Direct flights available from Mumbai/Delhi. We get corporate rates if booked in advance.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section id="enquire" className="py-20 px-6 sm:px-12 max-w-[800px] mx-auto">
        <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-[#E6E8EF] shadow-xl text-center">
           <h2 className="text-3xl font-bold text-[#1F2328] mb-4">Like this London plan?</h2>
           <p className="text-[#1F2328]/60 mb-8">Fill this form to get the final price based on your travel dates.</p>
           
           <form action="https://formsubmit.co/thenomadsco@gmail.com" method="POST" className="space-y-4 text-left">
              <input type="hidden" name="_subject" value="London Package Inquiry" />
              
              <div className="grid sm:grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-sm font-semibold ml-1 text-[#1F2328]">Full Name</label>
                   <input 
                     type="text" 
                     name="name" 
                     required 
                     className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:outline-none focus:border-[#2D3191] focus:ring-1 focus:ring-[#2D3191] transition-all" 
                     placeholder="e.g. Rahul Sharma" 
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-sm font-semibold ml-1 text-[#1F2328]">Phone Number</label>
                   <input 
                     type="tel" 
                     name="phone" 
                     required 
                     className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:outline-none focus:border-[#2D3191] focus:ring-1 focus:ring-[#2D3191] transition-all" 
                     placeholder="e.g. +91 98765 43210" 
                   />
                 </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                     <label className="text-sm font-semibold ml-1 text-[#1F2328]">Travel Month</label>
                     <input 
                       type="text" 
                       name="travel_dates" 
                       className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:outline-none focus:border-[#2D3191] focus:ring-1 focus:ring-[#2D3191] transition-all" 
                       placeholder="e.g. May 2026" 
                     />
                </div>
                <div className="space-y-1">
                     <label className="text-sm font-semibold ml-1 text-[#1F2328]">Number of Travelers</label>
                     <input 
                       type="number" 
                       name="travelers" 
                       className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:outline-none focus:border-[#2D3191] focus:ring-1 focus:ring-[#2D3191] transition-all" 
                       placeholder="e.g. 2 Adults, 1 Child" 
                     />
                </div>
              </div>
              
              <div className="space-y-1">
                   <label className="text-sm font-semibold ml-1 text-[#1F2328]">Any specific requirements?</label>
                   <textarea 
                     name="notes" 
                     rows={3}
                     className="w-full px-4 py-3 bg-[#FAFAF8] rounded-xl border border-[#E6E8EF] focus:outline-none focus:border-[#2D3191] focus:ring-1 focus:ring-[#2D3191] transition-all resize-none" 
                     placeholder="e.g. Need Jain food, celebrating anniversary..." 
                   />
              </div>

              <button type="submit" className="w-full py-4 bg-[#2D3191] text-white font-bold rounded-xl hover:bg-[#242875] transition-all mt-4 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                 Get My Free Quote
              </button>
           </form>
        </div>
      </section>

      <Footer />
      
      {/* Sticky Bottom Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E6E8EF] p-4 sm:hidden flex items-center justify-between z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
         <div>
            <p className="text-xs text-[#1F2328]/60">Starting from</p>
            <p className="text-lg font-bold text-[#2D3191]">₹1,25,000</p>
         </div>
         <a href="#enquire" className="px-6 py-2.5 bg-[#02A551] text-white text-sm font-bold rounded-full shadow-md">
            Enquire Now
         </a>
      </div>
    </div>
  );
}

// --- Navigation & Footer (Reused for consistency) ---
function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-[#E6E8EF] transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={nomadsLogo} alt="The Nomads Co." className="h-10 w-auto transition-transform duration-300 ease-out group-hover:-translate-y-0.5" />
            <span className="text-lg font-semibold text-[#1F2328] tracking-tight" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}>The Nomads Co.</span>
          </Link>
          <div className="hidden lg:flex items-center justify-center gap-10">
            {[{ label: "Destinations", to: "/#destinations" }, { label: "Experiences", to: "/#experiences" }, { label: "Testimonials", to: "/#testimonials" }, { label: "Contact", to: "/contactus" }].map((link) => (
              <Link key={link.label} to={link.to} className="text-sm font-medium text-[#1F2328]/70 hover:text-[#2D3191] transition-colors duration-300 ease-out">{link.label}</Link>
            ))}
          </div>
          <div className="flex items-center justify-end gap-4">
            <Link to="/contactus" className="hidden lg:block px-6 py-2.5 bg-[#2D3191] text-white text-sm font-medium rounded-full hover:bg-[#242875] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg">Plan My Trip</Link>
            <button className="lg:hidden text-[#1F2328]"><Menu size={24} /></button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[#FAFAF8] text-[#1F2328] py-16 px-6 sm:px-12 border-t border-[#E6E8EF]">
      <div className="max-w-[1400px] mx-auto text-center sm:text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>The Nomads Co.</h3>
            <p className="text-sm text-[#1F2328]/70">Crafting extraordinary journeys since 2015.</p>
          </div>
          <div><h4 className="font-semibold mb-4">Support</h4><ul className="space-y-2 text-sm text-[#1F2328]/70"><li><Link to="/contactus">Contact Us</Link></li><li>FAQs</li></ul></div>
          <div><h4 className="font-semibold mb-4">Legal</h4><ul className="space-y-2 text-sm text-[#1F2328]/70"><li>Privacy Policy</li><li>Terms</li></ul></div>
          <div><h4 className="font-semibold mb-4">Social</h4><div className="flex gap-4 justify-center sm:justify-start"><Facebook /><Instagram /></div></div>
        </div>
        <div className="text-sm text-[#1F2328]/50 pt-8 border-t border-[#E6E8EF]">© {currentYear} The Nomads Co. All rights reserved.</div>
      </div>
    </footer>
  );
}
