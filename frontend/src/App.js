import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from './api/stripe';
import useAuthStore from './logic/useStore';  // Zustand store สำหรับตรวจสอบการล็อกอินและบทบาท
import AppRoutes from './routes/AppRoutes';   // ใช้ AppRoutes สำหรับจัดการเส้นทาง
import Header from './components/Header';         // ใช้ Header ที่คุณให้มา

function App() {
  const { isLoggedIn, role } = useAuthStore();  // ตรวจสอบสถานะการล็อกอินและบทบาท
  const [currentLayout, setCurrentLayout] = useState(<AppRoutes isLoggedIn={isLoggedIn} />);

  // ตรวจจับการเปลี่ยนแปลงของ isLoggedIn และ role
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cancelStatus = urlParams.get('cancel');
    
    if (cancelStatus === 'true') {
      // Handle payment cancellation if needed
      console.log('Payment was cancelled');
    }

    // กำหนด Layout ตาม role ของผู้ใช้
    if (isLoggedIn) {
      // ถ้า logged in ให้ใช้ layout ตาม role
      setCurrentLayout(<AppRoutes isLoggedIn={isLoggedIn} />);
    } else {
      setCurrentLayout(<AppRoutes isLoggedIn={isLoggedIn} />);
    }
  }, [isLoggedIn, role]);  // เมื่อ isLoggedIn หรือ role เปลี่ยน

  return (
    <Elements stripe={stripePromise}>
      <div className="App">
        <Header />  {/* แสดง Header ทุกหน้า */}
        {currentLayout}  {/* ใช้ AppRoutes ที่จัดการเส้นทาง */}
      </div>
    </Elements>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
