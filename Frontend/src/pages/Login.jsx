// src/pages/Login.jsx - UPDATED VERSION with user_type redirect
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

// Base URL for your backend
const API_URL = 'http://localhost:5000/api';

const Login = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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
  };

  // ✅ UPDATED: Email/Password Login with user_type redirect
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.status !== 'success') {
        throw new Error(data.message || 'Login failed');
      }

      // ✅ Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('authMethod', 'email');
      localStorage.setItem('user_type', data.user.user_type);
      
      // If remember me is checked
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // ✅ NEW: Redirect based on user_type
      const userType = data.user.user_type;
      console.log('User type detected:', userType);
      
      if (userType === 'donor' || userType === 'restaurant') {
        navigate('/post-food');
      } else {
        navigate('/claim-food');
      }

    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ UPDATED: Google Login with user_type redirect
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Decode Google token
      const decoded = jwtDecode(credentialResponse.credential);
      
      // Send to your backend
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: decoded.email,
          name: decoded.name,
          googleId: decoded.sub
        })
      });

      const data = await response.json();

      if (data.status !== 'success') {
        throw new Error(data.message || 'Google login failed');
      }

      // ✅ Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('authMethod', 'google');
      localStorage.setItem('user_type', data.user.user_type);
      
      // ✅ NEW: Redirect based on user_type
      const userType = data.user.user_type;
      console.log('Google user type detected:', userType);
      
      if (userType === 'donor' || userType === 'restaurant') {
        navigate('/post-food');
      } else {
        navigate('/claim-food');
      }

    } catch (error) {
      console.error('Google login error:', error);
      alert('Google login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    console.log('Google Login Failed');
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-100 rounded-full opacity-10"></div>
      </div>

      <div className={`relative w-full max-w-4xl transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
      }`}>
        
        <div className="bg-white/95 rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left Side - Brand & Visual */}
            <div className="bg-gradient-to-br from-emerald-600 to-cyan-600 p-8 flex flex-col justify-between relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-10 -translate-x-10"></div>
              
              <div className="relative z-10">
                <Link to="/" className="inline-flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow">
                    <span className="text-emerald-600 font-bold text-xl">R</span>
                  </div>
                  <span className="text-2xl font-bold text-white">RePlate</span>
                </Link>
                
                <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
                  Welcome Back to <br />Your <span className="text-cyan-200">Food Saving</span> Journey
                </h1>
                
                <p className="text-emerald-100 leading-relaxed mb-6">
                  Continue fighting food waste and feeding communities. 
                  Every login helps save meals and reduce environmental impact.
                </p>
              </div>

              {/* Stats */}
              <div className="relative z-10 grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
                {[
                  { number: '10K+', label: 'Meals Saved' },
                  { number: '200+', label: 'Partners' },
                  { number: '50+', label: 'Cities' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-emerald-200 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="p-8">
              <div className="max-w-sm mx-auto w-full">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
                  <p className="text-gray-600 text-sm">Access your RePlate account</p>
                </div>

                {/* Google Sign In */}
                <div className="mb-6">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="filled_blue"
                    size="large"
                    text="continue_with"
                    shape="rectangular"
                    width="100%"
                  />
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with email</span>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Email Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400"
                        placeholder="Enter your email"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400"
                        placeholder="Enter your password"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300" 
                      />
                      <span className="text-sm text-gray-600">
                        Remember me
                      </span>
                    </label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-md transition-all duration-300 disabled:opacity-50 relative"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          <span>Sign In</span>
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Sign Up Link */}
                <div className="text-center pt-6 border-t border-gray-200 mt-6">
                  <p className="text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <Link 
                      to="/register" 
                      className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200 hover:underline"
                    >
                      Sign up for free
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;