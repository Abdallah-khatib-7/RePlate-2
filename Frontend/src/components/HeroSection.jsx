
import React from 'react';
import { Link } from 'react-router-dom'; 

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-green-50 to-blue-100 min-h-screen flex items-center">
      <div className="absolute inset-0 bg-black opacity-5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        
        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
          Fight <span className="text-green-600">Food Waste</span>
          <br />
          Feed <span className="text-blue-600">Communities</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Connecting restaurants with surplus food to people in need. 
          Join the movement to reduce food waste and help your community.
        </p>
        
        {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
       <Link 
        to="/login" 
      className="bg-green-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-center"
        >
            Find Food Near You
      </Link>
      <Link 
      to="/login" 
      className="border-2 border-green-500 text-green-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-500 hover:text-white transition-all duration-200 transform hover:scale-105 text-center"
  >
         List Surplus Food
      </Link>
</div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">1.3B</div>
            <div className="text-gray-600">Tons of Food Wasted Yearly</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">800M</div>
            <div className="text-gray-600">People Go Hungry</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">50%</div>
            <div className="text-gray-600">Reduction Possible</div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default HeroSection;