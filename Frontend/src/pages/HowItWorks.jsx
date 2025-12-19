import React from 'react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Restaurants List Surplus Food",
      description: "Local restaurants easily list their extra meals that would otherwise go to waste",
      icon: "🏪",
      features: ["Recover food costs", "Reduce disposal fees", "Build community goodwill"],
      color: "from-green-500 to-green-600"
    },
    {
      number: "02",
      title: "Discover Amazing Deals",
      description: "Browse available meals from top restaurants at 50-80% off regular prices",
      icon: "🔍",
      features: ["Restaurant-quality food", "Huge savings", "Try new cuisines"],
      color: "from-blue-500 to-blue-600"
    },
    {
      number: "03",
      title: "Place Your Order",
      description: "Secure your meal with easy online payment and choose your pickup time",
      icon: "📱",
      features: ["Secure payments", "Flexible pickup times", "Instant confirmation"],
      color: "from-purple-500 to-purple-600"
    },
    {
      number: "04",
      title: "Enjoy & Make Impact",
      description: "Pick up your delicious meal and track your environmental impact",
      icon: "🌍",
      features: ["Reduce food waste", "Save money", "Help the planet"],
      color: "from-orange-500 to-orange-600"
    }
  ];

  const userTypes = [
    {
      type: "Food Lovers",
      description: "People looking for delicious restaurant meals at discounted prices",
      benefits: [
        "Save 50-80% on restaurant meals",
        "Discover new local restaurants",
        "Help reduce food waste",
        "Track your environmental impact"
      ],
      icon: "🍽️",
      color: "bg-green-500"
    },
    {
      type: "Restaurant Partners",
      description: "Restaurants wanting to reduce waste and generate extra revenue",
      benefits: [
        "Recover costs on surplus food",
        "Reduce disposal costs",
        "Attract new customers",
        "Build community reputation"
      ],
      icon: "🏪",
      color: "bg-blue-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">How RePlate Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A simple, powerful platform that turns food waste into community meals. 
            Join thousands of users already making a difference in Lebanon.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* 4-Step Process */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The 4-Step Process</h2>
            <p className="text-gray-600 text-lg">Simple steps to save food and money</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="group text-center">
                {/* Step Number & Icon */}
                <div className="relative mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {step.number}
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-3xl shadow-lg">
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>
                
                {/* Features */}
                <ul className="space-y-2">
                  {step.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <span className="text-green-500">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* User Types */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Everyone</h2>
            <p className="text-gray-600 text-lg">Whether you're hungry or have extra food</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {userTypes.map((user, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 ${user.color} rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                    {user.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{user.type}</h3>
                  <p className="text-gray-600">{user.description}</p>
                </div>

                <ul className="space-y-3">
                  {user.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center space-x-3">
                      <span className="text-green-500 text-lg">✓</span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 text-center">
                  <Link 
                    to={user.type === "Food Lovers" ? "/register" : "/register"} 
                    className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
                  >
                    Get Started as {user.type}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Stats */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl p-8 md:p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-6">Join the Movement</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {[
              { number: "10,000+", label: "Meals Saved" },
              { number: "200+", label: "Restaurant Partners" },
              { number: "50+", label: "Cities in Lebanon" },
              { number: "25+", label: "Tons CO₂ Reduced" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-2xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform duration-200"
            >
              Start Saving Food Now
            </Link>
            <Link 
              to="/register" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-200"
            >
              List Your Restaurant
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HowItWorks;