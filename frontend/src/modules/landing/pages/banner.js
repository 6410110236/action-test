import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles

const banners = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?auto=format&fit=crop&w=1200&h=400",
        title: "Premium Cars",
        description: "Discover our luxury collection"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=1200&h=400",
        title: "New Arrivals",
        description: "Check out our latest models"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?auto=format&fit=crop&w=1200&h=400",
        title: "Special Offers",
        description: "Great deals on selected models"
    },
];

const BannerCarousel = () => {
    return (
        <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={5000}
        showArrows
        showStatus={false}
        >
        {banners.map((banner) => (
            <div key={banner.id}>
            <img src={banner.image} alt={banner.title} />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white">
                <h2 className="text-4xl font-bold mb-2">{banner.title}</h2>
                <p className="text-xl">{banner.description}</p>
                </div>
            </div>
            </div>
        ))}
        </Carousel>
    );
    };

export default BannerCarousel;
