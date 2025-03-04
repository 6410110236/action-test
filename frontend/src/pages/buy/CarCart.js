import React, { useState, useEffect } from 'react';
import { Pagination } from 'antd';
import { Link } from 'react-router-dom';
import { GET_GARAGES } from '../../api/main'; // นำเข้า query จากไฟล์ main
import { client } from '../../api/apolloClient';
import useCarStore from '../../logic/carStore'; // นำเข้า useCarStore จาก store ที่เราสร้างไว้
import SideBar from '../../components/SideBar';

const CarCart = () => {
    const { cars, setCars } = useCarStore(); // ดึงข้อมูล cars จาก Zustand store
    const [searchQuery, setSearchQuery] = useState(""); // ค่าค้นหาจาก input
    const [currentPage, setCurrentPage] = useState(1);
    const carsPerPage = 18;

    const fetchCars = () => {
        client.query({ query: GET_GARAGES })
            .then(response => {
                console.log('🚀 Data from API:', response.data);
                // แปลงข้อมูลให้เป็นรูปแบบที่ง่ายต่อการใช้งาน
                const formattedCars = response.data.garages.map((garage) => {
                    const model = garage.model || {}; // ตรวจสอบว่า model มีค่าไหม
                    const brand = model.brand_car || {}; // ตรวจสอบว่า brand มีค่าไหม

                    return {
                        id: garage.documentId, // ใช้ documentId ของแต่ละรถ
                        modelName: model.ModelName || 'Unknown', // ชื่อรุ่นรถ
                        brandName: brand.BrandName || 'Unknown', // ชื่อแบรนด์รถ
                        price: garage.Price, // ราคา
                        image: garage.Picture && garage.Picture.length > 0 ? garage.Picture[0].url : '', // รูปภาพ
                        category: garage.VehicleRegistrationTypes || 'Unknown', // หมวดหมู่
                        color: garage.Color || 'Unknown', // สี
                        gearType: model.GearType || 'Unknown' // ประเภทเกียร์
                    };
                });
                console.log('🚀 Formatted cars:', formattedCars);
                setCars(formattedCars); // ตั้งค่าข้อมูลที่จัดการแล้วใน store
            })
            .catch(error => console.error('❌ Error fetching data:', error));
    };

    useEffect(() => {
        // หากข้อมูลยังไม่มีใน store ให้ดึงจาก API
            fetchCars();
            console.log('useEffect: Fetching data from API...');
    }, [setCars]); // ตรวจสอบเมื่อ `cars` ใน store ยังไม่มีข้อมูล

    // ฟังก์ชันคำนวณการแบ่งหน้า
    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;

    // กรองข้อมูลตามคำค้นหา
    const filteredCars = cars.filter((car) => {
        // ตรวจสอบว่า car มี modelName และ brandName ก่อนที่จะทำการกรอง
        return (
            (car.modelName && car.modelName.toLowerCase().includes(searchQuery.toLowerCase())) || 
            (car.brandName && car.brandName.toLowerCase().includes(searchQuery.toLowerCase()))
        );
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
                            to={`/detail/${car.id}`} // ใช้ documentId จาก API
                            key={car.id} // ใช้ id จาก API
                            className="group border rounded-lg p-4 hover:shadow-lg transition-shadow"
                        >
                            <div className="relative overflow-hidden rounded-lg mb-3">
                                {car.image ? (
                                    <img
                                        src={`${process.env.REACT_APP_BASE_URL}${car.image}`}
                                        alt={car.modelName}
                                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-500">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h3 className="font-medium mb-1">{car.modelName}</h3>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-primary font-semibold">{car.brandName}</span>
                                <span className="text-sm text-gray-500">{car.price} ฿</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>{car.category}</span>
                                <span>{car.color}</span>
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
