"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Image from "next/image";
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Copy} from 'lucide-react'
import QRCode from 'qrcode'
import { createBrowserClient } from '@supabase/ssr'

interface PaymentQRModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  registrationId: string
  onPaymentConfirmed: () => void
}

const UPI_ID = 'anmoldeepsingh1692k4@okhdfcbank'
const MERCHANT_NAME = 'Kala Yatra 2.0'
const AMOUNT = 1

export default function PaymentQRModal({
  isOpen,
  onClose,
  orderId,

  onPaymentConfirmed,
}: PaymentQRModalProps) {
  const [qrCode, setQrCode] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [hasPaid, setHasPaid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const generateQR = async () => {
      try {
        const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${AMOUNT}&cu=INR&tn=${orderId}`
        const qrDataUrl = await QRCode.toDataURL(upiUrl, { width: 300 })
        setQrCode(qrDataUrl)
      } catch (error) {
        console.error('[v0] QR generation error:', error)
      }
    }

    if (isOpen) {
      generateQR()
    }
  }, [isOpen, orderId])

  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('[v0] Copy failed:', error)
    }
  }

  const handleConfirmPayment = async () => {
    if (!hasPaid) return

    setIsSubmitting(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // Update payment status back to pending for verification
      const { error } = await supabase
        .from('payments')
        .update({ status: 'pending' })
        .eq('order_id', orderId)

      if (error) {
        console.error('[v0] Payment update error:', error)
      } else {
        console.log('[v0] Payment status updated to pending for verification')
        onPaymentConfirmed()
        onClose()
      }
    } catch (error) {
      console.error('[v0] Payment confirmation error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-900">Complete Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-lg border-2 border-amber-200">
            <p className="text-center text-sm text-amber-800 mb-3 font-semibold">
              Scan QR Code to Pay ₹{AMOUNT}
            </p>
            {qrCode && (
              <div className="flex justify-center">
  <div className="relative w-64 h-64">
    <Image
      src={qrCode ?? "/placeholder.svg"}
      alt="Payment QR Code"
      fill
      className="object-contain"
      priority
    />
  </div>
</div>
            )}
          </div>

          {/* UPI ID */}
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-700 mb-2">Or pay using UPI ID:</p>
            <div className="flex items-center justify-between bg-white p-3 rounded border border-amber-300">
              <div>
                <p className="font-mono font-semibold text-amber-900">{UPI_ID}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyUPI}
                className="text-amber-600 hover:bg-amber-100"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            {copied && <p className="text-xs text-green-600 text-center mt-2">✓ UPI ID copied!</p>}
          </div>

          {/* Order ID */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700">Order ID:</p>
            <p className="font-mono font-semibold text-blue-900 text-sm">{orderId}</p>
          </div>

          {/* Payment Confirmation */}
          <div className="bg-amber-100 border border-amber-300 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="payment-confirm"
                checked={hasPaid}
                onCheckedChange={(checked) => setHasPaid(checked as boolean)}
              />
              <label
                htmlFor="payment-confirm"
                className="text-sm text-amber-900 cursor-pointer leading-tight"
              >
                I have paid the desired amount of ₹{AMOUNT}
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleConfirmPayment}
            disabled={!hasPaid || isSubmitting}
            className="w-full bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-6"
          >
            {isSubmitting ? 'Submitting...' : 'Confirm Payment'}
          </Button>

          <p className="text-xs text-amber-700 text-center">
            Your payment will be verified within 24 hours and you&apos;ll receive a confirmation email.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
