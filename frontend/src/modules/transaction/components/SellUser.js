import React, { useEffect, useState } from "react";
import { client } from "../../../utils/apolloClient";
import AddCarForm from "./AddCarForm";
import { GET_CARS, DELETE_CAR } from "../../../conf/main";
import useAuthStore from "../../../store/authStore";
import EditCarForm from "./EditCarForm";

function SellUser() {
  const [cars, setCars] = useState([]);

  const jwtSell = useAuthStore((state) => state.user.documentId);
  console.log("Sell : ", jwtSell);

  useEffect(() => {
    client
      .query({
        query: GET_CARS,
        variables: {
          filters: {
            users_permissions_user: {
              documentId: {
                eq: jwtSell,
              },
            },
          },
        },
      })
      .then((response) => {
        console.log("🚀 Data from API:", response.data);
        console.log("Base URL:", process.env.REACT_APP_BASE_URL);
        console.log("Image URL:", cars.Picture?.[0]?.url);
        setCars(response.data.garages);
      })
      .catch((error) => console.error("❌ Error fetching data:", error));
  }, []);

  const handleDelete = (documentId) => {
    // ใช้ Apollo Client โดยตรงเพื่อเรียก mutation
    client
      .mutate({
        mutation: DELETE_CAR,
        variables: { documentId },
      })
      .then((response) => {
        console.log("✅ Car deleted:", response.data.deleteGarage.documentId);
        setCars(cars.filter((car) => car.documentId !== documentId)); // อัปเดตสถานะหลังจากลบ
      })
      .catch((error) => console.error("❌ Error deleting car:", error));
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
                            ? `${process.env.REACT_APP_BASE_URL}${car.Picture[0].url}`
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

                    <EditCarForm item={car} />

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

            <AddCarForm item={cars} />
          </div>

          {/* Profile Card */}
        </div>
      </div>
    </div>
  );
}



export default SellUser;
