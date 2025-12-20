import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const ClaimFood = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    sortBy: 'newest',
    maxPrice: '',
    status: 'available'
  });
  const [selectedListing, setSelectedListing] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    fetchListings();
  }, [filters.status]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.maxPrice) params.append('price_max', filters.maxPrice);
      if (filters.sortBy) params.append('sort', filters.sortBy);
      if (filters.status) params.append('status', filters.status);
      
      const url = `${API_URL}/food/listings?${params.toString()}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setListings(data.listings || []);
      } else {
        throw new Error(data.message || 'Failed to fetch listings');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load food listings. Please try again.');
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClaimFood = async (listingId) => {
    try {
      setClaiming(true);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/food/listings/${listingId}/claim`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notes: 'I would like to claim this food'
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        alert('🎉 Successfully claimed! Check your dashboard for pickup details.');
        // Refresh listings
        fetchListings();
        setSelectedListing(null);
      } else {
        throw new Error(data.message || 'Claim failed');
      }
    } catch (error) {
      console.error('Claim error:', error);
      alert(`Failed to claim food: ${error.message}`);
    } finally {
      setClaiming(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // Redirect to landing page
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'available':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">Available</span>;
      case 'reserved':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">Reserved</span>;
      case 'claimed':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">Claimed</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-bold">{status}</span>;
    }
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

  const cities = [...new Set(listings.map(l => l.city))].filter(Boolean);
  const availableCount = listings.filter(l => l.status === 'available').length;
  const reservedCount = listings.filter(l => l.status === 'reserved').length;
  const totalCount = listings.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Simple Header with Logout Button */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">🍽️ Food Rescue Platform</h1>
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
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Discover Food Listings</h2>
                <p className="text-gray-600">Rescue delicious food, save money, and reduce waste</p>
              </div>
              <div className="flex space-x-4">
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold">
                  {availableCount} available
                </div>
                <button
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    status: prev.status === 'available' ? 'all' : 'available' 
                  }))}
                  className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold hover:bg-blue-200 transition-colors"
                >
                  {filters.status === 'available' ? 'Show All' : 'Show Available Only'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className={`bg-white rounded-2xl shadow-lg p-6 sticky top-8 transform transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">🔍 Filters</h2>
                
                <div className="space-y-6">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📊 Status
                    </label>
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="available">Available Only</option>
                      <option value="all">All Statuses</option>
                      <option value="reserved">Reserved</option>
                      <option value="claimed">Claimed</option>
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📍 City
                    </label>
                    <select
                      name="city"
                      value={filters.city}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">All Cities</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      💰 Max Price
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">$</span>
                      <input
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        placeholder="Any price"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📊 Sort By
                    </label>
                    <select
                      name="sortBy"
                      value={filters.sortBy}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="quantity_high">Most Quantity</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={() => setFilters({
                      city: '',
                      sortBy: 'newest',
                      maxPrice: '',
                      status: 'available'
                    })}
                    className="w-full py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Clear All Filters
                  </button>
                </div>

                {/* Stats */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">📈 Quick Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total listings:</span>
                      <span className="font-bold">{totalCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available:</span>
                      <span className="font-bold text-green-600">{availableCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reserved:</span>
                      <span className="font-bold text-yellow-600">{reservedCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cities:</span>
                      <span className="font-bold">{cities.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Food Listings */}
            <div className="lg:col-span-3">
              {/* Loading State */}
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                  {error}
                </div>
              ) : (
                <>
                  {/* Results Header */}
                  <div className="mb-6 flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Food Listings ({listings.length})
                      </h2>
                      <p className="text-gray-600">
                        {filters.status === 'available' 
                          ? 'Available for claiming' 
                          : 'All food listings including reserved and claimed'}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Updated just now
                    </div>
                  </div>

                  {/* Food Listings Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {listings.map((listing, index) => (
                      <div
                        key={listing.id}
                        className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        style={{ transitionDelay: `${200 + index * 100}ms` }}
                      >
                        {/* Food Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={listing.image_url || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop`}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 right-4">
                            {getStatusBadge(listing.status)}
                          </div>
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
                            {listing.city}
                          </div>
                          {listing.status === 'available' && (
                            <div className="absolute top-12 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                              {Math.round((listing.price / 25) * 100)}% OFF
                            </div>
                          )}
                        </div>

                        {/* Food Info */}
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-gray-900">{listing.title}</h3>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">${listing.price}</div>
                              <div className="text-sm text-gray-500 line-through">${(listing.price / 0.65).toFixed(2)}</div>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-4 line-clamp-2">{listing.description}</p>

                          {/* Restaurant Info */}
                          <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                              🏪
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{listing.donor_name}</p>
                              <p className="text-sm text-gray-500">{listing.address}</p>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="text-sm text-gray-500">Quantity</div>
                              <div className="font-bold">{listing.quantity} meals</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="text-sm text-gray-500">Pickup</div>
                              <div className="font-bold">{formatDate(listing.pickup_time)}</div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-3">
                            <button
                              onClick={() => setSelectedListing(listing)}
                              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                            >
                              <span>🔍 View Details</span>
                            </button>
                            
                            {listing.status === 'available' ? (
                              <button
                                onClick={() => handleClaimFood(listing.id)}
                                disabled={claiming}
                                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                              >
                                {claiming ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Claiming...</span>
                                  </>
                                ) : (
                                  <>
                                    <span>🍽️ Claim Now</span>
                                    <span className="text-xs bg-white/20 px-2 py-1 rounded">Save ${(listing.price / 0.65 - listing.price).toFixed(2)}</span>
                                  </>
                                )}
                              </button>
                            ) : (
                              <button
                                disabled
                                className={`w-full py-3 rounded-lg font-semibold cursor-not-allowed ${
                                  listing.status === 'reserved' 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {listing.status === 'reserved' ? '⏳ Already Reserved' : '✅ Claimed'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* No Results */}
                  {listings.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🍽️</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">No food listings found</h3>
                      <p className="text-gray-600 mb-6">
                        {filters.status === 'available' 
                          ? 'No available food at the moment. Check back later!' 
                          : 'Try changing your filters or check back later'}
                      </p>
                      <div className="space-x-4">
                        <button
                          onClick={() => setFilters({
                            city: '',
                            sortBy: 'newest',
                            maxPrice: '',
                            status: 'available'
                          })}
                          className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
                        >
                          Clear Filters
                        </button>
                        <button
                          onClick={() => setFilters(prev => ({ ...prev, status: 'all' }))}
                          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200"
                        >
                          Show All Listings
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Listing Details */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedListing.title}</h2>
                  <div className="mt-2">{getStatusBadge(selectedListing.status)}</div>
                </div>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <img
                src={selectedListing.image_url}
                alt={selectedListing.title}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">📋 Description</h3>
                  <p className="text-gray-600">{selectedListing.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">📍 Pickup Details</h3>
                  <p className="text-gray-600">{selectedListing.address}, {selectedListing.city}</p>
                  <p className="text-gray-600 font-medium mt-1">
                    {formatDate(selectedListing.pickup_time)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600">Available Quantity</div>
                  <div className="text-2xl font-bold text-green-700">{selectedListing.quantity} meals</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600">Original Price</div>
                  <div className="text-2xl font-bold text-blue-700">${(selectedListing.price / 0.65).toFixed(2)}</div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes</h3>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Bring your own containers if possible</li>
                  <li>• Arrive within the pickup window</li>
                  <li>• Show confirmation at the restaurant</li>
                  <li>• Food must be consumed same day</li>
                </ul>
              </div>

              <div className="flex space-x-4">
                {selectedListing.status === 'available' ? (
                  <button
                    onClick={() => handleClaimFood(selectedListing.id)}
                    disabled={claiming}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {claiming ? 'Claiming...' : '🍽️ Claim This Food'}
                  </button>
                ) : (
                  <div className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg font-semibold text-center">
                    {selectedListing.status === 'reserved' ? '⏳ This food is already reserved' : '✅ This food has been claimed'}
                  </div>
                )}
                <button
                  onClick={() => setSelectedListing(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimFood;