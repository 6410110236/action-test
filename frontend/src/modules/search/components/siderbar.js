import React, { useState, useEffect } from 'react';
import { Select, Drawer, Button, Input, Checkbox, Tag } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';

const { Option } = Select;

const SideBar = ({ cars, setCars }) => {
    const [visible, setVisible] = useState(false);
    const [sortOption, setSortOption] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [originalCars, setOriginalCars] = useState([]);
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);

    useEffect(() => {
        setOriginalCars(cars);
    }, []);

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const handleSort = (value) => {
        setSortOption(value);
        let sortedCars = [...cars];

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

        setCars(sortedCars);
    };

    const handleSearch = debounce((value) => {
        setSearchTerm(value);
        filterCars(value, selectedCategories, selectedBrands, minPrice, maxPrice);
    }, 300);

    const handleCategoryChange = (checkedValues) => {
        setSelectedCategories(checkedValues);
        filterCars(searchTerm, checkedValues, selectedBrands, minPrice, maxPrice);
    };

    const handleBrandChange = (checkedValues) => {
        setSelectedBrands(checkedValues);
        filterCars(searchTerm, selectedCategories, checkedValues, minPrice, maxPrice);
    };

    const filterCars = (search, categories, brands, minPriceFilter, maxPriceFilter) => {
        let filteredCars = [...originalCars];

        if (search) {
            filteredCars = filteredCars.filter(
                (car) =>
                    car.modelName.toLowerCase().includes(search.toLowerCase()) ||
                    car.brandName.toLowerCase().includes(search.toLowerCase())
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
                    parseInt(car.price.replace(/[^0-9]/g, '')) >=
                    parseInt(minPriceFilter)
            );
        }

        if (maxPriceFilter) {
            filteredCars = filteredCars.filter(
                (car) =>
                    parseInt(car.price.replace(/[^0-9]/g, '')) <=
                    parseInt(maxPriceFilter)
            );
        }

        setCars(filteredCars);
    };

    const categoryOptions = [
        ...new Set(originalCars.map((car) => car.category)),
    ];

    const brandOptions = [
        ...new Set(originalCars.map((car) => car.brandName)),
    ];

    const Filters = (
        <div>
            <h3 className="text-xl font-semibold mb-4">ค้นหาและจัดเรียง</h3>

            <div className="mb-4">
                <Input.Search
                    placeholder="ค้นหาตามรุ่นหรือยี่ห้อ"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleSearch(e.target.value);
                    }}
                    style={{ width: '100%' }}
                />
            </div>

            <div className="mb-4">
                <h4 className="font-medium mb-2">หมวดหมู่</h4>
                <Checkbox.Group
                    options={categoryOptions}
                    value={selectedCategories}
                    onChange={handleCategoryChange}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                />
            </div>

            <div className="mb-4">
                <h4 className="font-medium mb-2">ยี่ห้อ</h4>
                <Checkbox.Group
                    options={brandOptions}
                    value={selectedBrands}
                    onChange={handleBrandChange}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                />
            </div>

            <div className="mb-4">
                <h4 className="font-medium mb-2">กรองตามราคา</h4>
                <Input
                    placeholder="ราคาขั้นต่ำ"
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
                    placeholder="ราคาขั้นสูง"
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
                <h4 className="font-medium mb-2">ตัวกรองที่เลือก:</h4>
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
                        <Tag color="green">ราคาขั้นต่ำ: ฿{minPrice}</Tag>
                    )}
                    {maxPrice && (
                        <Tag color="red">ราคาขั้นสูง: ฿{maxPrice}</Tag>
                    )}
                </div>
            </div>

            <div className="mb-4">
                <h4 className="font-medium mb-2">จัดเรียงโดย</h4>
                <Select
                    value={sortOption}
                    onChange={handleSort}
                    style={{ width: '100%' }}
                    placeholder="เลือกตัวเลือก"
                >
                    <Option value="price-asc">ราคา: ต่ำไปสูง</Option>
                    <Option value="price-desc">ราคา: สูงไปต่ำ</Option>
                    <Option value="brand">ยี่ห้อ</Option>
                    <Option value="category">หมวดหมู่</Option>
                    <Option value="model">รุ่น</Option>
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
                    setCars(originalCars);
                }}
                style={{ width: '100%' }}
            >
                รีเซ็ตตัวกรอง
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
                    กรอง & จัดเรียง
                </Button>
            </div>

            <div className="hidden md:block w-64 p-4 border-r">
                {Filters}
            </div>

            <Drawer
                title="กรอง & จัดเรียง"
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
                    ปิดเมนู
                </Button>
            </Drawer>
        </>
    );
};

export default SideBar;