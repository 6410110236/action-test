import React, { useEffect, useState } from 'react';
// import { client, gql } from './apolloClient';



function Users() {
    // const [cars, setCars] = useState([]);

//   useEffect(() => {
//     client.query({ query: GET_CARS })
//       .then(response => {
//         console.log('🚀 Data from API:', response.data);
//         setCars(response.data.garages_connection.nodes); 
//       })
//       .catch(error => console.error('❌ Error fetching data:', error));
//   }, []);



    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Seller Name</h2>
              <p className="text-gray-500">Seller</p>
            </div>

            <div className="space-y-6">
              <h3 className="font-semibold border-b pb-2">PROFILE</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p>Username</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p>Contact Number</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>Email Address</p>
                </div>
              </div>
            </div>
          </div>
    );
}

export default Users;
