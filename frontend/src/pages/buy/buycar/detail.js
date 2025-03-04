
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Carousel, Card, Modal, Tabs, Table } from 'antd';
import {
  LikeOutlined, LikeFilled, ShareAltOutlined, CalculatorOutlined, CarOutlined,
  SwapOutlined, PhoneOutlined, MailOutlined, MessageOutlined,
  FacebookOutlined, TwitterOutlined, WhatsAppOutlined, InstagramOutlined
} from '@ant-design/icons';
import 'tailwindcss/tailwind.css';
import 'antd/dist/reset.css';
import conf from "../../../api/main";

import { client } from '../../../api/apolloClient';
import useCarStore from '../../../logic/carStore';
import { GET_GARAGES, GET_SPECIFIC_CAR  } from '../../../api/main';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, setCars } = useCarStore();
  const [selectedCar, setSelectedCar] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInstallmentModalVisible, setIsInstallmentModalVisible] = useState(false);
  const [installmentAmount, setInstallmentAmount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(120);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const carouselRef = React.useRef(null);
  const [downPaymentPercentage, setDownPaymentPercentage] = useState(10);
  const [calculationDetails, setCalculationDetails] = useState({
    totalPrice: 0,
    downPayment: 0,
    monthlyPayment: 0
  });

  const fetchCarData = async () => {
    try {
      const response = await client.query({ query: GET_GARAGES });
      console.log('🚀 API Response:', response.data);

      const formattedCars = response.data.garages.map((garage) => ({
        id: garage.documentId,
        modelName: garage.model?.ModelName || 'Unknown',
        brandName: garage.model?.brand_car?.BrandName || 'Unknown',
        price: garage.Price,
        image: garage.Picture?.length > 0 ? garage.Picture[0].url : '',
        category: garage.VehicleRegistrationTypes || 'Unknown',
        color: garage.Color || 'Unknown',
        gearType: garage.model?.GearType || 'Unknown',
        details: garage.details || {},  // รายละเอียดเพิ่มเติม
        inspection: garage.inspection || {},  // การตรวจสภาพรถ
      }));

      setCars(formattedCars);
      const car = formattedCars.find(car => car.id === id);
      if (car) {
        setSelectedCar(car);
      } else {
        fetchSpecificCar();
      }
    } catch (error) {
      console.error('❌ Error fetching car data:', error);
    }
  };

  const fetchSpecificCar = async (carId) => {
    try {
      const response = await client.query({ query: GET_SPECIFIC_CAR, variables: { documentId: carId } });
      console.log('🚀 Specific Car API Response:', response.data);
  
      const garage = response.data.garage;
      const car = {
        id: garage.documentId,
        modelName: garage.model?.ModelName || 'Unknown',
        brandName: garage.model?.brand_car?.BrandName || 'Unknown',
        price: garage.Price,
        image: garage.Picture?.length > 0 ? garage.Picture[0].url : '',
        category: garage.VehicleRegistrationTypes || 'Unknown',
        color: garage.Color || 'Unknown',
        gearType: garage.model?.GearType || 'Unknown',
        details: garage.details || {},
        inspection: garage.inspection || {},
      };
  
      setSelectedCar(car);
    } catch (error) {
      console.error('❌ Error fetching specific car data:', error);
    }
  };

  useEffect(() => {
    if (!cars.length) {
      fetchCarData();
    } else {
      const car = cars.find(car => car.id === id);
      if (car) {
        setSelectedCar(car);
      } else {
        fetchSpecificCar();
      }
    }
  }, [id, cars]);

  const handleClick = (action) => {
    if (action === 'Reserve') {
      calculateInstallment();
      setIsInstallmentModalVisible(true);
    } else if (action === 'Share') {
      setIsShareModalVisible(true);
    }
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsInstallmentModalVisible(false);
    setIsShareModalVisible(false);
  };

  const calculateInstallment = () => {
    const totalPrice = selectedCar.price
      ? parseInt(String(selectedCar.price).replace(/[^0-9]/g, ''), 10)
      : 0;

    if (totalPrice > 0) {
      const downPayment = Math.ceil((totalPrice * downPaymentPercentage) / 100);
      const remainingAmount = totalPrice - downPayment;
      const monthlyPayment = Math.ceil(remainingAmount / 12);

      setCalculationDetails({
        totalPrice: totalPrice.toLocaleString(),
        downPayment: downPayment.toLocaleString(),
        monthlyPayment: monthlyPayment.toLocaleString()
      });
    }

    setIsInstallmentModalVisible(true);
  };

  const tabItems = [
    {
      key: '1',
      label: 'Car Details',
      children: (
        <Table
          pagination={false}
          showHeader={false}
          dataSource={[
            { key: 'fuel', label: 'Fuel Type', value: selectedCar.details?.fuelType || 'None' },
            { key: 'seat', label: 'Seats', value: selectedCar.details?.seatCount || 'None' },
            { key: 'regType', label: 'Registration Type', value: selectedCar.details?.registrationType || 'None' },
            { key: 'spareKey', label: 'Spare Key', value: selectedCar.details?.spareKey || 'None' },
            { key: 'insurance', label: 'Primary Insurance', value: selectedCar.details?.insurance || 'None' },
            { key: 'color', label: 'Color', value: selectedCar.details?.color || 'None' },
            { key: 'regDate', label: 'Registration Date', value: selectedCar.details?.registrationDate || 'None' },
            { key: 'lastDist', label: 'Latest Mileage', value: selectedCar.details?.lastDistance || 'None' },
          ]}
          columns={[
            { title: 'Item', dataIndex: 'label', key: 'label' },
            { title: 'Details', dataIndex: 'value', key: 'value' },
          ]}
        />
      ),
    },
    {
      key: '2',
      label: 'Vehicle Inspection',
      children: (
        <Table
          pagination={false}
          showHeader={false}
          dataSource={[
            { key: 'lastInspection', label: 'Last Inspection', value: selectedCar.inspection?.lastInspection || 'None' },
            { key: 'nextInspection', label: 'Next Inspection', value: selectedCar.inspection?.nextInspection || 'None' },
            { key: 'status', label: 'Status', value: selectedCar.inspection?.status || 'None' },
          ]}
          columns={[
            { title: 'Item', dataIndex: 'label', key: 'label' },
            { title: 'Details', dataIndex: 'value', key: 'value' },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="bg-white p-6">
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side */}
          {selectedCar.image ? (
            <img
              src={`${conf.apiUrlPrefix}${selectedCar.image}`}
              alt={selectedCar.modelName}
              className="w-full max-w-[700px] h-64 max-h-64 object-cover transition-transform duration-300 group-hover:scale-120"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-500">
              No Image
            </div>
          )}
          {/* Right Side */}
          <div className="w-full lg:w-1/3 p-4 flex flex-col justify-between">
            <Card className="flex-grow">
              <h1 className="text-3xl font-bold mb-2">{selectedCar.modelName || 'No data'}</h1>
              <h2 className="text-xl text-gray-600 mb-4">{selectedCar.brandName || 'No data'}</h2>
              <p className="text-2xl text-red-600 font-semibold mb-4">
                {selectedCar.price ? `${selectedCar.price} ฿` : 'No price data'}
              </p>

              <p className="text-md text-gray-700 mb-2">Type: {selectedCar.category || 'No data'}</p>
              <p className="text-md text-gray-700 mb-4">Transmission: {selectedCar.gearType || 'No data'}</p>
              <div className="grid grid-cols-2 gap-4">
                <Button type="primary" icon={<CarOutlined />} onClick={() => handleClick('Reserve')} className="w-full">
                  Pricing
                </Button>
                <Button icon={<ShareAltOutlined />} onClick={() => handleClick('Share')} className="w-full">
                  Share
                </Button>
                {/* Like Button */}
                <Button
                  icon={isLiked ? <LikeFilled /> : <LikeOutlined />}
                  onClick={handleLikeClick}
                  className={`w-full col-span-2 flex items-center justify-center ${isLiked ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                    }`}
                >
                  Like <span className="ml-2">{likeCount}</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Tabs (car details and inspection) */}
        <div className="mt-6">
          <Tabs defaultActiveKey="1" items={tabItems} />
        </div>
      </div>

      {/* Modal for Contact Info */}
      <Modal open={isModalVisible} onCancel={handleCancel} footer={null} title="Contact Seller">
        <div className="flex flex-col items-center space-y-4">
          <Button type="link" icon={<PhoneOutlined style={{ fontSize: '24px' }} />} href="tel:0123456789">
            Phone: 012-345-6789
          </Button>
          <Button type="link" icon={<MailOutlined style={{ fontSize: '24px' }} />} href="mailto:seller@example.com">
            Email: seller@example.com
          </Button>
          <Button type="link" icon={<MessageOutlined style={{ fontSize: '24px' }} />} href="sms:0123456789">
            Send Message
          </Button>
        </div>
      </Modal>

      {/* Modal for Sharing */}
      <Modal open={isShareModalVisible} onCancel={handleCancel} footer={null} title="Share">
        <div className="flex flex-col items-center space-y-4">
          <Button type="link" icon={<FacebookOutlined style={{ fontSize: '24px', color: '#1877F2' }} />} href="https://www.facebook.com/">
            Facebook
          </Button>
          <Button type="link" icon={<TwitterOutlined style={{ fontSize: '24px', color: '#1DA1F2' }} />} href="https://x.com/">
            X (Twitter)
          </Button>
          <Button type="link" icon={<WhatsAppOutlined style={{ fontSize: '24px', color: '#25D366' }} />} href="https://www.whatsapp.com/">
            WhatsApp
          </Button>
          <Button type="link" icon={<InstagramOutlined style={{ fontSize: '24px', color: '#E4405F' }} />} href="https://www.instagram.com/">
            Instagram
          </Button>
        </div>
      </Modal>

      {/* Modal for Installment Calculation */}
      <Modal 
        open={isInstallmentModalVisible} 
        onCancel={handleCancel} 
        footer={null} 
        title="Payment Calculator"
        width={400}
      >
        <div className="flex flex-col space-y-6 p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Total Price: <span className="text-red-600">{calculationDetails.totalPrice} THB</span>
            </h3>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Select Down Payment Percentage:</p>
              <div className="flex flex-wrap gap-2">
                {[1, 10, 20, 30, 40].map((percentage) => (
                  <button
                    key={percentage}
                    onClick={() => {
                      setDownPaymentPercentage(percentage);
                      calculateInstallment();
                    }}
                    className={`px-3 py-1 rounded ${
                      downPaymentPercentage === percentage
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {percentage}%
                  </button>
                ))}
              </div>
            </div>

            {/* Add warning message for 1% down payment */}
            {downPaymentPercentage === 1 && (
              <div className="text-yellow-600 text-sm bg-yellow-50 p-2 rounded">
                ⚠️ 1% down payment is a special promotion. Terms and conditions apply.
              </div>
            )}

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Down Payment:</span>
                <span className="font-semibold">{calculationDetails.downPayment} THB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Payment (12 months):</span>
                <span className="font-semibold">{calculationDetails.monthlyPayment} THB</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button 
              type="primary" 
              icon={<CarOutlined />} 
              onClick={() => {
                handleCancel();
                navigate('/payment', {
                  state: {
                    carId: id,
                    modelName: selectedCar.modelName,
                    price: selectedCar.price,
                    image: selectedCar.image,
                    downPayment: calculationDetails.downPayment,
                    monthlyPayment: calculationDetails.monthlyPayment,
                    downPaymentPercentage
                  }
                });
              }}
              className="w-full"
            >
              Proceed to Payment
            </Button>
            <Button onClick={handleCancel} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Detail;
