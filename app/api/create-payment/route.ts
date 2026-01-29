import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationId, orderId, expectedAmount } = body;

    // Validate inputs
    if (!registrationId || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (expectedAmount !== 1) {
      return NextResponse.json(
        { error: 'Invalid amount. Only ₹1 is accepted.' },
        { status: 400 }
      );
    }

    // Create payment record (no need to check if exists, each registration gets a unique order)
    const { data, error } = await supabase
      .from('payments')
      .insert({
        registration_id: registrationId,
        order_id: orderId,
        expected_amount: 1,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create payment record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentId: data.id,
      orderId,
      message: 'Payment record created successfully',
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
