import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Users, Car, CreditCard, TrendingUp } from 'lucide-react';

const data = [
  { name: 'Ocak', rezervasyon: 40 },
  { name: 'Şubat', rezervasyon: 30 },
  { name: 'Mart', rezervasyon: 45 },
  { name: 'Nisan', rezervasyon: 55 },
];

const stats = [
  { name: 'Toplam Rezervasyon', value: '1,234', icon: Car, change: '+12%' },
  { name: 'Toplam Müşteri', value: '892', icon: Users, change: '+9%' },
  { name: 'Toplam Gelir', value: '₺156,789', icon: CreditCard, change: '+23%' },
  { name: 'Ortalama Değer', value: '₺890', icon: TrendingUp, change: '+4%' },
];

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Yönetim Paneli</h1>
      
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        {item.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">Rezervasyon İstatistikleri</h2>
          <div className="mt-6">
            <BarChart width={800} height={300} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="rezervasyon" fill="#3B82F6" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;