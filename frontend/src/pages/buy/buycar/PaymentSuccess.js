import React, { useRef, useState } from 'react';
import { Result, Button, message, Alert } from 'antd';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircleOutlined, PrinterOutlined, DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PaymentSuccess = () => {
  const location = useLocation();
  const paymentDetails = location.state;
  const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Redirect if no payment details
  if (!paymentDetails) {
    return <Navigate to="/" replace />;
  }

  const formatCurrency = (amount) => {
    // Parse the amount if it's a string
    const numericAmount = typeof amount === 'string' ? 
      parseFloat(amount.replace(/[^0-9.-]+/g, '')) : 
      amount;

    // Check if the parsed amount is valid
    if (isNaN(numericAmount)) {
      return '0 THB';
    }

    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numericAmount);
  };

  const formatDate = (date) => {
    try {
      return new Date(date || Date.now()).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return new Date().toLocaleString('en-US');
    }
  };

  const downloadReceipt = async () => {
    if (!receiptRef.current) {
      message.error('Receipt content not found');
      return;
    }

    setIsDownloading(true);
    try {
      // Set background color to white for better PDF quality
      const originalBackground = receiptRef.current.style.background;
      receiptRef.current.style.background = 'white';

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, // Increase quality
        useCORS: true, // Enable CORS for images
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Restore original background
      receiptRef.current.style.background = originalBackground;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30; // Add some top margin

      // Add title
      pdf.setFontSize(16);
      pdf.text('KODROD Purchase Receipt', pdfWidth / 2, 20, { align: 'center' });

      // Add image
      pdf.addImage(
        imgData, 
        'PNG', 
        imgX, 
        imgY, 
        imgWidth * ratio, 
        imgHeight * ratio
      );

      // Add footer
      pdf.setFontSize(10);
      pdf.text(
        'Thank you for your purchase!', 
        pdfWidth / 2, 
        pdfHeight - 10, 
        { align: 'center' }
      );

      // Generate filename
      const filename = `KODROD-Receipt-${paymentDetails.transactionId}-${new Date().getTime()}.pdf`;
      
      pdf.save(filename);
      message.success('Receipt downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      message.error('Failed to download receipt. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Result
          status="success"
          title="Reservation Successful!"
          subTitle={`You have successfully reserved ${paymentDetails.modelName}`}
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
        />
        
        <div ref={receiptRef} className="bg-white p-8 rounded-lg shadow-lg mb-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">KODROD</h1>
            <p className="text-gray-600 mt-2">
              Official Reservation Receipt
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold mb-4">Receipt Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="font-medium">{paymentDetails.transactionId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Purchase Date</p>
                  <p className="font-medium">{formatDate(paymentDetails.date)}</p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Brand & Model</p>
                  <p className="font-medium">{paymentDetails.brandName} {paymentDetails.modelName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{paymentDetails.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Color</p>
                  <p className="font-medium">{paymentDetails.color}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="font-medium text-green-600">{formatCurrency(paymentDetails.totalPrice)}</p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Reservation Fee (1%)</p>
                  <p className="font-medium">{formatCurrency(paymentDetails.reservationFee)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">{paymentDetails.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Vehicle Price</p>
                  <p className="font-medium text-green-600">{formatCurrency(paymentDetails.totalPrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <p className="font-medium text-green-600">Reservation Fee Paid</p>
                </div>
              </div>
            </div>

            <Alert
              message="Next Steps"
              description={
                <ul className="list-disc pl-4 mt-2">
                  <li>Keep this receipt for your records</li>
                  <li>Our team will contact you within 24 hours</li>
                  <li>Prepare your identification documents</li>
                  <li>Reservation fee is fully refundable if canceled within 7 days</li>
                </ul>
              }
              type="info"
              showIcon
              className="mb-6"
            />

            <div className="text-center text-sm text-gray-500">
              <p className="font-medium">Thank you for choosing KODROD!</p>
              <p className="mt-1">For support: support@kodrod.com | Tel: 1234-5678</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Link to="/">
            <Button type="primary" size="large">
              Back to Home
            </Button>
          </Link>
          <Button 
            onClick={() => window.print()} 
            icon={<PrinterOutlined />}
            size="large"
          >
            Print Receipt
          </Button>
          <Button 
            onClick={downloadReceipt} 
            icon={isDownloading ? <LoadingOutlined /> : <DownloadOutlined />}
            type="primary"
            ghost
            size="large"
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