import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../modules/landing/pages/Home';
import SignIn from '../modules/auth/pages/signIn';
import SignUp from '../modules/auth/pages/signUp';
import Users from '../modules/transaction/components/SellUser';
import Order from '../modules/transaction/order';
import PrivateRoute from './PrivateRoutes'; // Import PrivateRoute

const AppRoutes = () => {
    return (
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user" element={<Users/>} />
        <Route path="/order" element={<PrivateRoute><Order /></PrivateRoute>} />
        </Routes>
    );
};

export default AppRoutes;