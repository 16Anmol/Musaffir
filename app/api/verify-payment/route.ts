import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const EXPECTED_AMOUNT = 100;
const ADMIN_SECRET = process.env.PAYMENT_ADMIN_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationId,  paidAmount, adminSecret } = body;

    // Validate admin authentication for manual verification
    if (adminSecret && adminSecret !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized admin access' },
        { status: 403 }
      );
    }

    // Get payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('registration_id', registrationId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { verified: false, message: 'No pending payment found for this registration' },
        { status: 200 }
      );
    }

    // If payment is already verified, return success
    if (payment.status === 'verified') {
      return NextResponse.json({
        verified: true,
        message: 'Payment already verified!',
      });
    }

    // If payment is rejected, return failure
    if (payment.status === 'rejected') {
      return NextResponse.json({
        verified: false,
        message: 'This payment has been rejected. Please try again with ₹100.',
      });
    }

    // Manual verification (admin endpoint)
    if (adminSecret) {
      if (!paidAmount) {
        return NextResponse.json(
          { error: 'Admin must provide paidAmount for verification' },
          { status: 400 }
        );
      }

      // STRICT ₹100 VERIFICATION
      if (paidAmount !== EXPECTED_AMOUNT) {
        // Reject if amount doesn't match exactly
        const { error: updateError } = await supabase
          .from('payments')
          .update({
            status: 'rejected',
            paid_amount: paidAmount,
            updated_at: new Date().toISOString(),
          })
          .eq('id', payment.id);

        if (updateError) {
          console.error('Update error:', updateError);
        }

        return NextResponse.json({
          verified: false,
          message: `❌ Payment rejected. Amount ₹${paidAmount} is invalid. Only ₹${EXPECTED_AMOUNT} is accepted.`,
        });
      }

      // Amount is correct - verify the payment
      const { error: verifyError } = await supabase
        .from('payments')
        .update({
          status: 'verified',
          paid_amount: EXPECTED_AMOUNT,
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.id);

      if (verifyError) {
        console.error('Verification error:', verifyError);
        return NextResponse.json(
          { error: 'Failed to verify payment' },
          { status: 500 }
        );
      }

      // Update registration status to paid
      await supabase
        .from('kala_yatra_registrations')
        .update({ payment_status: 'verified' })
        .eq('id', registrationId);

      return NextResponse.json({
        verified: true,
        message: `✅ Payment verified! Amount ₹${EXPECTED_AMOUNT} confirmed.`,
      });
    }

    // User-initiated verification (check pending status)
    return NextResponse.json({
      verified: false,
      message:
        'Payment is pending verification. Our team will verify it shortly. Check back in a few moments.',
      status: payment.status,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
