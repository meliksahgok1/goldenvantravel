interface StorageData {
  users: any[];
  pages: any[];
  reservations: any[];
  settings: any;
}

const STORAGE_KEY = 'goldenvan_data';

const defaultData: StorageData = {
  users: [{
    id: '1',
    username: 'admin',
    password: '$2a$10$8Ux8Ey8Y5Z5Z5Z5Z5Z5Z5OqH1H1H1H1H1H1H1H1H1H1H1H1H1H1', // admin123
    role: 'admin'
  }],
  pages: [],
  reservations: [],
  settings: {
    companyName: 'GoldenVan Travel',
    email: 'info@goldenvan.com',
    phone: '+90 555 123 4567',
    address: 'İstanbul, Türkiye'
  }
};

export function getData(): StorageData {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : defaultData;
}

export function saveData(data: Partial<StorageData>) {
  const currentData = getData();
  const newData = { ...currentData, ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  return newData;
}

export function getCollection(name: keyof StorageData) {
  const data = getData();
  return data[name];
}

export function saveCollection(name: keyof StorageData, items: any[]) {
  const data = getData();
  data[name] = items;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return items;
}