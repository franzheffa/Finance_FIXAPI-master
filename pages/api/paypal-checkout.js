import Stripe from 'stripe';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

function isPaypalUnavailableError(error) {
  const msg = String(error?.message || '').toLowerCase();
  return msg.includes('paypal') || msg.includes('payment_method_types');
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
    try {
      const paypalSession = await stripe.checkout.sessions.create({
        payment_method_types: ['paypal', 'card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: 'Recharge Ui - PayPal' },
              unit_amount: amount
            },
            quantity: 1
          }
        ],
        mode: 'payment',
        success_url: `${origin}/?success=true&source=paypal`,
        cancel_url: `${origin}/?canceled=true&source=paypal`,
        metadata: {
          rail: 'paypal'
        }
      });
      return res.status(200).json({
        url: paypalSession.url,
        mode: 'paypal_via_stripe'
      });
    } catch (err) {
      if (!isPaypalUnavailableError(err)) throw err;
      const fallbackSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: 'Recharge Ui - PayPal Fallback' },
              unit_amount: amount
            },
            quantity: 1
          }
        ],
        mode: 'payment',
        success_url: `${origin}/?success=true&source=paypal-fallback`,
        cancel_url: `${origin}/?canceled=true&source=paypal-fallback`,
        metadata: {
          rail: 'paypal_fallback'
        }
      });
      return res.status(200).json({
        url: fallbackSession.url,
        mode: 'card_fallback',
        warning: 'PayPal not yet enabled in Stripe account. Fallback to card checkout.'
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: 'PayPal checkout session failed',
      message: err?.message || undefined,
      details: process.env.NODE_ENV === 'development' ? err?.message : undefined
    });
  }
}
