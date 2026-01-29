'use client'

import { useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { LogOut, CheckCircle, Clock, CreditCard } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { signOut, getUser } from '@/lib/supabase/auth'
import PaymentQRModal from '@/components/payment-qr-modal'
import type { User as SupabaseUser } from "@supabase/supabase-js";


interface AppUser extends SupabaseUser {
  full_name?: string; // optional
}

interface SupabaseRegistrationRow {
  id: string
  full_name: string
  email: string
  registered_by_email: string
  status?: 'pending' | 'confirmed'
  created_at: string
  payments?: Payment[]
}
interface Registration {
  registered_by_email: ReactNode
  event_date: ReactNode

  order_id: string | null
  payment_record: Payment | null

  id: string
  full_name: string
  email: string
  event_name: string
  status: 'pending' | 'confirmed'
  created_at: string
  payment_status: 'pending' | 'verified'
}
interface Payment {
  status?: 'pending' | 'verified' | 'success' | string
  order_id?: string | null
}


export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<AppUser | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<{ orderId: string; registrationId: string } | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [signOutLoading, setSignOutLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    }
    checkMobile()
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getUser()
        if (!currentUser) {
          router.push('/auth')
          return
        }
        setUser(currentUser)

        // Fetch user's registrations
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data, error } = await supabase
          .from('kala_yatra_registrations')
          .select(`
            id, 
            full_name, 
            email,
            registered_by_email, 
            status, 
            created_at,
            payments (
              id,
              order_id,
              status,
              paid_amount
            )
          `)
          .eq('registered_by_email', currentUser.email)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching registrations:', error)
        } else {
          // Transform data with actual payment verification status
          const transformedData: Registration[] =
  (data as SupabaseRegistrationRow[])?.map((reg) => {
    const payment = reg.payments?.[0]
    const hasVerifiedPayment =
      payment?.status === 'verified' || payment?.status === 'success'

    return {
      id: reg.id,
      full_name: reg.full_name,
      email: reg.email,

      event_name: 'Kala Yatra 2.0',
      event_date: '31st March 2026',

      registered_by_email: reg.registered_by_email,
      created_at: reg.created_at,

      payment_status: hasVerifiedPayment ? 'verified' : 'pending',
      status: hasVerifiedPayment ? 'confirmed' : reg.status ?? 'pending',

      order_id: payment?.order_id ?? null,
      payment_record: payment ?? null,
    }
  }) ?? []
          setRegistrations(transformedData)
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleSignOut = async () => {
    setSignOutLoading(true)
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
      setSignOutLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === 'confirmed') {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Confirmed
        </Badge>
      )
    }
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Header />
        <section className="py-16 px-4 pt-28">
          <div className="max-w-4xl mx-auto">
            <p className="text-amber-900 text-center">Loading your dashboard...</p>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-brrom-amber-50 via-orange-50 to-yellow-50">
      <Header />
      <section className="py-16 px-4 pt-28">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* User Info Header */}
            <div className="mb-8 flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-amber-900 mb-2">Registration Dashboard</h1>
                <p className="text-amber-700">
                  Signed in as: <span className="font-semibold">{user?.email}</span>
                </p>
              </div>
              <Button
                onClick={handleSignOut}
                disabled={signOutLoading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {signOutLoading ? 'Signing out...' : 'Sign Out'}
              </Button>
            </div>

            {/* Registrations List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">Your Event Registrations</h2>

              {registrations.length === 0 ? (
                <Card className="border-2 border-amber-200">
                  <CardContent className="pt-8 text-center">
                    <p className="text-amber-700 mb-4">No registrations yet</p>
                    <Button
                      onClick={() => router.push('/kala-yatra')}
                      className="bg-linear-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white"
                    >
                      Register for Kala Yatra 2.0
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                registrations.map((reg, index) => (
                  <motion.div
                    key={reg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-2 border-amber-200 hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-amber-900">{reg.event_name}</CardTitle>
                            <CardDescription className="text-amber-600">
                              {reg.full_name} • {reg.email}
                            </CardDescription>
                            <CardDescription className="text-blue-700 text-xs mt-1">
                              Registered by: {reg.registered_by_email}
                            </CardDescription>
                          </div>
                          {getStatusBadge(reg.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-amber-700">Registered On</p>
                            <p className="font-semibold text-amber-900">
                              {new Date(reg.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-amber-700">Status</p>
                            <p className="font-semibold text-amber-900 capitalize">{reg.status}</p>
                          </div>
                          <div>
                            <p className="text-sm text-amber-700">Payment</p>
                            <p className={`font-semibold ${reg.payment_status === 'verified' ? 'text-green-600' : 'text-orange-600'}`}>
                              {reg.payment_status === 'verified' ? 'Confirmed' : 'Pending'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-amber-700">Event Date</p>
                            <p className="font-semibold text-amber-900">{reg.event_date}</p>
                          </div>
                        </div>

                        {reg.order_id && (
                          <div className="mt-3 text-xs text-amber-700">
                            Order ID: <span className="font-mono font-semibold">{reg.order_id}</span>
                          </div>
                        )}

                        {/* Payment Not Done Status */}
                        {reg.payment_record?.status === 'payment_not_done' && (
                          <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded">
                            <p className="text-sm text-red-800 font-semibold mb-1">
                              Payment Required
                            </p>
                            <p className="text-xs text-red-700 mb-3">
                              Please complete your payment to confirm your registration.
                            </p>
                            <Button
                              onClick={() => {
                                if (!reg.order_id) return
                                if (isMobile) {
                                  // Mobile: Open UPI app directly
                                  const upiId = 'anmoldeepsingh1692k4@okhdfcbank'
                                  const merchantName = 'Kala Yatra 2.0'
                                  const amount = 1
                                  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${reg.order_id}`
                                  window.location.href = upiUrl
                                } else {
                                  // Desktop: Show QR modal
                                  setSelectedPayment({ orderId: reg.order_id, registrationId: reg.id })
                                  setPaymentModalOpen(true)
                                }
                              }}
                              className="w-full bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm"
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              Pay Now ₹1
                            </Button>
                          </div>
                        )}
                        {/* Pending Verification Status */}
                        {reg.status === 'pending' && reg.payment_record?.status === 'pending' && (
                          <div className="mt-4 p-3 bg-amber-100 border border-amber-200 rounded">
                            <p className="text-sm text-amber-800 font-semibold mb-1">
                              Registration Being Confirmed
                            </p>
                            <p className="text-xs text-amber-700">
                              Your payment is being verified. You&aposll receive a confirmation email once approved (usually within 24 hours).
                            </p>
                          </div>
                        )}

                        {reg.status === 'confirmed' && (
                          <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded">
                            <p className="text-sm text-green-800 font-semibold mb-1">
                              Successfully Registered!
                            </p>
                            <p className="text-xs text-green-700">
                              Your registration is confirmed. Check your email for competition details, rules, and submission guidelines.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>

            {/* Back Button */}
            <div className="mt-8">
              <Button
                onClick={() => router.push('/kala-yatra')}
                variant="outline"
                className="border-amber-300 text-amber-900 hover:bg-amber-50"
              >
                Back to Kala Yatra
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />

      {/* Payment QR Modal */}
      {selectedPayment && (
        <PaymentQRModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false)
            setSelectedPayment(null)
          }}
          orderId={selectedPayment.orderId}
          registrationId={selectedPayment.registrationId}
          onPaymentConfirmed={() => {
            // Refresh registrations
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}
