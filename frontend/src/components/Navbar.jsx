import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck } from 'lucide-react';
import axiosClient from '../api/axiosClient';

export default function Navbar() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        await axiosClient.get('/admin/me');
        setIsAdminAuthenticated(true);
      } catch {
        setIsAdminAuthenticated(false);
      }
    };

    const handleAuthChange = (event) => {
      setIsAdminAuthenticated(Boolean(event.detail?.authenticated));
    };

    checkAdminSession();
    window.addEventListener('admin-auth-changed', handleAuthChange);
    return () => window.removeEventListener('admin-auth-changed', handleAuthChange);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-orange-500 text-white font-extrabold px-2.5 py-1 rounded text-xl tracking-tight">
            1Fi
          </div>
          <span className="text-gray-900 font-bold text-lg hidden sm:inline">Store</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">100% Verified EMI Plans</span>
          </span>
          {!isAdminAuthenticated && (
            <Link
              to="/super/admin"
              className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-orange-500 text-white font-bold px-3 py-2 rounded-lg transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}