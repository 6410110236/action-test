import React, { useEffect, useState, useContext } from 'react';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/Auth.context'; // Import AuthContext

const LatestCarsSection = () => {
    const [latestCars, setLatestCars] = useState([]);
    const { state } = useContext(AuthContext); // Get the state from AuthContext

    // Mock data for testing
    const mockCars = [
        {
            id: 1,
            modelName: 'Model S',
            brandName: 'Tesla',
            price: '80,000฿',
            image: 'https://hips.hearstapps.com/hmg-prod/images/2025-tesla-model-s-1-672d42e172407.jpg?crop=0.465xw:0.466xh;0.285xw,0.361xh&resize=1200:*', // Example image URL
            category: 'Electric Car',
            gearType: 'Automatic'
        },
        {
            id: 2,
            modelName: 'Mustang',
            brandName: 'Ford',
            price: '55,000฿',
            image: 'https://www.vdm.ford.com/content/dam/na/ford/en_us/images/mustang/2025/jellybeans/Ford_Mustang_2025_200A_PJS_883_89W_13B_COU_64F_99H_44U_EBST_YZTAC_DEFAULT_EXT_4.png', // Example image URL
            category: 'Sport',
            gearType: 'Manual'
        },
        {
            id: 3,
            modelName: 'Civic',
            brandName: 'Honda',
            price: '25,000฿',
            image: 'https://media.ed.edmunds-media.com/honda/civic/2025/oem/2025_honda_civic_sedan_si_fq_oem_1_1600.jpg', // Example image URL
            category: 'Sedan',
            gearType: 'Automatic'
        },
        {
            id: 4,
            modelName: 'Corolla',
            brandName: 'Toyota',
            price: '20,000฿',
            image: 'https://hips.hearstapps.com/hmg-prod/images/2025-toyota-corolla-fx-102-6674930515eb4.jpg?crop=0.482xw:0.483xh;0.205xw,0.250xh&resize=768:*', // Example image URL
            category: 'Sedan',
            gearType: 'Automatic'
        },
        {
            id: 5,
            modelName: 'Model 3',
            brandName: 'Tesla',
            price: '35,000฿',
            image: 'https://hips.hearstapps.com/hmg-prod/images/2019-tesla-model3-lt-airporthero-low-101-1587061146.jpg', // Example image URL
            category: 'Electric Car',
            gearType: 'Automatic'
        },
        {
            id: 6,
            modelName: 'Camaro',
            brandName: 'Chevrolet',
            price: '40,000฿',
            image: 'https://di-uploads-pod25.dealerinspire.com/rickhendrickcitychevy/uploads/2023/11/mlp-img-perf-2024-camaro.jpg', // Example image URL
            category: 'Sport',
            gearType: 'Manual'
        }
    ];

    useEffect(() => {
        // Set mock data to state for testing
        setLatestCars(mockCars);
    }, []);

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
                    <Link to={`/detail/${car.modelName}`} key={car.id} className="group">
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
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default LatestCarsSection;
