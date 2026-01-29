"use client"
import { motion } from "framer-motion"
import { useState } from "react"
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/about#team" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
  services: [
    { name: "Trip Planning", href: "/trips" },
    { name: "Group Tours", href: "/trips?category=group" },
    { name: "Custom Packages", href: "/contact" },
    { name: "Travel Insurance", href: "/insurance" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Booking Policy", href: "/policy" },
  ],
  destinations: [
    { name: "Kashmir", href: "/trips?destination=kashmir" },
    { name: "Himachal", href: "/trips?destination=himachal" },
    { name: "Uttarakhand", href: "/trips?destination=uttarakhand" },
    { name: "Rajasthan", href: "/trips?destination=rajasthan" },
  ],
}

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/profile.php?id=61578721408947" },
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/musafir30824/" },
  { name: "Twitter", icon: Twitter, href: "https://x.com/musaffir_" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/" },
]

export default function Footer() {
  const [email, setEmail] = useState('')
const [loading, setLoading] = useState(false)

const handleSubscribe = async () => {
  if (!email) return alert("Please enter an email.")
  setLoading(true)
  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbzsMFkn_0U2xNrHj3CUGdGYKo0-eoy-498GPy4IOm9OaLn5lv56QrjHidEjmF6Gs7XIug/exec", {
      method: "POST",
      body: new URLSearchParams({ email }),
    })

    const result = await res.json()
    if (result.result === "success") {
      alert("Subscribed successfully!")
      setEmail('')
    } else {
      alert("Something went wrong. Try again.")
    }
  } catch (error) {
    console.error("Subscribe error:", error)
    alert("Subscription failed.")
  } finally {
    setLoading(false)
  }
}

  return (
    
    <footer className="bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-amber-700">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-4">Stay Updated with Musaffir</h3>
            <p className="text-amber-200 mb-6">
              Subscribe to our newsletter and get the latest travel deals and destination guides
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
             <Input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Enter your email"
  className="bg-amber-800/50 border-amber-600 text-white placeholder-amber-300 focus:border-amber-400"
/>
<Button
  onClick={handleSubscribe}
  disabled={loading}
  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 whitespace-nowrap border-2 border-amber-500"
>
  {loading ? "Subscribing..." : "Subscribe"}
</Button>

            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <Plane className="h-10 w-10 text-amber-400" />
                <span className="text-2xl font-bold">Musaffir</span>
              </div>
              <p className="text-amber-200 mb-6 leading-relaxed">
                Your trusted travel companion for unforgettable journeys. We create experiences that connect you with
                the world&apos;s most beautiful destinations and help students stay connected with vibrant campus life.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-amber-200">
                  <MapPin className="h-5 w-5 mr-3 text-amber-400" />
                  <span>Amritsar, Punjab, India</span>
                </div>
                <div className="flex items-center text-amber-200">
                  <Phone className="h-5 w-5 mr-3 text-amber-400" />
                  <span>+91 79 7373 2526</span>
                </div>
                <div className="flex items-center text-amber-200">
                  <Mail className="h-5 w-5 mr-3 text-amber-400" />
                  <span>musafir30824@gmail.com</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-4 capitalize text-amber-300">
                {category.replace(/([A-Z])/g, " $1").trim()}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-amber-200 hover:text-amber-400 transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social Links & CTA */}
        <motion.div
          className="mt-12 pt-8 border-t border-amber-700"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-6 md:mb-0">
              <span className="text-amber-200">Follow us:</span>
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-300 hover:text-amber-100 transition-colors"
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                )
              })}
            </div>
            <Link href="/trips">
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 border-2 border-amber-500">
                <Plane className="h-4 w-4 mr-2" />
                Start Your Journey
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Copyright */}
      <div className="border-t border-amber-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-amber-200">
            <p>&copy; 2024 Musaffir.com, Inc. All rights reserved.</p>
            <p>Made with ❤️ for travelers worldwide</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
