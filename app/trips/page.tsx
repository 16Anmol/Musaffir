"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, MapPin, Users, Star, Heart, Share2, Clock, Wifi, Car, Camera, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"


const trips = [
  {
    id: 1,
    title: "Mussoorie & Rishikesh Adventure",
    location: "Uttarakhand, India",
    duration: "5 Days",
    price: 12999,
    originalPrice: 15999,
    rating: 4.8,
    reviews: 124,
    image: "/mussoorie_bg.jpg",
    category: "Adventure",
    difficulty: "Moderate",
    groupSize: "8-12 people",
    highlights: ["Kempty Falls", "Ram Jhula", "River Rafting", "Temple Visit"],
    amenities: ["AC Transport", "3-Star Hotels", "All Meals", "Guide"],
    featured: true,
    discount: 19,
  },
  {
    id: 2,
    title: "Kashmir Valley Paradise",
    location: "Kashmir, India",
    duration: "7 Days",
    price: 18999,
    originalPrice: 22999,
    rating: 4.9,
    reviews: 89,
    image: "/home_t2.jpg",
    category: "Nature",
    difficulty: "Easy",
    groupSize: "6-10 people",
    highlights: ["Dal Lake", "Gulmarg", "Pahalgam", "Srinagar Gardens"],
    amenities: ["Houseboat Stay", "Shikara Rides", "Local Cuisine", "Photography"],
    featured: true,
    discount: 17,
  },
  {
    id: 3,
    title: "Kedarnath Spiritual Journey",
    location: "Uttarakhand, India",
    duration: "6 Days",
    price: 15999,
    originalPrice: 18999,
    rating: 4.7,
    reviews: 156,
    image: "/home_t3.jpg",
    category: "Spiritual",
    difficulty: "Challenging",
    groupSize: "10-15 people",
    highlights: ["Kedarnath Temple", "Chopta", "Tungnath", "Chandrashila"],
    amenities: ["Helicopter Option", "Trekking Gear", "Medical Support", "Puja Arrangements"],
    featured: false,
    discount: 16,
  },
  {
    id: 4,
    title: "Golden Temple & Punjab Heritage",
    location: "Punjab, India",
    duration: "3 Days",
    price: 8999,
    originalPrice: 10999,
    rating: 4.9,
    reviews: 203,
    image: "/home_t4.jpeg",
    category: "Cultural",
    difficulty: "Easy",
    groupSize: "5-8 people",
    highlights: ["Golden Temple", "Jallianwala Bagh", "Wagah Border", "Local Markets"],
    amenities: ["Heritage Hotels", "Cultural Shows", "Local Guide", "Traditional Meals"],
    featured: false,
    discount: 18,
  },
  {
    id: 5,
    title: "Manali Snow Adventure",
    location: "Himachal Pradesh, India",
    duration: "6 Days",
    price: 16999,
    originalPrice: 19999,
    rating: 4.6,
    reviews: 98,
    image: "/manali_bg.jpg",
    category: "Adventure",
    difficulty: "Moderate",
    groupSize: "8-12 people",
    highlights: ["Solang Valley", "Rohtang Pass", "Hadimba Temple", "Snow Activities"],
    amenities: ["Snow Gear", "Adventure Sports", "Bonfire Nights", "Local Cuisine"],
    featured: false,
    discount: 15,
  },
  {
    id: 6,
    title: "Jodhpur Blue City Explorer",
    location: "Rajasthan, India",
    duration: "4 Days",
    price: 11999,
    originalPrice: 14999,
    rating: 4.5,
    reviews: 76,
    image: "/jodhpur_bg.jpg",
    category: "Cultural",
    difficulty: "Easy",
    groupSize: "6-10 people",
    highlights: ["Mehrangarh Fort", "Blue City Walk", "Umaid Bhawan", "Desert Safari"],
    amenities: ["Heritage Hotels", "Camel Safari", "Folk Performances", "Royal Dining"],
    featured: false,
    discount: 20,
  },
]

const categories = ["All", "Adventure", "Nature", "Spiritual", "Cultural"]

const durations = ["All", "1-3 Days", "4-6 Days", "7+ Days"]

export default function TripsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [selectedDuration, setSelectedDuration] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 25000])
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [filteredTrips, setFilteredTrips] = useState(trips)
  const [favorites, setFavorites] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Get search query from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const searchParam = urlParams.get("search")
    if (searchParam) {
      setSearchQuery(searchParam)
    }
  }, [])

  useEffect(() => {
    const filtered = trips.filter((trip) => {
      const matchesSearch =
        trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || trip.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === "All" || trip.difficulty === selectedDifficulty
      const matchesDuration =
        selectedDuration === "All" ||
        (selectedDuration === "1-3 Days" && Number.parseInt(trip.duration) <= 3) ||
        (selectedDuration === "4-6 Days" &&
          Number.parseInt(trip.duration) >= 4 &&
          Number.parseInt(trip.duration) <= 6) ||
        (selectedDuration === "7+ Days" && Number.parseInt(trip.duration) >= 7)
      const matchesPrice = trip.price >= priceRange[0] && trip.price <= priceRange[1]
      const matchesFeatured = !showFeaturedOnly || trip.featured

      return matchesSearch && matchesCategory && matchesDifficulty && matchesDuration && matchesPrice && matchesFeatured
    })

    // Sort trips
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "duration":
          return Number.parseInt(a.duration) - Number.parseInt(b.duration)
        default:
          return b.featured ? 1 : -1
      }
    })

    setFilteredTrips(filtered)
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedDuration, priceRange, showFeaturedOnly, sortBy])

  const toggleFavorite = (tripId: number) => {
    setFavorites((prev) => (prev.includes(tripId) ? prev.filter((id) => id !== tripId) : [...prev, tripId]))
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/https://www.colorpalettestore.com/cdn/shop/products/744D40.png?v=1614624668" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-rrom-amber-900/80 to-orange-900/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Discover Amazing Trips
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-6 text-amber-100 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Explore handpicked destinations and create memories that last a lifetime
          </motion.p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-4 bg-white shadow-lg sticky top-16 z-40 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-5 w-5" />
              <Input
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 border-amber-200 focus:border-amber-500"
              />
            </div>

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            {/* Desktop Filters */}
            <div className={`flex flex-wrap gap-4 items-center ${showFilters ? "block" : "hidden lg:flex"}`}>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 border-2 border-amber-200 focus:border-amber-500">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              

              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger className="w-40 border-2 border-amber-200 focus:border-amber-500">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((duration) => (
                    <SelectItem key={duration} value={duration}>
                      {duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 border-2 border-amber-200 focus:border-amber-500">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Filters */}
          <div
            className={`mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div>
                <label className="text-sm font-medium text-amber-800 mb-2 block">
                  Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={25000}
                  min={0}
                  step={1000}
                  className="w-full"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
  id="featured"
  checked={showFeaturedOnly}
  onCheckedChange={(checked) => setShowFeaturedOnly(checked === true)}
/>
                <label htmlFor="featured" className="text-sm font-medium text-amber-800">
                  Featured trips only
                </label>
              </div>
              <div className="text-sm text-amber-700">
                Showing {filteredTrips.length} of {trips.length} trips
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trips Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredTrips.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-amber-900 mb-2">No trips found</h3>
              <p className="text-amber-700 mb-4">Try adjusting your search criteria</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                  setSelectedDifficulty("All")
                  setSelectedDuration("All")
                  setPriceRange([0, 25000])
                  setShowFeaturedOnly(false)
                }}
                className="bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              >
                Clear Filters
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="overflow-hidden border-2 border-amber-200 shadow-lg hover:shadow-2xl transition-all duration-300 h-full hover:border-amber-400">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={trip.image || "/placeholder.svg"}
                        alt={trip.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-amber-900/60 to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {trip.featured && (
                          <Badge className="bg-amber-600 hover:bg-amber-700 text-white">Featured</Badge>
                        )}
                        {trip.discount > 0 && (
                          <Badge className="bg-red-600 hover:bg-red-700 text-white">{trip.discount}% OFF</Badge>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                          onClick={() => toggleFavorite(trip.id)}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              favorites.includes(trip.id) ? "fill-red-500 text-red-500" : "text-white"
                            }`}
                          />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                        >
                          <Share2 className="h-4 w-4 text-white" />
                        </Button>
                      </div>

                      {/* Bottom Info */}
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{trip.rating}</span>
                          <span className="text-sm text-gray-300">({trip.reviews})</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {trip.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {trip.groupSize}
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6 bg-linear-to-b from-white to-amber-50">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-amber-900 group-hover:text-amber-700 transition-colors">
                          {trip.title}
                        </h3>
                        <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                          {trip.category}
                        </Badge>
                      </div>

                      <div className="flex items-center text-amber-700 mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{trip.location}</span>
                      </div>

                      {/* Highlights */}
                      <div className="mb-4">
                        <p className="text-sm text-amber-700 mb-2">Highlights:</p>
                        <div className="flex flex-wrap gap-1">
                          {trip.highlights.slice(0, 3).map((highlight, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                              {highlight}
                            </Badge>
                          ))}
                          {trip.highlights.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                              +{trip.highlights.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex items-center gap-3 mb-4 text-amber-600">
                        <Wifi className="h-4 w-4" />
                        <Car className="h-4 w-4" />
                        <Camera className="h-4 w-4" />
                        <span className="text-xs">+{trip.amenities.length} amenities</span>
                      </div>

                      {/* Price and CTA */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                          {/*  <span className="text-2xl font-bold text-amber-600">₹{trip.price.toLocaleString()}</span>
                         {trip.originalPrice > trip.price && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{trip.originalPrice.toLocaleString()}
                              </span> 
                            )}  */}
                          </div>
                          <span className="text-md text-amber-600">Coming Soon</span>
                        </div>
                        {/*<Link href={`https://docs.google.com/forms/d/e/1FAIpQLSfuaVHKTPrVyDdzykMZVL6jTPD1xdgiMDmlSRoq2sGi1mcACg/viewform?usp=sharing&ouid=100832964902746238927`}> */}
                          <Button className="bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                            Register
                          </Button>
                      
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
