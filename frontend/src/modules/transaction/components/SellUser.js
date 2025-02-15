import React, { useEffect, useState } from 'react';
import { client, gql } from './apolloClient';
import AddCarForm from './AddCarForm';

const GET_CARS = gql`
  query GetAllBrands {
    garages_connection {
      nodes {  
        documentId
        Price
        Picture {
          url
        }
        model {
          ModelName
          brand_car {
            BrandName
          }
        }
      }
    }
  }
`;

function SellUser() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    client.query({ query: GET_CARS })
      .then(response => {
        console.log('🚀 Data from API:', response.data);
        setCars(response.data.garages_connection.nodes); 
      })
      .catch(error => console.error('❌ Error fetching data:', error));
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Cart Section */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h1 className="text-2xl font-semibold">Seller's Cart</h1>
              <p className="text-gray-600">You have {cars.length} item(s) in your cart</p>
            </div>

            {/* Cart Items */}
            {cars.length > 0 ? (
              cars.map((car) => (
                <div key={car.documentId} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 relative overflow-hidden rounded-md">
                      <img
                        src={car.Picture.length > 0 ? "http://localhost:1337"+car.Picture[0].url : "/placeholder.svg"}
                        alt={car.model.ModelName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{car.model.ModelName}</h3>
                      <p className="text-sm text-gray-500">{car.model.brand_car.BrandName}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">${car.Price.toLocaleString()}</span>
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No cars available.</p>
            )}

            <AddCarForm />
          </div>

          {/* Profile Card */}
          
        </div>
      </div>
    </div>
  );
}

export default SellUser;
