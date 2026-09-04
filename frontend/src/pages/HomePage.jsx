import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { ChevronRight, Smartphone, AlertCircle } from 'lucide-react';

const resolveImageUrl = (rawImg) => {
  if (!rawImg) return 'https://via.placeholder.com/350x350?text=No+Image';
  if (rawImg.startsWith('http://') || rawImg.startsWith('https://')) {
    return rawImg;
  }
  const rawBase = import.meta.env.VITE_API_URL || 'https://product-emi-switcher.onrender.com/api';
  const origin = rawBase.replace(/\/api\/?$/, '');
  const cleanPath = rawImg.startsWith('/') ? rawImg : `/${rawImg}`;
  return `${origin}${cleanPath}`;
};

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosClient.get('/products');
        setProducts(res.data.data || []);
      } catch (err) {
        setError('Failed to connect to catalog service.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm animate-pulse h-96" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-24 p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center">
        <AlertCircle className="w-10 h-10 mx-auto mb-2 text-red-500" />
        <p className="font-semibold text-sm">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-md mx-auto my-24 p-10 text-center bg-white border border-dashed border-gray-200 rounded-3xl shadow-sm">
        <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No Products Listed</h3>
        <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">
          The catalog is currently unpopulated. Log in to the administrator portal to add smartphones and EMI schedules.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Explore Latest Devices on EMI
        </h1>
        <p className="text-gray-500 text-sm mt-1">Smartphones backed by mutual funds and 0% interest</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => {
          const defaultVariant = product.variants?.[0] || {};
          const availablePlans = defaultVariant.emiPlans?.length > 0 
            ? defaultVariant.emiPlans 
            : (product.emiPlans || []);
          const minEmi = availablePlans[0] || {};

          const rawImg = defaultVariant.images?.[0] || defaultVariant.imageUrl || '';
          const imgUrl = resolveImageUrl(rawImg);

          return (
            <Link
              key={product._id}
              to={`/products/${product.slug}`}
              className="group bg-white border border-gray-100 hover:border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded-md">
                    {product.tag || 'NEW'}
                  </span>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{product.brand}</span>
                </div>

                <div className="h-64 w-full flex items-center justify-center p-4 bg-gray-50/70 rounded-2xl overflow-hidden mb-5">
                  <img
                    src={imgUrl}
                    alt={product.name}
                    crossOrigin="anonymous"
                    className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/350x350?text=No+Image';
                    }}
                  />
                </div>

                <h2 className="text-lg font-bold text-gray-900 group-hover:text-orange-500 transition line-clamp-1">
                  {product.name}
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  {defaultVariant.storage} • {defaultVariant.colorName}
                </p>

                <div className="mt-4 flex items-baseline gap-2.5">
                  <span className="text-2xl font-black text-gray-900 tracking-tight">
                    ₹{defaultVariant.sellingPrice?.toLocaleString('en-IN')}
                  </span>
                  {defaultVariant.mrp > defaultVariant.sellingPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{defaultVariant.mrp?.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {minEmi.monthlyAmount && (
                  <div className="mt-3 text-xs text-gray-700 bg-gray-50 border border-gray-100/80 p-2.5 rounded-xl flex items-center justify-between">
                    <span className="text-gray-500">Starting EMI</span>
                    <strong className="text-gray-900 font-bold">₹{minEmi.monthlyAmount?.toLocaleString('en-IN')}/mo</strong>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-orange-600">
                <span>View Plans & Variants</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}