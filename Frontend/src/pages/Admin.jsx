// src/pages/Admin.jsx
import React, { useState, useEffect } from 'react';
const Admin = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  // Mock data for demonstration
  const statsData = {
    totalUsers: 1247,
    activeRestaurants: 89,
    mealsSaved: 15632,
    pendingApprovals: 23
  };

  const recentActivities = [
    { id: 1, action: 'New restaurant registered', user: 'Fresh Bites Cafe', time: '2 hours ago', type: 'success' },
    { id: 2, action: 'Food listing reported', user: 'Urban Eats', time: '5 hours ago', type: 'warning' },
    { id: 3, action: 'User account verified', user: 'Sarah Johnson', time: '1 day ago', type: 'info' },
    { id: 4, action: 'Payment processed', user: 'Green Kitchen', time: '1 day ago', type: 'success' }
  ];

  const StatCard = ({ title, value, change, icon, color }) => (
    <div className={`bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-full flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
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
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your RePlate platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Super Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={statsData.totalUsers}
            change={12}
            icon="👥"
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Active Restaurants"
            value={statsData.activeRestaurants}
            change={8}
            icon="🏪"
            color="from-green-500 to-green-600"
          />
          <StatCard
            title="Meals Saved"
            value={statsData.mealsSaved}
            change={25}
            icon="🍽️"
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            title="Pending Approvals"
            value={statsData.pendingApprovals}
            change={-5}
            icon="⏳"
            color="from-orange-500 to-orange-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Actions */}
            <div className={`bg-white rounded-xl shadow-lg p-6 transform transition-all duration-500 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <span>👥</span>
                  <span>Manage Users</span>
                </button>
                <button className="bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <span>🏪</span>
                  <span>Restaurants</span>
                </button>
                <button className="bg-purple-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-600 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <span>📊</span>
                  <span>Analytics</span>
                </button>
                <button className="bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <span>⚙️</span>
                  <span>Settings</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`bg-white rounded-xl shadow-lg p-6 transform transition-all duration-500 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div 
                    key={activity.id}
                    className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg transform transition-all duration-300 delay-${400 + index * 100} ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    } hover:bg-gray-50`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.type === 'success' ? 'bg-green-500' : 
                        activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">by {activity.user}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* System Status */}
            <div className={`bg-white rounded-xl shadow-lg p-6 transform transition-all duration-500 delay-400 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">System Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">API Server</span>
                  <span className="flex items-center text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Online
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Database</span>
                  <span className="flex items-center text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Healthy
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Storage</span>
                  <span className="flex items-center text-yellow-600">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    78% Used
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Backup</span>
                  <span className="text-gray-900">2 hours ago</span>
                </div>
              </div>
            </div>

            {/* Pending Actions */}
            <div className={`bg-white rounded-xl shadow-lg p-6 transform transition-all duration-500 delay-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Actions</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-yellow-800">Restaurant Verifications</span>
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">12</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-red-800">Reported Listings</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">5</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-800">Support Tickets</span>
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">8</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className={`bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg p-6 text-white transform transition-all duration-500 delay-600 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <h2 className="text-xl font-bold mb-4">Platform Growth</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>New Users Today</span>
                  <span className="font-bold">23</span>
                </div>
                <div className="flex justify-between">
                  <span>Meals Saved Today</span>
                  <span className="font-bold">156</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Sessions</span>
                  <span className="font-bold">342</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;