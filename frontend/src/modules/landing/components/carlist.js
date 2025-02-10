import React from 'react';
import { Clock } from 'lucide-react';

const latestCars = [
    {
        id: 1,
        name: "Luxury Sedan 2024",
        price: "$50,000",
        image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=400&h=300",
        category: "Sedan"
    },
    {
        id: 2,
        name: "Sport SUV Plus",
        price: "$45,000",
        image: "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?auto=format&fit=crop&w=400&h=300",
        category: "SUV"
    },
    {
        id: 3,
        name: "Electric Compact",
        price: "$35,000",
        image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=400&h=300",
        category: "Sedan"
    },
    ];
    
const LatestCarsSection = () => {
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
                <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-medium mb-1">{car.name}</h3>
                <div className="flex justify-between items-center">
                <span className="text-primary font-semibold">{car.price}</span>
                <span className="text-sm text-gray-500">{car.category}</span>
                </div>
            </div>
            ))}
        </div>
        </section>
    );
};

export default LatestCarsSection;
