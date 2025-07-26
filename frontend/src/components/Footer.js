import React from 'react';
import { FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-gradient-to-tr from-white via-orange-50 to-orange-100 text-gray-800 font-serif shadow-inner border-t border-orange-200"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          
          {/* Brand Info */}
          <div className="text-center md:text-left max-w-xs">
            <h2 className="text-2xl font-bold text-orange-700 tracking-wide">Expensive Watches</h2>
            <p className="mt-1 text-sm text-gray-700 italic">
              Timeless elegance. Crafted with precision & prestige.
            </p>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="text-md font-semibold text-orange-900 mb-1 underline underline-offset-4">
              Contact
            </h3>
            <p className="text-sm text-gray-800">Dhyey Bhuva</p>
            <p className="text-sm text-gray-800">+91 94288 68843</p>
          </div>

          {/* Social Media */}
          <div className="text-center w-full md:w-auto">
            <h3 className="text-md font-semibold text-orange-800 mb-1">Follow Us</h3>
            <div className="flex justify-center md:justify-start">
              <a
                href="https://instagram.com/yourbrand"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-500 transition"
              >
                <FaInstagram size={28} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-orange-200 my-5" />

        {/* Bottom Section */}
        <div className="text-center text-xs text-gray-600 leading-snug">
          <p>
            &copy; {currentYear} <span className="text-orange-800 font-semibold">Mart Watches</span>. All rights reserved.
          </p>
          <p className="mt-1">
            Created by <span className="text-orange-900 font-medium">Harshil Bhuva</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
