// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
const Dashboard = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);
  
  // Mock user data
  const userStats = {
    mealsClaimed: 12,
    moneySaved: 86.50,
    co2Reduced: 24.8,
    favoriteRestaurants: 3
  };

  const recentActivity = [
    { id: 1, type: 'claimed', item: 'Mediterranean Platter', restaurant: 'Olive Garden', time: '2 hours ago', amount: 8.99 },
    { id: 2, type: 'saved', item: 'Artisan Sandwiches', restaurant: 'Urban Deli', time: '1 day ago', amount: 12.99 },
    { id: 3, type: 'claimed', item: 'Gourmet Pizza', restaurant: 'Firestone Pizzeria', time: '2 days ago', amount: 15.99 },
    { id: 4, type: 'saved', item: 'Salad Bowls', restaurant: 'Green Leaf Cafe', time: '3 days ago', amount: 6.99 }
  ];

  const upcomingPickups = [
    { id: 1, item: 'Fresh Pastry Assortment', restaurant: 'Sweet Dreams Bakery', time: 'Today, 8:00 AM', status: 'ready' },
    { id: 2, item: 'Asian Fusion Box', restaurant: 'Dragon Palace', time: 'Tomorrow, 7:30 PM', status: 'confirmed' }
  ];

  const favoriteRestaurants = [
    { id: 1, name: 'Green Leaf Cafe', rating: 4.8, type: 'Healthy & Vegan', saves: 156 },
    { id: 2, name: 'Urban Deli Co.', rating: 4.6, type: 'Sandwiches & Salads', saves: 203 },
    { id: 3, name: 'Firestone Pizzeria', rating: 4.9, type: 'Italian & Pizza', saves: 189 }
  ];

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <div className={`bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity, index }) => (
    <div className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 delay-${400 + index * 100} ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
    } hover:shadow-md hover:border-green-200`}>
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          activity.type === 'claimed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
        }`}>
          {activity.type === 'claimed' ? '✅' : '💾'}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{activity.item}</p>
          <p className="text-sm text-gray-500">{activity.restaurant} • {activity.time}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-green-600">${activity.amount}</p>
        <p className="text-xs text-gray-500 capitalize">{activity.type}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center py-6 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back! Here's your food saving journey.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">User Name</p>
                <p className="text-xs text-gray-500">Food Saver Pro</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Meals Claimed"
            value={userStats.mealsClaimed}
            subtitle="This month"
            icon="🍽️"
            color="from-green-500 to-green-600"
          />
          <StatCard
            title="Money Saved"
            value={`$${userStats.moneySaved}`}
            subtitle="vs. retail price"
            icon="💰"
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            title="CO₂ Reduced"
            value={`${userStats.co2Reduced}kg`}
            subtitle="Environmental impact"
            icon="🌱"
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            title="Favorite Spots"
            value={userStats.favoriteRestaurants}
            subtitle="Restaurants you love"
            icon="❤️"
            color="from-orange-500 to-orange-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Actions */}
            <div className={`bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-500 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-green-500 text-white py-4 px-4 rounded-xl font-semibold hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-3">
                  <span className="text-2xl">🔍</span>
                  <span>Find Food</span>
                </button>
                <button className="bg-blue-500 text-white py-4 px-4 rounded-xl font-semibold hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-3">
                  <span className="text-2xl">⭐</span>
                  <span>Favorites</span>
                </button>
                <button className="bg-purple-500 text-white py-4 px-4 rounded-xl font-semibold hover:bg-purple-600 transition-colors duration-200 flex items-center justify-center space-x-3">
                  <span className="text-2xl">📊</span>
                  <span>Statistics</span>
                </button>
                <button className="bg-orange-500 text-white py-4 px-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center space-x-3">
                  <span className="text-2xl">⚙️</span>
                  <span>Settings</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-500 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                <button className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-200">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <ActivityItem key={activity.id} activity={activity} index={index} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Upcoming Pickups */}
            <div className={`bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-500 delay-400 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Pickups</h2>
              <div className="space-y-4">
                {upcomingPickups.map((pickup, index) => (
                  <div 
                    key={pickup.id}
                    className={`flex items-center justify-between p-4 border-2 ${
                      pickup.status === 'ready' ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'
                    } rounded-xl transform transition-all duration-300 delay-${500 + index * 100} ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        pickup.status === 'ready' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                        <p className="font-semibold text-gray-900">{pickup.item}</p>
                        <p className="text-sm text-gray-500">{pickup.restaurant}</p>
                        <p className="text-xs text-gray-400">{pickup.time}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      pickup.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {pickup.status === 'ready' ? 'Ready' : 'Confirmed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite Restaurants */}
            <div className={`bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-500 delay-600 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Favorites</h2>
              <div className="space-y-4">
                {favoriteRestaurants.map((restaurant, index) => (
                  <div 
                    key={restaurant.id}
                    className={`flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: `${700 + index * 100}ms` }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl flex items-center justify-center text-xl">
                      🏪
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm font-medium text-gray-700">{restaurant.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">{restaurant.type}</p>
                      <p className="text-xs text-gray-400">{restaurant.saves} meals saved</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Environmental Impact */}
            <div className={`bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-lg p-6 text-white transform transition-all duration-500 delay-800 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <h2 className="text-xl font-bold mb-4">Your Impact</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Food Waste Prevented</span>
                  <span className="font-bold">12.5 kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Equivalent Meals</span>
                  <span className="font-bold">42 people</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Water Saved</span>
                  <span className="font-bold">1,250 L</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-green-400">
                <p className="text-center text-green-100 text-sm">
                  🌍 You're making a real difference!
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;