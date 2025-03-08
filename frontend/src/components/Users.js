import React, { useEffect, useState } from 'react';
import { client, gql } from '../api/apolloClient';
import { GET_USER } from '../api/main';
import useAuthStore from "../logic/authStore";

function Users() {
  const [user, setUser] = useState(null);
  const jwtSell = useAuthStore((state) => state.user.documentId);

  useEffect(() => {
    // Ensure jwtSell is available before making the request
    if (!jwtSell) return;

    client
      .query({
        query: GET_USER,
        variables: {
          documentId: jwtSell, // No need for eq, just pass the value directly
        },
      })
      .then(response => {
        setUser(response.data.usersPermissionsUser);
      })
      .catch(error => console.error('❌ Error fetching data:', error));
  }, [jwtSell]); // Effect runs when jwtSell changes

  if (!user) return <p>Loading...</p>;

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="mb-4 relative w-24 h-24 mx-auto">
          <img
            src={"https://cdn-icons-png.flaticon.com/512/3135/3135715.png" // รูปดีฟอลต์ในมือถือ
              }
            alt="Profile picture"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <h2 className="text-2xl font-bold">{user.username}</h2>
        <p className="text-gray-500">{user.role?.name || 'No role assigned'}</p> {/* Default message */}
      </div>

      <div className="space-y-6">
        <h3 className="font-semibold border-b pb-2">PROFILE</h3>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Username</p>
            <p className="font-medium">{user.username}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Contact</p>
            <p className="font-medium">{user.ContactNumber}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
