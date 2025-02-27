import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, Link, useLocation } from 'react-router-dom';
import Home from '../modules/landing/pages/Home';
import SignIn from '../modules/auth/pages/signIn';
import SignUp from '../modules/auth/pages/signUp';
import SellUser from '../modules/transaction/components/SellUser';
import Order from '../modules/transaction/order';
import CarCart from '../modules/search/pages/CarCart';
import Users from '../modules/transaction/components/Users';
import Detail from '../modules/detail/mock/detail';
import useAuthStore from '../store/authStore';
import ConfigGarage from '../modules/transaction/components/ConfigGarage';
import Payment from '../pages/Payment';
import PaymentSuccess from '../pages/PaymentSuccess';
import PaymentCancel from '../pages/PaymentCancel';

// Role constants with default role
const ROLES = {
  BUYER: 'Buyer',
  SELLER: 'Seller',
  DEFAULT: 'Buyer' // Default role for logged-in users
};

// Protected Route Component with enhanced validation
const ProtectedRoute = ({ children, allowedRoles = [], isLoggedIn, userRole }) => {
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // Simulate role validation
    const validateRole = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      setIsValidating(false);
    };
    validateRole();
  }, []);

  if (isValidating) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If no specific roles are required or user has correct role, allow access
  if (allowedRoles.length === 0 || allowedRoles.includes(userRole || ROLES.DEFAULT)) {
    return children;
  }

  // If user doesn't have required role, redirect to home with error
  return (
    <Navigate 
      to="/home" 
      state={{ 
        error: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
        from: location
      }} 
      replace 
    />
  );
};

const AppRoutes = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const role = useAuthStore((state) => state.role);
  const location = useLocation();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

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
            allowedRoles={[ROLES.BUYER, ROLES.SELLER, ROLES.DEFAULT]}
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
        path="/cofigg" 
        element={
          <ProtectedRoute 
            isLoggedIn={isLoggedIn} 
            allowedRoles={[ROLES.SELLER]} 
            userRole={role}
          >
            <ConfigGarage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/users" 
        element={
          <ProtectedRoute 
            isLoggedIn={isLoggedIn} 
            allowedRoles={[ROLES.SELLER]} 
            userRole={role}
          >
            <Users />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/order" 
        element={
          <ProtectedRoute 
            isLoggedIn={isLoggedIn} 
            allowedRoles={[ROLES.SELLER]} 
            userRole={role}
          >
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
