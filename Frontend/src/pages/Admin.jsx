import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  AlertCircle,
  Trash2,
  Edit,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Filter,
  Download,
  RefreshCw,
  Home,
  MapPin,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Star,
  MessageSquare,
  Award,
  Scale,
  Thermometer,
  Truck
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalRecipients: 0,
    totalFoodListings: 0,
    totalClaims: 0,
    totalRevenue: 0,
    foodSaved: 0,
    co2Saved: 0
  });
  const [users, setUsers] = useState([]);
  const [foodListings, setFoodListings] = useState([]);
  const [claims, setClaims] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userActionLoading, setUserActionLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [viewUser, setViewUser] = useState(null);
  const [viewClaim, setViewClaim] = useState(null);
  const [viewFood, setViewFood] = useState(null);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'food') fetchFoodListings();
    if (activeTab === 'claims') fetchClaims();
    if (activeTab === 'reviews') fetchReviews();
  }, [activeTab]);

  const checkAdminAuth = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
      navigate('/login');
      return;
    }

    const isAdmin =
      user.user_type === 'admin' ||
      user.is_admin === 1;

    if (!isAdmin) {
      navigate('/login');
      return;
    }

    await fetchDashboardStats();
    setLoading(false);
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      showNotification('error', 'Failed to load dashboard statistics');
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('error', 'Failed to load users');
    }
  };

  const fetchFoodListings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/food-listings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setFoodListings(data.listings);
      }
    } catch (error) {
      console.error('Error fetching food listings:', error);
      showNotification('error', 'Failed to load food listings');
    }
  };

  const fetchClaims = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/claims`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setClaims(data.claims);
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
      showNotification('error', 'Failed to load claims');
    }
  };

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/reviews`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      showNotification('error', 'Failed to load reviews');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setUserActionLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        showNotification('success', 'User deleted successfully');
        fetchUsers();
        fetchDashboardStats();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification('error', 'Failed to delete user');
    } finally {
      setUserActionLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      setUserActionLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: currentStatus === 'active' ? 'suspended' : 'active' })
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        showNotification('success', `User ${currentStatus === 'active' ? 'suspended' : 'activated'} successfully`);
        fetchUsers();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      showNotification('error', 'Failed to update user status');
    } finally {
      setUserActionLoading(false);
    }
  };

  const handleDeleteFoodListing = async (foodId) => {
    if (!window.confirm('Are you sure you want to delete this food listing?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/food-listings/${foodId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        showNotification('success', 'Food listing deleted successfully');
        fetchFoodListings();
        fetchDashboardStats();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error deleting food listing:', error);
      showNotification('error', 'Failed to delete food listing');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        showNotification('success', 'Review deleted successfully');
        fetchReviews();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      showNotification('error', 'Failed to delete review');
    }
  };

  const handleUpdateClaimStatus = async (claimId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/claims/${claimId}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        showNotification('success', `Claim status updated to ${newStatus}`);
        fetchClaims();
        fetchDashboardStats();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error updating claim status:', error);
      showNotification('error', 'Failed to update claim status');
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_type');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  const handleRefresh = () => {
    if (activeTab === 'dashboard') fetchDashboardStats();
    else if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'food') fetchFoodListings();
    else if (activeTab === 'claims') fetchClaims();
    else if (activeTab === 'reviews') fetchReviews();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
      suspended: { color: 'bg-red-100 text-red-800', icon: <Ban className="w-4 h-4" /> },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <AlertCircle className="w-4 h-4" /> },
      completed: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> },
      available: { color: 'bg-blue-100 text-blue-800', icon: <Package className="w-4 h-4" /> },
      reserved: { color: 'bg-yellow-100 text-yellow-800', icon: <AlertCircle className="w-4 h-4" /> },
      claimed: { color: 'bg-purple-100 text-purple-800', icon: <CheckCircle className="w-4 h-4" /> },
      expired: { color: 'bg-gray-100 text-gray-800', icon: <XCircle className="w-4 h-4" /> }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: null };
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${config.color}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFoodListings = foodListings.filter(food =>
    food.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? 
              <CheckCircle className="w-5 h-5 mr-2" /> : 
              <AlertCircle className="w-5 h-5 mr-2" />
            }
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-gray-400">Full Control Panel</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
              <button
                onClick={handleRefresh}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="px-6">
          <nav className="flex space-x-1">
            {['dashboard', 'users', 'food', 'claims', 'reviews', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 rounded-t-lg font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  {tab === 'dashboard' && <BarChart3 className="w-4 h-4" />}
                  {tab === 'users' && <Users className="w-4 h-4" />}
                  {tab === 'food' && <Package className="w-4 h-4" />}
                  {tab === 'claims' && <DollarSign className="w-4 h-4" />}
                  {tab === 'reviews' && <Eye className="w-4 h-4" />}
                  {tab === 'settings' && <Settings className="w-4 h-4" />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="p-6">
        {/* Search Bar */}
        {activeTab !== 'dashboard' && (
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">📊 Overview Dashboard</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Users</p>
                    <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Donors</p>
                    <p className="font-bold text-green-400">{stats.totalDonors}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Recipients</p>
                    <p className="font-bold text-blue-400">{stats.totalRecipients}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Food Listings</p>
                    <p className="text-3xl font-bold mt-2">{stats.totalFoodListings}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-400">Total Claims</p>
                  <p className="font-bold text-yellow-400">{stats.totalClaims}</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Revenue</p>
                    <p className="text-3xl font-bold mt-2">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-400">Completed Claims</p>
                    <p className="font-bold text-green-400">{stats.totalCompletedClaims || 0}</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Environmental Impact</p>
                    <p className="text-3xl font-bold mt-2">{stats.foodSaved} kg</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-400">CO₂ Saved</p>
                  <p className="font-bold text-purple-400">{stats.co2Saved} kg</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">⚡ Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('users')}
                  className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-center"
                >
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-bold">Manage Users</p>
                </button>
                <button
                  onClick={() => setActiveTab('food')}
                  className="p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-center"
                >
                  <Package className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-bold">Manage Food</p>
                </button>
                <button
                  onClick={() => setActiveTab('claims')}
                  className="p-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors text-center"
                >
                  <DollarSign className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-bold">Manage Claims</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">👥 User Management</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  Showing {filteredUsers.length} of {users.length} users
                </span>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="py-3 px-4 text-left">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="py-3 px-4 text-left">User</th>
                    <th className="py-3 px-4 text-left">Type</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Joined</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="py-3 px-4">
                        <input 
                          type="checkbox" 
                          className="rounded" 
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user.id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                            }
                          }}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-bold">{user.full_name || 'No Name'}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          user.user_type === 'donor' ? 'bg-blue-100 text-blue-800' :
                          user.user_type === 'admin' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.user_type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(user.is_admin ? 'active' : 'active')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-400">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewUser(user)}
                            className="p-1.5 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user.id, 'active')}
                            className="p-1.5 bg-yellow-600 hover:bg-yellow-700 rounded transition-colors"
                            title="Suspend User"
                            disabled={userActionLoading}
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1.5 bg-red-600 hover:bg-red-700 rounded transition-colors"
                            title="Delete User"
                            disabled={userActionLoading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Food Listings Tab */}
        {activeTab === 'food' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">🍽️ Food Listings Management</h2>
              <span className="text-sm text-gray-400">
                {filteredFoodListings.length} listings
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFoodListings.map((food) => (
                <div key={food.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                  {food.image_url && (
                    <img
                      src={food.image_url}
                      alt={food.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg">{food.title}</h3>
                      {getStatusBadge(food.status)}
                    </div>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {food.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div>
                        <p className="text-xs text-gray-400">Quantity</p>
                        <p className="font-bold">{food.quantity} meals</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Price</p>
                        <p className="font-bold text-green-400">${food.price}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">City</p>
                        <p className="font-bold">{food.city}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Pickup</p>
                        <p className="font-bold text-sm">{formatDate(food.pickup_time)}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-400">
                        Donor: {food.donor_name}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewFood(food)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteFoodListing(food.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Claims Tab */}
        {activeTab === 'claims' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">📋 Claims Management</h2>
              <span className="text-sm text-gray-400">
                {claims.length} total claims
              </span>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="py-3 px-4 text-left">Claim ID</th>
                    <th className="py-3 px-4 text-left">Food Item</th>
                    <th className="py-3 px-4 text-left">Recipient</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Claimed At</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim) => (
                    <tr key={claim.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="py-3 px-4 font-mono">#{claim.id}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-bold">{claim.food_title}</p>
                          <p className="text-sm text-gray-400">${claim.price}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-bold">{claim.recipient_name}</p>
                          <p className="text-sm text-gray-400">{claim.recipient_email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(claim.status)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-400">
                        {formatDate(claim.claimed_at)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() => setViewClaim(claim)}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleUpdateClaimStatus(claim.id, 'completed')}
                            className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs transition-colors"
                            disabled={claim.status === 'completed'}
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleUpdateClaimStatus(claim.id, 'cancelled')}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs transition-colors"
                            disabled={claim.status === 'cancelled'}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">⭐ Reviews Management</h2>
              <span className="text-sm text-gray-400">
                {reviews.length} reviews
              </span>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold">{review.food_title}</h3>
                      <p className="text-sm text-gray-400">
                        {review.restaurant_name} • {review.reviewer_name || 'Anonymous'}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {review.category_feedback && (
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs">
                        {review.category_feedback}
                      </span>
                    </div>
                  )}
                  
                  {review.review_text && (
                    <p className="text-gray-300 mb-3">{review.review_text}</p>
                  )}
                  
                  {review.suggestions && (
                    <div className="mb-3 p-3 bg-gray-900/50 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Suggestions:</p>
                      <p className="text-gray-300">{review.suggestions}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <div>
                      Posted: {formatDate(review.created_at)}
                      {review.anonymous === 1 && ' • Anonymous'}
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                    >
                      Delete Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">⚙️ Admin Settings</h2>
            
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-3">Website Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Site Name</label>
                      <input
                        type="text"
                        defaultValue="RePlate"
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Maintenance Mode</label>
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input type="checkbox" className="sr-only" />
                          <div className="block w-10 h-6 bg-gray-700 rounded-full"></div>
                          <div className="dot absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full transition"></div>
                        </div>
                        <span className="ml-3 text-sm">Enable maintenance mode</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-3">Email Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Admin Email</label>
                      <input
                        type="email"
                        defaultValue="admin@admin.com"
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Notification Email</label>
                      <input
                        type="email"
                        defaultValue="notifications@replate.com"
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-3">Danger Zone</h3>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-red-900/30 hover:bg-red-900/50 border border-red-700 text-red-400 rounded-lg transition-colors">
                      Clear All Cache
                    </button>
                    <button className="w-full px-4 py-3 bg-red-900/30 hover:bg-red-900/50 border border-red-700 text-red-400 rounded-lg transition-colors">
                      Reset Statistics
                    </button>
                    <button className="w-full px-4 py-3 bg-red-700 hover:bg-red-800 text-white rounded-lg transition-colors">
                      Delete All Test Data
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-700">
                  <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors">
                    Save All Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* User Profile Modal */}
      {viewUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white rounded-xl w-full max-w-md p-6 relative">
            
            <button
              onClick={() => setViewUser(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">👤 User Profile</h2>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400">Name:</span>
                <div className="font-bold">{viewUser.full_name || 'N/A'}</div>
              </div>

              <div>
                <span className="text-gray-400">Email:</span>
                <div className="font-bold">{viewUser.email}</div>
              </div>

              <div>
                <span className="text-gray-400">User Type:</span>
                <div className="font-bold capitalize">{viewUser.user_type}</div>
              </div>

              <div>
                <span className="text-gray-400">Admin:</span>
                <div className="font-bold">
                  {viewUser.is_admin ? 'Yes' : 'No'}
                </div>
              </div>

              <div>
                <span className="text-gray-400">Joined:</span>
                <div className="font-bold">
                  {new Date(viewUser.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Food Details Modal */}
      {viewFood && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 text-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            
            <button
              onClick={() => setViewFood(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl z-10"
            >
              ✕
            </button>

            {viewFood.image_url && (
              <div className="h-64 w-full overflow-hidden">
                <img
                  src={viewFood.image_url}
                  alt={viewFood.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{viewFood.title}</h2>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Package className="w-4 h-4" />
                    <span>Food Listing #{viewFood.id}</span>
                  </div>
                </div>
                {getStatusBadge(viewFood.status)}
              </div>

              <p className="text-gray-300 mb-6">{viewFood.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Food Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Food Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-900/50 p-3 rounded-lg">
                      <div className="text-xs text-gray-400">Quantity</div>
                      <div className="font-bold text-lg">{viewFood.quantity} meals</div>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded-lg">
                      <div className="text-xs text-gray-400">Price</div>
                      <div className="font-bold text-lg text-green-400">${viewFood.price}</div>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded-lg">
                      <div className="text-xs text-gray-400">Category</div>
                      <div className="font-bold">{viewFood.category || 'General'}</div>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded-lg">
                      <div className="text-xs text-gray-400">Allergens</div>
                      <div className="font-bold">{viewFood.allergens || 'None specified'}</div>
                    </div>
                  </div>
                </div>

                {/* Location & Timing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location & Timing
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-bold">{viewFood.city}</div>
                        <div className="text-sm text-gray-400">{viewFood.address || 'Address not specified'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-bold">Pickup Time</div>
                        <div className="text-sm text-gray-400">{formatDate(viewFood.pickup_time)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-bold">Expires</div>
                        <div className="text-sm text-gray-400">{formatDate(viewFood.expiry_date || viewFood.pickup_time)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Donor Information */}
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Donor Information
                </h3>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-400">Donor Name</div>
                      <div className="font-bold">{viewFood.donor_name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Restaurant</div>
                      <div className="font-bold">{viewFood.restaurant_name || 'Individual Donor'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Contact</div>
                      <div className="font-bold">{viewFood.donor_email || 'No contact provided'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-700">
                <button
                  onClick={() => handleDeleteFoodListing(viewFood.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Delete Listing
                </button>
                <button
                  onClick={() => setViewFood(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Claim Details Modal */}
      {viewClaim && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 text-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            
            <button
              onClick={() => setViewClaim(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl z-10"
            >
              ✕
            </button>

            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Claim #{viewClaim.id}</h2>
                  <div className="flex items-center gap-2 text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span>Total: ${viewClaim.price}</span>
                    <span>•</span>
                    <span>{formatDate(viewClaim.claimed_at)}</span>
                  </div>
                </div>
                {getStatusBadge(viewClaim.status)}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Food Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Food Item
                  </h3>
                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <div className="mb-3">
                      <div className="text-xs text-gray-400">Food Title</div>
                      <div className="font-bold text-lg">{viewClaim.food_title}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-400">Price</div>
                        <div className="font-bold text-green-400">${viewClaim.price}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Quantity</div>
                        <div className="font-bold">{viewClaim.quantity || '1'} meal(s)</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Donor</div>
                        <div className="font-bold">{viewClaim.donor_name}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Location</div>
                        <div className="font-bold">{viewClaim.city}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recipient Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Recipient Details
                  </h3>
                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <div className="mb-3">
                      <div className="text-xs text-gray-400">Recipient Name</div>
                      <div className="font-bold text-lg">{viewClaim.recipient_name}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{viewClaim.recipient_email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{viewClaim.recipient_phone || 'No phone provided'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Claim Timeline */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Claim Timeline
                </h3>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Claim Created</span>
                      </div>
                      <span className="text-sm text-gray-400">{formatDate(viewClaim.claimed_at)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          viewClaim.status === 'completed' || viewClaim.status === 'cancelled' 
                            ? 'bg-blue-500' 
                            : 'bg-gray-600'
                        }`}></div>
                        <span>Processing</span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {viewClaim.updated_at ? formatDate(viewClaim.updated_at) : 'In progress'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          viewClaim.status === 'completed' 
                            ? 'bg-green-500' 
                            : viewClaim.status === 'cancelled'
                            ? 'bg-red-500'
                            : 'bg-gray-600'
                        }`}></div>
                        <span className="capitalize">{viewClaim.status}</span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {viewClaim.status === 'completed' || viewClaim.status === 'cancelled'
                          ? formatDate(viewClaim.updated_at)
                          : 'Pending'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-bold mb-4">Admin Actions</h3>
                <div className="flex flex-wrap gap-3">
                  {viewClaim.status !== 'completed' && (
                    <button
                      onClick={() => {
                        handleUpdateClaimStatus(viewClaim.id, 'completed');
                        setViewClaim({...viewClaim, status: 'completed'});
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                      Mark as Completed
                    </button>
                  )}
                  {viewClaim.status !== 'cancelled' && (
                    <button
                      onClick={() => {
                        handleUpdateClaimStatus(viewClaim.id, 'cancelled');
                        setViewClaim({...viewClaim, status: 'cancelled'});
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                      Cancel Claim
                    </button>
                  )}
                  <button
                    onClick={() => setViewClaim(null)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;