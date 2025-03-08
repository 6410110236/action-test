import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Home from "../pages/home/Home";
import Order from "../pages/home/order";
import SignIn from "../pages/signIn";
import SignUp from "../pages/signUp";
import SellUser from "../pages/seller/SellUser";
import CarCart from "../pages/buy/CarCart";
import Users from "../components/Users";
import Detail from "../pages/buy/buycar/detail";
import useAuthStore from "../logic/authStore";
import ConfigGarage from "../pages/seller/ConfigGarage";
import ConfigBrand from "../pages/seller/ConfigGarageComponents/ConfigBrand";
import ConfigModel from "../pages/seller/ConfigGarageComponents/ConfigModel";
import ConfigCategoryCar from "../pages/seller/ConfigGarageComponents/ConfigCategoryCar";
import Payment from "../pages/buy/buycar/Payment";
import PaymentSuccess from "../pages/buy/buycar/PaymentSuccess";
import PaymentCancel from "../pages/buy/buycar/PaymentCancel";
import Test from "../pages/seller/Test";

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

// Role constants
const ROLES = {
  PUBLIC: "Public",
  BUYER: "Buyer",
  SELLER: "Seller",
  DEFAULT: "Buyer",
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [], isLoggedIn, userRole }) => {
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        setIsValidating(false);
      } catch (err) {
        setError(err.message);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  if (isValidating) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Navigate
        to="/home"
        state={{ error: "Authentication error. Please try again." }}
        replace
      />
    );
  }

  if (!isLoggedIn && !allowedRoles.includes(ROLES.PUBLIC)) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  const hasRequiredRole = !allowedRoles.length || 
    allowedRoles.includes(userRole || ROLES.DEFAULT) || 
    allowedRoles.includes(ROLES.PUBLIC);

  if (!hasRequiredRole) {
    return (
      <Navigate
        to="/home"
        state={{
          error: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
          from: location,
        }}
        replace
      />
    );
  }

  return children;
};

const AppRoutes = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const role = useAuthStore((state) => state.role);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/user" element={<Users />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Public and Protected Routes - All Users */}
      <Route
        path="/detail/:id"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn} userRole={role}>
            <Detail />
          </ProtectedRoute>
        }
      />

      {/* Public and Protected Routes - Buyers & Sellers */}
      <Route
        path="/buy"
        element={
          <ProtectedRoute
            isLoggedIn={isLoggedIn}
            allowedRoles={[ROLES.PUBLIC, ROLES.BUYER, ROLES.SELLER]}
            userRole={role}
          >
            <CarCart />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Sellers Only */}
      <Route
        path="/seller/*"
        element={
          <ProtectedRoute
            isLoggedIn={isLoggedIn}
            allowedRoles={[ROLES.SELLER]}
            userRole={role}
          >
            <Routes>
              <Route path="/" element={<SellUser />} />
              <Route path="order" element={<Order />} />
              <Route path="config" element={<ConfigGarage />}>
                <Route index element={<Navigate to="brand" replace />} />
                <Route path="brand" element={<ConfigBrand />} />
                <Route path="model" element={<ConfigModel />} />
                <Route path="categorycar" element={<ConfigCategoryCar />} />
              </Route>
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Payment */}
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

      {/* Test Route */}
      <Route
        path="/test"
        element={
          <ProtectedRoute
            isLoggedIn={isLoggedIn}
            allowedRoles={[ROLES.SELLER]}
            userRole={role}
          >
            <Test />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;
