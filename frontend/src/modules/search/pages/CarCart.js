import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SideBar from '../components/SideBar';
import { Pagination } from 'antd';
import { client, gql } from '../../../utils/apolloClient';
import useCarStore from '../../../store/carStore'; // นำเข้า store ที่เราสร้างไว้
import { GET_GARAGES } from '../../../conf/main'; // นำเข้า query จากไฟล์ main

const CarCart = () => {
    const { cars, setCars } = useCarStore(); // ดึงข้อมูล cars จาก Zustand store
    const [searchQuery, setSearchQuery] = useState(""); // ค่าค้นหาจาก input
    const [currentPage, setCurrentPage] = useState(1);
    const carsPerPage = 18;

    useEffect(() => {
        // หากข้อมูลยังไม่มีใน store ให้ดึงจาก API
        if (cars.length === 0) {
            client.query({ query: GET_GARAGES })
                .then(response => {
                    console.log('🚀 Data from API:', response.data);
                    setCars(response.data.garages); // ตั้งค่าข้อมูลใน store
                })
                .catch(error => console.error('❌ Error fetching data:', error));
        }
    }, [cars, setCars]); // ตรวจสอบเมื่อ `cars` ใน store ยังไม่มีข้อมูล

    // ฟังก์ชันคำนวณการแบ่งหน้า
    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;

    // กรองข้อมูลตามคำค้นหา
    const filteredCars = cars.filter((car) => {
        return car.model?.ModelName.toLowerCase().includes(searchQuery.toLowerCase()) || 
               car.model?.brand_car?.BrandName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // คำนวณรถที่จะแสดงในแต่ละหน้า
    const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

    // ฟังก์ชันเมื่อเปลี่ยนหน้า
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex">
            {/* SideBar สำหรับการจัดเรียง */}
            <SideBar cars={cars} setCars={setCars} />

            {/* ส่วนของรายการรถยนต์ */}
            <section className="max-w-screen-xl mx-auto px-4 mb-12 flex-1 mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentCars.map((car) => (
                        <Link
                            to={`/detail/${car.documentId}`} // ใช้ documentId จาก API
                            key={car.documentId} // ใช้ documentId จาก API
                            className="group border rounded-lg p-4 hover:shadow-lg transition-shadow"
                        >
                            <div className="relative overflow-hidden rounded-lg mb-3">
                                {car.Picture.length > 0 ? (
                                    <img
                                        src={car.Picture?.[0]?.url ? `${process.env.REACT_APP_BASE_URL}${car.Picture[0].url}` : "/placeholder.svg"}
                                        alt={car.model.ModelName}
                                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-500">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h3 className="font-medium mb-1">{car.model.ModelName}</h3>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-primary font-semibold">{car.VehicleRegistrationTypes}</span>
                                <span className="text-sm text-gray-500">{car.Price}฿</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>{car.Color}</span>
                                <span>{car.Warranty}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* แบ่งหน้า */}
                {filteredCars.length > carsPerPage && (
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            current={currentPage}
                            pageSize={carsPerPage}
                            total={filteredCars.length} // ใช้จำนวนของ filteredCars
                            onChange={handlePageChange}
                            showSizeChanger={false}
                        />
                    </div>
                )}
            </section>
        </div>
    );
};

export default CarCart;
