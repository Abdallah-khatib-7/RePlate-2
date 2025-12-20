// src/pages/Register.jsx - UPDATED VERSION
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const Register = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('foodLover'); // Default to foodLover
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Restaurant Information 
    restaurantName: '',
    restaurantType: '',
    address: '',
    cuisineType: '',
    
    // Preferences
    newsletter: true,
    terms: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError(''); // Clear error on typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    // Validate terms acceptance
    if (!formData.terms) {
      setError('Please accept the Terms of Service and Privacy Policy');
      setIsLoading(false);
      return;
    }

    try {
      // Prepare data for backend
      const fullName = `${formData.firstName} ${formData.lastName}`;
      
      // Map frontend user types to database user types
      const dbUserType = userType === 'restaurant' ? 'donor' : 'recipient';
      
      const registrationData = {
        email: formData.email,
        password: formData.password,
        full_name: fullName,
        phone: formData.phone,
        user_type: dbUserType
      };

      // Add address if it's a restaurant
      if (userType === 'restaurant' && formData.address) {
        registrationData.address = formData.address;
      }

      // Send registration request to backend
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      const data = await response.json();

      if (data.status !== 'success') {
        throw new Error(data.message || 'Registration failed');
      }

      // ✅ Success! Save token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('authMethod', 'email');
      localStorage.setItem('userType', userType);
      
      // Redirect to dashboard
      navigate('/claim-food');

    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const userTypes = [
    {
      id: 'foodLover',
      title: 'Food Lover',
      description: 'Find and claim surplus food from local restaurants',
      icon: '🍽️',
      features: ['Browse available meals', 'Save money on food', 'Reduce food waste', 'Support local businesses']
    },
    {
      id: 'restaurant',
      title: 'Restaurant Partner',
      description: 'List your surplus food and reduce waste',
      icon: '🏪',
      features: ['Recover food costs', 'Reduce waste disposal fees', 'Reach new customers', 'Environmental impact']
    }
  ];

  const cuisineTypes = [
    'Mediterranean', 'Italian', 'Asian', 'Mexican', 'American', 
    'Vegetarian', 'Vegan', 'Bakery', 'Cafe', 'Fast Casual', 'Fine Dining'
  ];

  const passwordStrength = {
    weak: { color: 'text-red-600', width: 'w-1/4', label: 'Weak' },
    medium: { color: 'text-yellow-600', width: 'w-2/4', label: 'Medium' },
    strong: { color: 'text-green-600', width: 'w-3/4', label: 'Strong' },
    veryStrong: { color: 'text-green-700', width: 'w-full', label: 'Very Strong' }
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return null;
    if (password.length < 6) return passwordStrength.weak;
    if (password.length < 8) return passwordStrength.medium;
    if (password.length < 12) return passwordStrength.strong;
    return passwordStrength.veryStrong;
  };

  const passwordStrengthInfo = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className={`w-full max-w-4xl transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
      }`}>
        
        {/* Registration Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-10"></div>
            <div className="relative z-10">
              <Link to="/" className="inline-flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-xl">R</span>
                </div>
                <span className="text-2xl font-bold text-white">RePlate</span>
              </Link>
              <h1 className="text-3xl font-bold text-white mb-2">Join Our Community</h1>
              <p className="text-blue-100">Start your journey to reduce food waste and save delicious meals</p>
            </div>
          </div>

          <div className="p-8">
            {/* User Type Selection */}
            <div className={`mb-8 transform transition-all duration-500 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">I want to join as a...</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setUserType(type.id)}
                    className={`p-6 border-2 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 ${
                      userType === type.id
                        ? 'border-green-500 bg-green-50 shadow-lg'
                        : 'border-gray-200 bg-gray-50 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        userType === type.id ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{type.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{type.description}</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          {type.features.map((feature, index) => (
                            <li key={index}>✓ {feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Personal Information */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transform transition-all duration-500 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transform transition-all duration-500 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {/* Restaurant Information (Conditional) */}
              {userType === 'restaurant' && (
                <div className={`space-y-6 transform transition-all duration-500 delay-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Restaurant Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Restaurant Name
                      </label>
                      <input
                        type="text"
                        name="restaurantName"
                        value={formData.restaurantName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="Your restaurant name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cuisine Type
                      </label>
                      <select
                        name="cuisineType"
                        value={formData.cuisineType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select cuisine type</option>
                        {cuisineTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Restaurant Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Full street address"
                    />
                  </div>
                </div>
              )}

              {/* Password Section */}
              <div className={`space-y-4 transform transition-all duration-500 delay-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Create a password"
                    />
                    {passwordStrengthInfo && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Password strength:</span>
                          <span className={passwordStrengthInfo.color}>{passwordStrengthInfo.label}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full transition-all duration-300 ${passwordStrengthInfo.color} ${passwordStrengthInfo.width}`}></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                        formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                    />
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-red-600 text-xs mt-2">Passwords do not match</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className={`space-y-4 transform transition-all duration-500 delay-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500 border-gray-300" 
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                    Send me updates about new features, special offers, and food saving tips
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    name="terms"
                    checked={formData.terms}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500 border-gray-300 mt-1" 
                    required
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                    I agree to the{' '}
                    <Link to='/terms' className="text-green-600 hover:text-green-700 font-medium">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to='/privacy' className="text-green-600 hover:text-green-700 font-medium">Privacy Policy</Link>
                    . I understand that my data will be processed in accordance with RePlate's privacy practices.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all  disabled:opacity-50 relative overflow-hidden group transform duration-500 delay-800"
              >
                <span className="relative z-10">
                  {isLoading ? 'Creating Account...' : `Join as ${userType === 'foodLover' ? 'Food Lover' : 'Restaurant Partner'}`}
                </span>
                
                {/* Loading Animation */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200 underline"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;