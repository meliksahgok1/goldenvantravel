import React, { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2, Search } from 'lucide-react';
import ErrorAlert from '../../components/admin/ErrorAlert';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import SuccessAlert from '../../components/admin/SuccessAlert';

interface Reservation {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupLocation: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  dropoffLocation: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  date: string;
  time: string;
  passengers: number;
  vehicleType: string;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
}

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/.netlify/functions/reservations');
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to load reservations'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reservation?')) {
      return;
    }

    try {
      const response = await fetch(`/.netlify/functions/reservations?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete reservation');
      }

      setMessage({ type: 'success', text: 'Reservation deleted successfully' });
      fetchReservations();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to delete reservation'
      });
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/.netlify/functions/reservations?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update reservation status');
      }

      setMessage({ type: 'success', text: 'Status updated successfully' });
      fetchReservations();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update status'
      });
    }
  };

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.pickupLocation.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.dropoffLocation.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Rezervasyonlar</h1>
        </div>
      </div>

      {message && (
        message.type === 'success' 
          ? <SuccessAlert message={message.text} />
          : <ErrorAlert message={message.text} />
      )}

      <div className="mt-6 flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Rezervasyon ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Müşteri
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Alış Noktası
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Varış Noktası
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Tarih/Saat
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Durum
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Ödeme
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">İşlemler</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation._id}>
                      <td className="whitespace-nowrap px-3 py-4">
                        <div className="text-sm text-gray-900">{reservation.customerName}</div>
                        <div className="text-sm text-gray-500">{reservation.customerEmail}</div>
                        <div className="text-sm text-gray-500">{reservation.customerPhone}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {reservation.pickupLocation.address}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {reservation.dropoffLocation.address}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(reservation.date).toLocaleDateString('tr-TR')}
                        <br />
                        {reservation.time}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <select
                          value={reservation.status}
                          onChange={(e) => handleStatusChange(reservation._id, e.target.value)}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="pending">Beklemede</option>
                          <option value="confirmed">Onaylandı</option>
                          <option value="completed">Tamamlandı</option>
                          <option value="cancelled">İptal Edildi</option>
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            reservation.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : reservation.paymentStatus === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {reservation.paymentStatus === 'paid'
                            ? 'Ödendi'
                            : reservation.paymentStatus === 'failed'
                            ? 'Başarısız'
                            : 'Beklemede'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setSelectedReservation(reservation)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(reservation._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Detail Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Rezervasyon Detayı</h3>
              <button
                onClick={() => setSelectedReservation(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Müşteri Bilgileri</h4>
                <p>İsim: {selectedReservation.customerName}</p>
                <p>E-posta: {selectedReservation.customerEmail}</p>
                <p>Telefon: {selectedReservation.customerPhone}</p>
              </div>
              <div>
                <h4 className="font-medium">Transfer Bilgileri</h4>
                <p>Alış: {selectedReservation.pickupLocation.address}</p>
                <p>Varış: {selectedReservation.dropoffLocation.address}</p>
                <p>Tarih: {new Date(selectedReservation.date).toLocaleDateString('tr-TR')}</p>
                <p>Saat: {selectedReservation.time}</p>
                <p>Yolcu Sayısı: {selectedReservation.passengers}</p>
                <p>Araç Tipi: {selectedReservation.vehicleType}</p>
              </div>
              <div>
                <h4 className="font-medium">Ödeme Bilgileri</h4>
                <p>Tutar: ₺{selectedReservation.price}</p>
                <p>Durum: {selectedReservation.paymentStatus}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;