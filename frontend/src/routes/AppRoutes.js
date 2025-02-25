import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from '../modules/landing/pages/Home';
import SignIn from '../modules/auth/pages/signIn';
import SignUp from '../modules/auth/pages/signUp';
import SellUser from '../modules/transaction/components/SellUser';  // ส่วนของ Seller
import Order from '../modules/transaction/order';  // ส่วนของ Seller
import CarCart from '../modules/search/pages/CarCart';  // ส่วนของ Buyer
import Users from '../modules/transaction/components/Users';  // สำหรับ Seller
import Detail from '../modules/detail/mock/detail';
import useAuthStore from '../store/authStore';  // นำเข้า useAuthStore จาก zustand store

const AppRoutes = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const role = useAuthStore((state) => state.role);  // ตรวจสอบบทบาทผู้ใช้

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      
      {/* ส่วนสำหรับ Buyer */}
      <Route path="/buy" element={<CarCart />} />
      
      {/* ส่วนสำหรับ Seller */}
      <Route path="/seller" element={isLoggedIn && role === 'Seller' ? <SellUser /> : <Navigate to="/signin" replace />} />
      <Route path="/users" element={isLoggedIn && role === 'Seller' ? <Users /> : <Navigate to="/signin" replace />} />
      <Route path="/order" element={isLoggedIn && role === 'Seller' ? <Order /> : <Navigate to="/signin" replace />} />

      {/* หน้าแสดงรายละเอียด */}
      <Route path="/detail/:id" element={<Detail />} />
      
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;
