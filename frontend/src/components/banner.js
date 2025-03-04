import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles

const banners = [
    {
        id: 1,
        image: "https://static.vecteezy.com/system/resources/thumbnails/035/757/238/small_2x/ai-generated-sport-car-firewall-wallpaper-free-photo.jpg",
        title: "Premium Cars",
        description: "Discover our luxury collection"
    },
    {
        id: 2,
        image: "https://media.architecturaldigest.com/photos/6762eb5a09186853034dd973/4:3/w_2880,h_2160,c_limit/10)%20Jaguar-GT%20%5BJaguar%5D.jpg",
        title: "New Arrivals",
        description: "Check out our latest models"
    },
    {
        id: 3,
        image: "https://hips.hearstapps.com/hmg-prod/images/2025-camry-se-awd-supersonicred-003-6622d9f47d39b.jpg?crop=0.732xw:0.743xh;0.117xw,0.215xh&resize=980:*",
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
            <div key={banner.id} className="relative h-96" >
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
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
