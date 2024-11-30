import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface LocationPickerProps {
  label: string;
  value: string;
  onChange: (value: string, location: google.maps.LatLngLiteral) => void;
  placeholder: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  label,
  value,
  onChange,
  placeholder
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [inputValue, setInputValue] = useState(value);
  const mapRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const initialLocation = { lat: 41.0082, lng: 28.9784 }; // İstanbul
    const newMap = new google.maps.Map(mapRef.current, {
      zoom: 13,
      center: initialLocation,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    const newMarker = new google.maps.Marker({
      position: initialLocation,
      map: newMap,
      draggable: true
    });

    setMap(newMap);
    setMarker(newMarker);

    newMarker.addListener('dragend', () => {
      const position = newMarker.getPosition();
      if (position) {
        const location = { lat: position.lat(), lng: position.lng() };
        updateAddress(location);
      }
    });

    newMap.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const location = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        newMarker.setPosition(location);
        updateAddress(location);
      }
    });

    const input = document.getElementById(label) as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(input, {
      componentRestrictions: { country: 'tr' },
      fields: ['formatted_address', 'geometry']
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        newMap.setCenter(location);
        newMarker.setPosition(location);
        onChange(place.formatted_address || '', location);
      }
    });
  }, []);

  const updateAddress = (location: google.maps.LatLngLiteral) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        onChange(results[0].formatted_address, location);
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="space-y-2">
      <label htmlFor={label} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id={label}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
        />
      </div>
      <div ref={mapRef} className="h-[200px] rounded-lg overflow-hidden" />
    </div>
  );
};

export default LocationPicker;