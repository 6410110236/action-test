import React from 'react';
import BannerCarousel from './banner';
import CategorySection from './category';
import LatestCarsSection from './carlist';

function Home() {
    return (
        <div className="min-h-screen bg-gray-50">
        <BannerCarousel />
        <CategorySection />
        <LatestCarsSection />
        </div>
    );
}

export default Home;
