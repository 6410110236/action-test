// CarCart.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import mockData from '../../mock/mock';
import SideBar from '../components/siderbar';
import { Pagination } from 'antd';

const CarCart = () => {
    const [cars, setCars] = useState(mockData);
    const [currentPage, setCurrentPage] = useState(1);
    const carsPerPage = 18;

    // คำนวณการแบ่งหน้า
    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

    // ฟังก์ชันเมื่อเปลี่ยนหน้า
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex">
            {/* SideBar สำหรับการจัดเรียง */}
            <SideBar cars={cars} setCars={setCars} />

            {/* ส่วนของรายการรถยนต์ */}
            <section className="max-w-screen-xl mx-auto px-4 mb-12 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentCars.map((car) => (
                        <Link
                            to={`/detail`}
                            key={car.id}
                            className="group border rounded-lg p-4 hover:shadow-lg transition-shadow"
                        >
                            <div className="relative overflow-hidden rounded-lg mb-3">
                                {car.image ? (
                                    <img
                                        src={car.image}
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
                                <span className="text-sm text-gray-500">{car.price}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>{car.category}</span>
                                <span>{car.gearType}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* แบ่งหน้า */}
                {cars.length > carsPerPage && (
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            current={currentPage}
                            pageSize={carsPerPage}
                            total={cars.length}
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
