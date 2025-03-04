import { loadStripe } from '@stripe/stripe-js';
import conf from './main';
export const stripePromise = loadStripe(conf.apiUrlPrefix);

export const createCheckoutSession = async (items) => {
  try {
    const response = await fetch(`${conf.apiUrlPrefix}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items,
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};