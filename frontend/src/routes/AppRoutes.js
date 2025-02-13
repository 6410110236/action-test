import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../modules/landing/pages/Home';
import SignIn from '../modules/auth/pages/signIn';
import SignUp from '../modules/auth/pages/signUp';
import Users from '../modules/transaction/components/SellUser';
import Order from '../modules/transaction/order';
import PrivateRoute from './PrivateRoutes'; // Import PrivateRoute
import Detail from '../modules/detail/mock/detail';
import CarCart from '../modules/search/pages/carcart';


const AppRoutes = () => {
    return (
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/buy" element={<CarCart/>} />
        <Route path="/seller" element={<Users/>} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/order" element={<PrivateRoute><Order /></PrivateRoute>} />
        </Routes>
    );
};

export default AppRoutes;