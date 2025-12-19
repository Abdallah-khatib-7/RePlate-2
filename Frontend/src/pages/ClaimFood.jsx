// src/pages/ClaimFood.jsx
import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';

const ClaimFood = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  // Mock food data
  const foodItems = [
    {
      id: 1,
      name: 'Fresh Mediterranean Platter',
      restaurant: 'Olive Garden Bistro',
      description: 'Assorted Mediterranean dishes including hummus, tabbouleh, and fresh pita bread. Perfect for sharing!',
      quantity: 8,
      originalPrice: 24.99,
      discountPrice: 8.99,
      category: 'mediterranean',
      pickupTime: 'Today, 7:00 PM - 8:00 PM',
      distance: '0.8 miles',
      rating: 4.8,
      image: '🥙',
      isVegan: true,
      isVegetarian: true
    },
    {
      id: 2,
      name: 'Artisan Sandwiches Box',
      restaurant: 'Urban Deli Co.',
      description: 'Freshly made artisan sandwiches with premium ingredients. Includes 4 different varieties.',
      quantity: 12,
      originalPrice: 32.50,
      discountPrice: 12.99,
      category: 'sandwiches',
      pickupTime: 'Today, 6:30 PM - 7:30 PM',
      distance: '1.2 miles',
      rating: 4.6,
      image: '🥪',
      isVegetarian: false
    },
    {
      id: 3,
      name: 'Gourmet Pizza Collection',
      restaurant: 'Firestone Pizzeria',
      description: 'Assorted gourmet pizzas including Margherita, Pepperoni, and Veggie Supreme. Freshly baked.',
      quantity: 6,
      originalPrice: 45.00,
      discountPrice: 15.99,
      category: 'pizza',
      pickupTime: 'Today, 8:00 PM - 9:00 PM',
      distance: '0.5 miles',
      rating: 4.9,
      image: '🍕'
    },
    {
      id: 4,
      name: 'Healthy Salad Bowls',
      restaurant: 'Green Leaf Cafe',
      description: 'Nutritious salad bowls with mixed greens, quinoa, avocado, and protein options. Gluten-free available.',
      quantity: 10,
      originalPrice: 18.75,
      discountPrice: 6.99,
      category: 'salads',
      pickupTime: 'Today, 5:00 PM - 6:00 PM',
      distance: '1.5 miles',
      rating: 4.7,
      image: '🥗',
      isVegan: true,
      isVegetarian: true
    },
    {
      id: 5,
      name: 'Asian Fusion Box',
      restaurant: 'Dragon Palace',
      description: 'Delicious Asian fusion dishes including sushi rolls, stir-fry, and dumplings. Great variety!',
      quantity: 5,
      originalPrice: 35.99,
      discountPrice: 14.99,
      category: 'asian',
      pickupTime: 'Today, 7:30 PM - 8:30 PM',
      distance: '2.1 miles',
      rating: 4.5,
      image: '🍱'
    },
    {
      id: 6,
      name: 'Fresh Pastry Assortment',
      restaurant: 'Sweet Dreams Bakery',
      description: 'Assorted fresh pastries including croissants, muffins, and danishes. Baked this morning.',
      quantity: 15,
      originalPrice: 22.50,
      discountPrice: 7.99,
      category: 'bakery',
      pickupTime: 'Tomorrow, 8:00 AM - 10:00 AM',
      distance: '0.9 miles',
      rating: 4.8,
      image: '🥐',
      isVegetarian: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️' },
    { id: 'mediterranean', name: 'Mediterranean', icon: '🥙' },
    { id: 'sandwiches', name: 'Sandwiches', icon: '🥪' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'salads', name: 'Salads', icon: '🥗' },
    { id: 'asian', name: 'Asian', icon: '🍱' },
    { id: 'bakery', name: 'Bakery', icon: '🥐' },
    { id: 'more', name: 'More', icon: '...' },
  ];

  const filteredItems = foodItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.restaurant.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const FoodCard = ({ item }) => (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl flex items-center justify-center text-2xl">
              {item.image}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
              <p className="text-green-600 font-semibold">{item.restaurant}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-full">
            <span className="text-green-600">⭐</span>
            <span className="text-green-700 font-semibold text-sm">{item.rating}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.description}</p>

        {/* Dietary Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.isVegan && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">🌱 Vegan</span>
          )}
          {item.isVegetarian && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">🥬 Vegetarian</span>
          )}
          {!item.isVegetarian && (
            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">🍗 Contains Meat</span>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">📦</span>
            <span className="text-gray-600">{item.quantity} available</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">📍</span>
            <span className="text-gray-600">{item.distance}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">⏰</span>
            <span className="text-gray-600">{item.pickupTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">💰</span>
            <span className="text-gray-600">Save 60%+</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-green-600">${item.discountPrice}</span>
            <span className="text-gray-400 line-through text-sm">${item.originalPrice}</span>
          </div>
          <Link to="/register" className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 transform hover:scale-105">
            Claim Now
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`py-8 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Surplus Food</h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Discover delicious surplus meals from local restaurants and cafes. Save food, save money, help the planet!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search and Filter Bar */}
        <div className={`mb-8 transform transition-all duration-500 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Search Input */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-xl">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search for food or restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${300 + index * 50}ms` }}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className={`mb-6 transform transition-all duration-500 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <p className="text-gray-600">
            Found <span className="font-bold text-green-600">{filteredItems.length}</span> items 
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Food Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <FoodCard item={item} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className={`text-center py-16 transform transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No food found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or check back later for new listings.
            </p>
            <button 
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
            >
              Show All Items
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ClaimFood;