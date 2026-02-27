import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import {
  MapPin,
  Calendar,
  Star,
  ChevronDown,
  Instagram,
  Facebook,
  Mail,
  Phone,
  Award,
  Shield,
  Heart,
  X,
  Plane,
  Compass,
  Headphones,
  Map,
  SlidersHorizontal
} from "lucide-react"

// -- Reusable Components --

// Optimized Image Component with lazy loading and fallback
const OptimizedImage = ({ src, alt, className, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (priority) {
      const img = new Image()
      img.src = src
      img.onload = () => setIsLoaded(true)
      img.onerror = () => setError(true)
    }
  }, [src, priority])

  const handleLoad = () => setIsLoaded(true)
  const handleError = () => setError(true)

  const finalSrc = error ? "/placeholder.svg?height=600&width=800" : src

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      <img
        src={finalSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  )
}

// RevealOnScroll: Adds fade-in-up animation when elements enter viewpoint
const RevealOnScroll = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  )
}

// -- Data Data --

// Updated Hero Images with labels for the carousel tabs
const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    label: "Taj Mahal, India"
  },
  {
    url: "https://images.unsplash.com/photo-1613395933344-8691eb5477e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    label: "Santorini, Greece"
  },
  {
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    label: "Eiffel Tower, Paris"
  }
]

// New Extended Key Services Data
const keyServices = [
    {
      icon: <Plane className="w-8 h-8 text-blue-600" />,
      title: "Visa & Flight Support",
      description: "Hassle-free documentation and booking assistance."
    },
    {
      icon: <Map className="w-8 h-8 text-blue-600" />,
      title: "End-to-End Planning",
      description: "From itinerary creation to returning home safely."
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Verified Premium Stays",
      description: "Handpicked 4 & 5 star accommodations for comfort."
    },
    {
        icon: <Headphones className="w-8 h-8 text-blue-600" />,
        title: "24/7 On-Trip Support",
        description: "Always just a message away whenever you need us."
      },
      {
        icon: <Compass className="w-8 h-8 text-blue-600" />,
        title: "Curated Local Experiences",
        description: "Authentic activities beyond standard tourist traps."
      },
      {
        icon: <SlidersHorizontal className="w-8 h-8 text-blue-600" />,
        title: "Flexible Itineraries",
        description: "Plans that adapt to your pace and preferences."
      }
  ];

// Destinations data (Updated with correct images)
const destinations = [
  // International
  {
    id: 1,
    title: "Bali, Indonesia",
    category: "International",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    tags: ["Tropical", "Beaches", "Culture"],
    description: "Island of Gods with serene beaches and vibrant culture."
  },
  {
    id: 2,
    title: "Maldives",
    category: "International",
    image: "https://images.unsplash.com/photo-1514282401047-d79aa23f5e2b?auto=format&fit=crop&w=800&q=80",
    tags: ["Honeymoon", "Luxury", "Beaches"],
    description: "Overwater villas and crystal clear turquoise lagoons."
  },
  {
    id: 3,
    title: "Dubai, UAE",
    category: "International",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    tags: ["Luxury", "City", "Desert"],
    description: "Futuristic architecture, luxury shopping, and desert safaris."
  },
  {
    id: 4,
    title: "Singapore",
    category: "International",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
    tags: ["City", "Family", "Modern"],
    description: "A blend of nature and modernity in a global metropolis."
  },
  {
    id: 5,
    title: "Thailand",
    category: "International",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80",
    tags: ["Beaches", "Culture", "Nightlife"],
    description: "Vibrant street life, ornate temples, and tropical beaches."
  },
  {
    id: 6,
    title: "Vietnam",
    category: "International",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    tags: ["Nature", "Culture", "Food"],
    description: "Bustling cities, serene limestone islands, and rich history."
  },
  {
    id: 7,
    title: "Sri Lanka",
    category: "International",
    image: "https://images.unsplash.com/photo-1586052556237-3039b4cb8944?auto=format&fit=crop&w=800&q=80",
    tags: ["Nature", "Wildlife", "Beaches"],
    description: "Diverse landscapes, wildlife, and ancient Buddhist ruins."
  },
  {
    id: 8,
    title: "Bhutan",
    category: "International",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
    tags: ["Mountains", "Culture", "Peace"],
    description: "The last great Himalayan kingdom, shrouded in mystery."
  },
  {
    id: 9,
    title: "Europe (Schengen)",
    category: "International",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80",
    tags: ["History", "Culture", "Romance"],
    description: "Explore diverse cultures, history, and architecture across Europe."
  },
  {
    id: 10,
    title: "Australia",
    category: "International",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=800&q=80",
    tags: ["Adventure", "Wildlife", "Beaches"],
    description: "The Great Barrier Reef, outback adventures, and vibrant cities."
  },
  {
    id: 11,
    title: "New Zealand",
    category: "International",
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=800&q=80",
    tags: ["Adventure", "Nature", "Landscapes"],
    description: "Stunning natural landscapes, from mountains to fjords."
  },
  {
    id: 12,
    title: "Japan",
    category: "International",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    tags: ["Culture", "Modern", "Food"],
    description: "A seamless blend of ancient traditions and cutting-edge technology."
  },
  {
    id: 13,
    title: "South Korea",
    category: "International",
    image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80",
    tags: ["Culture", "City", "Food"],
    description: "Dynamic cities, ancient palaces, and trendy pop culture."
  },
  {
    id: 14,
    title: "Turkey",
    category: "International",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80",
    tags: ["History", "Culture", "Landscapes"],
    description: "Where East meets West, featuring rich history and unique landscapes."
  },
  {
    id: 15,
    title: "USA",
    category: "International",
    image: "https://images.unsplash.com/photo-1503431374360-f18ebeb8746c?auto=format&fit=crop&w=800&q=80", // Updated Image
    tags: ["City", "Nature", "Diverse"],
    description: "Diverse experiences from bustling metropolises to vast national parks."
  },
  {
    id: 16,
    title: "South Africa",
    category: "International",
    image: "https://images.unsplash.com/photo-1516426122078-c23e7631985c?auto=format&fit=crop&w=800&q=80", // Updated Image
    tags: ["Wildlife", "Adventure", "Nature"],
    description: "Safari adventures, stunning coastlines, and vibrant culture."
  },
  {
    id: 17,
    title: "Kenya",
    category: "International",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80",
    tags: ["Wildlife", "Safari", "Nature"],
    description: "Home of the Great Migration and iconic African wildlife."
  },
  {
    id: 18,
    title: "Tanzania",
    category: "International",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a5535?auto=format&fit=crop&w=800&q=80",
    tags: ["Wildlife", "Safari", "Beaches"],
    description: "Mount Kilimanjaro, Serengeti safaris, and Zanzibar beaches."
  },
  // India
  {
    id: 19,
    title: "Kashmir",
    category: "India",
    image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80",
    tags: ["Mountains", "Nature", "Romance"],
    description: "Paradise on Earth with stunning valleys and Dal Lake."
  },
  {
    id: 20,
    title: "Leh-Ladakh",
    category: "India",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
    tags: ["Adventure", "Mountains", "Road Trip"],
    description: "Stark mountain landscapes, monasteries, and high passes."
  },
  {
    id: 21,
    title: "Himachal Pradesh",
    category: "India",
    image: "https://images.unsplash.com/photo-1573644783262-71185f23470c?auto=format&fit=crop&w=800&q=80",
    tags: ["Mountains", "Nature", "Adventure"],
    description: "Scenic hill stations, pine forests, and snow-capped peaks."
  },
  {
    id: 22,
    title: "Uttarakhand",
    category: "India",
    image: "https://images.unsplash.com/photo-1593183842771-73d1364550c5?auto=format&fit=crop&w=800&q=80", // Updated Image
    tags: ["Mountains", "Spiritual", "Nature"],
    description: "Land of Gods, featuring pilgrimage sites and Himalayan vistas."
  },
  {
    id: 23,
    title: "Rajasthan",
    category: "India",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    tags: ["History", "Culture", "Desert"],
    description: "Royal palaces, vibrant culture, and vast desert landscapes."
  },
  {
    id: 24,
    title: "Goa",
    category: "India",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    tags: ["Beaches", "Nightlife", "Relaxation"],
    description: "Sun, sand, beaches, and a relaxed coastal vibe."
  },
  {
    id: 25,
    title: "Kerala",
    category: "India",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    tags: ["Nature", "Backwaters", "Wellness"],
    description: "God's Own Country with tranquil backwaters and lush greenery."
  },
  {
    id: 26,
    title: "Andaman Islands",
    category: "India",
    image: "https://images.unsplash.com/photo-1555660177-2e90c2884334?auto=format&fit=crop&w=800&q=80",
    tags: ["Beaches", "Islands", "Adventure"],
    description: "Pristine beaches, clear waters, and water sports."
  },
  {
    id: 27,
    title: "North East India",
    category: "India",
    image: "https://images.unsplash.com/photo-1619609477623-902e7333c357?auto=format&fit=crop&w=800&q=80",
    tags: ["Nature", "Culture", "Offbeat"],
    description: "Unexplored beauty, tribal culture, and biodiversity."
  },
  {
    id: 28,
    title: "Sikkim",
    category: "India",
    image: "https://images.unsplash.com/photo-1615459428680-e9942df16c6d?auto=format&fit=crop&w=800&q=80",
    tags: ["Mountains", "Nature", "Monasteries"],
    description: "Home to Kanchenjunga, scenic landscapes, and monasteries."
  },
  {
    id: 29,
    title: "Meghalaya",
    category: "India",
    image: "https://images.unsplash.com/photo-1605629672844-250d79c0ff7d?auto=format&fit=crop&w=800&q=80", // Updated Image (Living Root Bridge vibe)
    tags: ["Nature", "Waterfalls", "Offbeat"],
    description: "Abode of Clouds, known for living root bridges and waterfalls."
  },
  {
    id: 30,
    title: "Arunachal Pradesh",
    category: "India",
    image: "https://images.unsplash.com/photo-1622307862343-568731cb41d8?auto=format&fit=crop&w=800&q=80",
    tags: ["Mountains", "Culture", "Adventure"],
    description: "Land of the Dawn-Lit Mountains with rich tribal heritage."
  },
  {
    id: 31,
    title: "Karnataka",
    category: "India",
    image: "https://images.unsplash.com/photo-1600626333389-21377b3f1683?auto=format&fit=crop&w=800&q=80", // Updated Image (Hampi)
    tags: ["History", "Nature", "Culture"],
    description: "Heritage sites like Hampi, coffee plantations in Coorg."
  },
  {
    id: 32,
    title: "Tamil Nadu",
    category: "India",
    image: "https://images.unsplash.com/photo-1582510003544-5d1454053607?auto=format&fit=crop&w=800&q=80", // Updated Image (Temple)
    tags: ["Culture", "Temples", "Beaches"],
    description: "Land of temples, rich culture, and coastal beauty."
  },
  {
    id: 33,
    title: "Pondicherry",
    category: "India",
    image: "https://images.unsplash.com/photo-1568521247052-61d971601883?auto=format&fit=crop&w=800&q=80", // Updated Image (French Colony vibe)
    tags: ["Beaches", "French Colony", "Relaxation"],
    description: "A touch of French culture on the Indian coast."
  },
  {
    id: 34,
    title: "West Bengal",
    category: "India",
    image: "https://images.unsplash.com/photo-1586673235975-b4b610529977?auto=format&fit=crop&w=800&q=80", // Updated Image (Darjeeling Tea Garden)
    tags: ["Culture", "History", "Mountains"],
    description: "Cultural richness of Kolkata to the tea gardens of Darjeeling."
  },
  {
    id: 35,
    title: "Odisha",
    category: "India",
    image: "https://images.unsplash.com/photo-1597735487288-f85eb0d47c70?auto=format&fit=crop&w=800&q=80", // Updated Image (Konark Sun Temple vibe)
    tags: ["Culture", "Temples", "Beaches"],
    description: "Known for its ancient temples, beaches, and tribal culture."
  },
  {
    id: 36,
    title: "Gujarat",
    category: "India",
    image: "https://images.unsplash.com/photo-1556916795-baf0a9058816?auto=format&fit=crop&w=800&q=80",
    tags: ["Culture", "Wildlife", "White Desert"],
    description: "Rann of Kutch, Asiatic Lions, and vibrant traditions."
  }
];

// Testimonials Data
const testimonials = [
  {
    id: 1,
    name: "Priya & Rahul",
    location: "Mumbai",
    rating: 5,
    text: "Kirti planned our honeymoon to Maldives perfectly. Every detail was taken care of, from flights to the amazing water villa. Truly stress-free!",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    name: "Amit Desai",
    location: "Bangalore",
    rating: 5,
    text: "The Nomads Co. helped me plan a solo trip to Vietnam. The itinerary was flexible yet comprehensive. Excellent local recommendations!",
    image: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    id: 3,
    name: "The Sharma Family",
    location: "Delhi",
    rating: 5,
    text: "A wonderful family vacation to Singapore. Kirti ensured activities for both kids and adults were included. Highly recommended!",
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  }
]

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showDestinations, setShowDestinations] = useState(false)
  const [activeCategory, setActiveCategory] = useState("International")
  const [selectedDestination, setSelectedDestination] = useState("")
  // State for Hero Carousel
  const [heroActiveIndex, setHeroActiveIndex] = useState(0);

  // Auto-rotate hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
        setHeroActiveIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const filteredDestinations = destinations.filter(
    (dest) => dest.category === activeCategory
  )

  const handleDestinationClick = (destinationName) => {
    setSelectedDestination(destinationName)
    setShowDestinations(false)
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">
      {/* SEO Meta Tags */}
      <head>
        <title>The Nomads Co. | Curated Journeys</title>
        <meta
          name="description"
          content="Tailored travel experiences for the modern explorer. Discover your next adventure with The Nomads Co."
        />
      </head>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-white to-teal-50 opacity-50"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md py-4 shadow-sm"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <a href="#" className="text-2xl font-bold tracking-tighter z-50">
            The Nomads Co.
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#about"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              About
            </a>
            <a
              href="#destinations"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Destinations
            </a>
            <a
              href="#reviews"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Reviews
            </a>
            <a
              href="#contact"
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              Plan My Trip
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden z-50 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col items-end space-y-1.5">
              <span
                className={`block h-0.5 bg-current transition-all duration-300 ${
                  isMenuOpen ? "w-6 rotate-45 translate-y-2" : "w-6"
                }`}
              ></span>
              <span
                className={`block h-0.5 bg-current transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : "w-4"
                }`}
              ></span>
              <span
                className={`block h-0.5 bg-current transition-all duration-300 ${
                  isMenuOpen ? "w-6 -rotate-45 -translate-y-2" : "w-5"
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-8 transition-all duration-500 ${
            isMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <a
            href="#about"
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl font-medium"
          >
            About
          </a>
          <a
            href="#destinations"
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl font-medium"
          >
            Destinations
          </a>
          <a
            href="#reviews"
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl font-medium"
          >
            Reviews
          </a>
          <a
            href="#contact"
            onClick={() => setIsMenuOpen(false)}
            className="px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-full"
          >
            Plan My Trip
          </a>
        </div>
      </nav>

      {/* Hero Section - Updated Layout & Carousel */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Hero Text - Updated Typography */}
            <RevealOnScroll>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-8">
                Your Next Great <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  Adventure
                </span>{" "}
                Awaits.
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg mb-10">
                Curating personalized, stress-free journeys for the modern
                explorer. Discover the world's most captivating destinations with expertly crafted itineraries.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <a
                  href="#contact"
                  className="px-8 py-4 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 inline-flex items-center group"
                >
                  Start Planning
                  <Calendar className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                </a>
                <div className="flex items-center text-sm font-medium text-gray-500">
                  <div className="flex -space-x-3 mr-4">
                    {[1, 2, 3, 4].map((i) => (
                      <img
                        key={i}
                        src={`https://randomuser.me/api/portraits/${
                          i % 2 ? "women" : "men"
                        }/${30 + i}.jpg`}
                        alt="User"
                        className="w-10 h-10 rounded-full border-2 border-white"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-gray-600">Trusted by 1000+ happy families</span>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            {/* Hero Carousel - Samsung Style revolving tabs */}
            <RevealOnScroll className="delay-200">
              <div className="relative">
                {/* Main Active Image */}
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3] md:aspect-[16/9] lg:aspect-[4/3]">
                    {heroImages.map((img, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                index === heroActiveIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                        >
                            <OptimizedImage
                                src={img.url}
                                alt={img.label}
                                priority={index === 0}
                                className="w-full h-full object-cover"
                            />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent">
                                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white">
                                    <h3 className="text-2xl md:text-3xl font-bold">{img.label}</h3>
                                </div>
                             </div>
                        </div>
                    ))}
                </div>

                {/* Tab navigation */}
                <div className="flex justify-center mt-6 md:mt-8 space-x-4">
                    {heroImages.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setHeroActiveIndex(index)}
                            className={`relative px-4 py-2 text-sm md:text-base font-medium transition-all duration-300 ${
                                index === heroActiveIndex
                                ? "text-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {img.label.split(",")[0]} {/* Show only city name on tab */}
                            {index === heroActiveIndex && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
                            )}
                        </button>
                    ))}
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Founder Section - Restructured */}
      <section id="about" className="py-20 relative">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <RevealOnScroll className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold tracking-wider mb-4">
              THE FOUNDER
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Meet Kirti Shah
            </h2>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <RevealOnScroll className="order-2 md:order-1">
              <h3 className="text-3xl font-bold mb-6 leading-tight">
                "I believe travel should be personal, not packaged."
              </h3>
              <div className="space-y-6 text-lg text-gray-600 mb-8">
                <p>
                  With over a decade of experience exploring the globe, I
                  founded The Nomads Co. to bridge the gap between cookie-cutter
                  tours and the desire for authentic, tailored experiences.
                </p>
                <p>
                  My mission is to handle the complexities of planning so you
                  can focus on the joy of discovery. From securing visas to
                  finding hidden local gems, I'm your dedicated travel partner.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-px bg-gray-300 flex-grow"></div>
                <span className="font-handwriting text-3xl text-blue-600">
                  Kirti Shah
                </span>
                <div className="h-px bg-gray-300 flex-grow"></div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll className="order-1 md:order-2 delay-200">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-200 rounded-[2rem] rotate-3 transform translate-x-4 translate-y-4"></div>
                <OptimizedImage
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Kirti Shah, Founder"
                  className="rounded-[2rem] shadow-xl relative z-10 max-h-[600px]"
                />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* New Key Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
            <RevealOnScroll className="text-center mb-16">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold tracking-wider mb-4">
                  WHAT WE DO
                </span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Key Services Offered</h2>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyServices.map((service, index) => (
                <RevealOnScroll key={index} className={`delay-${index * 100}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow h-full border border-gray-100">
                    <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                    {service.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-gray-600 leading-relaxed">
                    {service.description}
                    </p>
                </div>
                </RevealOnScroll>
            ))}
            </div>
        </div>
      </section>


      {/* Destinations Trigger Section - New Interactive Layout */}
      <section id="destinations" className="py-24">
        <div className="container mx-auto px-4 md:px-8">
            <RevealOnScroll>
                <div
                    onClick={() => setShowDestinations(true)}
                    className="group relative overflow-hidden rounded-[2.5rem] cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500"
                >
                    {/* Background Gradient & Subtle Image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-teal-700 opacity-90 z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                        alt="World Travel"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Content */}
                    <div className="relative z-20 py-20 px-8 md:py-28 text-center flex flex-col items-center justify-center text-white">
                        <Compass className="w-16 h-16 mb-6 opacity-80 group-hover:rotate-45 transition-transform duration-500" />
                        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Explore Trending Destinations
                        </h2>
                        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mb-8">
                            Discover our handpicked selection of the world's most captivating spots, from international hotspots to hidden gems across India.
                        </p>
                        <button className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-full transition-transform group-hover:-translate-y-1 group-hover:shadow-lg flex items-center">
                            Discover Now <ChevronDown className="ml-2 w-5 h-5 group-hover:translate-y-0.5 transition-transform"/>
                        </button>
                    </div>
                </div>
            </RevealOnScroll>
        </div>
      </section>


      {/* Destinations Popup Overlay */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ${
          showDestinations
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowDestinations(false)}
        ></div>
        <div className="absolute inset-0 md:inset-10 bg-white md:rounded-[2rem] overflow-hidden flex flex-col shadow-2xl">
          <div className="p-6 md:p-8 border-b flex justify-between items-center bg-gray-50">
            <h3 className="text-2xl md:text-3xl font-bold">
              Choose Your Adventure
            </h3>
            <button
              onClick={() => setShowDestinations(false)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center p-6 bg-white z-10">
            <div className="inline-flex bg-gray-100 rounded-full p-1.5">
              {["International", "India"].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2.5 rounded-full text-sm md:text-base font-medium transition-all ${
                    activeCategory === category
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {category}
                  <span className="ml-2 text-xs opacity-70">
                    (
                    {
                      destinations.filter((d) => d.category === category)
                        .length
                    }
                    )
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Destinations Grid Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1"
                  onClick={() => handleDestinationClick(dest.title)}
                >
                  <div className="relative h-56 overflow-hidden">
                    <OptimizedImage
                      src={dest.image}
                      alt={dest.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      {dest.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs text-white bg-white/20 backdrop-blur-md px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                      {dest.title}
                    </h4>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {dest.description}
                    </p>
                    <div className="mt-4 pt-4 border-t flex justify-between items-center text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Quick View & Plan</span>
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <section id="reviews" className="py-24 relative bg-blue-50/50">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <RevealOnScroll className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold tracking-wider mb-4">
              TESTIMONIALS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Loved by Travelers
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <RevealOnScroll key={testimonial.id} className={`delay-${index * 100}`}>
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all h-full flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 text-blue-50 opacity-50 pointer-events-none">
                    <svg width="120" height="120" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-4 3.638-4 5.849h4v10h-10z"/>
                    </svg>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-400 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed italic mb-8 flex-grow relative z-10">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full mr-4 object-cover border-2 border-blue-100"
                    />
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-gray-500 text-sm">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900 opacity-5 pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <RevealOnScroll className="text-center mb-16">
             <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold tracking-wider mb-4">
              GET IN TOUCH
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Start Your Journey
            </h2>
            <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
              Tell us about your dream trip, and we'll make it a reality.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-start">
            <RevealOnScroll className="lg:col-span-2 space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div>
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Reach out directly or fill the form. We're eager to hear from you!
                </p>
              </div>

              <div className="space-y-6">
                <a
                  href="tel:+919924399335"
                  className="flex items-center p-4 rounded-2xl hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Call / WhatsApp
                    </p>
                    <p className="text-lg font-bold group-hover:text-blue-600 transition-colors">
                      +91 9924399335
                    </p>
                  </div>
                </a>
                <a
                  href="mailto:thenomadsco@gmail.com"
                  className="flex items-center p-4 rounded-2xl hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Email Us
                    </p>
                    <p className="text-lg font-bold group-hover:text-blue-600 transition-colors">
                      thenomadsco@gmail.com
                    </p>
                  </div>
                </a>
                <div className="flex items-center p-4 rounded-2xl hover:bg-blue-50 transition-colors group">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Location
                    </p>
                    <p className="text-lg font-bold group-hover:text-blue-600 transition-colors">
                      Vadodara, Gujarat
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll className="lg:col-span-3 delay-200">
              <form
                target="_blank"
                action="https://formsubmit.co/thenomadsco@gmail.com"
                method="POST"
                className="bg-white p-8 md:p-12 rounded-[2rem] shadow-lg border border-gray-100"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="destination"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Destination in Mind
                  </label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    defaultValue={selectedDestination}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., Maldives, Kerala, Europe..."
                  />
                </div>
                <div className="mb-8">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Trip Details & Requirements
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your preferences, dates, travelers..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-xl hover:-translate-y-1"
                >
                  Send Enquiry
                </button>
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
              </form>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <a href="#" className="text-3xl font-bold text-white mb-6 block">
                The Nomads Co.
              </a>
              <p className="text-gray-400 pr-6 leading-relaxed mb-8">
                Crafting unforgettable, personalized travel experiences. Your journey, our expertise. Let's explore the world together.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                 <a
                  href="mailto:thenomadsco@gmail.com"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#about" className="hover:text-blue-400 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#destinations"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Destinations
                  </a>
                </li>
                <li>
                  <a
                    href="#reviews"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Reviews
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
             <div>
              <h4 className="text-lg font-bold text-white mb-6">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/privacypolicy" className="hover:text-blue-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-blue-400 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} The Nomads Co. All rights reserved.
            </p>
             <p className="text-sm text-gray-500 mt-4 md:mt-0">
              Made with <Heart className="w-4 h-4 inline text-red-500 mx-1" /> in India
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
