import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Card, Button, message, Tabs, Spin } from 'antd';
import { CreditCardOutlined, QrcodeOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react'; // Update import

// Initialize Stripe with test publishable key
const stripePromise = loadStripe('pk_test_51QwipMFz2GA96RWuC7iLXVAtSICJBSdaKsHbx3Go3xtr2ZkCZjsk0ChA3UkjBTRbYvGmXP3FtsQlTrd4uivfAycC00zDf4dolp');

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

// Update ThaiQRPayment component
const ThaiQRPayment = ({ amount, carDetails }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        // Clean amount by removing commas and currency symbols
        const cleanAmount = typeof amount === 'string' 
          ? parseFloat(amount.replace(/[^0-9.-]+/g, ''))
          : parseFloat(amount);

        // Convert to satang (smallest Thai currency unit)
        const amountInSatang = Math.round(cleanAmount * 100);

        // Validate amount
        if (isNaN(amountInSatang) || amountInSatang <= 0) {
          console.error('Invalid amount:', { amount, cleanAmount, amountInSatang });
          throw new Error('Invalid payment amount');
        }

        const formData = new URLSearchParams();
        formData.append('amount', amountInSatang.toString());
        formData.append('currency', 'thb');
        formData.append('payment_method_types[]', 'promptpay');
        formData.append('metadata[carModel]', carDetails?.modelName || '');
        formData.append('metadata[carBrand]', carDetails?.brandName || '');
        formData.append('metadata[originalAmount]', cleanAmount.toString());

        const response = await axios.post(
          'https://api.stripe.com/v1/payment_intents',
          formData.toString(),
          {
            headers: {
              'Authorization': `Bearer ${process.env.REACT_APP_STRIPE_SECRET_KEY}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );

        if (response.data && response.data.id) {
          setPaymentIntentId(response.data.id);
        } else {
          throw new Error('Invalid payment response');
        }
      } catch (error) {
        console.error('Payment setup error:', {
          error,
          response: error.response?.data,
          amount
        });
        
        message.error(
          error.message === 'Invalid payment amount' 
            ? 'Please enter a valid payment amount'
            : `Payment setup failed: ${error.response?.data?.error?.message || error.message}`
        );
      }
    };

    if (amount) {
      createPaymentIntent();
    }
  }, [amount, carDetails]);

  const simulatePayment = async () => {
    setLoading(true);
    try {
      // Simulate payment success after 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentDetails = {
        transactionId: `test_${paymentIntentId}`,
        date: new Date(),
        modelName: carDetails.modelName,
        brandName: carDetails.brandName,
        category: carDetails.category,
        color: carDetails.color,
        totalPrice: carDetails.price,
        reservationFee: amount,
        paymentMethod: 'Thai QR Payment'
      };

      message.success('Payment successful!');
      navigate('/payment/success', { state: paymentDetails });
    } catch (error) {
      message.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-64 h-64 bg-white flex items-center justify-center rounded-lg shadow-md">
          {paymentIntentId ? (
            <QRCodeSVG
              value={`https://example.com/pay/${paymentIntentId}`}
              size={200}
              level="H"
              includeMargin={true}
              className="p-4"
            />
          ) : (
            <Spin size="large" />
          )}
        </div>
        <div className="text-lg font-semibold text-gray-700">
          Reservation Fee: {amount.toLocaleString()} THB
        </div>
        <div className="text-sm text-gray-500 text-center max-w-md">
          This is a test QR code. For development purposes only.
        </div>
      </div>
      <Button
        type="primary"
        onClick={simulatePayment}
        loading={loading}
        disabled={!paymentIntentId}
        className="w-full h-12 text-lg"
      >
        Simulate Payment
      </Button>
    </div>
  );
};

// Wrap CheckoutForm with Elements provider
const StripeCheckoutForm = ({ amount, carDetails }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} carDetails={carDetails} />
    </Elements>
  );
};

const CheckoutForm = ({ amount, carDetails }) => {
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

      // Create payment details for receipt
      const paymentDetails = {
        transactionId: paymentMethod.id,
        date: new Date(),
        modelName: carDetails.modelName,
        brandName: carDetails.brandName,
        category: carDetails.category,
        color: carDetails.color,
        totalPrice: carDetails.price,
        reservationFee: amount,
        paymentMethod: 'Credit Card'
      };

      message.success('Payment successful!');
      navigate('/payment/success', { state: paymentDetails });
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
        Reservation Fee: {amount.toLocaleString()} THB
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

// Update Payment component to use StripeCheckoutForm
const Payment = () => {
  const location = useLocation();
  const carDetails = location.state;
  const [activeTab, setActiveTab] = useState('1');

  const calculateDownPayment = (price) => {
    const numericPrice = parseFloat(price.toString().replace(/[^0-9.-]+/g, ''));
    const feePercentage = numericPrice >= 1000000 ? 0.01 : 0.1;
    return Math.round(numericPrice * feePercentage);
  };

  if (!carDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">No payment details found</p>
      </div>
    );
  }

  const downPaymentAmount = calculateDownPayment(carDetails.price);

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
        <StripeCheckoutForm 
          amount={downPaymentAmount} 
          carDetails={{
            ...carDetails,
            downPayment: downPaymentAmount
          }}
        />
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
      children: (
        <ThaiQRPayment 
          amount={downPaymentAmount.toString()}
          carDetails={{
            ...carDetails,
            downPayment: downPaymentAmount
          }}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Reservation Receipt
          </h1>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Car Details</h2>
            <div className="space-y-2 text-gray-600">
              <p>Model: {carDetails.modelName}</p>
              <p>Total Price: {carDetails.price.toLocaleString()} THB</p>
              <p>Reservation Fee ({carDetails.price >= 1000000 ? '1%' : '10%'}): {downPaymentAmount.toLocaleString()} THB</p>
              <p className="text-sm text-blue-600">
                * This is a refundable reservation fee
                {carDetails.price < 1000000 && ' (10% for vehicles under 1,000,000 THB)'}
              </p>
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