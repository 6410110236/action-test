import React, { useState } from "react";

function AddCarForm() {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [image, setImage] = useState(null);

    const handleButtonClick = () => {
        setIsPopupVisible(true);
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <button
                onClick={handleButtonClick}
                className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
                ADD
            </button>

            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-xl font-bold mb-4">Add New Car</h2>
                        <form className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                                <div className="w-full h-24 bg-gray-200 flex items-center justify-center border border-gray-300 rounded-md relative">
                                    {image ? (
                                        <img
                                            src={image}
                                            alt="Uploaded"
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    ) : (
                                        <span className="text-gray-500">IMG</span>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Brand</label>
                                <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Model</label>
                                <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">ประเภทเกียร์</label>
                                <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input type="number" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">จำนวนที่นั่ง</label>
                                <input type="number" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">ประเภทการจดทะเบียน</label>
                                <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">คุณสมบัติรถ</label>
                                <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div className="col-span-2 flex justify-end mt-4">
                                <button
                                    type="button"
                                    onClick={handleClosePopup}
                                    className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="ml-2 px-4 py-2 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddCarForm;
