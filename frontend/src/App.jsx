import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminAuthPage from './pages/AdminAuthPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 antialiased font-sans">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/super/admin" element={<AdminAuthPage />} />
            <Route path="/super/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}