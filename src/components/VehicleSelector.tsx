import React from 'react';
import { Car } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  capacity: number;
  price: number;
  image: string;
}

interface VehicleSelectorProps {
  selectedVehicle: string;
  onChange: (vehicleId: string) => void;
}

const vehicles: Vehicle[] = [
  {
    id: 'sedan',
    name: 'Lüks Sedan',
    capacity: 3,
    price: 500,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'van',
    name: 'Premium Van',
    capacity: 6,
    price: 800,
    image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'minibus',
    name: 'Minibüs',
    capacity: 12,
    price: 1200,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'vip',
    name: 'VIP Araç',
    capacity: 4,
    price: 1500,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  }
];

const VehicleSelector: React.FC<VehicleSelectorProps> = ({ selectedVehicle, onChange }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {vehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
            selectedVehicle === vehicle.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-300'
          }`}
          onClick={() => onChange(vehicle.id)}
        >
          <div className="aspect-w-16 aspect-h-9 mb-4">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="object-cover rounded-md"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">{vehicle.name}</h3>
              <p className="text-sm text-gray-500">{vehicle.capacity} yolcu</p>
            </div>
            <div className="text-blue-600 font-semibold">₺{vehicle.price}</div>
          </div>
          {selectedVehicle === vehicle.id && (
            <div className="absolute top-2 right-2">
              <Car className="h-5 w-5 text-blue-500" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VehicleSelector;