import React, { useState } from 'react';
import { Car, Truck, Bus } from 'lucide-react';

const categories = [
    { id: 1, name: "Sedan", icon: Car, count: 12 },
    { id: 2, name: "SUV", icon: Car, count: 8 },
    { id: 3, name: "Truck", icon: Truck, count: 6 },
    { id: 4, name: "Bus", icon: Bus, count: 4 },
];

const CategorySection = () => {
    const [activeCategory, setActiveCategory] = useState("all");

    return (
        <section className="max-w-screen-xl mx-auto px-4 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
            const Icon = category.icon;
            return (
                <button
                key={category.id}
                onClick={() => setActiveCategory(category.name)}
                className="p-6 rounded-lg border transition-all transform border-gray-200 hover:border-primary/50 hover:scale-105 hover:shadow-lg"
                >
                <div className="flex flex-col items-center gap-2">
                    <Icon className="w-8 h-8" />
                    <h3 className="font-medium">{category.name}</h3>
                    <span className="text-sm text-gray-500">{category.count} cars</span>
                </div>
                </button>
            );
            })}
        </div>
        </section>
    );
};

export default CategorySection;
