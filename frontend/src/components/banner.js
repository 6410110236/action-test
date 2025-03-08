import React, { useState, useCallback } from "react";
import { Carousel } from "react-responsive-carousel"; // Import carousel styles
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { LeftOutlined, RightOutlined } from "@ant-design/icons"; // นำเข้าไอคอนจาก antd
import { useNavigate } from "react-router-dom";

// ข้อมูลของแบนเนอร์
const banners = [
  {
    id: 1,
    image:
      "https://www.wsupercars.com/wallpapers-wide/Hennessey/2025-Hennessey-Super-Venom-Mustang-Dark-Horse-001-1440w.jpg",
    title: "Premium Cars",
    description: "Discover our luxury collection",
  },
  {
    id: 2,
    image:
      "https://www.wsupercars.com/wallpapers-super-ultrawide/Lamborghini/2024-Lamborghini-Revuelto-Opera-Unica-004-1440sw.jpg",
    title: "New Arrivals",
    description: "Check out our latest models",
  },
  {
    id: 3,
    image:
      "https://www.wsupercars.com/wallpapers-super-ultrawide/Cadillac/2025-Cadillac-CT5-V-Blackwing-004-1440sw.jpg",
    title: "Special Offers",
    description: "Great deals on selected models",
  },
  {
    id: 4,
    image:
      "https://www.wsupercars.com/wallpapers-super-ultrawide/Porsche/2025-Porsche-911-Carrera-T-004-1440sw.jpg",
    title: "Sports Cars",
    description: "Explore our high-performance vehicles",
  },
  {
    id: 5,
    image:
      "https://www.wsupercars.com/wallpapers-super-ultrawide/Porsche/2025-Porsche-911-GT3-005-1440sw.jpg",
    title: "Luxury Cars",
    description: "Discover our luxury collection",
  },
];

const BannerCarousel = () => {
  const [searchState, setSearchState] = useState({
    query: "",
    isOpen: false,
    isLoading: false,
    error: null
  });
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setSearchState(prev => ({ ...prev, query: newQuery }));
  };

  const debouncedSearch = useCallback(
    async (searchTerm) => {
      if (!searchTerm.trim()) return;

      setSearchState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Simulate a search operation
        setTimeout(() => {
          setSearchState(prev => ({
            ...prev,
            isOpen: false,
            query: "",
            isLoading: false
          }));
          navigate(`/buy?search=${searchTerm}`);
        }, 1000);
      } catch (error) {
        setSearchState(prev => ({
          ...prev,
          error: 'Failed to fetch results',
          isLoading: false
        }));
      }
    }, [navigate]);

  return (
    <div className="relative">
      <Carousel
        showThumbs={false} // ปิดการแสดง thumbnail ของแต่ละภาพ
        autoPlay // ให้แสดงอัตโนมัติ
        infiniteLoop // ให้วนลูปกลับมาที่แรก
        interval={3000} // ตั้งเวลาเปลี่ยนภาพทุ
        showArrows={false} // ปิดการแสดงลูกศรของ Carousel เอง
        showStatus={false} // ปิดสถานะแสดงว่าเป็นภาพที่เท่าไร
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="relative h-[200px] sm:h-[300px] md:h-[400px] lg:h-[600px]"
            style={{
              backgroundImage: `url(${banner.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-5 left-5 md:bottom-10 md:left-10 text-white">
              <h3 className="text-lg sm:text-xl md:text-4xl font-bold">{banner.title}</h3>
              <p className="text-xs sm:text-sm md:text-lg">{banner.description}</p>
            </div>
          </div>
        ))}
      </Carousel>

      {/* ปุ่มลูกศรด้านซ้าย */}
      <div
        className="absolute top-1/2 left-2 sm:left-4 md:left-8 transform -translate-y-1/2 bg-white p-1 sm:p-2 md:p-3 rounded-full shadow-lg cursor-pointer hover:bg-gray-200"
        onClick={() =>
          document.querySelector(".carousel .control-prev").click()
        }
        style={{ zIndex: 10 }}
      >
        <LeftOutlined className="text-sm sm:text-lg md:text-2xl text-gray-700" />
      </div>

      {/* ปุ่มลูกศรด้านขวา */}
      <div
        className="absolute top-1/2 right-2 sm:right-4 md:right-8 transform -translate-y-1/2 bg-white p-1 sm:p-2 md:p-3 rounded-full shadow-lg cursor-pointer hover:bg-gray-200"
        onClick={() =>
          document.querySelector(".carousel .control-next").click()
        }
        style={{ zIndex: 10 }}
      >
        <RightOutlined className="text-sm sm:text-lg md:text-2xl text-gray-700" />
      </div>

      {/* กล่องค้นหาที่ทับกับภาพ */}
      <div className="absolute top-[100%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg z-10 w-11/12 sm:w-10/12 md:w-4/5 max-w-4xl">
        <h2 className="text-lg sm:text-xl md:text-3xl font-bold text-center text-black mb-4">
          ค้นหารถยนต์
        </h2>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* ฟอร์มค้นหารถ */}
          <input
            type="text"
            placeholder="ค้นหายี่ห้อรุ่นรถ"
            value={searchState.query}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                debouncedSearch(searchState.query);
              }
            }}
            className="flex-1 p-2 sm:p-3 border border-gray-300 rounded-lg"
          />
          <button
            className="bg-blue-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={() => debouncedSearch(searchState.query)}
          >
            ค้นหารถ
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;
