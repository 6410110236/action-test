import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { useCarStore } from '../logic/carStore'; // นำเข้า useCarStore จาก store ที่เราสร้างไว้

const LatestCarsSection = () => {
    const [latestCars, setLatestCars] = useState([]); // สำหรับเก็บข้อมูลรถที่ดึงมาจาก store
    const { cars, setCars } = useCarStore(); // ดึงข้อมูล cars จาก Zustand store

    useEffect(() => {
        // ตรวจสอบว่าข้อมูลใน store ยังไม่มี หรือยังไม่ได้ตั้งค่า
        if (cars.length > 0) {
            // Map ข้อมูลจาก store (cars) ให้อยู่ในรูปแบบที่ต้องการแสดง
            const carsMapped = cars.map((garage) => {
                const model = garage.model || {};
                const brand = model.brand_car || {};

                return {
                    id: garage.documentId, // ใช้ documentId ของแต่ละรถ
                    modelName: model.ModelName || 'Unknown', // ชื่อรุ่นรถ
                    brandName: brand.BrandName || 'Unknown', // ชื่อแบรนด์รถ
                    price: garage.Price, // ราคา
                    image: garage.Picture && garage.Picture.length > 0 ? garage.Picture[0].url : '', // รูปภาพ
                    category: garage.VehicleRegistrationTypes || 'Unknown', // หมวดหมู่
                    gearType: model.GearType || 'Unknown' // ประเภทเกียร์
                };
            });

            setLatestCars(carsMapped); // อัพเดต state latestCars
        }
    }, [cars]);
    
    return (
        <section className="max-w-screen-xl mx-auto px-4 mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Latest Cars</h2>
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm text-gray-500">Recently Added</span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestCars.map((car) => (
                    <div key={car.id} className="group">
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
                        <div className="flex justify-between items-center">
                            <span className="text-primary font-semibold">{car.brandName}</span>
                            <span className="text-sm text-gray-500">{car.price}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{car.category}</span>
                            <span className="text-sm text-gray-500">{car.gearType}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default LatestCarsSection;
