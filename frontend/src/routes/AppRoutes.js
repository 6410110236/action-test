import React from 'react';
import { Route, Routes } from 'react-router-dom';
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
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/buy" element={<CarCart/>} />
        <Route path="/seller" element={<SellUser/>} />
        <Route path="/users" element={<Users/>} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/order" element={<PrivateRoute><Order /></PrivateRoute>} />
        </Routes>
    );
};

export default AppRoutes;