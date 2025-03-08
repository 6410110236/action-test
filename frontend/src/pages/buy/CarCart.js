import React, { useState, useEffect } from 'react';
import { Pagination } from 'antd';
import { client } from '../../api/apolloClient';
import useCarStore from '../../logic/carStore';
import conf, { GET_GARAGES } from '../../api/main';
import SideBar from '../../components/SideBar';
import { Link, useLocation } from 'react-router-dom';

const CarCart = () => {
    const { cars, setCars } = useCarStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredCars, setFilteredCars] = useState([]);
    const carsPerPage = 18;
    const location = useLocation();

    const fetchCars = () => {
        client.query({ query: GET_GARAGES })
            .then(response => {
                const formattedCars = response.data.garages.map((garage) => {
                    const model = garage.model || {};
                    const brand = model.brand_car || {};
                    const category = model.category_car || {};

                    return {
                        id: garage.documentId,
                        modelName: model.ModelName || 'Unknown',
                        brandName: brand.BrandName || 'Unknown',
                        price: garage.Price,
                        image: garage.Picture && garage.Picture.length > 0 ? garage.Picture[0].url : '',
                        category: category.Category || 'Unknown',
                        color: garage.Color || 'Unknown',
                        gearType: model.GearType || 'Unknown'
                    };
                });
                setCars(formattedCars);
            })
            .catch(error => console.error('❌ Error fetching data:', error));
    };

    useEffect(() => {
        fetchCars();
    }, [setCars]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const category = params.get('category');
        const search = params.get('search');
        let filtered = cars;

        if (category) {
            filtered = filtered.filter(car => car.category === category);
        }

        if (search) {
            filtered = filtered.filter(car => 
                car.modelName.toLowerCase().includes(search.toLowerCase()) ||
                car.brandName.toLowerCase().includes(search.toLowerCase()) ||
                car.category.toLowerCase().includes(search.toLowerCase()) ||
                car.color.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredCars(filtered);
    }, [location.search, cars]);

    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;

    const filteredCarsToShow = filteredCars.filter((car) => {
        return (
            (car.modelName && car.modelName.toLowerCase().includes(searchQuery.toLowerCase())) || 
            (car.brandName && car.brandName.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    });

    const currentCars = filteredCarsToShow.slice(indexOfFirstCar, indexOfLastCar);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex flex-col md:flex-row">
            <SideBar setFilteredCars={setFilteredCars} />

            <section className="max-w-screen-xl mx-auto px-4 mb-12 flex-1 mt-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentCars.map((car) => (
                        <Link
                            to={`/detail/${car.id}`}
                            key={car.id}
                            className="group border rounded-lg p-4 hover:shadow-lg transition-shadow"
                        >
                            <div className="relative overflow-hidden rounded-lg mb-3">
                                {car.image ? (
                                    <img
                                        src={`${conf.apiUrlPrefix}${car.image}`}
                                        alt={car.modelName}
                                        className="w-full h-48 sm:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-48 sm:h-64 flex items-center justify-center bg-gray-200 text-gray-500">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h3 className="font-medium mb-1">{car.modelName}</h3>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-primary font-semibold">{car.brandName}</span>
                                <span className="text-sm text-gray-500">{car.price.toLocaleString()} ฿</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>{car.category}</span>
                                <span>{car.color}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredCarsToShow.length > carsPerPage && (
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            current={currentPage}
                            pageSize={carsPerPage}
                            total={filteredCarsToShow.length}
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
