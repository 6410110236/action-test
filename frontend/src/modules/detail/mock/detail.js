import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  const { cars, setCars } = useCarStore();
  const [selectedCar, setSelectedCar] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInstallmentModalVisible, setIsInstallmentModalVisible] = useState(false);
  const [installmentAmount, setInstallmentAmount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(120);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const carouselRef = React.useRef(null);

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
    console.log(`${action} button clicked`);
    if (action === 'Interest') {
      setIsModalVisible(true);
    } else if (action === 'Calculate') {
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
    const priceNumber = selectedCar.price
      ? parseInt(String(selectedCar.price).replace(/[^0-9]/g, ''), 10)
      : 0;
    const installment = priceNumber > 0 ? Math.ceil(priceNumber / 12) : 0;
    setInstallmentAmount(installment.toLocaleString());
  };

  const tabItems = [
    {
      key: '1',
      label: 'รายละเอียดรถยนต์',
      children: (
        <Table
          pagination={false}
          showHeader={false}
          dataSource={[
            { key: 'fuel', label: 'ประเภทเชื้อเพลิง', value: selectedCar.details?.fuelType || 'None' },
            { key: 'seat', label: 'จำนวนที่นั่ง', value: selectedCar.details?.seatCount || 'None' },
            { key: 'regType', label: 'ประเภทการจดทะเบียน', value: selectedCar.details?.registrationType || 'None' },
            { key: 'spareKey', label: 'กุญแจสำรอง', value: selectedCar.details?.spareKey || 'None' },
            { key: 'insurance', label: 'การรับประกันหลัก', value: selectedCar.details?.insurance || 'None' },
            { key: 'color', label: 'สี', value: selectedCar.details?.color || 'None' },
            { key: 'regDate', label: 'วันจดทะเบียน', value: selectedCar.details?.registrationDate || 'None' },
            { key: 'lastDist', label: 'ระยะทางล่าสุด', value: selectedCar.details?.lastDistance || 'None' },
          ]}
          columns={[
            { title: 'รายการ', dataIndex: 'label', key: 'label' || 'None' },
            { title: 'ข้อมูล', dataIndex: 'value', key: 'value' || 'None' },
          ]}
        />
      ),
    },
    {
      key: '2',
      label: 'การตรวจสภาพรถยนต์',
      children: (
        <Table
          pagination={false}
          showHeader={false}
          dataSource={[
            { key: 'lastInspection', label: 'ตรวจสภาพครั้งล่าสุด', value: selectedCar.inspection?.lastInspection || 'None' },
            { key: 'nextInspection', label: 'กำหนดตรวจครั้งถัดไป', value: selectedCar.inspection?.nextInspection || 'None' },
            { key: 'status', label: 'สถานะ', value: selectedCar.inspection?.status || 'None' },
          ]}
          columns={[
            { title: 'รายการ', dataIndex: 'label', key: 'label' || 'None' },
            { title: 'ข้อมูล', dataIndex: 'value', key: 'value' || 'None' },
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
              <h1 className="text-3xl font-bold mb-2">{selectedCar.modelName || 'ไม่พบข้อมูล'}</h1>
              <h2 className="text-xl text-gray-600 mb-4">{selectedCar.brandName || 'ไม่พบข้อมูล'}</h2>
              <p className="text-2xl text-red-600 font-semibold mb-4">
                {selectedCar.price ? `${selectedCar.price} ฿` : 'ไม่พบข้อมูล'}
              </p>

              <p className="text-md text-gray-700 mb-2">ประเภท: {selectedCar.category || 'ไม่พบข้อมูล'}</p>
              <p className="text-md text-gray-700 mb-4">ระบบเกียร์: {selectedCar.gearType || 'ไม่พบข้อมูล'}</p>
              <div className="grid grid-cols-2 gap-4">
                <Button type="primary" icon={<CarOutlined />} onClick={() => handleClick('Interest')} className="w-full">
                  สนใจรถคันนี้
                </Button>
                <Button icon={<CalculatorOutlined />} onClick={() => handleClick('Calculate')} className="w-full">
                  คำนวณงวด
                </Button>
                <Button icon={<SwapOutlined />} onClick={() => handleClick('Compare')} className="w-full">
                  เปรียบเทียบรถ
                </Button>
                <Button icon={<ShareAltOutlined />} onClick={() => handleClick('Share')} className="w-full">
                  แชร์
                </Button>
                {/* Like Button */}
                <Button
                  icon={isLiked ? <LikeFilled /> : <LikeOutlined />}
                  onClick={handleLikeClick}
                  className={`w-full col-span-2 flex items-center justify-center ${isLiked ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                    }`}
                >
                  ถูกใจ <span className="ml-2">{likeCount}</span>
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
      <Modal open={isModalVisible} onCancel={handleCancel} footer={null} title="ติดต่อผู้ขาย">
        <div className="flex flex-col items-center space-y-4">
          <Button type="link" icon={<PhoneOutlined style={{ fontSize: '24px' }} />} href="tel:0123456789">
            โทรศัพท์: 012-345-6789
          </Button>
          <Button type="link" icon={<MailOutlined style={{ fontSize: '24px' }} />} href="mailto:seller@example.com">
            อีเมล: seller@example.com
          </Button>
          <Button type="link" icon={<MessageOutlined style={{ fontSize: '24px' }} />} href="sms:0123456789">
            ส่งข้อความ
          </Button>
        </div>
      </Modal>

      {/* Modal for Sharing */}
      <Modal open={isShareModalVisible} onCancel={handleCancel} footer={null} title="แชร์">
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
      <Modal open={isInstallmentModalVisible} onCancel={handleCancel} footer={null} title="คำนวณค่างวด">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-lg font-semibold text-gray-800">
            ใน 1 ปี ผ่อนเพียงเดือนละ <span className="text-red-600">{installmentAmount}</span> บาท
          </p>
          <Button type="primary" icon={<CarOutlined />} className="w-full" onClick={handleCancel}>
            ยืนยัน
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Detail;
