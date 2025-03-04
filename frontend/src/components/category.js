import React, { useState, useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaCar, FaTruck, FaBus, FaCarSide } from "react-icons/fa";
import { IoCarSportSharp, IoCarSharp } from "react-icons/io5";
import { BsFillLightningChargeFill } from "react-icons/bs";

const CarCategoryScroll = () => {
    const scrollContainerRef = useRef(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [isPressed, setIsPressed] = useState(false);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const categories = [
        { id: 1, name: "Sedan", icon: <FaCarSide />, description: "Classic four-door family car" },
        { id: 2, name: "SUV", icon: <FaCar />, description: "Spacious sport utility vehicle" },
        { id: 3, name: "Coupe", icon: <IoCarSharp />, description: "Stylish two-door car" },
        { id: 4, name: "Hatchback", icon: <FaCarSide />, description: "Compact car with rear door" },
        { id: 5, name: "Convertible", icon: <IoCarSportSharp />, description: "Car with retractable roof" },
        { id: 6, name: "Luxury", icon: <FaCar />, description: "Premium high-end vehicle" },
        { id: 7, name: "Van", icon: <FaTruck />, description: "Spacious cargo vehicle" },
        { id: 8, name: "Pickup", icon: <FaTruck />, description: "Utility vehicle with open cargo area" },
        { id: 9, name: "Minivan", icon: <FaBus />, description: "Family-oriented passenger van" },
        { id: 10, name: "Electric Car", icon: <BsFillLightningChargeFill />, description: "Battery-powered vehicle" },
        { id: 11, name: "Hybrid", icon: <IoCarSharp />, description: "Dual power source vehicle" },
        { id: 12, name: "Sport", icon: <IoCarSportSharp />, description: "High-performance vehicle" }
    ];

    const handleScroll = (direction) => {
        if (!scrollContainerRef.current) return;
        
        const scrollAmount = direction === 'left' ? -800 : 800;
        scrollContainerRef.current.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    const handleCategoryClick = (category) => {
        setActiveCategory(category.id === activeCategory ? null : category.id);
        setIsPressed(true);
    };

    const handleMouseUp = () => {
        setIsPressed(false);
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const checkScroll = () => {
            const { scrollLeft, scrollWidth, clientWidth } = container;
            setIsAtStart(scrollLeft === 0);
            setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
        };

        const debouncedCheckScroll = debounce(checkScroll, 100);

        container.addEventListener("scroll", debouncedCheckScroll);
        checkScroll(); // Initial check

        return () => {
            container.removeEventListener("scroll", debouncedCheckScroll);
        };
    }, []);

    const debounce = (fn, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    };

    return (
        <div className="relative w-full py-8 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Car Categories</h2>
                <div className="relative group">
                    {!isAtStart && (
                        <button
                            onClick={() => handleScroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg opacity-70 hover:opacity-100 transition-opacity duration-300 hidden md:block"
                            aria-label="Scroll left"
                        >
                            <FaChevronLeft className="text-primary w-6 h-6" />
                        </button>
                    )}

                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-4 py-4 px-2 scroll-smooth"
                        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
                        role="list"
                    >
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                onMouseDown={() => handleCategoryClick(category)}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                className={`
                                    flex-shrink-0 w-64 p-4 rounded-lg 
                                    transition-all duration-300 transform 
                                    hover:scale-105 cursor-pointer
                                    hover:shadow-lg hover:shadow-primary/20
                                    ${isPressed && activeCategory === category.id 
                                        ? "bg-primary text-white" 
                                        : "bg-card hover:bg-primary/10"}
                                `}
                                role="listitem"
                            >
                                <div className="flex flex-col items-center space-y-3">
                                    <div className={`
                                        text-4xl transition-colors duration-300
                                        ${isPressed && activeCategory === category.id 
                                            ? "text-white" 
                                            : "text-primary group-hover:text-primary"}
                                    `}>
                                        {category.icon}
                                    </div>
                                    <h3 className="font-semibold text-lg transition-colors duration-300">
                                        {category.name}
                                    </h3>
                                    <p className={`
                                        text-sm text-center transition-colors duration-300
                                        ${isPressed && activeCategory === category.id 
                                            ? "opacity-90" 
                                            : "opacity-80"}
                                    `}>
                                        {category.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!isAtEnd && (
                        <button
                            onClick={() => handleScroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg opacity-70 hover:opacity-100 transition-opacity duration-300 hidden md:block"
                            aria-label="Scroll right"
                        >
                            <FaChevronRight className="text-primary w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CarCategoryScroll;
