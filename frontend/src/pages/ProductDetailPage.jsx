import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import {
  Check,
  Truck,
  RotateCcw,
  Award,
  Lock,
  Star,
  Smartphone,
  Cpu,
  Camera,
  BatteryCharging
} from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [otherProducts, setOtherProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedEmiIndex, setSelectedEmiIndex] = useState(0);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/products/${slug}`);
        setProduct(res.data.data);

        const allRes = await axiosClient.get('/products');
        const others = (allRes.data.data || []).filter((p) => p.slug !== slug);
        setOtherProducts(others);
      } catch (err) {
        setError('Unable to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, [slug]);

  // Variant change hone par image index aur EMI selection reset karein
  useEffect(() => {
    setSelectedImageIndex(0);
    setSelectedEmiIndex(0);
  }, [selectedVariantIndex]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 h-[480px] bg-gray-200 rounded-3xl" />
        <div className="md:col-span-7 space-y-4">
          <div className="h-8 bg-gray-200 w-2/3 rounded" />
          <div className="h-10 bg-gray-200 w-1/3 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 bg-red-50 border border-red-200 text-red-700 rounded-3xl text-center">
        <p className="font-bold text-base">{error || 'Product not found'}</p>
        <Link to="/" className="text-xs text-orange-600 font-semibold underline mt-3 inline-block">
          Return to catalog
        </Link>
      </div>
    );
  }

  const currentVariant = product.variants?.[selectedVariantIndex] || {};
  
  // FIX: Variant ke specific plans lo, fallback ke liye product level plans check karo
  const rawPlans = (currentVariant.emiPlans && currentVariant.emiPlans.length > 0)
    ? currentVariant.emiPlans
    : (product.emiPlans || []);

  const availableEmiPlans = rawPlans;
  const currentEmi = availableEmiPlans[selectedEmiIndex] || availableEmiPlans[0] || {};

  const backendOrigin = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  const galleryImages = currentVariant.images?.length > 0 ? currentVariant.images : [''];
  const activeImage = galleryImages[selectedImageIndex] || galleryImages[0];
  const activeImageUrl = activeImage?.startsWith('http') ? activeImage : `${backendOrigin}${activeImage}`;

  const handleProceed = () => {
    alert(
      `Proceeding with Order:\n` +
      `Model: ${product.name}\n` +
      `Variant: ${currentVariant.storage} ${currentVariant.ram ? `(${currentVariant.ram})` : ''} - ${currentVariant.colorName}\n` +
      `Price: ₹${currentVariant.sellingPrice?.toLocaleString('en-IN')}\n` +
      `Selected EMI Plan: ₹${currentEmi.monthlyAmount?.toLocaleString('en-IN')} x ${currentEmi.tenureMonths} Months (${currentEmi.interestRate}% Interest)`
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Visual Showcase Card */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">

        {/* Left: Gallery & Finish Dots */}
        <div className="md:col-span-5 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0 md:pr-8">
          <div className="w-full text-left">
            <span className="text-[11px] font-bold text-red-500 uppercase tracking-widest bg-red-50 px-2.5 py-1 rounded">
              {product.tag || 'NEW'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
              {product.name}
            </h1>
            <p className="text-xs font-semibold text-gray-500 mt-1">
              {currentVariant.storage} {currentVariant.ram ? `• ${currentVariant.ram}` : ''} • {currentVariant.colorName}
            </p>
          </div>

          <div className="my-6 w-full flex flex-col items-center justify-center">
            <div className="h-72 w-full flex items-center justify-center">
              <img
                src={activeImageUrl}
                alt={`${product.name} - ${currentVariant.colorName}`}
                className="max-h-72 w-auto object-contain drop-shadow-md transition-all duration-200"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/350x350?text=No+Preview'; }}
              />
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2.5 mt-5">
                {galleryImages.map((img, idx) => {
                  const url = img.startsWith('http') ? img : `${backendOrigin}${img}`;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-12 h-12 rounded-xl border-2 p-1 overflow-hidden transition-all duration-150 cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-orange-500 shadow-sm scale-105'
                          : 'border-gray-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="thumbnail" className="w-full h-full object-contain" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Color Finishes Selection */}
          <div className="w-full text-center select-none">
            <p className="text-xs text-gray-500 mb-2.5 font-medium">
              Available in {product.variants.length} finishes
            </p>
            <div className="flex items-center justify-center gap-3">
              {product.variants.map((variant, idx) => (
                <button
                  key={idx}
                  type="button"
                  title={variant.colorName}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`w-7 h-7 rounded-full border-2 transition-all duration-150 cursor-pointer ${
                    selectedVariantIndex === idx
                      ? 'border-orange-500 scale-125 ring-2 ring-orange-100'
                      : 'border-white ring-1 ring-gray-300 opacity-80'
                  }`}
                  style={{ backgroundColor: variant.colorHex?.startsWith('#') ? variant.colorHex : `#${variant.colorHex || 'ccc'}` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Pricing & EMI Stack */}
        <div className="md:col-span-7 flex flex-col justify-between">
          <div>
            {/* Dynamic Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-gray-900">
                ₹{currentVariant.sellingPrice?.toLocaleString('en-IN')}
              </span>
              {currentVariant.mrp > currentVariant.sellingPrice && (
                <span className="text-base text-gray-400 line-through">
                  ₹{currentVariant.mrp?.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="text-xs font-bold text-gray-500 mt-1 mb-4 uppercase tracking-wider">
              EMI plans backed by mutual funds
            </p>

            {/* Variant Selector Tabs */}
            <div className="mb-5">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Select Storage & Finish
              </span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`text-xs px-3.5 py-2 rounded-xl border font-bold transition-all duration-150 cursor-pointer ${
                      selectedVariantIndex === idx
                        ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {variant.storage} {variant.ram ? `(${variant.ram})` : ''} • {variant.colorName}
                  </button>
                ))}
              </div>
            </div>

            {/* EMI Cards List -> FIX: maps on availableEmiPlans */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {availableEmiPlans.length === 0 ? (
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs text-gray-500 text-center">
                  No EMI plans configured for this variant.
                </div>
              ) : (
                availableEmiPlans.map((plan, idx) => {
                  const isSelected = selectedEmiIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedEmiIndex(idx)}
                      className={`cursor-pointer rounded-2xl p-3.5 sm:p-4 border transition-all duration-150 flex items-center justify-between ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/30 ring-1 ring-orange-500/20 shadow-xs'
                          : 'border-gray-100 bg-gray-50/60 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <div className="text-sm sm:text-base font-bold text-gray-900">
                          ₹{Number(plan.monthlyAmount)?.toLocaleString('en-IN')} x {plan.tenureMonths} months
                        </div>
                        {plan.cashback > 0 && (
                          <div className="text-xs text-emerald-600 font-bold mt-0.5">
                            Additional cashback of ₹{Number(plan.cashback)?.toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs sm:text-sm font-semibold text-gray-600">
                          {plan.interestRate}% interest
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 pt-4 border-t border-gray-100">
            <button
              onClick={handleProceed}
              type="button"
              className="w-full bg-[#ff5a00] hover:bg-[#e04f00] active:scale-[0.99] text-white py-3 px-6 rounded-2xl shadow-md transition-all duration-150 flex flex-col items-center justify-center cursor-pointer"
            >
              <span className="text-base sm:text-lg font-extrabold tracking-tight">
                Buy on {currentEmi.tenureMonths || 6} months EMI
              </span>
              {currentEmi.cashback > 0 ? (
                <span className="text-xs sm:text-[13px] font-semibold text-white/95 mt-0.5">
                  Earn ₹{Number(currentEmi.cashback)?.toLocaleString('en-IN')} cashback on this order
                </span>
              ) : (
                <span className="text-xs text-white/80 mt-0.5">
                  Instant approval backed by mutual funds
                </span>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Trust & Guarantee Section */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="border-b border-gray-100 pb-4 mb-4">
              <p className="text-xs text-gray-500 font-medium">Sold By : <strong className="text-orange-600 font-bold">{product.sellerName || 'Balaji Infocom'}</strong></p>
              <div className="mt-3 flex items-start gap-2 text-xs text-gray-700">
                <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900">Shipping Details:</h4>
                  <p className="text-gray-600 mt-0.5">{product.shippingDays}</p>
                </div>
              </div>
            </div>

            <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-wider">Shop with Confidence</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <RotateCcw className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-gray-900">2 Days Service Centre Replacement</h5>
                  <p className="text-gray-500 text-[11px] mt-0.5">Defective item covered under brand warranty policy.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <Award className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-gray-900">Top Brand</h5>
                  <p className="text-gray-500 text-[11px] mt-0.5">High-quality, trusted brands with verified customer satisfaction.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <Truck className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-gray-900">Free Delivery</h5>
                  <p className="text-gray-500 text-[11px] mt-0.5">This product is eligible for free doorstep delivery.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <Lock className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-gray-900">Secure Transaction</h5>
                  <p className="text-gray-500 text-[11px] mt-0.5">Payment system encrypts your data end-to-end.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-base font-black text-gray-900 mb-4">Product Details & Hardware</h3>
            <ul className="divide-y divide-gray-100 text-xs text-gray-700 space-y-2">
              <li className="pt-2 flex justify-between"><span className="text-gray-500">Storage</span> <span className="font-semibold text-gray-900">{currentVariant.storage}</span></li>
              <li className="pt-2 flex justify-between"><span className="text-gray-500">Color / Finish</span> <span className="font-semibold text-gray-900">{currentVariant.colorName}</span></li>
              {product.specifications?.screenSize && (
                <li className="pt-2 flex justify-between"><span className="text-gray-500">Display</span> <span className="font-semibold text-gray-900">{product.specifications?.screenSize}</span></li>
              )}
              {product.specifications?.processor && (
                <li className="pt-2 flex justify-between"><span className="text-gray-500">Processor</span> <span className="font-semibold text-gray-900">{product.specifications?.processor}</span></li>
              )}
              {product.specifications?.rearCamera && (
                <li className="pt-2 flex justify-between"><span className="text-gray-500">Rear Camera</span> <span className="font-semibold text-gray-900">{product.specifications?.rearCamera}</span></li>
              )}
              {product.specifications?.frontCamera && (
                <li className="pt-2 flex justify-between"><span className="text-gray-500">Front Camera</span> <span className="font-semibold text-gray-900">{product.specifications?.frontCamera}</span></li>
              )}
            </ul>
          </div>
        </div>

        {/* Reviews Box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs">
            <h3 className="text-base font-black text-gray-900 mb-2">Review & Rating</h3>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="text-lg font-black text-gray-900">{product.ratingAverage || 4.8}</span>
              <span className="text-xs text-gray-400">({product.ratingCount || 704} ratings)</span>
            </div>
            <div className="space-y-4">
              {product.reviews?.map((rev, i) => (
                <div key={i} className="border-t border-gray-100 pt-3 text-xs">
                  <p className="text-gray-700 font-medium">"{rev.comment}"</p>
                  <p className="text-[11px] text-gray-400 mt-1">{rev.author}, {rev.city} • <span className="text-emerald-600 font-semibold">Verified</span></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}