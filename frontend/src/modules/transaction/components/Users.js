import React, { useEffect, useState } from 'react';
import { client, gql } from '../../../utils/apolloClient';

const GET_USER = gql`
  query UsersPermissionsUser {
  usersPermissionsUser(documentId:"s5zlmm3u7a6bgopyrd846aoy") {
    ContactNumber
    documentId
    username
    email
    Picture {
      url
    }
    role {
      name
    }
  }
}
`;

function Users() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // const documentId = 's5zlmm3u7a6bgopyrd846aoy'; // Replace with actual document ID
    client.query({ query: GET_USER })
      .then(response => {
        console.log('🚀 Data from API:', response.data);
        setUser(response.data.usersPermissionsUser);
      })
      .catch(error => console.error('❌ Error fetching data:', error));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="mb-4 relative w-24 h-24 mx-auto">
          <img
            src={user.Picture?.url ? `${process.env.REACT_APP_BASE_URL}${user.Picture.url}` : "/placeholder.svg"}
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
