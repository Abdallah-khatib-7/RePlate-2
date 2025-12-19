import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600">شروط الخدمة</p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p>
                Welcome to <b>RePlate</b>. By using our platform, you agree to be bound by these Terms and Conditions.
                Our headquarters are located in <b>Lebanon</b>, and these terms are governed by Lebanese laws and regulations.
              </p>
            </section>

            {/* Definitions */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Definitions</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>"RePlate"</strong>: The food waste reduction platform.</li>
                <li><strong>"Restaurant"</strong>: Any food establishment registered on the platform.</li>
                <li><strong>"User"</strong>: Any person using the platform to obtain food.</li>
                <li><strong>"Surplus Food"</strong>: Edible meals that would otherwise be wasted.</li>
              </ul>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Responsibilities</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-yellow-700">
                  <strong>Important Note:</strong> RePlate is an intermediary platform and is <b>not responsible</b> for the quality of food provided by Restaurants.
                </p>
              </div>
              <ul className="list-disc list-inside space-y-2">
                <li>You must be <b>over 18</b> years old to use the platform.</li>
                <li>Responsibility for food quality lies with the <b>Restaurant</b>.</li>
                <li>Food must be inspected <b>before consumption</b>.</li>
                <li>Adherence to the agreed-upon pickup times.</li>
              </ul>
            </section>

            {/* Restaurant Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Restaurant Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Ensuring the food is <b>fit for human consumption</b>.</li>
                <li>Appropriate <b>packaging</b> of the food.</li>
                <li><b>Disclosing</b> food ingredients to Users.</li>
                <li>Adherence to <b>Lebanese food safety</b> regulations.</li>
              </ul>
            </section>

            {/* Payments & Refunds */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payments & Refunds</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>All transactions are in <b>Lebanese Lira (LBP) OR USD dollars.</b></li>
                <li><b>No refunds</b> after the food has been collected/received.</li>
                <li>In case of unavailability, a <b>full refund will be issued.</b></li>
                <li>The platform takes a <b>10% commission on every sale.</b></li>
              </ul>
            </section>

            {/* Lebanese Law */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
              <p>
                This agreement is governed by the laws and regulations of <b>Lebanon</b>. Any disputes arising from these terms
                will be settled in the courts of <b>Beirut, Lebanon</b>.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-green-50 rounded-2xl p-6 mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Questions?</h3>
              <p className="text-gray-700">
                For inquiries regarding the Terms of Service, please contact us at:
                <br />
                <strong>Email:</strong> abdallah.khatib2003@gmail.com
                <br />
                <strong>Phone:</strong> +961 03806359
              </p>
            </section>

            <div className="text-center text-sm text-gray-500 mt-8">
              Last Updated: October 10, 2025  
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;