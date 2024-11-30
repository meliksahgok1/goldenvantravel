import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              About Goldenvan
            </h3>
            <p className="mt-4 text-base text-gray-300">
              Professional transfer services providing comfortable and reliable transportation solutions across Turkey.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Contact Info
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center text-gray-300">
                <Phone className="h-5 w-5 mr-2" />
                +90 123 456 7890
              </li>
              <li className="flex items-center text-gray-300">
                <Mail className="h-5 w-5 mr-2" />
                info@goldenvan.com
              </li>
              <li className="flex items-center text-gray-300">
                <MapPin className="h-5 w-5 mr-2" />
                Istanbul, Turkey
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="/services" className="text-base text-gray-300 hover:text-white">
                  Our Services
                </a>
              </li>
              <li>
                <a href="/booking" className="text-base text-gray-300 hover:text-white">
                  Book Transfer
                </a>
              </li>
              <li>
                <a href="/contact" className="text-base text-gray-300 hover:text-white">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Follow Us
            </h3>
            <div className="mt-4 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 text-center">
            © {new Date().getFullYear()} Goldenvan Travel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;