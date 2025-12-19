import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const blogPosts = [
    {
      id: 1,
      title: "How to Reduce Food Waste in Lebanon",
      excerpt: "A comprehensive guide for restaurants and individuals to minimize food waste during the economic crisis",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&h=400",
      category: "Practical Tips",
      date: "December 15, 2024",
      readTime: "5 min read",
      author: "RePlate Team"
    },
    {
      id: 2,
      title: "Success Stories: Restaurants Saving Their Food",
      excerpt: "How Lebanese restaurants turned surplus food into additional income and community initiatives",
      image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&h=400",
      category: "Success Stories",
      date: "December 10, 2024",
      readTime: "7 min read",
      author: "Sarah Ahmed"
    },
    {
      id: 3,
      title: "The Environmental Impact of Food Waste in Lebanon",
      excerpt: "Study on how food waste affects Lebanon's environment and economy with possible solutions",
      image: "https://www.lbeforum.org/wp-content/uploads/2013/09/foodwaste.jpg",
      category: "Environment",
      date: "December 5, 2024",
      readTime: "8 min read",
      author: "Dr. Ali Hussein"
    },
    {
      id: 4,
      title: "Beginner's Guide to Sustainable Living",
      excerpt: "Simple steps you can take today to reduce food waste in your home",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&h=400",
      category: "Sustainability",
      date: "November 28, 2024",
      readTime: "6 min read",
      author: "Layla Ghanem"
    },
    {
      id: 5,
      title: "Modern Technologies Fighting Food Waste",
      excerpt: "How technology is being used to solve food waste problems worldwide",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=400",
      category: "Technology",
      date: "November 20, 2024",
      readTime: "9 min read",
      author: "Mohammed Al-Taqi"
    },
    {
      id: 6,
      title: "RePlate's Impact on Lebanese Society",
      excerpt: "Statistics and numbers about our platform's impact on reducing waste and supporting communities",
      image: "https://www.hrw.org/sites/default/files/styles/opengraph/public/media_2022/12/202212ejr_lebanon_breadline.jpg?h=1ec4304d&itok=Rvd5aq0d",
      category: "Community Impact",
      date: "November 15, 2024",
      readTime: "4 min read",
      author: "RePlate Analytics"
    }
  ];

  const categories = ["All", "Practical Tips", "Success Stories", "Environment", "Sustainability", "Technology", "Community Impact"];

  // Filter posts based on active category
  const filteredPosts = activeCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">RePlate Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover insights, success stories, and practical tips about food waste reduction, 
            sustainability, and community impact in Lebanon.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Categories - NOW WORKING */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl border ${
                activeCategory === category 
                  ? 'bg-green-500 text-white border-green-500' 
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-green-500 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Post - DYNAMIC BASED ON FILTER */}
        {featuredPost && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
            <div className="md:flex">
              <div className="md:flex-1">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:flex-1 p-8 md:p-12">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
                  {featuredPost.category}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{featuredPost.title}</h2>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">{featuredPost.excerpt}</p>
                <div className="flex items-center justify-between text-gray-500 mb-6">
                  <span>{featuredPost.author}</span>
                  <span>{featuredPost.date} • {featuredPost.readTime}</span>
                </div>
                <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300">
                  Read Full Article
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Blog Grid - DYNAMIC BASED ON FILTER */}
        {gridPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {gridPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                <div className="relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white text-green-600 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{post.author}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <div className="text-xs text-gray-400">{post.date}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Show message when no posts match filter
         
         <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
            <button 
              onClick={() => setActiveCategory("All")}
              className="mt-4 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors duration-300"
            >
              Show All Articles
            </button>
          </div>
        )}

        {/* Newsletter */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl p-8 md:p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Stay Updated</h3>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
            Get the latest articles, tips, and success stories delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-200">
              Subscribe
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Blog;