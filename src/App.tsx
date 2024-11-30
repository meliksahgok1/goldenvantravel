import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes';

function App() {
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {!isAdminRoute && <Navbar />}
        <main className="flex-grow">
          <AppRoutes />
        </main>
        {!isAdminRoute && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;