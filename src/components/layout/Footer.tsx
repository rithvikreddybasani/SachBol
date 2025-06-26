import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Logo />
            </div>
            <p className="text-blue-100 text-sm">
              Empowering citizens to fight corruption through transparency, accountability, and collective action.
            </p>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-blue-200 hover:text-white transition-colors duration-200">Home</Link></li>
              <li><Link to="/file-complaint" className="text-blue-200 hover:text-white transition-colors duration-200">File Complaint</Link></li>
              <li><Link to="/track-complaint" className="text-blue-200 hover:text-white transition-colors duration-200">Track Complaint</Link></li>
              <li><Link to="/dashboard" className="text-blue-200 hover:text-white transition-colors duration-200">Public Dashboard</Link></li>
              <li><Link to="/whistleblower" className="text-blue-200 hover:text-white transition-colors duration-200">Whistleblower Vault</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-blue-200 hover:text-white transition-colors duration-200">About Us</Link></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">FAQs</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">Terms of Use</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-blue-300" />
                <a href="mailto:contact@visiblegovernance.org" className="text-blue-200 hover:text-white transition-colors duration-200">contact@visiblegovernance.org</a>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-blue-300" />
                <a href="tel:+911234567890" className="text-blue-200 hover:text-white transition-colors duration-200">+91 1234 567 890</a>
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 text-blue-300 mt-1" />
                <span className="text-blue-200">New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-blue-300">
            &copy; {new Date().getFullYear()} Visible Governance. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <a href="#" className="text-sm text-blue-300 hover:text-white transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="text-sm text-blue-300 hover:text-white transition-colors duration-200">Terms of Service</a>
            <a href="#" className="text-sm text-blue-300 hover:text-white transition-colors duration-200">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;