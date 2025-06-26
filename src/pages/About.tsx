import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Users, Scale, BarChart2, AlertTriangle } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="bg-blue-900 px-6 py-12 sm:px-12">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-white p-3">
                  <div className="relative">
                    <Shield className="h-12 w-12 text-blue-800" />
                    <Eye className="h-6 w-6 absolute text-orange-500 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                <span className="block">About Visible Governance</span>
              </h1>
              <p className="mt-3 max-w-3xl mx-auto text-xl text-blue-100 sm:mt-4">
                Our mission is to empower citizens with tools that bring transparency and accountability to governance.
              </p>
            </div>
          </div>
          <div className="px-6 py-8 sm:px-12">
            <p className="text-lg text-gray-700 mb-6">
              Visible Governance is a citizen-led initiative designed to combat corruption through technology, transparency, and collective action. We believe that by providing accessible tools for reporting and tracking corruption, we can drive meaningful change in governance and public services across India.
            </p>
            <p className="text-lg text-gray-700">
              Our platform leverages blockchain technology, data visualization, and automated systems to ensure that every complaint is tracked, nothing falls through the cracks, and officials are held accountable for resolution timelines.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Accessible Reporting</h3>
              <p className="text-gray-600">
                Submit complaints via voice, photo, or text in 12 Indian languages, ensuring everyone can report corruption regardless of technical literacy.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                <Scale className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Immutable Audit Trail</h3>
              <p className="text-gray-600">
                Every action taken on a complaint is recorded on a blockchain ledger, ensuring complete transparency and preventing tampering with records.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Public Dashboards</h3>
              <p className="text-gray-600">
                Visual dashboards showing corruption hotspots, resolution rates, and department performance rankings to keep citizens informed.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Automated Escalation</h3>
              <p className="text-gray-600">
                SLA countdown timers and automated escalation to ensure complaints don't languish without resolution or response.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md lg:col-span-2"
            >
              <div className="rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Whistleblower Protection</h3>
              <p className="text-gray-600">
                Enhanced security features including anonymous submission, end-to-end encryption, and secure evidence vault to protect those who report high-level corruption.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-5xl font-bold text-blue-800">5,280+</p>
                <p className="mt-2 text-sm text-gray-600 uppercase tracking-wide font-medium">Active Whistleblowers</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-blue-800">16,542</p>
                <p className="mt-2 text-sm text-gray-600 uppercase tracking-wide font-medium">Complaints Filed</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-blue-800">74%</p>
                <p className="mt-2 text-sm text-gray-600 uppercase tracking-wide font-medium">Resolution Rate</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-blue-800">38%</p>
                <p className="mt-2 text-sm text-gray-600 uppercase tracking-wide font-medium">Corruption Reduction</p>
              </div>
            </div>
          </div>
        </div>

        {/* How We Work */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Work</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-lg font-medium text-gray-900">Our Process</span>
                </div>
              </div>

              <div className="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-4 lg:max-w-none">
                <div className="flex flex-col">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-900 text-white">
                      <span className="text-lg font-bold">1</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">Complaint Submission</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Citizens submit complaints with evidence through our secure platform in their preferred language.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-900 text-white">
                      <span className="text-lg font-bold">2</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">Verification & Routing</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Our system verifies complaint details, logs them on blockchain, and routes them to appropriate authorities.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-900 text-white">
                      <span className="text-lg font-bold">3</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">Tracking & Escalation</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Complaints are tracked with SLA timers, and auto-escalated if resolution deadlines are missed.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-900 text-white">
                      <span className="text-lg font-bold">4</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">Public Accountability</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Resolution data is published on public dashboards, creating transparency and accountability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Team</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-8">
              <p className="text-lg text-gray-700 mb-6">
                Visible Governance was created by a dedicated team of technologists, governance experts, and citizens committed to fighting corruption in India.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="mx-auto h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-10 w-10 text-blue-700" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">Technology Team</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Software engineers and security experts who built our secure platform
                    </p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="mx-auto h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <Scale className="h-10 w-10 text-blue-700" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">Legal Advisors</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Attorneys who ensure our process complies with all legal requirements
                    </p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="mx-auto h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <BarChart2 className="h-10 w-10 text-blue-700" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">Data Scientists</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Experts who analyze patterns to identify corruption hotspots
                    </p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="mx-auto h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <Eye className="h-10 w-10 text-blue-700" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">Citizen Volunteers</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Dedicated individuals who help monitor complaint resolution
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;