import Stripe from 'stripe';

function getStripe() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }
  return new Stripe(secret);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const amount = Number(req.body?.amount);
  const currency = String(req.body?.currency || 'usd').toLowerCase();
  const reference = String(req.body?.reference || `SMITH-${Date.now()}`);

  if (!Number.isFinite(amount) || amount < 100) {
    return res.status(400).json({ error: 'Invalid amount. Minimum is 100 (minor units).' });
  }

  try {
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        reference,
        rail: 'stripe'
      }
    });

    return res.status(200).json({
      id: intent.id,
      client_secret: intent.client_secret,
      status: intent.status
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Stripe payment intent failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
