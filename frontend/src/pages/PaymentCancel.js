import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import { CloseCircleOutlined } from '@ant-design/icons';

const PaymentCancel = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Result
        icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
        status="error"
        title="Payment Cancelled"
        subTitle="Your payment was cancelled. No charges were made to your account."
        extra={[
          <Link to="/" key="home">
            <Button type="primary" size="large">
              Return to Home
            </Button>
          </Link>,
          <Link to="/buy" key="tryAgain">
            <Button size="large">
              Try Again
            </Button>
          </Link>
        ]}
        className="bg-white p-8 rounded-lg shadow-md"
      />
    </div>
  );
};

export default PaymentCancel;