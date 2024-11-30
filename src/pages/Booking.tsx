import React, { useState } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import VehicleSelector from '../components/VehicleSelector';
import LocationPicker from '../components/LocationPicker';
import PaymentForm from '../components/PaymentForm';

interface Location {
  address: string;
  coordinates: google.maps.LatLngLiteral;
}

interface BookingData {
  pickup: Location;
  dropoff: Location;
  date: string;
  time: string;
  passengers: string;
  vehicleType: string;
}

const Booking = () => {
  const [bookingData, setBookingData] = useState<BookingData>({
    pickup: {
      address: '',
      coordinates: { lat: 41.0082, lng: 28.9784 }
    },
    dropoff: {
      address: '',
      coordinates: { lat: 41.0082, lng: 28.9784 }
    },
    date: '',
    time: '',
    passengers: '1',
    vehicleType: 'sedan'
  });

  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Form validation
    if (!bookingData.pickup.address || !bookingData.dropoff.address || !bookingData.date || !bookingData.time) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    // Show payment form
    setShowPayment(true);
  };

  const handlePayment = async (paymentData: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/.netlify/functions/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking: bookingData,
          payment: paymentData
        }),
      });

      if (!response.ok) {
        throw new Error('Ödeme işlemi başarısız oldu');
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        // Redirect to success page
        window.location.href = `/booking/success?id=${result.bookingId}`;
      } else {
        setError(result.error || 'Ödeme işlemi sırasında bir hata oluştu');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showPayment) {
    return (
      <PaymentForm 
        amount={calculatePrice(bookingData)}
        onSubmit={handlePayment}
        onCancel={() => setShowPayment(false)}
        isSubmitting={isSubmitting}
        error={error}
      />
    );
  }

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Transfer Rezervasyonu
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Alış ve varış noktalarını seçin
            </p>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <LocationPicker
                    label="Alış Noktası"
                    value={bookingData.pickup.address}
                    onChange={(address, coordinates) =>
                      setBookingData(prev => ({
                        ...prev,
                        pickup: { address, coordinates }
                      }))
                    }
                    placeholder="Alış noktasını seçin"
                  />

                  <LocationPicker
                    label="Varış Noktası"
                    value={bookingData.dropoff.address}
                    onChange={(address, coordinates) =>
                      setBookingData(prev => ({
                        ...prev,
                        dropoff: { address, coordinates }
                      }))
                    }
                    placeholder="Varış noktasını seçin"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tarih</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={bookingData.date}
                        onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Saat</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        value={bookingData.time}
                        onChange={(e) => setBookingData(prev => ({ ...prev, time: e.target.value }))}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Yolcu Sayısı</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        value={bookingData.passengers}
                        onChange={(e) => setBookingData(prev => ({ ...prev, passengers: e.target.value }))}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <option key={num} value={num}>{num} yolcu</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Araç Tipi Seçin</h3>
                  <VehicleSelector
                    selectedVehicle={bookingData.vehicleType}
                    onChange={(vehicleType) => setBookingData(prev => ({ ...prev, vehicleType }))}
                  />
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium text-gray-900">Toplam Tutar</p>
                      <p className="text-sm text-gray-500">KDV dahil</p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      ₺{calculatePrice(bookingData)}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'İşleniyor...' : 'Ödemeye Geç'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate price based on vehicle type and distance
const calculatePrice = (bookingData: BookingData) => {
  const basePrice = {
    sedan: 500,
    van: 800,
    minibus: 1200,
    vip: 1500
  }[bookingData.vehicleType] || 500;

  // Calculate distance between pickup and dropoff using Google Maps Distance Matrix API
  // For now, return base price
  return basePrice;
};

export default Booking;