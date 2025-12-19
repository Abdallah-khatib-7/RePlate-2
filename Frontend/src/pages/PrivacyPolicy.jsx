import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600">سياسة الخصوصية</p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Protecting Your Data in Lebanon</h2>
              <p>
                At <b>RePlate</b>, we respect your privacy and are committed to protecting your personal data in accordance with 
                Lebanese laws and international best practices. This policy outlines how we handle your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h3 className="font-bold text-blue-900 mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Full Name</li>
                    <li>Email Address</li>
                    <li>Phone Number</li>
                    <li>Address (Optional)</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <h3 className="font-bold text-green-900 mb-2">Usage Information</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Food Preferences</li>
                    <li>Order History</li>
                    <li>Favorite Restaurants</li>
                    <li>Approximate Location</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="grid gap-4">
                  {[
                    { icon: '🍽️', title: 'Service Delivery', desc: 'To deliver food and complete transactions' },
                    { icon: '📱', title: 'Platform Improvement', desc: 'To develop and personalize your experience' },
                    { icon: '📞', title: 'Support', desc: 'To provide better customer service' },
                    { icon: '📊', title: 'Analytics', desc: 'To analyze platform usage' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg" dir="ltr">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-yellow-700">
                  <strong>Data Storage:</strong> All data is stored on secure servers. We do <b>not</b> share your personal data with third parties without your consent, except when required by Lebanese law.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <div className="bg-green-50 rounded-xl p-6">
                <ul className="list-disc list-inside space-y-2 text-green-900">
                  <li>The right to <b>access</b> your data</li>
                  <li>The right to <b>rectify</b> information</li>
                  <li>The right to <b>delete</b> your account</li>
                  <li>The right to <b>object</b> to processing</li>
                </ul>
              </div>
            </section>

            <section className="text-center bg-blue-50 rounded-2xl p-6 mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Contact Us</h3>
              <p className="text-gray-700">
                For privacy inquiries:
                <br />
                <strong>abdallah.khatib2003@gmail.com</strong>
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

export default PrivacyPolicy;