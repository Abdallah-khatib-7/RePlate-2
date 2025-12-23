import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, X, AlertCircle, CheckCircle, Smile, Frown, Meh } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Rate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log('Location state:', location.state);
  console.log('Location state type:', typeof location.state);
  
  const parseClaimData = () => {
    if (location.state && typeof location.state === 'object') {
      console.log('Using location.state:', location.state);
      return location.state;
    }
    
    const claimId = localStorage.getItem('claimId');
    const foodId = localStorage.getItem('foodId');
    const foodTitle = localStorage.getItem('foodTitle');
    const restaurantName = localStorage.getItem('restaurantName');
    
    console.log('LocalStorage values:', { claimId, foodId, foodTitle, restaurantName });
    
    return {
      claimId,
      foodId,
      foodTitle,
      restaurantName
    };
  };

  const initialData = parseClaimData();
  const [claimId, setClaimId] = useState(initialData.claimId || '');
  const [foodId, setFoodId] = useState(initialData.foodId || '');
  const [foodTitle, setFoodTitle] = useState(initialData.foodTitle || '');
  const [restaurantName, setRestaurantName] = useState(initialData.restaurantName || '');

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [category, setCategory] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  console.log('RATE PAGE STATE:', { 
    claimId, 
    foodId, 
    foodTitle, 
    restaurantName,
    hasClaimId: !!claimId,
    hasFoodId: !!foodId
  });

  const ratingMessages = {
    1: {
      title: "We're so sorry! 😔",
      subtitle: "What went wrong?",
      placeholder: "Please tell us what happened so we can make it right...",
      categories: ['Food Quality', 'Late Pickup', 'Wrong Order', 'Poor Packaging', 'Rude Staff', 'Other'],
      suggestionPlaceholder: "What should we do to fix this?"
    },
    2: {
      title: "We can do better! 😟",
      subtitle: "What didn't meet your expectations?",
      placeholder: "Help us understand what we should improve...",
      categories: ['Food Temperature', 'Portion Size', 'Cleanliness', 'Communication', 'Value for Money', 'Other'],
      suggestionPlaceholder: "How can we improve?"
    },
    3: {
      title: "Good, but could be better! 🙂",
      subtitle: "How can we improve your experience?",
      placeholder: "Share what we can do to get that 5-star rating...",
      categories: ['Food Taste', 'Service Speed', 'Packaging', 'Pickup Process', 'Menu Variety', 'Other'],
      suggestionPlaceholder: "What would make it perfect next time?"
    },
    4: {
      title: "Great job! 😊",
      subtitle: "What did you like the most?",
      placeholder: "Tell us what made your experience great...",
      categories: ['Freshness', 'Taste', 'Service', 'Value', 'Convenience', 'Other'],
      suggestionPlaceholder: "Any suggestions to make it even better?"
    },
    5: {
      title: "Amazing! 😍",
      subtitle: "Tell us about your experience!",
      placeholder: "Share your amazing experience with others...",
      categories: ['Excellent Food', 'Great Service', 'Perfect Timing', 'Good Value', 'Helpful Staff', 'Other'],
      suggestionPlaceholder: "What made it 5-star for you?"
    }
  };

  useEffect(() => {
    console.log('Checking claim data on mount:', { claimId, foodId });
    
    if (!claimId || !foodId) {
      const savedClaimId = localStorage.getItem('claimId');
      const savedFoodId = localStorage.getItem('foodId');
      const savedFoodTitle = localStorage.getItem('foodTitle');
      const savedRestaurantName = localStorage.getItem('restaurantName');
      
      console.log('Fetching from localStorage:', { savedClaimId, savedFoodId });
      
      if (savedClaimId && savedFoodId) {
        setClaimId(savedClaimId);
        setFoodId(savedFoodId);
        setFoodTitle(savedFoodTitle || '');
        setRestaurantName(savedRestaurantName || '');
      } else {
        setError('Missing claim or food information. Please go back to dashboard.');
      }
    }
  }, []);

  const handleSubmitReview = async () => {
    console.log('Submitting review with:', { 
      claimId: parseInt(claimId, 10), 
      foodId: parseInt(foodId, 10), 
      rating 
    });
    
    if (!claimId || !foodId) {
      setError('Missing claim or food information. Please go back to dashboard.');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (rating < 3 && (!reviewText || !category)) {
      setError('Please provide feedback for low ratings');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to submit a review');
        setLoading(false);
        return;
      }

      // Convert to numbers
      const numericClaimId = parseInt(claimId, 10);
      const numericFoodId = parseInt(foodId, 10);
      const numericRating = parseInt(rating, 10);

      if (isNaN(numericClaimId) || isNaN(numericFoodId) || isNaN(numericRating)) {
        setError('Invalid claim or food ID');
        setLoading(false);
        return;
      }

      const reviewData = {
        claim_id: numericClaimId,
        food_id: numericFoodId,
        rating: numericRating,
        review_text: reviewText || null,
        category_feedback: category || null,
        suggestions: suggestions || null,
        anonymous: anonymous ? 1 : 0
      };

      console.log('Sending review data to server:', reviewData);

      const response = await fetch(`${API_URL}/reviews/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (data.status === 'success') {
        setSubmitted(true);
        
        localStorage.removeItem('claimId');
        localStorage.removeItem('foodId');
        localStorage.removeItem('foodTitle');
        localStorage.removeItem('restaurantName');
        
        setTimeout(() => navigate('/dashboard'), 3000);
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Submit review error:', error);
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRatingIcon = () => {
    if (rating >= 4) return <Smile className="w-8 h-8 text-green-500" />;
    if (rating === 3) return <Meh className="w-8 h-8 text-yellow-500" />;
    if (rating >= 1) return <Frown className="w-8 h-8 text-red-500" />;
    return null;
  };

  if (!claimId || !foodId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Missing Information</h2>
          <p className="text-gray-600 mb-4">Unable to find claim information. Please rate from your dashboard.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You! 🙏</h2>
          <p className="text-gray-600 mb-6">Your feedback helps us improve and helps other users find great food!</p>
          <div className="animate-pulse">
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Rate Your Experience</h1>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h2 className="font-bold text-gray-900 text-lg">{foodTitle || 'Food Item'}</h2>
            <p className="text-gray-600">Restaurant: {restaurantName || 'Restaurant'}</p>
            <p className="text-sm text-gray-500 mt-1">Claim ID: {claimId}</p>
            <p className="text-sm text-gray-500">Food ID: {foodId}</p>
          </div>
        </div>

        {/* Rating Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {rating > 0 ? ratingMessages[rating].title : 'How was your experience?'}
            </h2>
            <p className="text-gray-600">
              {rating > 0 ? ratingMessages[rating].subtitle : 'Tap the stars to rate'}
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform duration-200 hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Rating Icon */}
          {rating > 0 && (
            <div className="flex justify-center mb-6">
              {getRatingIcon()}
            </div>
          )}
        </div>

        {/* Feedback Form (shown when rating is selected) */}
        {rating > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Share Your Thoughts</h3>
            
            {/* Category Selection (for low ratings) */}
            {rating < 4 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What was the main issue? *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {ratingMessages[rating].categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        category === cat
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Review Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {rating < 3 ? 'Tell us more (required)' : 'Share your experience (optional)'}
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={ratingMessages[rating].placeholder}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required={rating < 3}
              />
            </div>

            {/* Suggestions */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suggestions for improvement
              </label>
              <textarea
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                placeholder={ratingMessages[rating].suggestionPlaceholder}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Anonymous Toggle */}
            <div className="mb-6">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={() => setAnonymous(!anonymous)}
                    className="sr-only"
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${
                    anonymous ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></div>
                  <div className={`dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    anonymous ? 'transform translate-x-4' : ''
                  }`}></div>
                </div>
                <span className="ml-3 text-sm text-gray-700">
                  Post review anonymously
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Your username won't be shown to the restaurant
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmitReview}
              disabled={loading || (rating < 3 && (!reviewText || !category))}
              className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
                loading || (rating < 3 && (!reviewText || !category))
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h4 className="font-bold text-gray-900 mb-2">💡 Why your review matters:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Helps restaurants improve their service</li>
            <li>• Guides other users in choosing quality food</li>
            <li>• Promotes better food rescue practices</li>
            <li>• All reviews are anonymous by default</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Rate;