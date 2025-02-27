import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, Button, message, Tabs, QRCode } from 'antd';
import { CreditCardOutlined, QrcodeOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const cardStyle = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const ThaiQRPayment = ({ amount }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleQRPayment = async () => {
    setLoading(true);
    try {
      // Simulate QR payment verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('Payment successful!');
      navigate('/payment/success');
    } catch (error) {
      message.error('Payment verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <QRCode 
          value={`https://payment.thailandqr.com/amount=${amount}`}
          size={256}
          className="mb-4"
        />
        <div className="text-lg font-semibold text-gray-700">
          Down Payment Amount: {amount} THB
        </div>
        <div className="text-sm text-gray-500 text-center">
          Scan with any mobile banking app to pay
        </div>
      </div>
      <Button
        type="primary"
        onClick={handleQRPayment}
        loading={loading}
        className="w-full h-12 text-lg"
      >
        Verify Payment
      </Button>
    </div>
  );
};

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        message.error(error.message);
        return;
      }
      message.success('Payment successful!');
      navigate('/payment/success');
    } catch (err) {
      message.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-md bg-white">
        <CardElement options={cardStyle} />
      </div>
      <div className="text-lg font-semibold text-gray-700 text-center">
        Down Payment Amount: {amount} THB
      </div>
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        disabled={!stripe}
        className="w-full h-12 text-lg"
      >
        Pay Now
      </Button>
    </form>
  );
};

const Payment = () => {
  const location = useLocation();
  const carDetails = location.state;
  const [activeTab, setActiveTab] = useState('1');

  if (!carDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">No payment details found</p>
      </div>
    );
  }

  const tabItems = [
    {
      key: '1',
      label: (
        <span className="flex items-center">
          <CreditCardOutlined className="mr-2" />
          Credit Card
        </span>
      ),
      children: (
        <Elements stripe={stripePromise}>
          <CheckoutForm amount={carDetails.downPayment} />
        </Elements>
      ),
    },
    {
      key: '2',
      label: (
        <span className="flex items-center">
          <QrcodeOutlined className="mr-2" />
          Thai QR Payment
        </span>
      ),
      children: <ThaiQRPayment amount={carDetails.downPayment} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Payment Details
          </h1>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Car Details</h2>
            <div className="space-y-2 text-gray-600">
              <p>Model: {carDetails.modelName}</p>
              <p>Total Price: {carDetails.price} THB</p>
              <p>Down Payment: {carDetails.downPayment} THB</p>
              <p>Monthly Payment: {carDetails.monthlyPayment} THB</p>
            </div>
          </div>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={tabItems}
            className="mb-8"
          />
        </Card>
      </div>
    </div>
  );
};

export default Payment;