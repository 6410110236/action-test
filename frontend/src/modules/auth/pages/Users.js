import React from 'react';

function Users() {
    return (
      <div className="min-h-screen bg-blue-50 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Cart Section */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h1 className="text-2xl font-semibold">Seller's cart</h1>
                <p className="text-gray-600">You have 3 item in your cart</p>
              </div>
              
              {/* Cart Item */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 relative overflow-hidden rounded-md">
                    <img
                      src="/placeholder.svg"
                      alt="Car"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Car Model</h3>
                    <p className="text-sm text-gray-500">Description</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">$Price</span>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
  
              {/* Repeat the above cart item div for each item */}
              
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md">
                ADD
              </button>
            </div>
  
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Seller Name</h2>
                <p className="text-gray-500">Seller</p>
              </div>
              
              <div className="space-y-6">
                <h3 className="font-semibold border-b pb-2">PROFILE</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gray-100 rounded-full" />
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
          </div>
        </div>
      </div>
    )
  }

export default Users;
