import React, { useState, useEffect } from 'react';
import { Select, Drawer, Button, Input, Checkbox, Tag } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import useCarStore from '../logic/carStore'; // นำเข้า useCarStore จาก store ที่สร้างไว้

const { Option } = Select;

const SideBar = () => {
    // สถานะสำหรับการแสดง Drawer
    const [visible, setVisible] = useState(false);
    // สถานะสำหรับตัวเลือกการจัดเรียง
    const [sortOption, setSortOption] = useState(null);
    // สถานะสำหรับคำค้นหา
    const [searchTerm, setSearchTerm] = useState('');
    // สถานะสำหรับหมวดหมู่ที่เลือก
    const [selectedCategories, setSelectedCategories] = useState([]);
    // สถานะสำหรับยี่ห้อที่เลือก
    const [selectedBrands, setSelectedBrands] = useState([]);
    // สถานะสำหรับราคาขั้นต่ำ
    const [minPrice, setMinPrice] = useState(null);
    // สถานะสำหรับราคาขั้นสูง
    const [maxPrice, setMaxPrice] = useState(null);

    // ดึงข้อมูลจาก useCarStore
    const { cars: carData, setCars } = useCarStore();

    // สถานะสำหรับเก็บข้อมูลรถที่กรองแล้ว
    const [filteredCars, setFilteredCars] = useState([]);

    useEffect(() => {
        // จัดเก็บข้อมูลดั้งเดิมไว้
        setFilteredCars(carData);
    }, [carData]);

    // ฟังก์ชันสำหรับแสดง Drawer
    const showDrawer = () => {
        setVisible(true);
    };

    // ฟังก์ชันสำหรับปิด Drawer
    const onClose = () => {
        setVisible(false);
    };

    // ฟังก์ชันสำหรับจัดเรียงข้อมูล
    const handleSort = (value) => {
        setSortOption(value);
        let sortedCars = [...filteredCars];

        switch (value) {
            case 'price-asc':
                sortedCars.sort(
                    (a, b) =>
                        parseInt(a.price.replace(/[^0-9]/g, '')) -
                        parseInt(b.price.replace(/[^0-9]/g, ''))
                );
                break;
            case 'price-desc':
                sortedCars.sort(
                    (a, b) =>
                        parseInt(b.price.replace(/[^0-9]/g, '')) -
                        parseInt(a.price.replace(/[^0-9]/g, ''))
                );
                break;
            case 'brand':
                sortedCars.sort((a, b) => a.brandName.localeCompare(b.brandName));
                break;
            case 'category':
                sortedCars.sort((a, b) => a.category.localeCompare(b.category));
                break;
            case 'model':
                sortedCars.sort((a, b) => a.modelName.localeCompare(b.modelName));
                break;
            default:
                break;
        }

        setFilteredCars(sortedCars);
    };

    // กรองข้อมูลตามคำค้นหา (Debounced)
    const handleSearch = debounce((value) => {
        setSearchTerm(value);
        filterCars(value, selectedCategories, selectedBrands, minPrice, maxPrice);
    }, 300);

    // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงหมวดหมู่ที่เลือก
    const handleCategoryChange = (checkedValues) => {
        setSelectedCategories(checkedValues);
        filterCars(searchTerm, checkedValues, selectedBrands, minPrice, maxPrice);
    };

    // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงยี่ห้อที่เลือก
    const handleBrandChange = (checkedValues) => {
        setSelectedBrands(checkedValues);
        filterCars(searchTerm, selectedCategories, checkedValues, minPrice, maxPrice);
    };

    // ฟังก์ชันสำหรับกรองข้อมูลรถยนต์
    const filterCars = (search, categories, brands, minPriceFilter, maxPriceFilter) => {
    let filteredCars = [...carData];

    // การค้นหาตามคำค้นหาของผู้ใช้
    if (search) {
        filteredCars = filteredCars.filter(
            (car) =>
                (car.modelName && car.modelName.toLowerCase().includes(search.toLowerCase())) ||
                (car.brandName && car.brandName.toLowerCase().includes(search.toLowerCase()))
        );
    }

    // การกรองหมวดหมู่
    if (categories.length > 0) {
        filteredCars = filteredCars.filter((car) =>
            categories.includes(car.category)
        );
    }

    // การกรองยี่ห้อ
    if (brands.length > 0) {
        filteredCars = filteredCars.filter((car) =>
            brands.includes(car.brandName)
        );
    }

    // การกรองตามราคาขั้นต่ำ
    if (minPriceFilter) {
        filteredCars = filteredCars.filter(
            (car) =>
                parseInt(car.price.replace(/[^0-9]/g, '')) >=
                parseInt(minPriceFilter)
        );
    }

    // การกรองตามราคาขั้นสูง
    if (maxPriceFilter) {
        filteredCars = filteredCars.filter(
            (car) =>
                parseInt(car.price.replace(/[^0-9]/g, '')) <=
                parseInt(maxPriceFilter)
        );
    }

    setFilteredCars(filteredCars);
};

    // ตัวเลือกหมวดหมู่
    const categoryOptions = [
        ...new Set(carData.map((car) => car.category || '')),
    ];

    // ตัวเลือกยี่ห้อ
    const brandOptions = [
        ...new Set(carData.map((car) => car.brandName || '')),
    ];

    // Filters component
    const Filters = (
        <div>
            <h3 className="text-xl font-semibold mb-4">Search and Sort</h3>

            <div className="mb-4">
                <Input.Search
                    placeholder="Search by model or brand"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleSearch(e.target.value);
                    }}
                    style={{ width: '100%' }}
                />
            </div>

            <div className="mb-4">
                <h4 className="font-medium mb-2">Categories</h4>
                <Checkbox.Group
                    options={categoryOptions}
                    value={selectedCategories}
                    onChange={handleCategoryChange}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                />
            </div>

            <div className="mb-4">
                <h4 className="font-medium mb-2">Brands</h4>
                <Checkbox.Group
                    options={brandOptions}
                    value={selectedBrands}
                    onChange={handleBrandChange}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                />
            </div>

            <div className="mb-4">
                <h4 className="font-medium mb-2">Price Range</h4>
                <Input
                    placeholder="Min Price"
                    type="number"
                    value={minPrice}
                    onChange={(e) => {
                        setMinPrice(e.target.value);
                        filterCars(
                            searchTerm,
                            selectedCategories,
                            selectedBrands,
                            e.target.value,
                            maxPrice
                        );
                    }}
                    style={{ marginBottom: '8px' }}
                />
                <Input
                    placeholder="Max Price"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => {
                        setMaxPrice(e.target.value);
                        filterCars(
                            searchTerm,
                            selectedCategories,
                            selectedBrands,
                            minPrice,
                            e.target.value
                        );
                    }}
                />
            </div>

            <div className="mb-4">
                <h4 className="font-medium mb-2">Selected Filters:</h4>
                <div className="flex flex-wrap gap-2">
                    {selectedBrands.map((brand) => (
                        <Tag key={brand} color="geekblue">
                            {brand}
                        </Tag>
                    ))}
                    {selectedCategories.map((category) => (
                        <Tag key={category} color="blue">
                            {category}
                        </Tag>
                    ))}
                    {minPrice && (
                        <Tag color="green">Min: ${minPrice}</Tag>
                    )}
                    {maxPrice && (
                        <Tag color="red">Max: ${maxPrice}</Tag>
                    )}
                </div>
            </div>

            <div className="mb-4">
                <h4 className="font-medium mb-2">Sort By</h4>
                <Select
                    value={sortOption}
                    onChange={handleSort}
                    style={{ width: '100%' }}
                    placeholder="Select option"
                >
                    <Option value="price-asc">Price: Low to High</Option>
                    <Option value="price-desc">Price: High to Low</Option>
                    <Option value="brand">Brand</Option>
                    <Option value="category">Category</Option>
                    <Option value="model">Model</Option>
                </Select>
            </div>

            <Button
                onClick={() => {
                    setSearchTerm('');
                    setSelectedCategories([]);
                    setSelectedBrands([]);
                    setMinPrice(null);
                    setMaxPrice(null);
                    setSortOption(null);
                    setFilteredCars(carData);
                }}
                style={{ width: '100%' }}
            >
                Reset Filters
            </Button>
        </div>
    );

    return (
        <>
            <div className="md:hidden p-4">
                <Button
                    type="primary"
                    onClick={showDrawer}
                    icon={<MenuOutlined />}
                >
                    Filter & Sort
                </Button>
            </div>

            <div className="hidden md:block w-64 p-4 border-r">
                {Filters}
            </div>

            <Drawer
                title="Filter & Sort"
                placement="left"
                onClose={onClose}
                visible={visible}
                bodyStyle={{ paddingBottom: 80 }}
            >
                {Filters}
                <Button
                    type="primary"
                    onClick={onClose}
                    className="mt-4"
                    style={{ width: '100%' }}
                >
                    Close Menu
                </Button>
            </Drawer>
        </>
    );
};

export default SideBar;