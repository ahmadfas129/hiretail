import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan, price, locale } = body;

    if (!plan || !price) {
      return NextResponse.json(
        { error: 'Plan and price are required' },
        { status: 400 }
      );
    }

    const userLocale = locale || 'en';

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Seller Plan`,
              description: `Hiretail ${plan} subscription`,
            },
            unit_amount: price * 100, // Convert to cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/${userLocale}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/${userLocale}/pricing?canceled=true`,
      client_reference_id: session.user.id,
      metadata: {
        userId: session.user.id,
        plan: plan,
      },
    });

    // Create subscription record in database
    await prisma.subscription.create({
      data: {
        userId: session.user.id,
        plan: plan,
        stripeSessionId: checkoutSession.id,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
