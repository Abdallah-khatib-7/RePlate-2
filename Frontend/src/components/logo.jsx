// src/components/Logo.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/logo.png'; // Correct import from src/assets

export const Logo = ({ className = "w-8 h-8" }) => {
  return (
    <img 
      src={logoImage}
      alt="RePlate Logo"
      className={className}
    />
  );
};

export const LogoWithText = ({ className = "w-32" }) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Logo className="w-10 h-10" />
      <Link to="/">
        <span className="text-2xl font-bold text-gray-900">RePlate</span>
      </Link>
    </div>
  );
};