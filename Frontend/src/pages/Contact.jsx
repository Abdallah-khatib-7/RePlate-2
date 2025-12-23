// src/pages/Contact.jsx
import React, { useState, useEffect } from 'react';
import ChatBot from '../components/ChatBot';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    const isUrgent = e.target.querySelector('input[type="checkbox"]').checked;
    
    const formDataToSend = {
      name: formData.name,
      email: formData.email,
      inquiryType: formData.inquiryType,
      subject: formData.subject,
      message: formData.message,
      isUrgent: isUrgent
    };

    const response = await fetch('http://localhost:5000/api/contact/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataToSend)
    });

    const data = await response.json();

    if (data.status === 'success') {
      alert(data.message || 'Thank you for your message! We\'ll get back to you within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '', inquiryType: 'general' });
    } else {
      throw new Error(data.message || 'Failed to send message');
    }

  } catch (error) {
    console.error('Form submission error:', error);
    alert('Failed to send message. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Us',
      description: 'Send us an email anytime',
      details: 'RePlate@gmail.com',
      action: 'mailto:abdallah.khatib2003@gmail.com'
    },
    {
      icon: '📞',
      title: 'Call Us',
      description: 'Mon-Fri from 9am to 6pm',
      details: '+961 03 806 359',
      action: 'tel:+96103806359'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Get instant help',
      details: 'Start chatting now',
      action: () => setIsChatOpen(true) 
    },
    {
      icon: '📍',
      title: 'Visit Us',
      description: 'Come say hello',
      details: '123 Green Street, Eco City',
      action: 'https://maps.google.com'
    }
  ];

  const handleContactMethodClick = (method) => {
    if (typeof method.action === 'function') {
      method.action(); 
    } else if (typeof method.action === 'string') {
      window.open(method.action, '_blank'); 
    }
  };

  const faqs = [
    {
      question: 'How do I become a restaurant partner?',
      answer: 'Simply sign up as a restaurant partner on our platform, complete the verification process, and start listing your surplus food.'
    },
    {
      question: 'Is there a cost to use RePlate?',
      answer: 'For food recipients, the platform is completely free. Restaurant partners pay a small commission on successful food listings.'
    },
    {
      question: 'How do I claim food?',
      answer: 'Browse available meals in your area, select the items you want, and follow the pickup instructions provided by the restaurant.'
    },
    {
      question: 'What types of food can be listed?',
      answer: 'We accept all types of surplus food that is safe for consumption, including prepared meals, baked goods, and fresh ingredients.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`py-12 text-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We'd love to hear from you. Whether you have questions about our platform, 
              want to become a partner, or just want to say hello - we're here to help!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Contact Methods */}
            <div className={`space-y-6 transform transition-all duration-500 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <h2 className="text-3xl font-bold text-gray-900">Let's Connect</h2>
              <p className="text-gray-600 leading-relaxed">
                Choose the most convenient way to reach out to our team. We're always happy to help!
              </p>

              {contactMethods.map((method, index) => (
                <button
                  key={index}
                  onClick={() => handleContactMethodClick(method)}
                  className={`flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group w-full text-left ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                  }`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300">
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{method.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{method.description}</p>
                    <p className="text-green-600 font-semibold">{method.details}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* FAQ Section */}
            <div className={`transform transition-all duration-500 delay-600 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Answers</h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div 
                    key={index}
                    className={`bg-white rounded-xl p-4 shadow-md transform transition-all duration-300 delay-${700 + index * 100} ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className={`bg-white rounded-3xl shadow-2xl p-8 transform transition-all duration-500 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
              <p className="text-gray-600 mb-8">Fill out the form below and we'll get back to you as soon as possible.</p>

              <form onSubmit={handleSubmit} className="space-y-8">
  {/* Name and Email - Side by Side */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block  font-semibold text-gray-800 mb-3 uppercase tracking-wide text-xs">
        Full Name *
      </label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white placeholder-gray-400"
        placeholder="Enter your full name"
        required
      />
    </div>
    <div>
      <label className="block  font-semibold text-gray-800 mb-3 uppercase tracking-wide text-xs">
        Email Address *
      </label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white placeholder-gray-400"
        placeholder="your.email@company.com"
        required
      />
    </div>
  </div>

  {/* Inquiry Type and Subject - Side by Side */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block  font-semibold text-gray-800 mb-3 uppercase tracking-wide text-xs">
        Inquiry Type *
      </label>
      <select
        name="inquiryType"
        value={formData.inquiryType}
        onChange={handleInputChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-gray-800"
      >
        <option value="general">General Inquiry</option>
        <option value="partnership">Partnership Opportunity</option>
        <option value="support">Technical Support</option>
        <option value="billing">Billing Question</option>
        <option value="feature">Feature Request</option>
        <option value="press">Press & Media</option>
        <option value="careers">Careers</option>
      </select>
    </div>
    <div>
      <label className="block  font-semibold text-gray-800 mb-3 uppercase tracking-wide text-xs">
        Subject *
      </label>
      <input
        type="text"
        name="subject"
        value={formData.subject}
        onChange={handleInputChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white placeholder-gray-400"
        placeholder="Brief subject of your message"
        required
      />
    </div>
  </div>

  {/* Message - Full Width */}
  <div>
    <label className="block font-semibold text-gray-800 mb-3 uppercase tracking-wide text-xs">
      Message *
    </label>
    <textarea
      name="message"
      value={formData.message}
      onChange={handleInputChange}
      rows={6}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white placeholder-gray-400 resize-none"
      placeholder="Please provide detailed information about your inquiry..."
      required
    />
  </div>

  {/* Priority and Additional Options */}
<div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
  <label className="flex items-center space-x-3 cursor-pointer group">
    <input 
      type="checkbox" 
      id="isUrgent"
      className="w-4 h-4 text-green-600 rounded focus:ring-green-500 border-gray-300"
    />
    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
      This is an urgent matter requiring immediate attention
    </span>
  </label>
  <p className="text-xs text-gray-500 mt-2 ml-7">
    Urgent requests will be prioritized and responded to within 2 business hours
  </p>
</div>

  {/* Submit Button */}
  <div className="pt-4">
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed relative overflow-hidden group"
    >
      <span className="relative z-10 flex items-center justify-center space-x-2">
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing Your Message...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>Send Message</span>
          </>
        )}
      </span>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>

    {/* Privacy Notice */}
    <p className="text-center text-gray-500 text-xs mt-4">
      By submitting this form, you agree to our Privacy Policy and consent to our team contacting you 
      regarding your inquiry. We respect your privacy and will never share your information with third parties.
    </p>
  </div>
</form>
            </div>

            

          </div>
        </div>

      </div>

      {/* Render ChatBot when open */}
      {isChatOpen && <ChatBot onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default Contact;