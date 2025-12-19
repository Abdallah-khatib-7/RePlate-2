import React from 'react';
import { Routes, Route } from 'react-router-dom'
import ScrollToTop from '../components/ScrollTop';
import Landing from '../pages/Landing';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import PostFood from '../pages/PostFood';
import ClaimFood from '../pages/ClaimFood';
import Admin from '../pages/Admin';
import NotFound from '../pages/NotFound';
import MainDashboard from '../pages/MainDashboard';
import TermsOfService from '../pages/TermsOfService';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import Cookies from '../pages/Cookies';
import FAQ from '../pages/FAQ';
import Support from '../pages/Support';
import Blog from '../pages/Blog';
import HowItWorks from '../pages/HowItWorks';
import ForgotPassword from '../pages/ForgotPassword'; 

const AppRouter = () => {
  return (
    <>
      <ScrollToTop /> 
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/cookies" element={<Cookies />} /> 
        <Route path="/faq" element={<FAQ />} />
        <Route path="/support" element={<Support />} />     
        <Route path="/main-dashboard" element={<MainDashboard />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
         <Route path="/forgot-password" element={<ForgotPassword />} />
          
        {/* Protected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/post-food" element={<PostFood />} />
        <Route path="/claim-food" element={<ClaimFood />} />
        <Route path="/admin" element={<Admin />} />
        
        {/* 404 Catch All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRouter;
