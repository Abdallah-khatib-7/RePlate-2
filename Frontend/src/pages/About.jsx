// src/pages/About.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Animated Header */}
        <div className={`text-center mb-20 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Our Story
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Born from a passion for sustainability and community, RePlate is revolutionizing 
            how we think about food waste and hunger.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          
          {/* Mission Text */}
          <div className={`space-y-6 transform transition-all duration-1000 delay-200 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}>
            <h2 className="text-4xl font-bold text-gray-900">
              Our <span className="text-green-600">Mission</span>
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Every year, <span className="font-semibold text-green-600">1.3 billion tons</span> of food is wasted globally, 
              while millions go hungry. We believe this is not just an environmental issue, 
              but a moral one.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              RePlate was founded to bridge this gap—connecting restaurants, cafes, and food 
              establishments with surplus food to individuals and organizations that can put 
              it to good use.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              Our platform makes it simple for businesses to reduce waste and for communities 
              to access nutritious meals, creating a sustainable cycle of sharing and caring.
            </p>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              {[
                { number: '10K+', label: 'Meals Saved', color: 'green' },
                { number: '500+', label: 'Partners', color: 'blue' },
                { number: '50+', label: 'Cities', color: 'purple' },
                { number: '100T+', label: 'CO₂ Reduced', color: 'orange' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className={`text-center p-4 bg-white rounded-xl shadow-lg transform transition-all duration-500 delay-${400 + index * 100} ${
                    isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
                  } hover:scale-105 hover:shadow-xl cursor-pointer`}
                >
                  <div className={`text-2xl font-bold text-${stat.color}-600 mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mission Visual */}
          <div className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-10 opacity-0 scale-95'
          }`}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
              <div className="relative bg-white rounded-3xl p-8 transform group-hover:-translate-y-2 transition-all duration-500 shadow-2xl">
                <div className="w-full h-80 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/about.png')] bg-cover bg-inherit  opacity-200"></div>
              
                {/*  this section was just to put RePlate Logo in the middle but i think this is better */}
              
                {/*  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-500">
                    </div>
                    <div className="space-y-2">
                      <div className="w-32 h-2 bg-green-300 rounded-full mx-auto transform group-hover:scale-x-110 transition-transform duration-500"></div>
                      <div className="w-28 h-2 bg-blue-300 rounded-full mx-auto transform group-hover:scale-x-110 transition-transform duration-500 delay-100"></div>
                      <div className="w-24 h-2 bg-green-200 rounded-full mx-auto transform group-hover:scale-x-110 transition-transform duration-500 delay-200"></div>
                    </div>
                  </div> */}


                  
                </div> 
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className={`transform transition-all duration-1000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Our <span className="text-green-600">Values</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌱',
                title: 'Sustainability',
                description: 'We\'re committed to reducing environmental impact through smart food redistribution.',
                color: 'green'
              },
              {
                icon: '🤝',
                title: 'Community',
                description: 'Building strong local networks that support both businesses and individuals in need.',
                color: 'blue'
              },
              {
                icon: '💡',
                title: 'Innovation',
                description: 'Using technology to create efficient, scalable solutions for food waste challenges.',
                color: 'purple'
              }
            ].map((value, index) => (
              <div 
                key={index}
                className={`group p-8 bg-white rounded-2xl shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${600 + index * 150}ms` }}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Call to Action */}
        <div className={`text-center mt-24 transform transition-all duration-1000 delay-800 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Join Our <span className="text-green-600">Mission</span>
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're a restaurant with surplus food or someone who wants to make a difference, 
            there's a place for you in the RePlate community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-green-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors duration-200 shadow-lg hover:shadow-xl">
              Become a Partner
            </Link>
            <Link to="/how-it-works" className="border-2 border-green-500 text-green-500 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-500 hover:text-white transition-all duration-200">
              Learn More
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;