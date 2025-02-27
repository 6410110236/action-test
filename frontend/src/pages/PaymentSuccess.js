import React, { useRef, useState } from 'react';
import { Result, Button, Card, Divider, message } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircleOutlined, PrinterOutlined, DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PaymentSuccess = () => {
  const location = useLocation();
  const paymentDetails = location.state;
  const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const formatDate = (date) => {
    try {
      return new Date(date || Date.now()).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const downloadReceipt = async () => {
    if (!receiptRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(receiptRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`receipt-${paymentDetails?.transactionId || 'payment'}.pdf`);
      message.success('Receipt downloaded successfully!');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      message.error('Failed to download receipt. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Result
          status="success"
          title="Payment Successful!"
          subTitle="Thank you for your purchase. Your transaction has been completed."
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
        />
        
        <div ref={receiptRef} className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">KODROD</h1>
            <p className="text-gray-500">
              Official Payment Receipt <br />
              Please bring this receipt to expedite your service
            </p>
          </div>
          
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h2 className="text-xl font-semibold mb-4">Receipt Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-medium">{paymentDetails?.transactionId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formatDate(paymentDetails?.date || new Date())}</p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Vehicle Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Car Model</p>
                <p className="font-medium">{paymentDetails?.modelName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Price</p>
                <p className="font-medium">{paymentDetails?.totalPrice || 0} THB</p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Payment Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Down Payment</p>
                <p className="font-medium">{paymentDetails?.downPayment || 0} THB</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Monthly Payment</p>
                <p className="font-medium">{paymentDetails?.monthlyPayment || 0} THB</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">{paymentDetails?.paymentMethod || 'Credit Card'}</p>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mt-6">
            <p>Thank you for your business!</p>
            <p>For any questions, please contact support@kodrod.com</p>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Link to="/">
            <Button type="primary">Back to Home</Button>
          </Link>
          <Button 
            onClick={() => window.print()} 
            icon={<PrinterOutlined />}
            type="default"
          >
            Print Receipt
          </Button>
          <Button 
            onClick={downloadReceipt} 
            icon={isDownloading ? <LoadingOutlined /> : <DownloadOutlined />}
            type="primary"
            ghost
            disabled={isDownloading}
          >
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;