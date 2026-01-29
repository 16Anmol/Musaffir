"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Star, ArrowRight, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const upcomingEvents = [
  {
    id: 1,
    title: "Heritage Walk - Amritsar",
    image: "/card_4.jpg",
    description:
      "Experience the rich cultural heritage of Amritsar through guided heritage walks exploring historical sites and local traditions.",
    link: "https://surveyheart.com/form/64b8ad4b20dd2664e0e290b4?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAb21jcAO4c59leHRuA2FlbQIxMQBzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAaderSS5efHLqywBkHzz3ZwZ69UeyXffCiIDX-ZL944Pqu793oV4ETSi8Yz-pw_aem_aNKRI4ggPmoo_R8KuKIWCg",
  },
  {
    id: 2,
    title: "Kala Yatra 2.0",
    image: "/image.png",
    description: "All India Art Competition - Showcasing artistic talents from across the nation. Details coming soon!",
    link: "/kala-yatra",
    isInternal: true,
  },
]

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    comment: "Absolutely amazing experience! The Kashmir trip was beyond my expectations.",
    image: "/priya.jpg",
  },
  {
    name: "Rahul Gupta",
    location: "Delhi",
    rating: 5,
    comment: "Professional service and incredible destinations. Highly recommended!",
    image: "/rahul.jpg",
  },
  {
    name: "Anjali Patel",
    location: "Bangalore",
    rating: 5,
    comment: "The Kedarnath journey was life-changing. Thank you Musaffir!",
    image: "/anjali.jpg",
  },
]

type EventType = {
  id: number
  title: string
  date: string
  location: string
  image: string
  description: string
  registerLink?: string
  details?: string
  whatsappLink?: string
  isInternal?: boolean
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null)

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/trips?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/home_bg.jpg" alt="Hero Background" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 via-orange-900/70 to-yellow-900/60" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Enhancing Global Tourism
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-8 text-gray-200"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Empowering communities and celebrating cultural heritage across every corner of the world
          </motion.p>

          {/* Enhanced Search Bar */}
          <motion.div
            className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-5 w-5" />
              <Input
                placeholder="Discover heritage sites and cultural initiatives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 h-12 bg-white/90 backdrop-blur-sm border-2 border-amber-200 text-gray-800 focus:border-amber-500"
              />
            </div>
            <Button
              size="lg"
              onClick={handleSearch}
              className="h-12 px-8 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 border-2 border-amber-500"
            >
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Link href="/trips">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 text-lg border-2 border-amber-500"
              >
                <Plane className="mr-2 h-5 w-5" />
                Explore Initiatives
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Upcoming Events */}
      <section className="px-3 py-7 bg-gradient-to-b from-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">Current Happenings and Updates</h2>
            <p className="text-xl text-amber-700 max-w-2xl mx-auto">
              Join exciting cultural events and tourism enhancement initiatives
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="overflow-hidden border-2 border-amber-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-amber-400">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                    </div>
                  </div>

                  <CardContent className="p-6 bg-gradient-to-b from-white to-amber-50">
                    <p className="text-amber-800 mb-4">{event.description}</p>

                    {event.link ? (
                      event.isInternal ? (
                        <Link href={event.link} className="flex-1">
                          <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                            Learn More
                          </Button>
                        </Link>
                      ) : (
                        <a href={event.link} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                            Register Now
                          </Button>
                        </a>
                      )
                    ) : (
                      <Button disabled className="w-full bg-gray-400 text-white font-semibold cursor-not-allowed">
                        Coming Soon
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Modal for View More */}
          {selectedEvent && (
            <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
              <DialogContent className="max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  {/* Right Info */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">{selectedEvent.title}</h2>
                    <p className="whitespace-pre-line">{selectedEvent.details}</p>
                    {selectedEvent.whatsappLink && (
                      <a href={selectedEvent.whatsappLink} target="_blank" rel="noopener noreferrer">
                        <Button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white">
                          Book via WhatsApp
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </section>
      <div className="flex justify-center mb-6">
        <Image src="/home_event_bg.png" alt="Event illustration" width={350} height={350} className="opacity-60" />
      </div>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">Our Mission</h2>
            <p className="text-xl text-amber-700 max-w-3xl mx-auto">
              We are dedicated to enhancing tourism experiences across the globe by preserving cultural heritage,
              supporting local communities, and promoting sustainable tourism practices that benefit both travelers and
              destinations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full border-2 border-amber-200 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-b from-white to-amber-50 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🏛️</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-amber-900 mb-3">Heritage Preservation</h3>
                <p className="text-amber-700">
                  Protecting and showcasing cultural landmarks and historical sites for future generations
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full border-2 border-amber-200 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-b from-white to-amber-50 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🌍</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-amber-900 mb-3">Community Development</h3>
                <p className="text-amber-700">
                  Empowering local communities through sustainable tourism and economic opportunities
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full border-2 border-amber-200 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-b from-white to-amber-50 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🎨</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-amber-900 mb-3">Cultural Promotion</h3>
                <p className="text-amber-700">
                  Celebrating and promoting diverse cultures, arts, and traditions worldwide
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-yellow-50 to-amber-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="lg:w-1/2">
              <Image
                src="/card_2.jpg"
                alt="Cultural heritage"
                width={400}
                height={400}
                className="mx-auto rounded-lg shadow-lg"
              />
            </div>

            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
                Join Our Tourism Enhancement Journey
              </h2>
              <p className="text-xl text-amber-700 mb-8">
                Together, we can make every destination more sustainable, accessible, and culturally enriching for
                travelers worldwide.
              </p>

              <div className="space-y-4">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8"
                  >
                    Get Involved
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">What Our Travelers Say</h2>
            <p className="text-xl text-amber-700">Real experiences from real travelers</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full border-2 border-amber-200 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-b from-white to-amber-50">
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full border-2 border-amber-300"
                    />
                    <div>
                      <h4 className="font-bold text-amber-900">{testimonial.name}</h4>
                      <p className="text-amber-700">{testimonial.location}</p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-amber-800 italic">&quot;{testimonial.comment}&quot;</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-900 via-orange-900 to-yellow-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">Ready to Make a Difference?</h2>
            <p className="text-xl text-amber-700 max-w-3xl mx-auto">
              Join us in our mission to enhance tourism and preserve cultural heritage around the world
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/trips">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-8 py-4 text-lg border-2 border-amber-500"
              >
                <Plane className="mr-2 h-5 w-5" />
                View Initiatives
              </Button>
            </Link>

            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-amber-900 px-8 py-4 text-lg bg-transparent"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
