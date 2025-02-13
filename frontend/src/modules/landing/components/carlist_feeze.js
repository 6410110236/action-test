import React, { useEffect, useState, useContext } from 'react';
import { Clock } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../../context/Auth.context'; // Import AuthContext

const LatestCarsSection = () => {
    const [latestCars, setLatestCars] = useState([]);
    const { state } = useContext(AuthContext); // Get the state from AuthContext

    const fetchCars = async () => {
        try {
            console.log('Fetching cars...');
            const [modelsResponse, categoriesResponse, garagesResponse, brandsResponse] = await axios.all([
                axios.get(`http://localhost:1337/api/models`),
                axios.get(`http://localhost:1337/api/category-cars`),
                axios.get(`http://localhost:1337/api/garages`),
                axios.get(`http://localhost:1337/api/brands`)
            ]);

            console.log('Models response:', modelsResponse.data);
            console.log('Categories response:', categoriesResponse.data);
            console.log('Garages response:', garagesResponse.data);
            console.log('Brands response:', brandsResponse.data);

            const models = modelsResponse.data.data;
            const categories = categoriesResponse.data.data;
            const garages = garagesResponse.data.data;
            const brands = brandsResponse.data.data;

            const cars = garages.map(garage => {
                const model = models.find(m => m.id === garage.CarID);
                const category = categories.find(c => c.id === model?.categoryId);
                const brand = brands.find(b => b.id === model?.brandId);

                return {
                    id: garage.id,
                    modelName: model ? model.ModelName : 'Unknown',
                    brandName: brand ? brand.BrandName : 'Unknown',
                    price: garage.Price,
                    image: garage.Picture && garage.Picture.length > 0 ? garage.Picture[0].url : '', // ตรวจสอบว่ามีภาพหรือไม่
                    category: category ? category.Category : 'Unknown', // ตรวจสอบว่า category มีข้อมูลหรือไม่
                    gearType: model ? model.GearType : 'Unknown'
                };
            });

            console.log('Mapped car data:', cars);
            setLatestCars(cars);
        } catch (error) {
            console.error('Error fetching cars:', error);
        }
    };

    useEffect(() => {
        fetchCars(); // Fetch cars every time the component mounts
    }, []); // Empty dependency array ensures this runs only once when the component mounts

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
