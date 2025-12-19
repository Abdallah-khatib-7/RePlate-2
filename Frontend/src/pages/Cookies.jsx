import React from 'react';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
            <p className="text-lg text-gray-600">سياسة الكوكيز</p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
              <p>
                <b>Cookies</b> are small text files stored on your device when you visit our website. 
                These files help us remember your preferences and improve your experience on our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>
              <div className="space-y-6">
                {[
                  {
                    type: 'Essential Cookies',
                    desc: 'Necessary for the platform to function and cannot be disabled.',
                    examples: ['User Login', 'Shopping Cart', 'Security Settings']
                  },
                  {
                    type: 'Performance Cookies',
                    desc: 'Gather information about how you use the platform.',
                    examples: ['Usage Analytics', 'Speed Optimization', 'Error Detection']
                  },
                  {
                    type: 'Functionality Cookies',
                    desc: 'Remember your preferences and personalize your experience.',
                    examples: ['Language', 'Region', 'Favorite Restaurants']
                  }
                ].map((cookie, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{cookie.type}</h3>
                    <p className="text-gray-600 mb-3">{cookie.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {cookie.examples.map((example, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Cookies</h2>
              <div className="bg-blue-50 rounded-xl p-6">
                <p className="text-blue-900 mb-4">
                  You can control your cookie settings through your browser. However, disabling 
                  certain cookies may affect the platform's functionality.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">For Common Browsers:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Google Chrome</li>
                      <li>Mozilla Firefox</li>
                      <li>Safari</li>
                      <li>Microsoft Edge</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">General Steps:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Open Browser Settings</li>
                      <li>Go to Privacy/Security</li>
                      <li>Manage Cookie Settings</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="text-center bg-green-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Questions About Cookies?</h3>
              <p className="text-gray-700">
                abdallah.khatib2003@gmail.com
                <br />
                +961 03806359
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;