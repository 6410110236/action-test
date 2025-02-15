import React from 'react';
import { Button, Carousel, Card, Modal } from 'antd';
import {
  LikeOutlined,
  LikeFilled,
  ShareAltOutlined,
  CalculatorOutlined,
  CarOutlined,
  SwapOutlined,
  PhoneOutlined,
  MailOutlined,
  MessageOutlined,
  FacebookOutlined,
  TwitterOutlined,
  WhatsAppOutlined,
  InstagramOutlined,
} from '@ant-design/icons';
import 'antd/dist/reset.css';
import 'tailwindcss/tailwind.css';

const mockData = {
  id: 1,
  modelName: 'Model S',
  brandName: 'Tesla',
  price: '80,000฿', 
  images: [
    'https://hips.hearstapps.com/hmg-prod/images/2025-tesla-model-s-1-672d42e172407.jpg',
    'https://www.tesla.com/sites/default/files/modelsx-new/social/model-s-hero-social.jpg',
    'https://hips.hearstapps.com/hmg-prod/images/2019-tesla-model3-lt-airporthero-low-101-1587061146.jpg',
    'https://di-uploads-pod25.dealerinspire.com/rickhendrickcitychevy/uploads/2023/11/mlp-img-perf-2024-camaro.jpg',
    'https://www.vdm.ford.com/content/dam/na/ford/en_us/images/mustang/2025/jellybeans/Ford_Mustang_2025_200A_PJS_883_89W_13B_COU_64F_99H_44U_EBST_YZTAC_DEFAULT_EXT_4.png',
  ],

  category: 'Electric Car',
  gearType: 'Automatic',
};

const Detail = () => {
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isInstallmentModalVisible, setIsInstallmentModalVisible] = React.useState(false);
  const [installmentAmount, setInstallmentAmount] = React.useState(0);
  const [isLiked, setIsLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(120);
  const carouselRef = React.useRef(); 

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

  const [isShareModalVisible, setIsShareModalVisible] = React.useState(false);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
    setIsInstallmentModalVisible(false);
    setIsShareModalVisible(false);
  };

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
    carouselRef.current.goTo(index); 
  };

  const calculateInstallment = () => {
    const priceNumber = parseInt(mockData.price.replace(/[^0-9]/g, ''), 10); 
    const installment = Math.ceil(priceNumber / 24); 
    setInstallmentAmount(installment.toLocaleString()); 
  };

  return (
    <div className="bg-white p-6">
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side */}
          <div className="w-full lg:w-2/3 p-4">
            <Carousel ref={carouselRef} autoplay={false} afterChange={(current) => setSelectedImage(current)}>
              {mockData.images.map((image, index) => (
                <div key={index}>
                  <img src={image} alt={`${mockData.modelName} ${index + 1}`} className="w-full h-96 object-cover rounded-lg" />
                </div>
              ))}
            </Carousel>
            {/* Thumbnail Images */}
            <div className="flex justify-center mt-4 flex-wrap gap-2">
              {mockData.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${mockData.modelName} Thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-300'
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </div>
          </div>
          {/* Right Side */}
          <div className="w-full lg:w-1/3 p-4 flex flex-col justify-between">
            <Card className="flex-grow">
              <h1 className="text-3xl font-bold mb-2">{mockData.modelName}</h1>
              <h2 className="text-xl text-gray-600 mb-4">{mockData.brandName}</h2>
              <p className="text-2xl text-red-600 font-semibold mb-4">{mockData.price}</p>
              <p className="text-md text-gray-700 mb-2">ประเภท: {mockData.category}</p>
              <p className="text-md text-gray-700 mb-4">ระบบเกียร์: {mockData.gearType}</p>
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
                  className={`w-full col-span-2 flex items-center justify-center ${
                    isLiked ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                  }`}
                >
                  ถูกใจ <span className="ml-2">{likeCount}</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>


      {/* Modal for Contact Info */}
      <Modal visible={isModalVisible} onCancel={handleCancel} footer={null} title="ติดต่อผู้ขาย">
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
      <Modal visible={isShareModalVisible} onCancel={handleCancel} footer={null} title="แชร์">
        <div className="flex flex-col items-center space-y-4">
          <Button type="link" icon={<FacebookOutlined style={{ fontSize: '24px', color: '#1877F2' }} />} href="https://www.facebook.com/">
            Facebook
          </Button>
          <Button type="link" icon={<TwitterOutlined style={{ fontSize: '24px', color: '#1DA1F2' }} />} href="https://x.com/"> 
            X (Twitter) {/* ไอคอนนี้มันน่ารักดีถ้าจะเปลี่ยนบอกได้นะครับ */}
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
      <Modal visible={isInstallmentModalVisible} onCancel={handleCancel} footer={null} title="คำนวณค่างวด">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-lg font-semibold text-gray-800">
            ผ่อนสบายเพียงเดือนละ <span className="text-red-600">{installmentAmount}</span> บาท
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
