import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from '../modules/landing/pages/Home';
import SignIn from '../modules/auth/pages/signIn';
import SignUp from '../modules/auth/pages/signUp';
import SellUser from '../modules/transaction/components/SellUser';
import Order from '../modules/transaction/order';
import PrivateRoute from './PrivateRoutes'; 
import Detail from '../modules/detail/mock/detail';
import CarCart from '../modules/search/pages/CarCart';
import Users from '../modules/transaction/components/Users';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/buy" element={<CarCart/>} />
            <Route path="/seller" element={<PrivateRoute><SellUser/></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><Users/></PrivateRoute>} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/order" element={<PrivateRoute><Order /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    );
};

export default AppRoutes;