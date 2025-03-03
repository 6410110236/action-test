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

import { client } from '../../../utils/apolloClient';
import useCarStore from '../../../store/carStore';
import { GET_GARAGES } from '../../../conf/main';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, setCars } = useCarStore();
  const [selectedCar, setSelectedCar] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInstallmentModalVisible, setIsInstallmentModalVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(120);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const carouselRef = React.useRef(null);
  const [calculationDetails, setCalculationDetails] = useState({
    totalPrice: 0,
    reservationFee: 0
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
      setSelectedCar(car || {});
    } catch (error) {
      console.error('❌ Error fetching car data:', error);
    }
  };

  useEffect(() => {
    if (!cars.length) {
      fetchCarData();
    } else {
      const car = cars.find(car => car.id === id);
      setSelectedCar(car || {});
    }
  }, [id, cars]);

  const handleClick = (action) => {
    if (action === 'Reserve') {
      calculateReservationFee();
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

  const calculateReservationFee = () => {
    const totalPrice = selectedCar.price
      ? parseInt(String(selectedCar.price).replace(/[^0-9]/g, ''), 10)
      : 0;

    if (totalPrice > 0) {
      const reservationFee = Math.ceil(totalPrice * 0.01); // 1% reservation fee

      setCalculationDetails({
        totalPrice: totalPrice.toLocaleString(),
        reservationFee: reservationFee.toLocaleString()
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
              src={`${process.env.REACT_APP_BASE_URL}${selectedCar.image}`}
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
                  Reserve
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
        title="Reservation Calculator"
        width={400}
      >
        <div className="flex flex-col space-y-6 p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Total Vehicle Price: <span className="text-red-600">{calculationDetails.totalPrice} THB</span>
            </h3>
            
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Reservation Fee (1%):</span>
                <span className="font-semibold text-blue-600">{calculationDetails.reservationFee} THB</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-2">Reservation Benefits:</h4>
              <ul className="text-sm text-blue-600 space-y-1 list-disc pl-4">
                <li>Secure your vehicle with just 1% reservation fee</li>
                <li>100% refundable within 7 days</li>
                <li>Priority vehicle inspection appointment</li>
                <li>24/7 customer support</li>
              </ul>
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
                    brandName: selectedCar.brandName,
                    category: selectedCar.category,
                    color: selectedCar.color,
                    price: selectedCar.price,
                    image: selectedCar.image,
                    reservationFee: calculationDetails.reservationFee
                  }
                });
              }}
              className="w-full"
            >
              Proceed to Reservation
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
