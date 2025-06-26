import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, BarChart2, Search, Shield, MessageSquare, Clock, Activity, Users } from 'lucide-react';
import StatCard from '../components/ui/StatCard';

const Home: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-r from-blue-900 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="md:flex md:justify-between md:items-center">
            <div className="md:w-1/2 pb-12 md:pb-0">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
              >
                Bringing <span className="text-orange-400">Transparency</span> to Governance
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 text-xl text-blue-100"
              >
                File, track, and publicly audit corruption-related grievances for a more accountable India.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <Link to="/file-complaint" className="inline-flex justify-center items-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition duration-200">
                  <FileText className="mr-2 h-5 w-5" />
                  File a Complaint
                </Link>
                <Link to="/dashboard" className="inline-flex justify-center items-center py-3 px-6 border border-blue-300 shadow-sm text-base font-medium rounded-md text-white bg-transparent hover:bg-blue-700 transition duration-200">
                  <BarChart2 className="mr-2 h-5 w-5" />
                  View Dashboard
                </Link>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:w-1/2"
            >
              <div className="relative rounded-lg shadow-xl bg-white p-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-orange-500"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Complaint Tracking</h3>
                <div className="mb-4">
                  <label htmlFor="complaintId" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Complaint ID
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="complaintId"
                      id="complaintId"
                      className="focus:ring-blue-500 focus:border-blue-500 flex-grow block w-full rounded-l-md sm:text-sm border-gray-300 p-2 border"
                      placeholder="e.g., VG-2023-1234"
                    />
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <Link to="/track-complaint" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Advanced tracking options →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              icon={<FileText className="h-8 w-8 text-blue-600" />}
              value="16,542"
              label="Complaints Filed"
              trend="+12% this month"
              isPositive={true}
            />
            <StatCard 
              icon={<Activity className="h-8 w-8 text-green-600" />}
              value="74%"
              label="Resolution Rate"
              trend="+8% this month"
              isPositive={true}
            />
            <StatCard 
              icon={<Clock className="h-8 w-8 text-orange-600" />}
              value="14 days"
              label="Avg. Resolution Time"
              trend="-3 days"
              isPositive={true}
            />
            <StatCard 
              icon={<Users className="h-8 w-8 text-purple-600" />}
              value="5,280"
              label="Active Whistleblowers"
              trend="+15% this month"
              isPositive={true}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Visible Governance provides a seamless experience for reporting corruption and tracking progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">1. Submit a Complaint</h3>
                <p className="text-gray-600">
                  File your grievance using voice, text, or photos in any of 12 Indian languages. All evidence is securely encrypted.
                </p>
                <Link to="/file-complaint" className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium">
                  File Now →
                </Link>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">2. Track Resolution Process</h3>
                <p className="text-gray-600">
                  Follow real-time progress with SLA countdowns, receive alerts, and see immutable records of all actions taken.
                </p>
                <Link to="/track-complaint" className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium">
                  Track Status →
                </Link>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <BarChart2 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">3. View Public Dashboards</h3>
                <p className="text-gray-600">
                  Access transparent metrics on corruption hotspots, resolution rates, and department performance rankings.
                </p>
                <Link to="/dashboard" className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium">
                  Explore Data →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8">
              <h2 className="text-3xl font-bold mb-4">Ready to fight corruption?</h2>
              <p className="text-blue-100 max-w-2xl">
                Join thousands of citizens using Visible Governance to create a more transparent and accountable India. Your voice matters.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/file-complaint" className="inline-flex justify-center items-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-blue-900 bg-white hover:bg-blue-50 transition duration-200">
                <FileText className="mr-2 h-5 w-5" />
                File Complaint
              </Link>
              <Link to="/whistleblower" className="inline-flex justify-center items-center py-3 px-6 border border-white shadow-sm text-base font-medium rounded-md text-white bg-transparent hover:bg-blue-700 transition duration-200">
                <Shield className="mr-2 h-5 w-5" />
                Whistleblower Vault
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;