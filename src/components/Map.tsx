import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface MapProps {
  center: google.maps.LatLngLiteral;
  markers?: google.maps.LatLngLiteral[];
  onMapClick?: (e: google.maps.MapMouseEvent) => void;
}

const Map: React.FC<MapProps> = ({ center, markers = [], onMapClick }) => {
  const mapStyles = {
    height: '400px',
    width: '100%'
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyCZlavyHZcZCxZzoQSfS9aATu1lCxWZ8fI">
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={center}
        onClick={onMapClick}
      >
        {markers.map((position, index) => (
          <Marker
            key={index}
            position={position}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;