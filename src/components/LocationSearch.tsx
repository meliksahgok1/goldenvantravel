import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationSearchProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  label,
  value,
  onChange,
  placeholder
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default LocationSearch;