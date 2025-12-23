
import React from 'react';

const FeatureCard = ({ icon, title, description, color = 'green' }) => {
  const colorClasses = {
    green: 'from-green-400 to-green-600',
    blue: 'from-blue-400 to-blue-600', 
    purple: 'from-purple-400 to-purple-600',
    orange: 'from-orange-400 to-orange-600'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
      {/* Icon */}
      <div className={`w-16 h-16 bg-gradient-to-r ${colorClasses[color]} rounded-2xl flex items-center justify-center text-white text-2xl mb-6 mx-auto`}>
        {icon}
      </div>
      
      {/* Content */}
      <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
        {title}
      </h3>
      <p className="text-gray-600 text-center leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;