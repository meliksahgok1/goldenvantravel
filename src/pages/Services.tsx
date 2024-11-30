import React from 'react';
import { Car, Users, Briefcase, Crown } from 'lucide-react';

const services = [
  {
    icon: Car,
    title: 'Airport Transfers',
    description: 'Reliable and comfortable transfers to and from airports.',
    price: 'Starting from ₺500'
  },
  {
    icon: Users,
    title: 'Group Transfers',
    description: 'Spacious vehicles for group travel and events.',
    price: 'Starting from ₺800'
  },
  {
    icon: Briefcase,
    title: 'Business Travel',
    description: 'Professional transfer services for business travelers.',
    price: 'Starting from ₺600'
  },
  {
    icon: Crown,
    title: 'VIP Services',
    description: 'Luxury vehicles with premium amenities.',
    price: 'Starting from ₺1000'
  }
];

const Services = () => {
  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Transfer Services
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Choose from our range of professional transfer services
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
              >
                <div className="px-6 py-8">
                  <service.icon className="h-12 w-12 text-blue-600 mx-auto" />
                  <h3 className="mt-4 text-xl font-medium text-gray-900 text-center">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-base text-gray-500 text-center">
                    {service.description}
                  </p>
                  <p className="mt-4 text-lg font-semibold text-blue-600 text-center">
                    {service.price}
                  </p>
                </div>
                <div className="px-6 py-4">
                  <button
                    className="w-full flex justify-center items-center px-4 py-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 hover:bg-blue-50"
                    onClick={() => window.location.href = '/booking'}
                  >
                    Book Now
                    <Car className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;