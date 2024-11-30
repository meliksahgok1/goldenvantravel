import React from 'react';

const About = () => {
  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            About Us
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Learn more about our mission and values.
          </p>
        </div>
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Our Mission</h3>
              <p className="mt-2 text-base text-gray-500">
                We strive to create innovative solutions that make a difference in people's lives.
                Our commitment to excellence drives everything we do.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Our Vision</h3>
              <p className="mt-2 text-base text-gray-500">
                To be the leading platform in our industry, setting new standards for quality and innovation.
                We envision a future where technology enhances every aspect of life.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;