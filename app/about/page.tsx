"use client"
import { motion } from "framer-motion"
import { Users, Target, Heart, Award, Instagram } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"

const teamMembers = [
  {
    name: "Anmoldeep Singh",
    role: "Technical Lead",
    image: "/profilepic1.jpg",
    instagram: "https://www.instagram.com/anmol_.16/?hl=en",
    description: "Building the future of travel technology",
  },
  {
    name: "Himanshu Dhir",
    role: "Founder & CEO",
    image: "/himanshu.jpg",
    instagram: "https://www.instagram.com/himanshu._dhir/?hl=en",
    description: "Creative mind behind our brand and outreach",
  },
  {
    name: "Danish Goswami",
    role: "Technology Lead",
    image: "/danish.jpeg",
    instagram: "https://www.instagram.com/danish.goswami_40613/following/",
    description: "Passionate about creating unforgettable travel experiences",
  },
]

const values = [
  {
    icon: Heart,
    title: "Passion for Travel",
    description: "We believe travel transforms lives and creates lasting memories",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Building connections between travelers and local communities",
  },
  {
    icon: Target,
    title: "Excellence",
    description: "Committed to delivering exceptional experiences every time",
  },
  {
    icon: Award,
    title: "Trust & Safety",
    description: "Your safety and satisfaction are our top priorities",
  },
]

/*const stats = [
  { number: "1000+", label: "Happy Travelers" },
  { number: "50+", label: "Destinations" },
  { number: "100+", label: "Successful Trips" },
  { number: "4.9", label: "Average Rating" },
]*/

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/placeholder.svg?height=600&width=1920" alt="About Hero" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-orange-900/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About Musaffir
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 text-amber-100 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            We are a dedicated team passionate about helping students stay connected with vibrant campus life and
            creating unforgettable travel experiences
          </motion.p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-8">Our Story</h2>
            <div className="prose prose-lg mx-auto text-amber-800">
              <p className="text-lg leading-relaxed mb-6">
                Welcome to Musaffir! We are a dedicated team of three—Anmoldeep Singh, Danish Goswami, and Himanshu
                Dhir—passionate about helping students stay connected with the vibrant campus life. Our website is
                designed to provide students with easy access to information about various events happening in
                universities and colleges.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Whether it&apos;s workshops, seminars, cultural festivals, or sports events, we aim to keep you informed so
                you never miss out on the opportunities that enrich your academic journey. Beyond campus events, we&apos;ve
                expanded our vision to include incredible travel experiences that help you explore the world and create
                lasting memories.
              </p>
              <p className="text-lg leading-relaxed">
                Join us on our social media channels to stay updated and engaged! Let&apos;s explore the world together and
                make every journey unforgettable.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

  {/* Stats Section 
      <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center text-white"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-amber-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* Our Values */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">Our Values</h2>
            <p className="text-xl text-amber-700 max-w-2xl mx-auto">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center p-6 h-full border-2 border-amber-200 hover:border-amber-400 transition-colors bg-gradient-to-b from-white to-amber-50">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-amber-900 mb-3">{value.title}</h3>
                      <p className="text-amber-700">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-amber-50 to-orange-50" id="team">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-amber-700 max-w-2xl mx-auto">The passionate individuals behind Musaffir</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="overflow-hidden border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 bg-gradient-to-b from-white to-amber-50">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Social Links */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a
                        href={member.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    </div>
                  </div>

                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-bold text-amber-900 mb-1">{member.name}</h3>
                    <p className="text-amber-600 font-medium mb-3">{member.role}</p>
                    <p className="text-amber-700 text-sm">{member.description}</p>
                  </CardContent>
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Journey</h2>
            <p className="text-xl mb-8 text-amber-200">
              Ready to explore the world with us? Let&apos;s create unforgettable memories together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-8 py-4 text-lg border-2 border-amber-500"
              >
                Explore Trips
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-amber-900 hover:bg-white hover:text-amber-900 px-8 py-4 text-lg"
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
