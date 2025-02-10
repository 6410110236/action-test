import React from 'react';
import BannerCarousel from '../components/banner';
import CarCategoryScroll from '../components/category';
import LatestCarsSection from '../components/carlist';

function Home() {
    return (
        <div className="min-h-screen bg-gray-50">
        <BannerCarousel />
        <CarCategoryScroll />
        <LatestCarsSection />
        </div>
    );
}

export default Home;
