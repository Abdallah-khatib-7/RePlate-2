// src/pages/MainDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MainDashboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [userType, setUserType] = useState('foodLover');

  useEffect(() => {
    setIsVisible(true);
    const savedUserType = localStorage.getItem('userType') || 'foodLover';
    setUserType(savedUserType);
  }, []);

  const Navigate = useNavigate();

  // Mock data based on user type
  const foodLoverData = {
    quickStats: {
      mealsClaimed: 12,
      moneySaved: 86.50,
      favoriteRestaurants: 3,
      streak: 5
    },
    nearbyDeals: [
      { id: 1, name: 'Mediterranean Platter', restaurant: 'Olive Garden', discount: 65, distance: '0.8mi', time: '7:00 PM' },
      { id: 2, name: 'Artisan Sandwiches', restaurant: 'Urban Deli', discount: 60, distance: '1.2mi', time: '6:30 PM' },
      { id: 3, name: 'Gourmet Pizza', restaurant: 'Firestone', discount: 70, distance: '0.5mi', time: '8:00 PM' }
    ],
    recentActivity: [
      { id: 1, action: 'claimed', item: 'Salad Bowls', restaurant: 'Green Leaf', time: '2 hours ago' },
      { id: 2, action: 'saved', item: 'Pastry Box', restaurant: 'Sweet Dreams', time: '1 day ago' }
    ]
  };

  const restaurantData = {
    quickStats: {
      listingsActive: 3,
      mealsSold: 45,
      revenue: 286.50,
      wasteReduced: '12.5kg'
    },
    recentListings: [
      { id: 1, name: 'Mediterranean Platter', price: 8.99, claimed: 8, total: 10 },
      { id: 2, name: 'Sandwich Box', price: 12.99, claimed: 12, total: 12 },
      { id: 3, name: 'Salad Bowls', price: 6.99, claimed: 7, total: 10 }
    ],
    performance: {
      rating: 4.8,
      totalSavings: 156.75,
      customers: 23
    }
  };
 
  const data = userType === 'foodLover' ? foodLoverData : restaurantData;

  const QuickStatCard = ({ title, value, subtitle, icon, color }) => (
    <div className={`bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center py-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {localStorage.getItem('userName') || 'Food Hero'}! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                {userType === 'foodLover' 
                  ? 'Ready to save some delicious food today?' 
                  : 'Manage your listings and reduce food waste'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {localStorage.getItem('userName')?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {userType === 'foodLover' ? (
            <>
              <QuickStatCard
                title="Meals Claimed"
                value={data.quickStats.mealsClaimed}
                subtitle="This month"
                icon="🍽️"
                color="from-green-500 to-green-600"
              />
              <QuickStatCard
                title="Money Saved"
                value={`$${data.quickStats.moneySaved}`}
                subtitle="vs. retail price"
                icon="💰"
                color="from-blue-500 to-blue-600"
              />
              <QuickStatCard
                title="Favorite Spots"
                value={data.quickStats.favoriteRestaurants}
                subtitle="Restaurants you love"
                icon="❤️"
                color="from-purple-500 to-purple-600"
              />
              <QuickStatCard
                title="Day Streak"
                value={data.quickStats.streak}
                subtitle="Keep it going!"
                icon="🔥"
                color="from-orange-500 to-orange-600"
              />
            </>
          ) : (
            <>
              <QuickStatCard
                title="Active Listings"
                value={data.quickStats.listingsActive}
                subtitle="Currently available"
                icon="📋"
                color="from-green-500 to-green-600"
              />
              <QuickStatCard
                title="Meals Sold"
                value={data.quickStats.mealsSold}
                subtitle="This week"
                icon="🍽️"
                color="from-blue-500 to-blue-600"
              />
              <QuickStatCard
                title="Revenue"
                value={`$${data.quickStats.revenue}`}
                subtitle="From surplus food"
                icon="💰"
                color="from-purple-500 to-purple-600"
              />
              <QuickStatCard
                title="Waste Reduced"
                value={data.quickStats.wasteReduced}
                subtitle="Environmental impact"
                icon="🌱"
                color="from-orange-500 to-orange-600"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Actions */}
            <div className={`bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {userType === 'foodLover' ? (
                  <>
                    <Link to="/claim-food" className="bg-green-500 text-white py-4 px-4 rounded-xl font-semibold hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-3">
                      <span className="text-2xl">🔍</span>
                      <span>Find Food</span>
                    </Link>
                    <button className="bg-blue-500 text-white py-4 px-4 rounded-xl font-semibold hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-3">
                      <span className="text-2xl">⭐</span>
                      <span>Favorites</span>
                    </button>
                    <button className="bg-purple-500 text-white py-4 px-4 rounded-xl font-semibold hover:bg-purple-600 transition-colors duration-200 flex items-center justify-center space-x-3">
                      <span className="text-2xl">📊</span>
                      <span>Statistics</span>
                    </button>
                    <button className="bg-orange-500 text-white py-4 px-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center space-x-3">
                      <span className="text-2xl">👤</span>
                      <span>Profile</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/post-food" className="bg-green-500 text-white py-4 px-4 rounded-xl font-semibold hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-3">
                      <span className="text-2xl">➕</span>
                      <span>List Food</span>
                    </Link>
                    <button className="bg-blue-500 text-white py-4 px-4 rounded-xl font-semibold hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-3">
                      <span className="text-2xl">📋</span>
                      <span>My Listings</span>
                    </button>
                    <button className="bg-purple-500 text-white py-4 px-4 rounded-xl font-semibold hover:bg-purple-600 transition-colors duration-200 flex items-center justify-center space-x-3">
                      <span className="text-2xl">📊</span>
                      <span>Analytics</span>
                    </button>
                    <button className="bg-orange-500 text-white py-4 px-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center space-x-3">
                      <span className="text-2xl">🏪</span>
                      <span>Restaurant</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Recent Activity/Listings */}
            <div className={`bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {userType === 'foodLover' ? 'Recent Activity' : 'Active Listings'}
                </h2>
                <button className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-200">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {(userType === 'foodLover' ? data.recentActivity : data.recentListings).map((item, index) => (
                  <div key={item.id} className={`flex items-center justify-between p-4 bg-gray-50 rounded-xl transform transition-all duration-300 delay-${400 + index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} hover:shadow-md`}>
                    {userType === 'foodLover' ? (
                      <>
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.action === 'claimed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                            {item.action === 'claimed' ? '✅' : '💾'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{item.item}</p>
                            <p className="text-sm text-gray-500">{item.restaurant} • {item.time}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.action === 'claimed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {item.action}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            🍽️
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">${item.price} • {item.claimed}/{item.total} claimed</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">${item.price}</p>
                          <p className="text-xs text-gray-500">{Math.round((item.claimed / item.total) * 100)}% sold</p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Nearby Deals / Performance */}
            <div className={`bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-500 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {userType === 'foodLover' ? '🔥 Hot Deals Nearby' : '📈 Performance'}
              </h2>
              <div className="space-y-4">
                {userType === 'foodLover' ? (
                  data.nearbyDeals.map((deal, index) => (
                    <div key={deal.id} className={`flex items-center justify-between p-4 border-2 border-green-200 bg-green-50 rounded-xl transform transition-all duration-300 delay-${500 + index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-semibold text-gray-900">{deal.name}</p>
                          <p className="text-sm text-gray-500">{deal.restaurant}</p>
                          <p className="text-xs text-gray-400">{deal.distance} • {deal.time}</p>
                        </div>
                      </div>
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                        {deal.discount}% OFF
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Rating</span>
                      <span className="flex items-center space-x-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-bold text-gray-900">{data.performance.rating}</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Savings</span>
                      <span className="font-bold text-green-600">${data.performance.totalSavings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Happy Customers</span>
                      <span className="font-bold text-gray-900">{data.performance.customers}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Environmental Impact */}
            <div className={`bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-lg p-6 text-white transform transition-all duration-500 delay-600 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <h2 className="text-xl font-bold mb-4">Your Impact 🌍</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>CO₂ Reduced</span>
                  <span className="font-bold">{userType === 'foodLover' ? '24.8kg' : '156kg'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Meals Saved</span>
                  <span className="font-bold">{userType === 'foodLover' ? '12' : '156'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Water Saved</span>
                  <span className="font-bold">{userType === 'foodLover' ? '1,250L' : '15,600L'}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-green-400">
                <p className="text-center text-green-100 text-sm">
                  {userType === 'foodLover' ? '🎉 You\'re making a difference!' : '🏆 Top-tier sustainability partner!'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};


export default MainDashboard;