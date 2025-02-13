import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth.context';

const PrivateRoute = ({ children }) => {
    const { state } = useContext(AuthContext);

    if (!state.isLoggedIn) {
        return <Navigate to="/signin" />;
    }

    return children;
};

export default PrivateRoute;