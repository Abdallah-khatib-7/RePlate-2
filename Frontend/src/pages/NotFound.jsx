// src/pages/NotFound.jsx
import React, { useState, useEffect } from 'react';
import { Link} from 'react-router-dom';
const NotFound = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [foodEmoji, setFoodEmoji] = useState('🍕');

  useEffect(() => {
    setIsVisible(true);
    
    // Animate food emojis
    const emojis = ['🍕', '🥪', '🥗', '🍱', '🥙', '🥐', '🍽️', '🌮'];
    let index = 0;
    const interval = setInterval(() => {
      setFoodEmoji(emojis[index]);
      index = (index + 1) % emojis.length;
    }, 1000);

    return () => {
      clearInterval(interval);
      setIsVisible(false);
    };
  }, []);

  /*const quickLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/claim-food', label: 'Find Food', icon: '🔍' },
    { path: '/login', label: 'Login', icon: '🔐' },
    { path: '/register', label: 'Sign Up', icon: '👤' }
  ]; */

  const funFacts = [
    "Every year, 1.3 billion tons of food is wasted globally",
    "Reducing food waste could feed 2 billion people",
    "Food waste contributes to 8% of global greenhouse gases",
    "The average family wastes $1,500 worth of food annually"
  ];

  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length);
    }, 4000);
    return () => clearInterval(factInterval);
  }, [funFacts.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className={`max-w-4xl w-full text-center transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
      }`}>
        
        {/* Animated Food Emoji */}
        <div className="mb-8">
          <div className="text-9xl mb-4 animate-bounce">
            {foodEmoji}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8">
          
          {/* Error Code */}
          <div className={`mb-6 transform transition-all duration-500 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <h1 className="text-8xl md:text-9xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              404
            </h1>
            <div className="w-24 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-6"></div>
          </div>

          {/* Message */}
          <div className={`mb-8 transform transition-all duration-500 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Oops! This page is missing...
            </h2>
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              Like that last slice of pizza you were saving, this page seems to have disappeared! 
              But don't worry - we've got plenty of other delicious options for you.
            </p>
            
            {/* Animated Food Fact */}
            <div className={`bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 transform transition-all duration-500 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="flex items-center justify-center space-x-3">
                <span className="text-green-600 text-xl">💡</span>
                <p className="text-green-800 font-medium">
                  {funFacts[currentFact]}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}

        {/* <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-8 transform transition-all duration-500 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center space-x-3 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
            >
              <span>↩️</span>
              <span>Go Back</span>
            </button>
            <Link
              to="/"
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <span>🏠</span>
              <span>Go Home</span>
            </Link>
          </div> */}

          {/* Quick Links */}
          
          {/* <div className={`transform transition-all duration-500 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>

            <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Navigation</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center justify-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all duration-200 transform hover:scale-105 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${700 + index * 100}ms` }}
                >
                  <span>{link.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{link.label}</span>
                </Link>
              ))}
            </div>
          </div> */}
        </div> 

        {/* Floating Food Elements */}
        <div className="flex justify-center space-x-4 mb-8">
          {['🥗', '🍕', '🥪', '🍱'].map((emoji, index) => (
            <div
              key={index}
              className={`text-4xl animate-float ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ 
                animationDelay: `${index * 0.5}s`,
                transitionDelay: `${800 + index * 200}ms`
              }}
            >
              {emoji}
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className={`bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-500 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <span className="text-3xl">🤔</span>
            <h3 className="text-xl font-bold text-gray-900">Still hungry for help?</h3>
          </div>
          <p className="text-gray-600 mb-4">
            If you can't find what you're looking for, our support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:abdallah.khatib2003@gmail.com"
              className="flex items-center justify-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
            >
              <span>📧</span>
              <span>Email Support</span>
            </a>
            <a
              href="/contact"
              className="flex items-center justify-center space-x-2 border border-green-500 text-green-500 px-6 py-3 rounded-lg font-semibold hover:bg-green-500 hover:text-white transition-all duration-200"
            >
              <span>💬</span>
              <span>Contact Form</span>
            </a>
          </div>
        </div>

        {/* CSS for floating animation */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default NotFound;