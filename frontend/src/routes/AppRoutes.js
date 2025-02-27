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
import useAuthStore from "../store/authStore";
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
  DEFAULT: "Buyer",
};

// Protected Route Component with enhanced validation
const ProtectedRoute = ({ children, allowedRoles = [], isLoggedIn, userRole }) => {
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
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

  if (allowedRoles.length === 0 || allowedRoles.includes(userRole || ROLES.DEFAULT)) {
    return children;
  }

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

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Buyer Routes */}
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
        <Route path="brand" element={<ConfigBrand />} />
        <Route path="model" element={<ConfigModel />} />
        <Route path="categorycar" element={<ConfigCategoryCar />} />
      </Route>

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

      {/* Protected Detail Route */}
      <Route
        path="/detail/:id"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn} userRole={role}>
            <Detail />
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

      {/* Catch All Route */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;
