import React, { Suspense } from 'react';
import { Route, Routes, Navigate, useLocation, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

// Role constants
const ROLES = {
  BUYER: 'Buyer',
  SELLER: 'Seller'
};

// Lazy load components
const Home = React.lazy(() => import('../modules/landing/pages/Home'));
const SignIn = React.lazy(() => import('../modules/auth/pages/signIn'));
const SignUp = React.lazy(() => import('../modules/auth/pages/signUp'));
const SellUser = React.lazy(() => import('../modules/transaction/components/SellUser'));
const Order = React.lazy(() => import('../modules/transaction/order'));
const CarCart = React.lazy(() => import('../modules/search/pages/CarCart'));
const Users = React.lazy(() => import('../modules/transaction/components/Users'));
const Detail = React.lazy(() => import('../modules/detail/mock/detail'));
const PaymentSuccess = React.lazy(() => import('../pages/PaymentSuccess'));
const PaymentCancel = React.lazy(() => import('../pages/PaymentCancel'));
const Payment = React.lazy(() => import('../pages/Payment'));

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-red-600">Something went wrong</h1>
            <button
              className="mt-4 text-blue-600 hover:text-blue-800"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [], isLoggedIn, userRole }) => {
  const location = useLocation();

  // Add proper authentication check
  if (!isLoggedIn) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Strictly check role permissions
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate 
      to="/home" 
      state={{ 
        error: `Access denied. Required role: ${allowedRoles.join(' or ')}` 
      }} 
      replace 
    />;
  }

  return children;
};

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

const AppRoutes = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const role = useAuthStore((state) => state.role);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
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
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
