import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card } from 'antd';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Payment Details
          </h1>
          <Elements stripe={stripePromise}>
            {/* Payment form will go here */}
            <div className="space-y-6">
              <p className="text-gray-600 text-center">
                Payment functionality coming soon...
              </p>
            </div>
          </Elements>
        </Card>
      </div>
    </div>
  );
};

export default Payment;