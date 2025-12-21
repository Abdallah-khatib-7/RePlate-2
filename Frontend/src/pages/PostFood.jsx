import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const PostFood = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Form state for new/editing listing
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    quantity: '',
    city: '',
    address: '',
    pickup_time: '',
    image_url: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    checkUserTypeAndLoad();
  }, []);

  // ✅ NEW: Check if user is a donor before loading page
  const checkUserTypeAndLoad = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      // Get user info to check user_type
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        const userType = data.user.user_type;
        setUserType(userType);
        
        if (userType === 'donor' || userType === 'restaurant') {
          // User is donor/restaurant, proceed
          setIsVisible(true);
          fetchRestaurantListings();
        } else {
          // User is not donor, redirect to claim-food
          alert('This page is for restaurant owners only. Redirecting to food listings...');
          navigate('/claim-food');
        }
      } else {
        throw new Error('Failed to get user info');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Session expired. Please login again.');
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const fetchRestaurantListings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await fetch(`${API_URL}/food/my-listings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setListings(data.listings || []);
      } else {
        throw new Error(data.message || 'Failed to fetch your listings');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load your food listings. Please try again.');
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_type');
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError('');
      
      console.log('=== FORM SUBMISSION START ===');
      console.log('Form data:', formData);
      console.log('Editing ID:', editingId);
      console.log('User type:', userType);
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }
      
      console.log('Token found, preparing request...');
      
      const url = editingId 
        ? `${API_URL}/food/listings/${editingId}`
        : `${API_URL}/food/listings`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      // Format pickup_time for MySQL (convert to ISO string)
      let formattedPickupTime = formData.pickup_time;
      if (formData.pickup_time) {
        const date = new Date(formData.pickup_time);
        formattedPickupTime = date.toISOString().slice(0, 19).replace('T', ' ');
        console.log('Formatted pickup time:', formattedPickupTime);
      }
      
      const formattedData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        city: formData.city,
        address: formData.address,
        pickup_time: formattedPickupTime,
        image_url: formData.image_url || null
      };
      
      // Don't send expiry_time if not provided
      if (formData.expiry_time) {
        const expiryDate = new Date(formData.expiry_time);
        formattedData.expiry_time = expiryDate.toISOString().slice(0, 19).replace('T', ' ');
      }
      
      console.log('Data to send:', formattedData);
      console.log('Request URL:', url);
      console.log('Request Method:', method);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });
      
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.status === 'success') {
        console.log('Success!');
        alert(editingId ? '✅ Listing updated successfully!' : '✅ Food listing created successfully!');
        resetForm();
        fetchRestaurantListings();
      } else {
        console.log('API returned error:', data.message);
        throw new Error(data.message || 'Failed to save listing');
      }
    } catch (error) {
      console.error('=== FORM SUBMISSION ERROR ===');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      
      let errorMessage = error.message;
      
      // Try to extract more specific error message
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else if (error.message.includes('401') || error.message.includes('Authentication')) {
        errorMessage = 'Session expired. Please login again.';
        localStorage.removeItem('token');
        navigate('/login');
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setError(errorMessage);
      alert(`Failed to save food listing: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (listing) => {
    // Format pickup_time for datetime-local input
    let pickupTime = '';
    if (listing.pickup_time) {
      const date = new Date(listing.pickup_time);
      pickupTime = date.toISOString().slice(0, 16);
    }
    
    setFormData({
      title: listing.title,
      description: listing.description,
      price: listing.price.toString(),
      quantity: listing.quantity.toString(),
      city: listing.city,
      address: listing.address,
      pickup_time: pickupTime,
      image_url: listing.image_url || ''
    });
    setEditingId(listing.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/food/listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        alert('🗑️ Listing deleted successfully!');
        fetchRestaurantListings();
      } else {
        throw new Error(data.message || 'Failed to delete listing');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Failed to delete listing: ${error.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      quantity: '',
      city: '',
      address: '',
      pickup_time: '',
      image_url: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'available':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">Available</span>;
      case 'reserved':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">Reserved</span>;
      case 'claimed':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">Claimed</span>;
      case 'expired':
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-bold">Expired</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-bold">{status}</span>;
    }
  };

  // Don't show anything if user type check is still running
  if (!userType && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking user permissions...</p>
        </div>
      </div>
    );
  }

  const totalListings = listings.length;
  const availableCount = listings.filter(l => l.status === 'available').length;
  const claimedCount = listings.filter(l => l.status === 'claimed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Simple Header - Just Logout */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Logged in as: <span className="font-bold text-orange-600">{userType}</span>
          </div>
          <div>
            <button
              onClick={async () => {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/food/debug-info`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                console.log('Debug Info:', data);
                alert(`User ID: ${data.user.id}\nUser Type: ${data.user.user_type}\nMy Listings: ${data.user_listings.length}`);
              }}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors duration-200 mr-2"
            >
              Debug
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

      {/* Main Content */}
      <div className={`py-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Restaurant Dashboard Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">🍽️ Restaurant Dashboard</h1>
                <p className="text-gray-600">Manage your food listings, update quantities, and add new items</p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(!showForm);
                }}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                {showForm ? '❌ Cancel' : '➕ Add New Listing'}
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow p-6">
                <div className="text-2xl font-bold text-gray-900">{totalListings}</div>
                <div className="text-gray-600">Total Listings</div>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <div className="text-2xl font-bold text-green-600">{availableCount}</div>
                <div className="text-gray-600">Available</div>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <div className="text-2xl font-bold text-blue-600">{claimedCount}</div>
                <div className="text-gray-600">Claimed</div>
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className={`mb-8 bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingId ? '✏️ Edit Food Listing' : '➕ Add New Food Listing'}
              </h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Food Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., Fresh Pizza Slices"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 5.99"
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity (meals) *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 10"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., Beirut"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Full restaurant address"
                    />
                  </div>

                  {/* Pickup Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="pickup_time"
                      value={formData.pickup_time}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL (optional)
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Describe the food, ingredients, and any important details..."
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {editingId ? 'Updating...' : 'Creating...'}
                      </div>
                    ) : (
                      editingId ? '💾 Update Listing' : '✅ Create Listing'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Restaurant Listings */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Food Listings ({listings.length})</h2>
              <div className="text-sm text-gray-500">
                Updated just now
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                {error}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🍕</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No food listings yet</h3>
                <p className="text-gray-600 mb-6">Start by adding your first food listing!</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  ➕ Add First Listing
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((listing, index) => (
                  <div
                    key={listing.id}
                    className={`bg-gray-50 rounded-xl p-6 transform transition-all duration-300 hover:shadow-md ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Listing Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          {listing.image_url && (
                            <img
                              src={listing.image_url}
                              alt={listing.title}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
                              }}
                            />
                          )}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-gray-900">{listing.title}</h3>
                              {getStatusBadge(listing.status)}
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2">{listing.description}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <div className="text-sm text-gray-500">Price</div>
                            <div className="font-bold text-green-600">${listing.price}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Quantity</div>
                            <div className="font-bold">{listing.quantity} meals</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Location</div>
                            <div className="font-bold">{listing.city}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Pickup</div>
                            <div className="font-bold">{formatDate(listing.pickup_time)}</div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row md:flex-col gap-2">
                        <button
                          onClick={() => handleEdit(listing)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostFood;