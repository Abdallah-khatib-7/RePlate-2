import React, { useState } from 'react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqItems = [
    {
      question: "How does RePlate work?",
      answer: "RePlate connects restaurants with surplus food to individuals looking for discounted meals. Restaurants list their surplus food, and users can purchase it at a 50-80% discount."
    },
    {
      question: "Is the food safe to eat?",
      answer: "Yes, all restaurants on our platform comply with Lebanese food safety standards. The food is surplus but still perfectly edible and properly packaged."
    },
    {
      question: "How do I pick up my order?",
      answer: "After purchase, you receive a confirmation with pickup details. Most restaurants offer self-pickup at their location during specified hours."
    },
    {
      question: "What if I don't receive my order?",
      answer: "First, contact the restaurant directly. If the issue isn't resolved, contact our support team, and we will help resolve the problem within 24 hours."
    },
    {
      question: "How do I open a restaurant account?",
      answer: "Click on 'Register Your Restaurant' and complete the registration form. We will verify your information and contact you within 48 hours to activate the account."
    },
    {
      question: "What is RePlate's commission?",
      answer: "We take a 10% commission on every sale. This helps us maintain and develop the platform."
    },
    {
      question: "Can I cancel an order?",
      answer: "You can cancel before the food is prepared. Once preparation has started, cancellation is not possible, but you can contact support for emergency situations."
    },
    {
      question: "How do I ensure food quality?",
      answer: "All restaurants are reviewed and rated by users. You can read reviews and see quality ratings before making a purchase."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600">الأسئلة الشائعة</p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                >
                  <span className="text-lg font-semibold text-gray-900">{item.question}</span>
                  <span className={`transform transition-transform duration-200 ${openItems[index] ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {openItems[index] && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Didn't Find Your Answer?</h3>
            <p className="mb-4 text-blue-100">Our support team is ready to assist you 24/7.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:support@replate-lb.com" className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                abdalah.khatib2003@gmail.com
              </a>
              <a href="tel:+96103806359" className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                +961 03806359
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;