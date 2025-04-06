import { useState, useEffect } from "react"
import { Search, SlidersHorizontal, ArrowUpDown, MapPin, Users, Star } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Slider } from "../components/ui/slider"
import { Link } from "react-router-dom"

interface Tour {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  duration: number;
  type: string;
  image: string;
  tags: string[];
  location: string;
  rating: number;
  reviews: number;
  maxGroupSize: number;
  featured: boolean;
}

// Sample tour data with landscape images
const mockTours: Tour[] = [
  {
    id: "1",
    title: "Himalayan Adventure Trek",
    subtitle: "Experience the majesty of the Himalayas",
    price: 29999,
    duration: 7,
    type: "adventure",
    image: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    tags: ["trekking", "camping", "photography"],
    location: "Nepal",
    rating: 4.8,
    reviews: 124,
    maxGroupSize: 12,
    featured: true
  },
  {
    id: "2",
    title: "Kerala Backwaters Cruise",
    subtitle: "Explore the serene backwaters of Kerala",
    price: 15999,
    duration: 5,
    type: "cultural",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    tags: ["houseboat", "fishing", "local cuisine"],
    location: "Kerala, India",
    rating: 4.6,
    reviews: 98,
    maxGroupSize: 8,
    featured: true
  },
  {
    id: "3",
    title: "African Safari Adventure",
    subtitle: "Witness the wild beauty of Africa",
    price: 45999,
    duration: 10,
    type: "wildlife",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    tags: ["safari", "wildlife", "photography"],
    location: "Tanzania",
    rating: 4.9,
    reviews: 156,
    maxGroupSize: 6,
    featured: true
  },
  {
    id: "4",
    title: "Varanasi Ganga Aarti Experience",
    subtitle: "Experience the spiritual essence of India",
    price: 8999,
    duration: 3,
    type: "religious",
    image: "https://images.unsplash.com/photo-1562680711-4c0dba2b7736?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    tags: ["spiritual", "rituals", "photography"],
    location: "Varanasi, India",
    rating: 4.7,
    reviews: 112,
    maxGroupSize: 15,
    featured: false
  },
  {
    id: "5",
    title: "Rajasthan Heritage Tour",
    subtitle: "Explore the royal heritage of Rajasthan",
    price: 24999,
    duration: 8,
    type: "heritage",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
    tags: ["palaces", "forts", "culture"],
    location: "Rajasthan, India",
    rating: 4.5,
    reviews: 87,
    maxGroupSize: 10,
    featured: false
  },
  {
    id: "6",
    title: "Bali Island Paradise",
    subtitle: "Discover the tropical paradise of Bali",
    price: 32999,
    duration: 6,
    type: "cultural",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    tags: ["beaches", "temples", "culture"],
    location: "Bali, Indonesia",
    rating: 4.8,
    reviews: 143,
    maxGroupSize: 8,
    featured: true
  },
  {
    id: "7",
    title: "Machu Picchu Expedition",
    subtitle: "Uncover the mysteries of the ancient Incas",
    price: 38999,
    duration: 9,
    type: "heritage",
    image: "https://images.unsplash.com/photo-1526392060635-9d3c10faf07d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    tags: ["hiking", "history", "photography"],
    location: "Peru",
    rating: 4.9,
    reviews: 167,
    maxGroupSize: 10,
    featured: true
  },
  {
    id: "8",
    title: "Northern Lights in Iceland",
    subtitle: "Witness the magical aurora borealis",
    price: 41999,
    duration: 7,
    type: "adventure",
    image: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    tags: ["aurora", "glaciers", "hot springs"],
    location: "Iceland",
    rating: 4.7,
    reviews: 98,
    maxGroupSize: 8,
    featured: false
  },
  {
    id: "9",
    title: "Japanese Cherry Blossom Tour",
    subtitle: "Experience the beauty of sakura season",
    price: 35999,
    duration: 8,
    type: "cultural",
    image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    tags: ["cherry blossoms", "temples", "culture"],
    location: "Japan",
    rating: 4.8,
    reviews: 132,
    maxGroupSize: 12,
    featured: true
  }
];

export default function ToursPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [duration, setDuration] = useState<string>("all")
  const [tourType, setTourType] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)
  const [tours, setTours] = useState<Tour[]>(mockTours)
  const [loading, setLoading] = useState(false)

  // Simulate API call with loading state
  useEffect(() => {
    setLoading(true)
    // Simulate network delay
    const timer = setTimeout(() => {
      setTours(mockTours)
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Filter tours based on search query and filters
  const filteredTours = tours.filter(tour => {
    const matchesSearch = 
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesPrice = tour.price >= priceRange[0] && tour.price <= priceRange[1]
    const matchesDuration = duration === "all" || 
      (duration === "1" && tour.duration === 1) ||
      (duration === "2" && tour.duration >= 2 && tour.duration <= 3) ||
      (duration === "4" && tour.duration >= 4 && tour.duration <= 7) ||
      (duration === "8" && tour.duration >= 8)
    
    const matchesType = tourType === "all" || tour.type === tourType

    return matchesSearch && matchesPrice && matchesDuration && matchesType
  })

  // Sort tours based on selected option
  const sortedTours = [...filteredTours].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price
    if (sortBy === "price-desc") return b.price - a.price
    if (sortBy === "duration-asc") return a.duration - b.duration
    if (sortBy === "duration-desc") return b.duration - a.duration
    if (sortBy === "rating-desc") return b.rating - a.rating
    if (sortBy === "reviews-desc") return b.reviews - a.reviews
    return 0
  })

  // Format price with commas
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50">
      {/* Header with search */}
      <div className="bg-gradient-to-r from-sky-600 to-emerald-600 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544731612-de7f96afe55f')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">Explore Tours</h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl drop-shadow-md">Discover amazing travel experiences curated just for you</p>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 max-w-4xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />
                <Input
                  placeholder="Search by destination, tour type, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-black border-sky-200 focus:ring-sky-500 focus:border-sky-500 rounded-lg"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 h-12 bg-white border-sky-300 hover:bg-sky-50 hover:text-black text-black font-medium rounded-lg transition-all duration-200"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-sky-100 space-y-6 mb-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Price Range</label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={50000}
                  step={1000}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm font-medium text-sky-700">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Duration</label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="border-sky-200 h-12 rounded-lg">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any duration</SelectItem>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="2">2-3 days</SelectItem>
                    <SelectItem value="4">4-7 days</SelectItem>
                    <SelectItem value="8">8+ days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Tour Type</label>
                <Select value={tourType} onValueChange={setTourType}>
                  <SelectTrigger className="border-sky-200 h-12 rounded-lg">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any type</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="wildlife">Wildlife</SelectItem>
                    <SelectItem value="religious">Religious</SelectItem>
                    <SelectItem value="heritage">Heritage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-sky-100">
              <Button
                variant="outline"
                onClick={() => {
                  setPriceRange([0, 50000])
                  setDuration("all")
                  setTourType("all")
                }}
                className="border-sky-300 hover:bg-sky-50 text-sky-700 font-medium"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        )}

        {/* Sort Options */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-lg font-medium text-gray-700">
            {sortedTours.length} {sortedTours.length === 1 ? 'tour' : 'tours'} found
          </p>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[220px] border-sky-200 h-12 rounded-lg">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-sky-500" />
                <SelectValue placeholder="Sort tours by..." />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="duration-asc">Duration: Short to Long</SelectItem>
              <SelectItem value="duration-desc">Duration: Long to Short</SelectItem>
              <SelectItem value="rating-desc">Highest Rated</SelectItem>
              <SelectItem value="reviews-desc">Most Reviews</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tour Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
          </div>
        ) : sortedTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedTours.map((tour, index) => (
              <Link to={`/tours/${tour.id}`} key={tour.id} className="group">
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col border-sky-100 hover:border-sky-300 rounded-xl animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="aspect-[16/9] relative overflow-hidden rounded-t-xl">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {tour.featured && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-sky-600 to-emerald-600 text-white font-medium px-3 py-1">
                        Featured
                      </Badge>
                    )}
                    <Badge className="absolute top-3 right-3 bg-white/95 text-gray-900 backdrop-blur-sm font-medium px-3 py-1">
                      {tour.duration} days
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-sky-700 transition-colors line-clamp-2">{tour.title}</h3>
                      <div className="flex items-center gap-1 bg-sky-50 px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-semibold text-sky-900">{tour.rating}</span>
                        <span className="text-sm text-sky-600">({tour.reviews})</span>
                      </div>
                    </div>
                    <p className="text-gray-600 line-clamp-2">{tour.subtitle}</p>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 text-sky-600" />
                      <span className="text-sm font-medium">{tour.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tour.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 px-2.5 py-0.5">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto pt-4 border-t border-sky-100">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users className="h-4 w-4 text-sky-600" />
                        <span className="text-sm font-medium">Max {tour.maxGroupSize}</span>
                      </div>
                      <div className="text-lg font-bold text-sky-700">
                        {formatPrice(tour.price)}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No tours found</h3>
            <p className="text-gray-600 text-lg">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
} 