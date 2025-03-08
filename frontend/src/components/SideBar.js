import React, { useState, useEffect } from 'react';
import { Select, Drawer, Button, Input, Checkbox, Tag } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import useCarStore from '../logic/carStore';
import { useLocation, useNavigate } from 'react-router-dom';

const { Option } = Select;

const SideBar = ({ setFilteredCars }) => {
    const [visible, setVisible] = useState(false);
    const [sortOption, setSortOption] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);

    const { cars: carData } = useCarStore();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setFilteredCars(carData);
    }, [carData, setFilteredCars]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const category = params.get('category');
        if (category) {
            setSelectedCategories([category]);
            filterCars(searchTerm, [category], selectedBrands, minPrice, maxPrice, sortOption);
        }
    }, [location.search]);

    const showDrawer = () => setVisible(true);
    const onClose = () => setVisible(false);

    const handleSort = (value, carsToSort = []) => {
        setSortOption(value);
        let sortedCars = Array.isArray(carsToSort) ? [...carsToSort] : [];

        switch (value) {
            case 'price-asc':
                sortedCars.sort(
                    (a, b) =>
                        parseInt(String(a.price).replace(/[^0-9]/g, '')) -
                        parseInt(String(b.price).replace(/[^0-9]/g, ''))
                );
                break;
            case 'price-desc':
                sortedCars.sort(
                    (a, b) =>
                        parseInt(String(b.price).replace(/[^0-9]/g, '')) -
                        parseInt(String(a.price).replace(/[^0-9]/g, ''))
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

    const handleSearch = (value) => {
        setSearchTerm(value);
        filterCars(value, selectedCategories, selectedBrands, minPrice, maxPrice, sortOption);
    };

    const handleCategoryChange = (checkedValues) => {
        setSelectedCategories(checkedValues);
        filterCars(searchTerm, checkedValues, selectedBrands, minPrice, maxPrice, sortOption);
    };

    const handleBrandChange = (checkedValues) => {
        setSelectedBrands(checkedValues);
        filterCars(searchTerm, selectedCategories, checkedValues, minPrice, maxPrice, sortOption);
    };

    const filterCars = (search, categories, brands, minPriceFilter, maxPriceFilter, sortOption) => {
        let filteredCars = [...carData];

        if (search) {
            filteredCars = filteredCars.filter(
                (car) =>
                    (car.modelName && car.modelName.toLowerCase().includes(search.toLowerCase())) ||
                    (car.brandName && car.brandName.toLowerCase().includes(search.toLowerCase())) ||
                    (car.category && car.category.toLowerCase().includes(search.toLowerCase())) ||
                    (car.color && car.color.toLowerCase().includes(search.toLowerCase()))
            );
        }

        if (categories.length > 0) {
            filteredCars = filteredCars.filter((car) =>
                categories.includes(car.category)
            );
        }

        if (brands.length > 0) {
            filteredCars = filteredCars.filter((car) =>
                brands.includes(car.brandName)
            );
        }

        if (minPriceFilter) {
            filteredCars = filteredCars.filter(
                (car) =>
                    parseInt(String(car.price).replace(/[^0-9]/g, '')) >=
                    parseInt(minPriceFilter)
            );
        }

        if (maxPriceFilter) {
            filteredCars = filteredCars.filter(
                (car) =>
                    parseInt(String(car.price).replace(/[^0-9]/g, '')) <=
                    parseInt(maxPriceFilter)
            );
        }

        handleSort(sortOption, filteredCars);
    };

    const categoryOptions = [
        ...new Set(carData.map((car) => car.category || '')),
    ];

    const brandOptions = [
        ...new Set(carData.map((car) => car.brandName || '')),
    ];

    const Filters = (
        <div>
            <h3 className="text-xl font-semibold mb-4">Search and Sort</h3>

            <div className="mb-4">
                <Input.Search
                    placeholder="Search by model, brand, category, or color"
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
                            maxPrice,
                            sortOption
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
                            e.target.value,
                            sortOption
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
                    onChange={(value) => handleSort(value, carData)}
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