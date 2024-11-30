import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';

// Lazy load admin and other routes
const Services = React.lazy(() => import('../pages/Services'));
const Booking = React.lazy(() => import('../pages/Booking'));
const Contact = React.lazy(() => import('../pages/Contact'));
const AdminLayout = React.lazy(() => import('../components/admin/AdminLayout'));
const Dashboard = React.lazy(() => import('../pages/admin/Dashboard'));
const Reservations = React.lazy(() => import('../pages/admin/Reservations'));
const Settings = React.lazy(() => import('../pages/admin/Settings'));
const Pages = React.lazy(() => import('../pages/admin/Pages'));
const Translations = React.lazy(() => import('../pages/admin/Translations'));
const DynamicPage = React.lazy(() => import('../pages/DynamicPage'));

// Loading component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/page/:slug" element={<DynamicPage />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/reservations"
          element={
            <AdminLayout>
              <Reservations />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/pages"
          element={
            <AdminLayout>
              <Pages />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/translations"
          element={
            <AdminLayout>
              <Translations />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminLayout>
              <Settings />
            </AdminLayout>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;