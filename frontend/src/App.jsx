import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminAuthPage from './pages/AdminAuthPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleNotification = (event) => {
      const notification = {
        id: Date.now() + Math.random(),
        type: event.detail?.type || 'info',
        message: event.detail?.message || 'Something happened.'
      };

      setNotifications((current) => [...current, notification]);
      window.setTimeout(() => {
        setNotifications((current) => current.filter((item) => item.id !== notification.id));
      }, 4200);
    };

    window.addEventListener('app-notification', handleNotification);
    return () => window.removeEventListener('app-notification', handleNotification);
  }, []);

  const removeNotification = (id) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="fixed top-20 right-4 z-[100] w-[min(100vw-2rem,380px)] space-y-3 pointer-events-none">
      {notifications.map((notification) => {
        const isError = notification.type === 'error';
        const isSuccess = notification.type === 'success';
        const Icon = isError ? AlertCircle : isSuccess ? CheckCircle2 : Info;
        const colors = isError
          ? 'border-red-200 bg-red-50 text-red-800'
          : isSuccess
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border-blue-200 bg-blue-50 text-blue-800';

        return (
          <div key={notification.id} className={`notification-enter pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg ${colors}`}>
            <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <p className="flex-1 text-sm font-semibold leading-5">{notification.message}</p>
            <button type="button" onClick={() => removeNotification(notification.id)} aria-label="Close notification" className="opacity-60 transition hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 antialiased font-sans">
        <NotificationCenter />
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/super/admin" element={<AdminAuthPage />} />
            <Route
              path="/super/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}