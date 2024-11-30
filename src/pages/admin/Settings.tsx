import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import ErrorAlert from '../../components/admin/ErrorAlert';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import SuccessAlert from '../../components/admin/SuccessAlert';
import useStore from '../../store/useStore';

const Settings = () => {
  const { settings: storedSettings, setSettings } = useStore();
  const [settings, setLocalSettings] = useState(storedSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/.netlify/functions/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data = await response.json();
      setLocalSettings(data);
      setSettings(data);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to load settings'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/.netlify/functions/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update settings');
      }

      setSettings(settings);
      setMessage({ type: 'success', text: 'Settings updated successfully' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred while saving'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateSetting = (path: string[], value: string) => {
    setLocalSettings(prev => {
      const newSettings = { ...prev };
      let current = newSettings;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newSettings;
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Site Ayarları</h3>
          <p className="mt-1 text-sm text-gray-500">
            Genel site ayarlarını ve yapılandırmalarını yönetin.
          </p>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit}>
            {message && (
              message.type === 'success' 
                ? <SuccessAlert message={message.text} />
                : <ErrorAlert message={message.text} />
            )}

            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Temel Bilgiler</h4>
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Şirket Adı
                      </label>
                      <input
                        type="text"
                        value={settings.companyName}
                        onChange={(e) => updateSetting(['companyName'], e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        E-posta
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => updateSetting(['email'], e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Telefon
                      </label>
                      <input
                        type="text"
                        value={settings.phone}
                        onChange={(e) => updateSetting(['phone'], e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Adres
                      </label>
                      <input
                        type="text"
                        value={settings.address}
                        onChange={(e) => updateSetting(['address'], e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Sosyal Medya</h4>
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={settings.socialMedia.facebook}
                        onChange={(e) => updateSetting(['socialMedia', 'facebook'], e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={settings.socialMedia.instagram}
                        onChange={(e) => updateSetting(['socialMedia', 'instagram'], e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Twitter
                      </label>
                      <input
                        type="url"
                        value={settings.socialMedia.twitter}
                        onChange={(e) => updateSetting(['socialMedia', 'twitter'], e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* SEO Settings */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">SEO Ayarları</h4>
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Site Başlığı
                      </label>
                      <input
                        type="text"
                        value={settings.seo.title}
                        onChange={(e) => updateSetting(['seo', 'title'], e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Meta Açıklama
                      </label>
                      <textarea
                        value={settings.seo.description}
                        onChange={(e) => updateSetting(['seo', 'description'], e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Anahtar Kelimeler
                      </label>
                      <input
                        type="text"
                        value={settings.seo.keywords}
                        onChange={(e) => updateSetting(['seo', 'keywords'], e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Virgülle ayrılmış anahtar kelimeler"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Fiyatlandırma</h4>
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Taban Fiyat
                      </label>
                      <input
                        type="number"
                        value={settings.pricing.basePrice}
                        onChange={(e) => updateSetting(['pricing', 'basePrice'], e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        KM Başına Fiyat
                      </label>
                      <input
                        type="number"
                        value={settings.pricing.pricePerKm}
                        onChange={(e) => updateSetting(['pricing', 'pricePerKm'], e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Para Birimi
                      </label>
                      <select
                        value={settings.pricing.currency}
                        onChange={(e) => updateSetting(['pricing', 'currency'], e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="TRY">TRY - Türk Lirası</option>
                        <option value="USD">USD - Amerikan Doları</option>
                        <option value="EUR">EUR - Euro</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;