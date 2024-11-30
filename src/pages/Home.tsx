import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, Clock, CreditCard } from 'lucide-react';

const features = [
  {
    icon: Car,
    title: 'Luxury Vehicles',
    description: 'Modern fleet of comfortable and well-maintained vehicles for your journey.'
  },
  {
    icon: Shield,
    title: 'Safe Travel',
    description: 'Professional drivers and fully insured transfers for your peace of mind.'
  },
  {
    icon: Clock,
    title: '24/7 Service',
    description: 'Available round the clock for all your transfer needs.'
  },
  {
    icon: CreditCard,
    title: 'Secure Payment',
    description: 'Easy and secure online payment through Iyzico payment system.'
  }
];

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Luxury transfer vehicle"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Premium Transfer Services
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Experience comfortable and reliable transfer services with Goldenvan Travel. Book your journey today.
          </p>
          <div className="mt-10">
            <Link
              to="/booking"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Book Now
              <Car className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Goldenvan Travel?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Experience the difference with our premium transfer services
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                          <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;