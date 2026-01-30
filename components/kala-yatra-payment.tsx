'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Clock, Copy } from 'lucide-react';
import QRCode from 'qrcode';
import { createBrowserClient } from '@supabase/ssr';

interface KalaYatraPaymentProps {
  registrationId: string;
  onPaymentComplete: () => void;
}

export default function KalaYatraPayment({ registrationId, onPaymentComplete }: KalaYatraPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'verifying' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');


  const EXPECTED_AMOUNT = 1;
  const UPI_ID = 'anmoldeepsingh1692k4@okhdfcbank';
  const MERCHANT_NAME = 'Kala Yatra 2.0';

  // Fetch existing payment record and generate QR code
  useEffect(() => {
    const fetchPaymentAndGenerateQR = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Fetch existing payment record
        const { data: paymentData, error: fetchError } = await supabase
          .from('payments')
          .select('order_id, status')
          .eq('registration_id', registrationId)
          .single();

        if (fetchError || !paymentData) {
          console.error('[v0] Error fetching payment:', fetchError);
          setPaymentStatus('error');
          setMessage('Failed to load payment information');
          return;
        }

        const existingOrderId = paymentData.order_id;
        setOrderId(existingOrderId);
        console.log('[v0] Using existing order ID:', existingOrderId);

        // Create UPI deep link with existing order ID
        const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${EXPECTED_AMOUNT}&cu=INR&tn=${existingOrderId}`;

        // Generate QR code
        const qrDataUrl = await QRCode.toDataURL(upiUrl);
        setQrCode(qrDataUrl);

        setPaymentStatus('pending');
        setMessage('Scan QR code to pay ₹1 via UPI. Your payment will be verified manually by our team.');
      } catch (error) {
        console.error('[v0] QR generation error:', error);
        setPaymentStatus('error');
        setMessage('Failed to generate payment QR code');
      }
    };

    fetchPaymentAndGenerateQR();
  }, [registrationId]);

  // Listen for payment status updates via Supabase Realtime
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const channel = supabase
      .channel(`payment-status-${registrationId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'payments',
          filter: `registration_id=eq.${registrationId}`,
        },
        (payload: { new: { status: string; }; }) => {
          console.log('[v0] Payment status update received:', payload.new);
          if (payload.new.status === 'verified') {
            setPaymentStatus('success');
            setMessage('✅ Payment verified successfully! Registration complete.');
            setTimeout(() => {
              onPaymentComplete();
            }, 2000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [registrationId, onPaymentComplete]);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayNow = async () => {
    setLoading(true);
    try {
      // Generate UPI URL with order ID
      const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${EXPECTED_AMOUNT}&cu=INR&tn=${orderId}`;

      console.log('[v0] Opening UPI app with URL:', upiUrl);
      console.log('[v0] Order ID:', orderId);

      setPaymentStatus('pending');
      setMessage('Please complete the payment. Your payment will be verified manually by our team within 24 hours.');

      // Redirect to UPI app in a new window (mobile will open UPI apps automatically)
      const upiWindow = window.open(upiUrl, '_blank');
      if (!upiWindow) {
        // If popup blocked, show message
        setMessage('Could not open UPI app. Please scan the QR code above to pay.');
      }
      
      setLoading(false);
    } catch (error) {
      setPaymentStatus('error');
      setMessage(error instanceof Error ? error.message : 'Payment initiation failed');
      setLoading(false);
    }
  };

  return (
    <div className="text-center max-w-lg mx-auto">
      <Card className="border-2 border-amber-200 bg-white shadow-lg">
        <CardHeader className="bg-linear-to-r from-amber-700 to-orange-700 text-white rounded-t-lg">
          <CardTitle className="text-2xl">Complete Your Payment</CardTitle>
          <CardDescription className="text-amber-100">
            Secure payment for Kala Yatra 2.0 Competition
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Payment Amount */}
          <div className="rounded-lg bg-white p-4 border border-amber-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-amber-900 font-medium">Registration Fee</span>
              <span className="text-2xl font-bold text-amber-900">₹{EXPECTED_AMOUNT}</span>
            </div>
            <p className="text-sm text-amber-700 mb-3">
              Only ₹{EXPECTED_AMOUNT} payment required. Transaction amount must match exactly.
            </p>
            {orderId && (
              <div className="bg-amber-50 p-2 rounded text-xs">
                <p className="text-amber-700">Order ID:</p>
                <p className="font-mono font-semibold text-amber-900">{orderId}</p>
              </div>
            )}
          </div>

          {/* Manual Verification Notice */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">Important:</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Make payment of ₹{EXPECTED_AMOUNT} using the QR code or UPI ID below</li>
              <li>• Your payment will be verified manually by our team</li>
              <li>• Verification usually takes up to 24 hours</li>
              <li>• Once verified, your registration status will be updated</li>
              <li>• You can check status anytime in your dashboard</li>
            </ul>
          </div>

          {/* QR Code Section */}
          {qrCode && (
            <div className="rounded-lg bg-linear-to-br from-amber-50 to-orange-50 p-6 border-2 border-amber-300">
              <p className="text-sm font-semibold text-amber-900 mb-4 text-center">Scan to Pay</p>
              <div className="relative w-56 h-56">
  <Image
    src={qrCode ?? "/placeholder.svg"}
    alt="Scan to Pay"
    fill
    className="object-contain border-4 border-white rounded-lg shadow-lg"
    priority
  />
</div>
              <p className="text-center text-xs text-amber-700">
                Use any UPI app (Google Pay, PhonePe, etc.)
              </p>
            </div>
          )}

          {/* Status Messages */}
          {paymentStatus === 'error' && (
            <div className="flex gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-sm text-red-700">{message}</p>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="flex gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          {(paymentStatus === 'pending' || paymentStatus === 'verifying') && (
            <div className="flex gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Clock className="w-5 h-5 text-blue-600 shrink-0 animate-spin" />
              <p className="text-sm text-blue-700">{message}</p>
            </div>
          )}

          {/* UPI ID for Manual Entry - Desktop Only */}
          <div className="hidden md:block rounded-lg bg-amber-100 p-4 space-y-3">
            <p className="text-sm font-semibold text-amber-900">Pay Using UPI ID:</p>
            <div className="flex items-center justify-between bg-white p-3 rounded border border-amber-200">
              <div>
                <p className="text-xs text-amber-700">UPI ID</p>
                <p className="font-mono font-bold text-amber-900">{UPI_ID}</p>
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={handleCopyUPI}
                className="text-amber-600 hover:bg-amber-200"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            {copied && <p className="text-xs text-green-600 text-center">✓ UPI ID copied!</p>}
          </div>

          {/* Mobile-Only Instructions */}
          <div className="md:hidden rounded-lg bg-blue-100 p-4 border border-blue-200">
            <p className="text-sm font-semibold text-blue-900 mb-2">On Mobile?</p>
            <p className="text-xs text-blue-800">Click the button below to open your UPI app (Google Pay, PhonePe, etc.) and complete the ₹1 payment</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            {/* Mobile: Pay Button */}
            <Button
              onClick={handlePayNow}
              disabled={loading || !qrCode}
              className="md:hidden w-full bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-6 text-lg font-semibold"
            >
              {loading ? 'Opening UPI App...' : 'Click Here to Pay ₹1'}
            </Button>

            {/* Desktop: Next Button */}
            <Button
              onClick={() => {
                setPaymentStatus('success');
                setMessage('✅ Payment processed! Proceeding to confirmation...');
                setTimeout(() => {
                  onPaymentComplete();
                }, 2000);
              }}
              disabled={loading}
              className="hidden md:block w-full bg-linear-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white py-6 text-lg font-semibold"
            >
              Next
            </Button>

            {paymentStatus === 'verifying' && (
              <p className="text-xs text-center text-amber-600">
                Opening your UPI app... Please complete the payment.
              </p>
            )}

            {paymentStatus === 'success' && (
              <p className="text-xs text-center text-green-600 animate-pulse">
                Saving your registration details...
              </p>
            )}
          </div>

          {/* Payment Disclaimer */}
          <p className="text-xs text-amber-700 text-center pt-2">
            ✅ Payment is secure. Your details will be saved after payment completion.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
