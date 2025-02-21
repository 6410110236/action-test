import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/Auth.context';

const PrivateRoute = ({ children }) => {
    const { state } = useContext(AuthContext);
    const location = useLocation();

    if (state.isLoginPending) {
        return null; // Or a loading spinner component
    }

    if (!state.isLoggedIn) {
        // Preserve the attempted URL
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;