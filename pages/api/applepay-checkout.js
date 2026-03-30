import Stripe from 'stripe';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const amountRaw = req.body?.amount;
  const amount = Number.isFinite(Number(amountRaw)) ? Number(amountRaw) : 5000;
  if (amount < 100 || amount > 100000000) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const origin = req.headers.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Recharge Ui - Apple Pay' },
            unit_amount: amount
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${origin}/?success=true&source=applepay`,
      cancel_url: `${origin}/?canceled=true&source=applepay`,
      metadata: {
        rail: 'apple_pay'
      }
    });

    return res.status(200).json({
      url: session.url,
      note: 'Apple Pay appears in Stripe Checkout when wallet/domain requirements are met.'
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Apple Pay checkout session failed',
      message: err?.message || undefined,
      details: process.env.NODE_ENV === 'development' ? err?.message : undefined
    });
  }
}
