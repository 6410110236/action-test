import React, { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { Button, message, Spin } from 'antd';
import { createCheckoutSession } from '../../../api/stripe';

const PaymentButton = ({ carId, price }) => {
  const stripe = useStripe();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const session = await createCheckoutSession(carId);
      
      if (session.error) {
        throw new Error(session.error);
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      message.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="primary"
      size="large"
      onClick={handlePayment}
      disabled={loading}
      className="w-full"
    >
      {loading ? <Spin /> : `Pay ฿${price.toLocaleString()}`}
    </Button>
  );
};

export default PaymentButton;