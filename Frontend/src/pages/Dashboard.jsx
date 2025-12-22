import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [activeReservations, setActiveReservations] = useState([]);
  const [pickupHistory, setPickupHistory] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [stats, setStats] = useState({
    totalSpent: 0,
    mealsSaved: 0,
    moneySaved: 0,
    co2Saved: 0
  });
  const [cancelling, setCancelling] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch all dashboard data
      await Promise.all([
        fetchUserInfo(),
        fetchActiveReservations(),
        fetchPickupHistory(),
        fetchDashboardStats()
      ]);

      setIsVisible(true);
    } catch (error) {
      console.error('Dashboard error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setUserInfo(data.user);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchActiveReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/dashboard/active-reservations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setActiveReservations(data.reservations || []);
        // Set current order as the most recent active reservation
        if (data.reservations && data.reservations.length > 0) {
          setCurrentOrder(data.reservations[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const fetchPickupHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/dashboard/pickup-history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setPickupHistory(data.history || []);
      }
    } catch (error) {
      console.error('Error fetching pickup history:', error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/dashboard/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCancelReservation = async (reservationId, foodId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      setCancelling(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/dashboard/cancel-reservation/${reservationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: 'User cancelled',
          food_id: foodId
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('Reservation cancelled successfully');
        // Refresh data
        fetchActiveReservations();
        fetchDashboardStats();
      } else {
        throw new Error(data.message || 'Failed to cancel reservation');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      alert(`Failed to cancel reservation: ${error.message}`);
    } finally {
      setCancelling(false);
    }
  };

  const handleGenerateQRCode = (pickupCode) => {
    setSelectedQRCode(pickupCode);
    setShowQR(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleBackToFood = () => {
    navigate('/claim-food');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">📊 Food Rescue Dashboard</h1>
              {userInfo && (
                <span className="text-sm text-gray-600">
                  Welcome back, {userInfo.full_name || userInfo.email}!
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleBackToFood}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
              >
                🍽️ Find More Food
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`py-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl">💳</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Meals Saved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.mealsSaved}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">🍽️</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Money Saved</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.moneySaved)}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">💰</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">CO₂ Saved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.co2Saved} kg</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">🌱</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Order & Active Reservations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Current Order Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">📋 Current Order Details</h2>
              {currentOrder ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{currentOrder.food_title}</h3>
                      <p className="text-sm text-gray-600">{currentOrder.restaurant_name}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                      {currentOrder.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Pickup Time</p>
                      <p className="font-bold">{formatDate(currentOrder.pickup_time)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-bold text-green-600">{formatCurrency(currentOrder.price)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Pickup Location</p>
                    <p className="font-bold">{currentOrder.address}, {currentOrder.city}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Order Code</p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-purple-600">{currentOrder.pickup_code}</p>
                      <button
                        onClick={() => handleGenerateQRCode(currentOrder.pickup_code)}
                        className="px-3 py-1 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors"
                      >
                        Show QR Code
                      </button>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-yellow-800 font-bold mb-2">⚠️ Important Notes for Pickup</p>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• Show this QR code to the restaurant</li>
                      <li>• Bring your own containers if possible</li>
                      <li>• Arrive within 15 minutes of pickup time</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📭</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No active orders</h3>
                  <p className="text-gray-600 mb-4">You don't have any active orders right now.</p>
                  <button
                    onClick={handleBackToFood}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                  >
                    Find Food to Claim
                  </button>
                </div>
              )}
            </div>

            {/* Active Reservations */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h2 className="text-xl font-bold text-gray-900">⏳ Active Reservations</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                  {activeReservations.length} active
                </span>
              </div>

              {activeReservations.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {activeReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900">{reservation.food_title}</h3>
                          <p className="text-sm text-gray-600">{reservation.restaurant_name}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {reservation.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Pickup</p>
                          <p className="text-sm font-medium">{formatDate(reservation.pickup_time)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="text-sm font-medium text-green-600">{formatCurrency(reservation.price)}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleGenerateQRCode(reservation.pickup_code)}
                          className="flex-1 px-3 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors"
                        >
                          QR Code
                        </button>
                        <button
                          onClick={() => handleCancelReservation(reservation.id, reservation.food_id)}
                          disabled={cancelling}
                          className="flex-1 px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          {cancelling ? 'Cancelling...' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">⏰</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No active reservations</h3>
                  <p className="text-gray-600">All your reservations have been picked up or cancelled.</p>
                </div>
              )}
            </div>
          </div>

          {/* Pickup History */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">📜 Pickup History</h2>
              <span className="text-sm text-gray-500">
                Last {pickupHistory.length} pickups
              </span>
            </div>

            {pickupHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Food Item</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Restaurant</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Pickup Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Review</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pickupHistory.map((history) => (
                      <tr key={history.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{history.food_title}</p>
                            <p className="text-sm text-gray-500">{history.quantity} meals</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-gray-700">{history.restaurant_name}</p>
                          <p className="text-sm text-gray-500">{history.city}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-gray-700">{formatDate(history.pickup_time)}</p>
                          {history.actual_pickup_time && (
                            <p className="text-xs text-green-600">Picked up: {formatDate(history.actual_pickup_time)}</p>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium text-green-600">{formatCurrency(history.amount)}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            history.status === 'completed' ? 'bg-green-100 text-green-800' :
                            history.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {history.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {history.status === 'completed' && !history.reviewed ? (
                            <button className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
                              Rate
                            </button>
                          ) : history.reviewed ? (
                            <span className="text-yellow-500 text-sm">⭐⭐⭐⭐⭐</span>
                          ) : (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📭</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No pickup history yet</h3>
                <p className="text-gray-600 mb-4">Start claiming food to build your history!</p>
                <button
                  onClick={handleBackToFood}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  Claim Your First Meal
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">⚡ Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={handleBackToFood}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-200"
              >
                <div className="text-2xl mb-2">🍽️</div>
                <p className="font-semibold">Find Food</p>
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-200"
              >
                <div className="text-2xl mb-2">👤</div>
                <p className="font-semibold">Edit Profile</p>
              </button>
              <button
                onClick={() => alert('Feature coming soon!')}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-200"
              >
                <div className="text-2xl mb-2">💳</div>
                <p className="font-semibold">Payment Methods</p>
              </button>
              <button
                onClick={() => navigate('/help')}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-200"
              >
                <div className="text-2xl mb-2">❓</div>
                <p className="font-semibold">Help Center</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Pickup QR Code</h3>
              <button
                onClick={() => setShowQR(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="flex flex-col items-center mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <QRCodeSVG 
                  value={selectedQRCode}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-sm text-gray-600 mb-2">Show this QR code to the restaurant</p>
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <p className="font-mono font-bold text-gray-800">{selectedQRCode}</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 font-bold mb-2">Instructions:</p>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>1. Show QR code at pickup counter</li>
                <li>2. Restaurant will scan to confirm</li>
                <li>3. Collect your food order</li>
                <li>4. Keep for future reference</li>
              </ul>
            </div>

            <button
              onClick={() => setShowQR(false)}
              className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;