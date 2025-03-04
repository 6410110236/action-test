import React, { useEffect, useState } from "react";
import { client } from "../../api/apolloClient";
import AddCarForm from "./AddCarForm";
import { GET_CARS, DELETE_CAR } from "../../api/main";
import useAuthStore from "../../logic/authStore";
import EditCarForm from "./EditCarForm";
import conf from "../../api/main";

function SellUser() {
  const [cars, setCars] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

  const jwtSell = useAuthStore((state) => state.jwt);
  const idSeller = useAuthStore((state) => state.user.documentId);
  console.log("Sell : ", jwtSell);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
    client
      .query({
        query: GET_CARS,
        variables: {
          filters: {
            users_permissions_user: {
              documentId: {
                eq: idSeller,
              },
            },
          },
        },
        fetchPolicy: "network-only",
      })
      .then((response) => {
        console.log("🚀 Data from API:", response.data);
        console.log("Base URL:", conf.apiUrlPrefix);
        console.log("Image URL:", cars.Picture?.[0]?.url);
        setCars(response.data.garages);
      })
      .catch((error) => console.error("❌ Error fetching data:", error));
  };

  const handleDelete = (documentId) => {
    // แสดง popup confirmation
    setCarToDelete(documentId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    // ใช้ Apollo Client โดยตรงเพื่อเรียก mutation
    client
      .mutate({
        mutation: DELETE_CAR,
        variables: { documentId: carToDelete },
        context: {
          headers: {
            Authorization: `Bearer ${jwtSell}`, // ✅ ส่ง JWT ไปกับ Header
          },
        },
      })
      .then((response) => {
        console.log("✅ Car deleted:", response.data.deleteGarage.documentId);
        setCars(cars.filter((car) => car.documentId !== carToDelete)); // อัปเดตสถานะหลังจากลบ
        setShowDeleteConfirmation(false); // ปิด popup
        setCarToDelete(null);
      })
      .catch((error) => {
        console.error("❌ Error deleting car:", error);
        setShowDeleteConfirmation(false);
        setCarToDelete(null);
      });
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setCarToDelete(null);
  };

  const handleGaragesUpdated = (garages) => {
    // Update the garages state with the new data
    setCars(garages);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 flex justify-center items-center">
      <div className="w-full max-w-7xl bg-white p-6 items-center justify-center rounded-lg shadow-md">
        <div className="gap-6 md:grid-cols-3">
          {/* Cart Section */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h1 className="text-2xl font-semibold">Seller's Cart</h1>
              <p className="text-gray-600">
                You have {cars.length} item(s) in your cart
              </p>
            </div>

            {/* Cart Items */}
            {cars.length > 0 ? (
              cars.map((car) => (
                <div
                  key={car.documentId}
                  className="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center hover:shadow-lg hover:bg-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 relative overflow-hidden rounded-md">
                      <img
                        src={
                          car.Picture?.[0]?.url
                            ? `${conf.apiUrlPrefix}${car.Picture[0].url}`
                            : "/placeholder.svg"
                        }
                        alt={car.model.ModelName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{car.model.ModelName}</h3>
                      <p className="text-sm text-gray-500">
                        {car.model.brand_car.BrandName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">
                      ${car.Price.toLocaleString()}
                    </span>

                    <EditCarForm
                      item={car}
                      onGaragesUpdated={handleGaragesUpdated}
                    />

                    <button
                      onClick={() => handleDelete(car.documentId)} // เรียกใช้ handleDelete เมื่อคลิก
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No cars available.</p>
            )}

            <AddCarForm onGaragesUpdated={handleGaragesUpdated} item={cars} />
          </div>

          {/* Profile Card */}
        </div>
      </div>
      {/* Delete Confirmation Popup */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this car?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellUser;
