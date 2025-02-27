import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, Link, useLocation } from "react-router-dom";
import Home from "../modules/landing/pages/Home";
import SignIn from "../modules/auth/pages/signIn";
import SignUp from "../modules/auth/pages/signUp";
import SellUser from "../modules/transaction/components/SellUser";
import Order from "../modules/transaction/order";
import CarCart from "../modules/search/pages/CarCart";
import Users from "../modules/transaction/components/Users";
import Detail from "../modules/detail/mock/detail";
import useAuthStore from "../store/authStore"; // นำเข้า useAuthStore จาก zustand store
import ConfigGarage from "../modules/transaction/components/ConfigGarage";
import ConfigBrand from "../modules/transaction/components/ConfigGarageComponents/ConfigBrand";
import ConfigModel from "../modules/transaction/components/ConfigGarageComponents/ConfigModel";
import ConfigCategoryCar from "../modules/transaction/components/ConfigGarageComponents/ConfigCategoryCar";
import Payment from "../pages/Payment";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentCancel from "../pages/PaymentCancel";

// Role constants with default role
const ROLES = {
  BUYER: "Buyer",
  SELLER: "Seller",
  DEFAULT: "Buyer", // Default role for logged-in users
};

// Protected Route Component with enhanced validation
const ProtectedRoute = ({
  children,
  allowedRoles = [],
  isLoggedIn,
  userRole,
}) => {
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // Simulate role validation
    const validateRole = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
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
  if (
    allowedRoles.length === 0 ||
    allowedRoles.includes(userRole || ROLES.DEFAULT)
  ) {
    return children;
  }

  // If user doesn't have required role, redirect to home with error
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

      {/* ส่วนสำหรับ Buyer */}
      <Route path="/buy" element={<CarCart />} />

      {/* ส่วนสำหรับ Seller */}
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
      >
        {" "}
        <Route path="brand" element={<ConfigBrand />} />
        <Route path="model" element={<ConfigModel />} />
        <Route path="categorycar" element={<ConfigCategoryCar />} />
      </Route>
      <Route
        path="/users"
        element={
          isLoggedIn && role === "Seller" ? (
            <Users />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
      <Route
        path="/order"
        element={
          isLoggedIn && role === "Seller" ? (
            <Order />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />

      {/* หน้าแสดงรายละเอียด */}
      <Route path="/detail/:id" element={<Detail />} />

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;
