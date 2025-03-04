import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCarStore from '../logic/carStore';
import { client } from '../api/apolloClient';
import conf, { GET_GARAGES } from '../api/main';

const LatestCarsSection = () => {
    const [latestCars, setLatestCars] = useState([]);
    const [visibleCars, setVisibleCars] = useState(6);
    const { setCars } = useCarStore();
    const navigate = useNavigate();

    useEffect(() => {
        client.query({ 
            query: GET_GARAGES,
            fetchPolicy: 'network-only' // Force fresh data
        })
            .then(response => {
                const carsMapped = response.data.garages.map((garage) => {
                    const model = garage.model || {};
                    const brand = model.brand_car || {};

                    // Parse the date when mapping the data
                    const createdDate = garage.createdAt ? new Date(garage.createdAt) : new Date();

                    return {
                        id: garage.documentId,
                        modelName: model.ModelName || 'Unknown',
                        brandName: brand.BrandName || 'Unknown',
                        price: garage.Price,
                        image: garage.Picture?.[0]?.url || '',
                        category: garage.VehicleRegistrationTypes || 'Unknown',
                        color: garage.Color || 'Unknown',
                        gearType: model.GearType || 'Unknown',
                        createdAt: createdDate.toISOString(), // Store as ISO string
                        status: garage.status || 'available',
                        details: garage.details || {},
                        inspection: garage.inspection || {}
                    };
                });

                const latestSortedCars = carsMapped
                    .filter(car => car.status === 'available')
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setLatestCars(latestSortedCars);
                setCars(carsMapped); // Store all cars in global state
            })
            .catch(error => console.error('Error fetching cars:', error));
    }, []);

    const handleCarClick = (car) => {
        navigate(`/detail/${car.id}`, {
            state: {
                carDetails: {
                    ...car,
                    // No need to convert createdAt again since it's already an ISO string
                    createdAt: car.createdAt
                }
            }
        });
    };

    return (
        <section className="max-w-screen-xl mx-auto px-4 mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Latest Cars</h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Recently Added</span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestCars.slice(0, visibleCars).map((car) => (
                    <div 
                        key={car.id} 
                        onClick={() => handleCarClick(car)}
                        className="group cursor-pointer transition-all duration-300 hover:shadow-lg rounded-lg overflow-hidden"
                    >
                        <div className="relative overflow-hidden rounded-lg mb-3">
                            {car.image ? (
                                <img
                                    src={`${conf.apiUrlPrefix}${car.image}`}
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
                        <div className="p-4">
                            <h3 className="font-medium mb-1 group-hover:text-blue-600">{car.modelName}</h3>
                            <div className="flex justify-between items-center">
                                <span className="text-primary font-semibold">{car.brandName}</span>
                                <span className="text-sm text-gray-500">{car.price.toLocaleString()} ฿</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-sm text-gray-500">{car.category}</span>
                                <span className="text-sm text-gray-500">{car.color}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {visibleCars < latestCars.length && (
                <div className="flex justify-center mt-6">
                    <button 
                        onClick={() => setVisibleCars(prev => prev + 3)} 
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition"
                    >
                        Show More
                    </button>
                </div>
            )}
        </section>
    );
};

export default LatestCarsSection;
