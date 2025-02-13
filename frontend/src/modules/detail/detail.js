import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./detail.css";

function Detail() {
  const { id } = useParams();
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeButton, setActiveButton] = useState("");

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const mockData = {
          title: "Car-title", // ข้อมูลจำลอง
          subtitle: "car-subtitle",
          status: "ข้อมูลจำลอง",
          price: 900000,
          installment: 15000,
          mileage: 5000,
          rating: 4.5,
          image: "https://via.placeholder.com/400"
        };

        setCarData(mockData); // ใช้ข้อมูลจำลองสำหรับทดสอบ
      } catch (error) {
        console.error("Error fetching car data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [id]);

  const handleButtonClick = (button) => {
    setActiveButton(button === activeButton ? "" : button);
  };

  if (loading) return <div className="detail">Loading...</div>;
  if (!carData) return <div className="detail">Car data not found.</div>;

  return (
    <div className="detail">
      <div className="detail-logo"></div>
      <div className="detail-menu"></div>
      <div className="content">
        <div className="box left-box">
          <img
            src={carData.image || "https://via.placeholder.com/400"}
            alt={carData.title}
            className="car-image"
          />
        </div>
        <div className="box right-box">
          <h2 className="car-title">{carData.title}</h2>
          <p className="car-subtitle">{carData.subtitle}</p>
          <div className="status">
            <span className="status-checked">✅ {carData.status}</span>
          </div>
          <div className="price">
            ราคา <span>{carData.price.toLocaleString()} -</span>
          </div>
          <div className="installment-box">
            <p>ผ่อนสบาย เพียงเดือนละ: <strong>฿{carData.installment.toLocaleString()}</strong></p>
            <div className="installment-buttons">
              <button
                className={`btn-calculate ${activeButton === "calculate" ? "active" : ""}`}
                onClick={() => handleButtonClick("calculate")}
              >
                คำนวณค่างวดรถ
              </button>
              <button
                className={`btn-interest ${activeButton === "interest" ? "active" : ""}`}
                onClick={() => handleButtonClick("interest")}
              >
                สนใจรถคันนี้
              </button>
            </div>
          </div>
          <p className="note">* ผ่อนง่ายด้วยบัตรประชาชนใบเดียว</p>
          <div className="info">
            <div className="info-item">เลขไมล์ <span>{carData.mileage.toLocaleString()} กม.</span></div>
            <hr className="divider" />
            <div className="info-item">คะแนนประเมิน: <span>{carData.rating}</span></div>
            <hr className="divider" />
            <div className="info-item">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
