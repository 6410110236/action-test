import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, Modal, message } from 'antd';
import axios from 'axios';
import conf from '../../api/main';

const { Option } = Select;

const Order = () => {
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('jwt');
            if (!token) {
                throw new Error('No JWT token found');
            }

            const headers = {
                Authorization: `Bearer ${token}`
            };

            const [brandsResponse, modelsResponse, categoriesResponse] = await Promise.all([
                axios.get(`${conf.apiUrlPrefix}/api/brands`, { headers }),
                axios.get(`${conf.apiUrlPrefix}/api/models`, { headers }),
                axios.get(`${conf.apiUrlPrefix}/api/category-cars`, { headers })
            ]);

            setBrands(brandsResponse.data.data);
            setModels(modelsResponse.data.data);
            setCategories(categoriesResponse.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async (values) => {
        try {
            const token = localStorage.getItem('jwt');
            if (!token) {
                throw new Error('No JWT token found');
            }

            const headers = {
                Authorization: `Bearer ${token}`
            };

            console.log('Saving order with values:', values);

            await axios.post(`${conf.apiUrlPrefix}/api/orders`, {
                data: {
                    BrandCar: values.brand,
                    Model: values.model,
                    CategoryCar: values.category,
                    Order: values.order
                }
            }, { headers });

            message.success('Order saved successfully');
            navigate('/user');
        } catch (error) {
            console.error('Error saving order:', error);
            message.error('Failed to save order');
        }
    };

    const handleBack = () => {
        Modal.confirm({
            title: 'Are you sure you want to go back?',
            content: 'Changes will not be saved.',
            onOk: () => navigate('/user')
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-4xl bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">Add Order</h2>
                <Form layout="vertical" onFinish={handleSave}>
                    <Form.Item
                        name="brand"
                        label="BrandCar"
                        rules={[{ required: true, message: 'Please select a brand' }]}
                    >
                        <Select placeholder="Select a brand">
                            {brands.map((brand) => (
                                <Option key={brand.id} value={brand.id}>
                                    {brand.attributes.BrandName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="model"
                        label="Model"
                        rules={[{ required: true, message: 'Please select a model' }]}
                    >
                        <Select placeholder="Select a model">
                            {models.map((model) => (
                                <Option key={model.id} value={model.id}>
                                    {model.attributes.ModelName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="CategoryCar"
                        rules={[{ required: true, message: 'Please select a category' }]}
                    >
                        <Select placeholder="Select a category">
                            {categories.map((category) => (
                                <Option key={category.id} value={category.id}>
                                    {category.attributes.Category}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="order"
                        label="Order"
                        rules={[{ required: true, message: 'Please enter the order details' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Enter order details" />
                    </Form.Item>
                    <div className="flex justify-between">
                        <Button type="default" onClick={handleBack}>
                            Back
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Order;