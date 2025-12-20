// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { LogoWithText } from './logo';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
             <Link to="/">
                <LogoWithText ame="w-36" />
             </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200">
              Home
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200">
              Find Food
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200">
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;