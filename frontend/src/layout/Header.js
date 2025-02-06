import React from 'react';
import { Link } from 'react-router-dom';

// ฟังก์ชัน Header รับตัวแปร isLoggedIn เพื่อแสดงสถานะการล็อกอิน
const Header = ({ isLoggedIn }) => {
    return (
        // ใช้คลาสจาก Tailwind เพื่อจัดสไตล์
        <header className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">

            {/* โลโก้ */}
            <Link to="/" className="text-2xl font-bold">
                KODROD
            </Link>

            {/* เมนูนำทาง */}
            <nav className="flex space-x-6">
                <Link to="/" className="hover:text-gray-300">Home</Link>
                <Link to="/buy" className="hover:text-gray-300">Buy</Link>
                <Link to="/about" className="hover:text-gray-300">About</Link>
                <Link to="/user" className="hover:text-gray-300">Users</Link>
            </nav>

            {/* ไอคอนด้านขวา */}
            <div className="flex space-x-4">
                <button className="hover:text-gray-300">
                    <i className="fa fa-search"></i>
                </button>
                {isLoggedIn ? (
                    <button className="hover:text-gray-300">
                        <i className="fa fa-user"></i>
                    </button>
                ) : (
                    <>
                        <Link to="/signin" className="hover:text-gray-300">Sign In</Link>
                        <Link to="/signup" className="hover:text-gray-300">Sign Up</Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
