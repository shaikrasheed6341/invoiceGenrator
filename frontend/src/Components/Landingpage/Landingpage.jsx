import React from 'react';
import { motion } from 'framer-motion';
import { SpotlightPreview } from '../Herosection/SpotlightPreview';


function Landingpage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_4px),linear-gradient(to_bottom,#4f4f4f2e_4px,transparent_4px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_80%_100%_at_50%_0%,#000_20%,transparent_100%)]"></div>
      <SpotlightPreview />
    
      {/* Features Section */}
      <section id="features" className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Everything you need to manage invoices
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Powerful features to help you create and manage invoices efficiently
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature Cards */}
            <motion.div
              whileHover={{ y: -10 }}
              className="relative p-6 bg-gray-800 rounded-lg"
            >
              <div className="absolute top-6 right-6">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-8 text-xl font-bold text-white">Professional Templates</h3>
              <p className="mt-2 text-gray-300">
                Choose from beautifully designed invoice templates that make your business look professional.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="relative p-6 bg-gray-800 rounded-lg"
            >
              <div className="absolute top-6 right-6">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-8 text-xl font-bold text-white">Quick Generation</h3>
              <p className="mt-2 text-gray-300">
                Create and send invoices in seconds with our intuitive interface and automated calculations.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="relative p-6 bg-gray-800 rounded-lg"
            >
              <div className="absolute top-6 right-6">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mt-8 text-xl font-bold text-white">Secure Payments</h3>
              <p className="mt-2 text-gray-300">
                Include multiple payment options and get paid faster with integrated payment processing.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Download Invoice Templates
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Get started with our professionally designed templates
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Template Card 1 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900 rounded-lg overflow-hidden shadow-lg"
            >
              <div className="p-6">
                <div className="flex items-center justify-center h-48 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                  <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">Professional Invoice</h3>
                <p className="mt-2 text-gray-400">Clean and modern design for businesses</p>
                <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Download Template
                </button>
              </div>
            </motion.div>

            {/* Template Card 2 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900 rounded-lg overflow-hidden shadow-lg"
            >
              <div className="p-6">
                <div className="flex items-center justify-center h-48 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                  <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">Creative Invoice</h3>
                <p className="mt-2 text-gray-400">Stylish design for creative professionals</p>
                <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Download Template
                </button>
              </div>
            </motion.div>

            {/* Template Card 3 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900 rounded-lg overflow-hidden shadow-lg"
            >
              <div className="p-6">
                <div className="flex items-center justify-center h-48 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
                  <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">Simple Invoice</h3>
                <p className="mt-2 text-gray-400">Minimalist design for small businesses</p>
                <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Download Template
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Why Choose Our Invoice Generator?
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Discover the advantages that make our solution stand out
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Advantage 1 */}
            <motion.div
              whileHover={{ y: -10 }}
              className="text-center"
            >
              
              <div className="inline-block p-4 bg-indigo-600 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">Lightning Fast</h3>
              <p className="mt-2 text-gray-400">Generate invoices in seconds</p>
            </motion.div>

            {/* Advantage 2 */}
            <motion.div
              whileHover={{ y: -10 }}
              className="text-center"
            >
              <div className="inline-block p-4 bg-indigo-600 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">Secure & Safe</h3>
              <p className="mt-2 text-gray-400">Your data is always protected</p>
            </motion.div>

            {/* Advantage 3 */}
            <motion.div
              whileHover={{ y: -10 }}
              className="text-center"
            >
              <div className="inline-block p-4 bg-indigo-600 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">Auto Updates</h3>
              <p className="mt-2 text-gray-400">Always up-to-date templates</p>
            </motion.div>

            {/* Advantage 4 */}
            <motion.div
              whileHover={{ y: -10 }}
              className="text-center"
            >
              <div className="inline-block p-4 bg-indigo-600 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">24/7 Support</h3>
              <p className="mt-2 text-gray-400">Help whenever you need it</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-transparent py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-400">© 2024 Invoice Generator. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-indigo-400">Terms</a>
              <a href="#" className="text-gray-400 hover:text-indigo-400">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-indigo-400">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landingpage;