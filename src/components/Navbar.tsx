import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Car, Phone, MapPin } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">GoldenVan</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a href="/" className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                {t('nav.home')}
              </a>
              <a href="/booking" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                {t('nav.booking')}
              </a>
              <a href="/services" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                {t('nav.services')}
              </a>
              <a href="/contact" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                {t('nav.contact')}
              </a>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <LanguageSwitcher />
            <div className="flex items-center text-gray-600">
              <Phone className="h-5 w-5" />
              <span className="ml-2">+90 555 123 4567</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5" />
              <span className="ml-2">İstanbul, Türkiye</span>
            </div>
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <a
            href="/"
            className="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            {t('nav.home')}
          </a>
          <a
            href="/booking"
            className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            {t('nav.booking')}
          </a>
          <a
            href="/services"
            className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            {t('nav.services')}
          </a>
          <a
            href="/contact"
            className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            {t('nav.contact')}
          </a>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="space-y-2 px-4">
            <LanguageSwitcher />
            <div className="flex items-center text-gray-600">
              <Phone className="h-5 w-5" />
              <span className="ml-2">+90 555 123 4567</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5" />
              <span className="ml-2">İstanbul, Türkiye</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;