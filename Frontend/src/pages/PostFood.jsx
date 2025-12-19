// src/pages/PostFood.jsx
import React, { useState, useEffect } from 'react';
const PostFood = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    foodName: '',
    foodCategory: '',
    description: '',
    quantity: 1,
    
    // Step 2: Pricing & Details
    originalPrice: '',
    discountPrice: '',
    dietaryTags: [],
    allergens: [],
    
    // Step 3: Pickup Information
    pickupTime: '',
    pickupDate: '',
    location: '',
    instructions: '',
    
    // Step 4: Restaurant Info
    restaurantName: '',
    contactEmail: '',
    contactPhone: ''
  });

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const updatedArray = checked 
        ? [...formData[name], value]
        : formData[name].filter(item => item !== value);
      setFormData({ ...formData, [name]: updatedArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Food listing created successfully! 🎉');
    // Reset form
    setFormData({
      foodName: '', foodCategory: '', description: '', quantity: 1,
      originalPrice: '', discountPrice: '', dietaryTags: [], allergens: [],
      pickupTime: '', pickupDate: '', location: '', instructions: '',
      restaurantName: '', contactEmail: '', contactPhone: ''
    });
    setCurrentStep(1);
    setIsSubmitting(false);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const categories = [
    { id: 'mediterranean', name: 'Mediterranean', icon: '🥙' },
    { id: 'sandwiches', name: 'Sandwiches', icon: '🥪' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'salads', name: 'Salads', icon: '🥗' },
    { id: 'asian', name: 'Asian', icon: '🍱' },
    { id: 'bakery', name: 'Bakery', icon: '🥐' },
    { id: 'mexican', name: 'Mexican', icon: '🌮' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' }
  ];

  const dietaryTags = [
    { id: 'vegan', name: 'Vegan', icon: '🌱' },
    { id: 'vegetarian', name: 'Vegetarian', icon: '🥬' },
    { id: 'gluten-free', name: 'Gluten-Free', icon: '🌾' },
    { id: 'dairy-free', name: 'Dairy-Free', icon: '🥛' },
    { id: 'nut-free', name: 'Nut-Free', icon: '🥜' },
    { id: 'organic', name: 'Organic', icon: '🍃' }
  ];

  const allergens = [
    'Gluten', 'Dairy', 'Nuts', 'Soy', 'Eggs', 'Shellfish', 'Fish', 'Sesame'
  ];

  const StepIndicator = () => (
    <div className={`flex justify-between mb-8 transform transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      {[1, 2, 3, 4].map(step => (
        <div key={step} className="flex flex-col items-center flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
            step === currentStep
              ? 'bg-green-500 text-white scale-110'
              : step < currentStep
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-200 text-gray-400'
          }`}>
            {step < currentStep ? '✓' : step}
          </div>
          <span className={`text-sm mt-2 font-medium ${
            step === currentStep ? 'text-green-600' : 'text-gray-500'
          }`}>
            {['Food Details', 'Pricing', 'Pickup', 'Restaurant'][step - 1]}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className={`text-center mb-8 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            List Surplus Food
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Turn your surplus food into opportunities. Help reduce waste while earning back costs.
          </p>
        </div>

        <div className={`bg-white rounded-3xl shadow-2xl p-8 transform transition-all duration-500 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          
          <StepIndicator />

          <form onSubmit={handleSubmit}>
            
            {/* Step 1: Food Details */}
            {currentStep === 1 && (
              <div className={`space-y-6 transform transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Food Information</h2>
                
                {/* Food Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Item Name *
                  </label>
                  <input
                    type="text"
                    name="foodName"
                    required
                    value={formData.foodName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Mediterranean Platter, Artisan Sandwiches"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Food Category *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setFormData({...formData, foodCategory: category.id})}
                        className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                          formData.foodCategory === category.id
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-green-300'
                        }`}
                      >
                        <span className="text-2xl mb-2">{category.icon}</span>
                        <span className="text-sm font-medium">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Describe the food items, ingredients, and any special notes..."
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Quantity *
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, quantity: Math.max(1, formData.quantity - 1)})}
                      className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl hover:bg-gray-200 transition-colors duration-200"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                      {formData.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, quantity: formData.quantity + 1})}
                      className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl hover:bg-gray-200 transition-colors duration-200"
                    >
                      +
                    </button>
                    <span className="text-gray-600 ml-4">servings/portions</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Pricing & Dietary Info */}
            {currentStep === 2 && (
              <div className={`space-y-6 transform transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing & Dietary Information</h2>
                
                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price ($) *
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      required
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="24.99"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surplus Price ($) *
                    </label>
                    <input
                      type="number"
                      name="discountPrice"
                      required
                      step="0.01"
                      value={formData.discountPrice}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="8.99"
                    />
                  </div>
                </div>

                {/* Savings Display */}
                {formData.originalPrice && formData.discountPrice && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 font-semibold">
                        You're offering {Math.round((1 - formData.discountPrice / formData.originalPrice) * 100)}% off!
                      </span>
                      <span className="text-green-600 font-bold">
                        Save ${(formData.originalPrice - formData.discountPrice).toFixed(2)} per item
                      </span>
                    </div>
                  </div>
                )}

                {/* Dietary Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Dietary Tags
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {dietaryTags.map(tag => (
                      <label key={tag.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:border-green-300 transition-colors duration-200 cursor-pointer">
                        <input
                          type="checkbox"
                          name="dietaryTags"
                          value={tag.id}
                          checked={formData.dietaryTags.includes(tag.id)}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                        />
                        <span className="text-lg">{tag.icon}</span>
                        <span className="text-sm font-medium">{tag.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Allergens */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Contains Allergens
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {allergens.map(allergen => (
                      <label key={allergen} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-xl hover:border-red-300 transition-colors duration-200 cursor-pointer">
                        <input
                          type="checkbox"
                          name="allergens"
                          value={allergen}
                          checked={formData.allergens.includes(allergen)}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                        />
                        <span className="text-sm font-medium">{allergen}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Pickup Information */}
            {currentStep === 3 && (
              <div className={`space-y-6 transform transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Pickup Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pickup Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Date *
                    </label>
                    <input
                      type="date"
                      name="pickupDate"
                      required
                      value={formData.pickupDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Pickup Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Time *
                    </label>
                    <input
                      type="time"
                      name="pickupTime"
                      required
                      value={formData.pickupTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., 123 Main Street, Kitchen entrance"
                  />
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Pickup Instructions
                  </label>
                  <textarea
                    name="instructions"
                    rows={3}
                    value={formData.instructions}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Any special instructions for pickup..."
                  />
                </div>
              </div>
            )}

            {/* Step 4: Restaurant Information */}
            {currentStep === 4 && (
              <div className={`space-y-6 transform transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Restaurant Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Restaurant Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Restaurant Name *
                    </label>
                    <input
                      type="text"
                      name="restaurantName"
                      required
                      value={formData.restaurantName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Your restaurant name"
                    />
                  </div>

                  {/* Contact Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      required
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    required
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="contact@yourrestaurant.com"
                  />
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Listing Summary</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Food Item:</span>
                      <span className="font-medium">{formData.foodName || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span className="font-medium">{formData.quantity} servings</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span className="font-medium">
                        ${formData.discountPrice || '0'} (was ${formData.originalPrice || '0'})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pickup:</span>
                      <span className="font-medium">
                        {formData.pickupDate} at {formData.pickupTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className={`flex justify-between pt-8 mt-8 border-t border-gray-200 transform transition-all duration-500 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>←</span>
                <span>Previous</span>
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all duration-200 transform hover:scale-105"
                >
                  <span>Next</span>
                  <span>→</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 bg-green-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Listing...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Publish Listing</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Benefits Section */}
        <div className={`mt-8 text-center transform transition-all duration-500 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <span>💰</span>
              <span>Recover food costs</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>🌍</span>
              <span>Reduce food waste</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>👥</span>
              <span>Reach new customers</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PostFood;