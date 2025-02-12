import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../modules/landing/pages/Home';
import SignIn from '../modules/auth/pages/signIn';
import signUp from '../modules/auth/pages/signUp';
import Users from '../modules/transaction/components/SellUser';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user" element={<Users />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<signUp />} />
        </Routes>
    );
};

export default AppRoutes;