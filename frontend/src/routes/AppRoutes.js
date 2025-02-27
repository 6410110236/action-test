import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from '../modules/landing/pages/Home';
import SignIn from '../modules/auth/pages/signIn';
import SignUp from '../modules/auth/pages/signUp';
import SellUser from '../modules/transaction/components/SellUser';  // ส่วนของ Seller
import Order from '../modules/transaction/order';  // ส่วนของ Seller
import CarCart from '../modules/search/pages/CarCart';  // ส่วนของ Buyer
import Users from '../modules/transaction/components/Users';  // สำหรับ Seller
import Detail from '../modules/detail/mock/detail';
import useAuthStore from '../store/authStore';  // นำเข้า useAuthStore จาก zustand store
import ConfigGarage from '../modules/transaction/components/ConfigGarage';  // ส่วนของ Seller

const AppRoutes = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const role = useAuthStore((state) => state.role);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      
      {/* ส่วนสำหรับ Buyer */}
      <Route path="/buy" element={<CarCart />} />
      
      {/* ส่วนสำหรับ Seller */}
      <Route path="/seller" element={isLoggedIn && role === 'Seller' ? <SellUser /> : <Navigate to="/signin" replace />} />
      <Route path="/cofigg" element={isLoggedIn && role === 'Seller' ? <ConfigGarage /> : <Navigate to="/signin" replace />} />
      <Route path="/users" element={isLoggedIn && role === 'Seller' ? <Users /> : <Navigate to="/signin" replace />} />
      <Route path="/order" element={isLoggedIn && role === 'Seller' ? <Order /> : <Navigate to="/signin" replace />} />

          {/* Protected Routes */}
          <Route 
            path="/detail/:id" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn} userRole={role}>
                <Detail />
              </ProtectedRoute>
            }
          />

          {/* Buyer & Seller Routes */}
          <Route 
            path="/buy" 
            element={
              <ProtectedRoute 
                isLoggedIn={isLoggedIn} 
                allowedRoles={[ROLES.BUYER, ROLES.SELLER]} 
                userRole={role}
              >
                <CarCart />
              </ProtectedRoute>
            } 
          />

          {/* Seller Routes */}
          <Route 
            path="/seller" 
            element={
              <ProtectedRoute 
                isLoggedIn={isLoggedIn} 
                allowedRoles={[ROLES.SELLER]} 
                userRole={role}
              >
                <SellUser />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={[ROLES.SELLER]} userRole={role}>
                <Users />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={[ROLES.SELLER]} userRole={role}>
                <Order />
              </ProtectedRoute>
            } 
          />

          {/* Payment Routes */}
          <Route 
            path="/payment/*" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn} userRole={role}>
                <Routes>
                  <Route path="/" element={<Payment />} />
                  <Route path="success" element={<PaymentSuccess />} />
                  <Route path="cancel" element={<PaymentCancel />} />
                </Routes>
              </ProtectedRoute>
            } 
          />

          {/* 404 Route */}
          <Route 
            path="*" 
            element={
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800">404</h1>
                  <p className="text-gray-600">Page not found</p>
                  <Link 
                    to="/home" 
                    className="mt-4 inline-block text-blue-600 hover:text-blue-800"
                  >
                    Return Home
                  </Link>
                </div>
              </div>
            }
          />
        </Routes>
  );
};

export default AppRoutes;
