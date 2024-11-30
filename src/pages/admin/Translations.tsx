import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import useStore from '../../store/useStore';
import ErrorAlert from '../../components/admin/ErrorAlert';
import SuccessAlert from '../../components/admin/SuccessAlert';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const defaultTranslations = {
  tr: {
    'nav.home': 'Ana Sayfa',
    'nav.services': 'Hizmetler',
    'nav.booking': 'Rezervasyon',
    'nav.contact': 'İletişim',
    'common.save': 'Kaydet',
    'common.cancel': 'İptal',
    'common.edit': 'Düzenle',
    'common.delete': 'Sil',
    'booking.title': 'Transfer Rezervasyonu',
    'booking.pickup': 'Alış Noktası',
    'booking.dropoff': 'Varış Noktası',
    'booking.date': 'Tarih',
    'booking.time': 'Saat',
    'booking.passengers': 'Yolcu Sayısı',
    'booking.vehicle': 'Araç Tipi',
    'booking.price': 'Fiyat',
    'booking.submit': 'Rezervasyon Yap'
  },
  en: {
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.booking': 'Booking',
    'nav.contact': 'Contact',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'booking.title': 'Transfer Booking',
    'booking.pickup': 'Pickup Location',
    'booking.dropoff': 'Drop-off Location',
    'booking.date': 'Date',
    'booking.time': 'Time',
    'booking.passengers': 'Passengers',
    'booking.vehicle': 'Vehicle Type',
    'booking.price': 'Price',
    'booking.submit': 'Book Now'
  }
};

const Translations = () => {
  const { translations, setTranslations, updateTranslation } = useStore();
  const [selectedLang, setSelectedLang] = useState('tr');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/.netlify/functions/translations');
      if (!response.ok) {
        throw new Error('Failed to fetch translations');
      }
      const data = await response.json();
      setTranslations(data || defaultTranslations);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to load translations'
      });
      setTranslations(defaultTranslations);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/.netlify/functions/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ translations }),
      });

      if (!response.ok) {
        throw new Error('Failed to save translations');
      }

      setMessage({ type: 'success', text: 'Translations saved successfully' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to save translations'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const currentTranslations = translations[selectedLang] || {};
  const filteredTranslations = Object.entries(currentTranslations).filter(
    ([key, value]) =>
      key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Çeviri Yönetimi</h1>
        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="h-5 w-5 mr-2" />
          {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>

      {message && (
        message.type === 'success' 
          ? <SuccessAlert message={message.text} />
          : <ErrorAlert message={message.text} />
      )}

      <div className="mb-6 flex space-x-4">
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="tr">Türkçe</option>
          <option value="en">English</option>
        </select>

        <input
          type="text"
          placeholder="Arama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Anahtar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Çeviri
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTranslations.map(([key, value]) => (
              <tr key={key}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {key}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateTranslation(selectedLang, key, e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Translations;