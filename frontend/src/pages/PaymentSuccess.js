import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => (
  <Result
    status="success"
    title="Payment Successful!"
    subTitle="Thank you for your purchase. Your transaction has been completed."
    extra={[
      <Link to="/" key="home">
        <Button type="primary">Back to Home</Button>
      </Link>
    ]}
  />
);

export default PaymentSuccess;