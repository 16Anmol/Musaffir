"use client"
import { useState, useEffect } from "react"
import type React from "react"
import KalaYatraPayment from "@/components/kala-yatra-payment"
import PaymentQRModal from "@/components/payment-qr-modal"

import { motion } from "framer-motion"
import { Clock, Calendar, Palette, ChevronRight, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { createBrowserClient } from "@supabase/ssr"
import { getUser } from "@/lib/supabase/auth"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js";

const REGISTRATION_DEADLINE = new Date("2026-03-25T23:59:59")
interface AppUser extends SupabaseUser {
  full_name?: string; // optional
}
interface Payment {
  id: string
  order_id: string | null
  status: 'pending' | 'verified' | 'success' | 'payment_not_done'
  paid_amount?: number
}
interface KalaYatraRegistrationDB {
  id: string
  user_id: string | null
  registered_by_email: string
  full_name: string
  age: number
  dob: string | null
  gender: string | null
  city: string
  state: string
  country: string
  email: string
  phone: string
  referral_code?: string | null
  hear_about_us?: string | null
  receive_updates: boolean
  join_community: boolean
  status: 'pending' | 'confirmed'
  created_at: string
  payments?: Payment[]
}
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = REGISTRATION_DEADLINE.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
      {[
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hours" },
        { value: timeLeft.minutes, label: "Minutes" },
        { value: timeLeft.seconds, label: "Seconds" },
      ].map((item, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="text-center"
        >
          <div className="bg-linear-to-br from-amber-600 to-amber-800 rounded-xl p-4 shadow-lg">
            <span className="text-3xl md:text-4xl font-bold text-white">{String(item.value).padStart(2, "0")}</span>
          </div>
          <p className="font-medium mt-2 text-sm md:text-base text-amber-100">{item.label}</p>
        </motion.div>
      ))}
    </div>
  )
}

// Step Indicator Component
function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex justify-center items-center gap-2 mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
              step < currentStep
                ? "bg-green-500 text-white"
                : step === currentStep
                  ? "bg-amber-700 text-white ring-2 ring-amber-900"
                  : "bg-gray-300 text-gray-600"
            }`}
          >
            {step < currentStep ? "✓" : step}
          </div>
          {step < 4 && (
            <div className={`w-8 h-1 mx-2 ${step < currentStep ? "bg-green-500" : "bg-gray-300"}`} />
          )}
        </div>
      ))}
      <div className="ml-4">
        {currentStep === 1 && <span className="text-amber-900 font-semibold">Enter Details</span>}
        {currentStep === 2 && <span className="text-amber-900 font-semibold">Terms & Conditions</span>}
        {currentStep === 3 && <span className="text-amber-900 font-semibold">Payment</span>}
        {currentStep === 4 && <span className="text-amber-900 font-semibold">Confirmation</span>}
      </div>
    </div>
  )
}

export default function KalaYatraRegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
const [user, setUser] = useState<AppUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [existingRegistration, setExistingRegistration] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    dob: "",
    gender: "",
    city: "",
    state: "",
    country: "India",
    email: "",
    mobile: "",
    referralCode: "",
    howDidYouHear: "",
    receiveUpdates: false,
    joinCommunity: false,
    agreeTerms: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationId, setRegistrationId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [existingRegDetails, setExistingRegDetails] =
  useState<KalaYatraRegistrationDB | null>(null)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    }
    checkMobile()
  }, [])

  // Check authentication and existing registration
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getUser()
        if (!currentUser) {
          router.push("/auth")
          return
        }
        setUser(currentUser)
        setFormData((prev) => ({ ...prev, email: currentUser.email || "" }))

        // Check if user already has a registration
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data } = await supabase
          .from("kala_yatra_registrations")
          .select(`
            *,
            payments (
              id,
              order_id,
              status,
              paid_amount
            )
          `)
          .eq("registered_by_email", currentUser.email)
          .single()

        if (data) {
          setExistingRegistration(true)
          setRegistrationId(data.id)
          setExistingRegDetails(data)
        }
      } catch (error) {
        console.log("[v0] No existing registration found:", error)
      } finally {
        setLoadingAuth(false)
      }
    }

    checkAuth()
  }, [router])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault()

    if (currentStep === 1) {
      // Validate form data before moving to step 2
      if (
        !formData.fullName ||
        !formData.age ||
        !formData.city ||
        !formData.state ||
        !formData.country ||
        !formData.email ||
        !formData.mobile
      ) {
        setErrorMessage("Please fill in all mandatory fields.")
        return
      }
      setErrorMessage("")
      setCurrentStep(2) // Move to Terms & Conditions
    }

    if (currentStep === 2) {
      // Validate terms agreement before payment
      if (!formData.agreeTerms) {
        setErrorMessage("Please agree to the terms and conditions to proceed.")
        return
      }

      // Save registration data to database before moving to payment
      setIsSubmitting(true)
      setErrorMessage("")

      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data, error } = await supabase
          .from("kala_yatra_registrations")
          .insert({
            user_id: user?.id || null,
            registered_by_email: user?.email || null,
            full_name: formData.fullName,
            age: parseInt(formData.age),
            dob: formData.dob || null,
            gender: formData.gender || null,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            email: formData.email,
            phone: formData.mobile,
            referral_code: formData.referralCode || null,
            hear_about_us: formData.howDidYouHear || null,
            receive_updates: formData.receiveUpdates,
            join_community: formData.joinCommunity,
            status: 'pending',
          })
          .select()

        if (error) {
          throw error
        }

        if (data && data.length > 0) {
          const registrationId = data[0].id
          setRegistrationId(registrationId)
          
          // Create payment record immediately
          const orderId = `ART_${Date.now()}_${registrationId.substring(0, 8)}`
          console.log('[v0] Creating payment record with order ID:', orderId)
          
          const { error: paymentError } = await supabase
            .from('payments')
            .insert({
              registration_id: registrationId,
              order_id: orderId,
              expected_amount: 1,
              status: 'pending',
            })
          
          if (paymentError) {
            console.error('[v0] Payment record creation error:', paymentError)
          } else {
            console.log('[v0] Payment record created successfully')
          }
          
          setCurrentStep(3) // Move to Payment step
        }
      } catch (error) {
        console.error("Registration error:", error)
        setErrorMessage("Failed to save registration. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handlePaymentComplete = () => {
    setCurrentStep(4)
  }

  // Loading state
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Header />
        <section className="py-16 px-4 pt-28">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-amber-900 text-lg">Loading registration...</p>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  // Existing registration check - Show registration details
  if (existingRegistration && existingRegDetails) {
    const payment = existingRegDetails.payments?.[0]
    const isConfirmed = payment?.status === 'verified' || payment?.status === 'success'

    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Header />
        <section className="py-16 px-4 pt-28">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Card className="p-8 border-2 border-amber-200 shadow-lg bg-white mb-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-amber-900 mb-2">Your Registration</h1>
                    <p className="text-amber-700">
                      Kala Yatra 2.0 - All India Art Competition
                    </p>
                  </div>
                  {isConfirmed ? (
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold text-sm">
                      Confirmed
                    </div>
                  ) : (
                    <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-semibold text-sm">
                      Being Confirmed
                    </div>
                  )}
                </div>

                {/* Registration Details */}
                <div className="bg-amber-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-amber-900 mb-4">Registration Details:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-amber-700">Full Name</p>
                      <p className="font-semibold text-amber-900">{existingRegDetails.full_name}</p>
                    </div>
                    <div>
                      <p className="text-amber-700">Age</p>
                      <p className="font-semibold text-amber-900">{existingRegDetails.age} years</p>
                    </div>
                    <div>
                      <p className="text-amber-700">Email</p>
                      <p className="font-semibold text-amber-900">{existingRegDetails.email}</p>
                    </div>
                    <div>
                      <p className="text-amber-700">Phone</p>
                      <p className="font-semibold text-amber-900">{existingRegDetails.phone}</p>
                    </div>
                    <div>
                      <p className="text-amber-700">City</p>
                      <p className="font-semibold text-amber-900">{existingRegDetails.city}</p>
                    </div>
                    <div>
                      <p className="text-amber-700">State</p>
                      <p className="font-semibold text-amber-900">{existingRegDetails.state}</p>
                    </div>
                    <div>
                      <p className="text-amber-700">Country</p>
                      <p className="font-semibold text-amber-900">{existingRegDetails.country}</p>
                    </div>
                    <div>
                      <p className="text-amber-700">Registered On</p>
                      <p className="font-semibold text-amber-900">
                        {new Date(existingRegDetails.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {payment?.order_id && (
                      <div className="md:col-span-2">
                        <p className="text-amber-700">Order ID</p>
                        <p className="font-mono font-semibold text-amber-900">{payment.order_id}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Message */}
                {isConfirmed ? (
                  <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-900 font-semibold mb-1">Registration Confirmed!</p>
                    <p className="text-green-700 text-sm">
                      Your registration has been verified and confirmed. You&apos;ll receive all competition details via email and WhatsApp.
                    </p>
                  </div>
                ) : payment?.status === 'payment_not_done' ? (
                  <div className="bg-red-100 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-900 font-semibold mb-1">Payment Required</p>
                    <p className="text-red-700 text-sm mb-3">
                      Please complete your payment to confirm your registration.
                    </p>
                    <Button
                      onClick={() => {
                        if (isMobile) {
                          // Mobile: Open UPI app directly
                          const upiId = 'anmoldeepsingh1692k4@okhdfcbank'
                          const merchantName = 'Kala Yatra 2.0'
                          const amount = 1
                          const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${payment?.order_id}`
                          window.location.href = upiUrl
                        } else {
                          // Desktop: Show QR modal
                          setPaymentModalOpen(true)
                        }
                      }}
                      className="w-full bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay Now ₹1
                    </Button>
                  </div>
                ) : (
                  <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-900 font-semibold mb-1">Registration Being Confirmed</p>
                    <p className="text-blue-700 text-sm">
                      Your payment is being verified. You&apos;ll be notified once confirmed (usually within 24 hours).
                    </p>
                  </div>
                )}

                {/* Important Note */}
                <div className="bg-amber-100 border border-amber-300 rounded-lg p-4 mb-6">
                  <p className="text-amber-900 text-sm">
                    <strong>Note:</strong> Only one registration per Gmail account is allowed. To view your current status, visit your dashboard.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Link href="/kala-yatra/dashboard" className="flex-1">
                    <Button className="w-full bg-linear-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white">
                      View Dashboard
                    </Button>
                  </Link>
                  <Link href="/kala-yatra" className="flex-1">
                    <Button variant="outline" className="w-full border-amber-300 text-amber-900 hover:bg-amber-50 bg-transparent">
                      Back to Kala Yatra
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
        <Footer />

        {/* Payment QR Modal */}
        {payment?.order_id && (
          <PaymentQRModal
            isOpen={paymentModalOpen}
            onClose={() => setPaymentModalOpen(false)}
            orderId={payment.order_id}
            registrationId={existingRegDetails.id}
            onPaymentConfirmed={() => {
              window.location.reload()
            }}
          />
        )}
      </div>
    )
  }

  // Step 1: Details Form
  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Header />

        {/* Hero Section with Countdown */}
        <section className="relative py-20 px-4 pt-28 bg-linear-to-br from-amber-900 via-amber-800 to-orange-900">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <Palette className="h-16 w-16 mx-auto mb-4 text-amber-400" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-amber-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
              Register for Kala Yatra 2.0
            </h1>
            <p className="text-xl text-amber-100 mb-8">Join the nationwide art movement for social change</p>

            {/* Important Dates */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-6 py-3">
                <Calendar className="h-5 w-5 text-amber-400" />
                <span>
                  Registration Deadline: <strong>25th March 2026</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-6 py-3">
                <Clock className="h-5 w-5 text-orange-400" />
                <span>
                  Competition Date: <strong>31st March 2026</strong>
                </span>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="mb-6">
              <p className="text-lg text-amber-200 mb-4">Time left to register:</p>
              <CountdownTimer />
            </div>
          </motion.div>
        </section>

        {/* Registration Form */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              {/* Step Indicator */}
              <StepIndicator currentStep={currentStep} />

              <Card className="p-8 border-2 border-amber-200 shadow-xl bg-white">
                <form onSubmit={handleNextStep} className="space-y-8">
                  {/* Error Message */}
                  {errorMessage && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{errorMessage}</div>
                  )}

                  {/* Section 1: Basic Information */}
                  <div>
                    <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 bg-linear-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center text-white text-sm">
                        1
                      </span>
                      Basic Participant Information
                      <span className="text-red-500 text-sm">(Mandatory)</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <Label htmlFor="fullName" className="text-amber-800">
                          Full Name *
                        </Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          className="mt-1 border-amber-200 focus:border-amber-500"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="age" className="text-amber-800">
                          Age *
                        </Label>
                        <Input
                          id="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) => handleInputChange("age", e.target.value)}
                          className="mt-1 border-amber-200 focus:border-amber-500"
                          placeholder="Your age"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dob" className="text-amber-800">
                          Date of Birth (Optional)
                        </Label>
                        <Input
                          id="dob"
                          type="date"
                          value={formData.dob}
                          onChange={(e) => handleInputChange("dob", e.target.value)}
                          className="mt-1 border-amber-200 focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender" className="text-amber-800">
                          Gender (Optional)
                        </Label>
                        <Select onValueChange={(value: string | boolean) => handleInputChange("gender", value)}>
                          <SelectTrigger className="mt-1 border-amber-200">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="city" className="text-amber-800">
                          City *
                        </Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          className="mt-1 border-amber-200 focus:border-amber-500"
                          placeholder="Your city"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-amber-800">
                          State *
                        </Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                          className="mt-1 border-amber-200 focus:border-amber-500"
                          placeholder="Your state"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country" className="text-amber-800">
                          Country *
                        </Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) => handleInputChange("country", e.target.value)}
                          className="mt-1 border-amber-200 focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Contact Details */}
                  <div>
                    <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 bg-linear-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center text-white text-sm">
                        2
                      </span>
                      Contact Details
                      <span className="text-red-500 text-sm">(Mandatory)</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="email" className="text-amber-800">
                          Email ID * (for certificates & updates)
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="mt-1 border-amber-200 focus:border-amber-500"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="mobile" className="text-amber-800">
                          Mobile Number * (WhatsApp preferred)
                        </Label>
                        <Input
                          id="mobile"
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) => handleInputChange("mobile", e.target.value)}
                          className="mt-1 border-amber-200 focus:border-amber-500"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Referral Code */}
                  <div>
                    <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 bg-linear-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center text-white text-sm">
                        3
                      </span>
                      Referral Code
                      <span className="text-gray-500 text-sm">(Optional)</span>
                    </h2>
                    <div>
                      <Label htmlFor="referralCode" className="text-amber-800">
                        Referral Code
                      </Label>
                      <Input
                        id="referralCode"
                        value={formData.referralCode}
                        onChange={(e) => handleInputChange("referralCode", e.target.value)}
                        className="mt-1 border-amber-200 focus:border-amber-500"
                        placeholder="Enter referral code if you have one"
                      />
                      <p className="text-xs text-amber-600 mt-2">
                        If someone referred you to this competition, enter their referral code here.
                      </p>
                    </div>
                  </div>

                  {/* Section 4: Optional Questions */}
                  <div>
                    <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 bg-linear-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white text-sm">
                        4
                      </span>
                      Additional Information
                      <span className="text-gray-500 text-sm">(Optional)</span>
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="howDidYouHear" className="text-amber-800">
                          How did you hear about us?
                        </Label>
                        <Select onValueChange={(value: string | boolean) => handleInputChange("howDidYouHear", value)}>
                          <SelectTrigger className="mt-1 border-amber-200">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="school">School</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="friend">Friend</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="receiveUpdates"
                          checked={formData.receiveUpdates}
                          onCheckedChange={(checked: boolean) => handleInputChange("receiveUpdates", checked as boolean)}
                          className="border-amber-400 data-[state=checked]:bg-amber-700"
                        />
                        <Label htmlFor="receiveUpdates" className="text-amber-800 cursor-pointer">
                          Would you like to receive updates about future competitions?
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="joinCommunity"
                          checked={formData.joinCommunity}
                          onCheckedChange={(checked: boolean) => handleInputChange("joinCommunity", checked as boolean)}
                          className="border-amber-400 data-[state=checked]:bg-amber-700"
                        />
                        <Label htmlFor="joinCommunity" className="text-amber-800 cursor-pointer">
                          Would you like to join our artist community?
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-linear-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white py-6 text-lg font-semibold"
                    >
                      {isSubmitting ? "Processing..." : "Continue to Next Step"}
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    )
  }

  // Step 2: Terms & Conditions
  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Header />
        <section className="py-16 px-4 pt-28">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              {/* Step Indicator */}
              <StepIndicator currentStep={2} />

              <Card className="p-8 border-2 border-amber-200 shadow-lg bg-white">
                <h2 className="text-3xl font-bold text-amber-900 mb-8">Terms & Conditions</h2>
                
                <div className="max-h-96 overflow-y-auto bg-amber-50 p-6 rounded-lg mb-8 space-y-4 text-amber-900 text-sm">
                  <h3 className="font-bold text-lg">Kala Yatra 2.0 - All India Art Competition</h3>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Registration & Participation:</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>This competition is open to artists of all ages and skill levels across India.</li>
                      <li>By registering, you confirm that all information provided is accurate and truthful.</li>
                      <li>Registration is non-refundable.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Competition Rules:</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li><strong>Topic Announcement:</strong> The art competition topic will be announced on the competition day (31st March 2026). Participants will have limited time to create their artwork based on the announced theme.</li>
                      <li>All submissions must be original work created during the competition timeframe.</li>
                      <li>Artwork must be created following the rules and guidelines provided on competition day.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Professional Judging:</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Results will be declared by professional judges with extensive experience in evaluating art.</li>
                      <li>Judging decisions are final and binding.</li>
                      <li>Winners will be announced on stage at the conclusion of the competition.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-red-700">Conduct & Behavior:</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li><strong className="text-red-700">IMPORTANT:</strong> No participant shall create any chaos, dispute, or disturbance after the result declaration. Any such behavior will lead to:</li>
                      <li className="ml-4">Immediate disqualification</li>
                      <li className="ml-4">Being barred from future competitions organized by us</li>
                      <li className="ml-4">Possible legal action if applicable</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Rights & Publicity:</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>By registering, you grant us the right to use your artwork and photos from the event for promotional purposes.</li>
                      <li>Winning artworks may be displayed in exhibitions or published in media.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Liability Disclaimer:</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>We are not responsible for any loss, damage, or theft of artwork during the event.</li>
                      <li>Participants compete at their own risk.</li>
                    </ul>
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleNextStep} className="space-y-6">
                  <div className="flex items-start space-x-3 bg-amber-100 p-4 rounded-lg">
                    <Checkbox
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked: boolean) => handleInputChange("agreeTerms", checked as boolean)}
                      className="border-amber-400 data-[state=checked]:bg-amber-700 mt-1"
                    />
                    <Label htmlFor="agreeTerms" className="text-amber-800 cursor-pointer font-semibold">
                      I have read and agree to all the terms and conditions mentioned above. I understand that any misconduct after result declaration will result in disqualification and being barred from future events.
                    </Label>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                      className="flex-1 border-amber-300 text-amber-900 hover:bg-amber-50"
                    >
                      Back to Details
                    </Button>
                    <Button
                      type="submit"
                      disabled={!formData.agreeTerms || isSubmitting}
                      className="flex-1 bg-linear-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white py-6 text-lg font-semibold"
                    >
                      {isSubmitting ? "Processing..." : "Proceed to Payment"}
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  // Step 3: Payment
  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Header />
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              {/* Step Indicator */}
              <StepIndicator currentStep={3} />

              <KalaYatraPayment 
                registrationId={registrationId!} 
                onPaymentComplete={handlePaymentComplete}
              />
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  // Step 4: Confirmation
  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Header />
        <section className="py-16 px-4 pt-28">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <StepIndicator currentStep={4} />

              <Card className="p-12 border-2 border-blue-200 shadow-xl bg-white">
                <Clock className="h-24 w-24 text-blue-500 mx-auto mb-6 animate-spin" />
                <h1 className="text-4xl font-bold text-amber-900 mb-4">Registration Submitted</h1>
                <p className="text-xl text-amber-700 mb-8">
                  Your registration is being processed and will be confirmed soon.
                </p>

                <div className="bg-blue-50 p-6 rounded-lg mb-8 space-y-3 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mt-1 text-sm">✓</div>
                    <div className="text-left">
                      <p className="font-semibold text-amber-900">Payment Verified:</p>
                      <p className="text-amber-700">₹1 payment received</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mt-1 text-sm">✓</div>
                    <div className="text-left">
                      <p className="font-semibold text-amber-900">Registered with:</p>
                      <p className="text-amber-700">{formData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mt-1 text-sm">✓</div>
                    <div className="text-left">
                      <p className="font-semibold text-amber-900">Details:</p>
                      <p className="text-amber-700">{formData.fullName} • {formData.city}, {formData.state}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-100 border border-amber-300 p-4 rounded-lg mb-8">
                  <p className="text-amber-900 font-semibold mb-2">What happens next?</p>
                  <ul className="text-amber-800 text-sm space-y-2">
                    <li>✓ Your registration details are being saved</li>
                    <li>✓ Registration will be confirmed within 24 hours</li>
                    <li>✓ Confirmation email will be sent to <strong>{formData.email}</strong></li>
                    <li>✓ Competition details will be shared via email and WhatsApp</li>
                  </ul>
                </div>

                <p className="text-amber-700 mb-8 text-sm">
                  You can check your registration status anytime from your dashboard using the same Google account.
                </p>

                <div className="flex gap-4">
                  <Link href="/kala-yatra/dashboard" className="flex-1">
                    <Button className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 text-lg">
                      View My Dashboard
                    </Button>
                  </Link>
                  <Link href="/kala-yatra" className="flex-1">
                    <Button variant="outline" className="w-full border-amber-300 text-amber-900 hover:bg-amber-50 px-8 py-6 text-lg bg-transparent">
                      Back to Kala Yatra
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  return null
}
