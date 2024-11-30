import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  pricing: {
    basePrice: string;
    pricePerKm: string;
    currency: string;
  };
}

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

interface StoreState {
  settings: Settings;
  translations: Translations;
  setSettings: (settings: Settings) => void;
  setTranslations: (translations: Translations) => void;
  updateTranslation: (lang: string, key: string, value: string) => void;
}

const useStore = create<StoreState>()(
  persist(
    (set) => ({
      settings: {
        companyName: 'GoldenVan Travel',
        email: 'info@goldenvan.com',
        phone: '+90 555 123 4567',
        address: 'İstanbul, Türkiye',
        socialMedia: {
          facebook: '',
          instagram: '',
          twitter: '',
        },
        seo: {
          title: 'GoldenVan Travel - VIP Transfer Services',
          description: 'Professional transfer services in Turkey',
          keywords: 'transfer, vip transfer, airport transfer',
        },
        pricing: {
          basePrice: '500',
          pricePerKm: '5',
          currency: 'TRY',
        },
      },
      translations: {},
      setSettings: (settings) => set({ settings }),
      setTranslations: (translations) => set({ translations }),
      updateTranslation: (lang, key, value) =>
        set((state) => ({
          translations: {
            ...state.translations,
            [lang]: {
              ...state.translations[lang],
              [key]: value,
            },
          },
        })),
    }),
    {
      name: 'goldenvan-store',
    }
  )
);

export default useStore;