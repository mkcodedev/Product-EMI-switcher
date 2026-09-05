import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient, { resolveMediaUrl } from '../api/axiosClient';
import { Trash2, Plus, LogOut, UploadCloud, Edit3, X, CheckCircle2 } from 'lucide-react';

const STANDARD_TENURES = [3, 6, 9, 12];

const calculateEMI = (price, tenure, rate = 0) => {
  const p = Number(price) || 0;
  const t = Number(tenure) || 1;
  const r = Number(rate) || 0;
  if (p <= 0 || t <= 0) return 0;
  const totalAmount = p + (p * r * (t / 12)) / 100;
  return Math.round(totalAmount / t);
};

const BLANK_FORM = {
  name: '',
  slug: '',
  brand: '',
  tag: 'NEW',
  sellerName: 'Balaji Infocom',
  shippingDays: 'Dispatch in less than 48 hours and delivery in 3-7 working days after dispatch',
  description: '',
  specifications: {
    storageDetails: '',
    screenSize: '',
    frontCamera: '',
    rearCamera: '',
    processor: '',
    battery: ''
  },
  variants: [
    {
      storage: '',
      ram: '',
      colorName: '',
      colorHex: '#000000',
      mrp: '',
      sellingPrice: '',
      images: [],
      emiPlans: STANDARD_TENURES.map((t) => ({
        monthlyAmount: '',
        tenureMonths: t,
        interestRate: 0,
        cashback: 0
      }))
    },
    {
      storage: '',
      ram: '',
      colorName: '',
      colorHex: '#C0C0C0',
      mrp: '',
      sellingPrice: '',
      images: [],
      emiPlans: STANDARD_TENURES.map((t) => ({
        monthlyAmount: '',
        tenureMonths: t,
        interestRate: 0,
        cashback: 0
      }))
    }
  ]
};

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeVariantForEmi, setActiveVariantForEmi] = useState(0);
  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState({
    brands: [],
    tags: [],
    storages: [],
    rams: [],
    colorNames: [],
    colorHexes: []
  });

  const [form, setForm] = useState(BLANK_FORM);

  const loadData = async () => {
    try {
      const meRes = await axiosClient.get('/admin/me');
      setAdmin(meRes.data.admin);
      const prodRes = await axiosClient.get('/products');
      setProducts(prodRes.data.data || []);
      const sugRes = await axiosClient.get('/products/meta/suggestions');
      setSuggestions(sugRes.data);
    } catch (err) {
      navigate('/super/admin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      await axiosClient.post('/admin/logout');
    } finally {
      navigate('/super/admin', { replace: true });
    }
  };

  const handleMultipleImageUpload = async (variantIdx, fileList) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    const uploadedUrls = [];

    try {
      for (let i = 0; i < fileList.length; i++) {
        const data = new FormData();
        data.append('image', fileList[i]);
        const res = await axiosClient.post('/media/upload', data);
        uploadedUrls.push(res.data.url);
      }

      const updated = [...form.variants];
      updated[variantIdx].images = [...updated[variantIdx].images, ...uploadedUrls];
      setForm({ ...form, variants: updated });
    } catch (err) {
      alert(err.response?.data?.message || 'Error uploading photos');
    } finally {
      setUploading(false);
    }
  };

  const removeVariantImage = (variantIdx, imgIdx) => {
    const updated = [...form.variants];
    updated[variantIdx].images = updated[variantIdx].images.filter((_, i) => i !== imgIdx);
    setForm({ ...form, variants: updated });
  };

const handleVariantChange = (vIdx, field, value) => {
    const updated = [...form.variants];
    updated[vIdx][field] = value;

    if (field === 'sellingPrice') {
      const numPrice = Number(value) || 0;
      updated[vIdx].emiPlans = updated[vIdx].emiPlans.map((plan) => ({
        ...plan,
        monthlyAmount: numPrice > 0 ? Number(calculateEMI(numPrice, plan.tenureMonths, plan.interestRate)) : 0
      }));
    }

    setForm({ ...form, variants: updated });
  };

  const addVariantRow = () => {
    const newIdx = form.variants.length;
    const newVariant = {
      storage: '',
      ram: '',
      colorName: '',
      colorHex: '#18181B',
      mrp: '',
      sellingPrice: '',
      images: [],
      emiPlans: STANDARD_TENURES.map((t) => ({
        monthlyAmount: '',
        tenureMonths: t,
        interestRate: 0,
        cashback: 0
      }))
    };
    setForm({ ...form, variants: [...form.variants, newVariant] });
    setActiveVariantForEmi(newIdx);
  };

  const removeVariantRow = (idx) => {
    if (form.variants.length <= 2) {
      alert('A minimum of 2 variants is strictly required.');
      return;
    }
    const filtered = form.variants.filter((_, i) => i !== idx);
    setForm({ ...form, variants: filtered });
    setActiveVariantForEmi(0);
  };

  const handleEmiFieldChange = (planIdx, field, value) => {
    const updatedVariants = [...form.variants];
    const currentVariant = updatedVariants[activeVariantForEmi];
    const plan = currentVariant.emiPlans[planIdx];

    const updatedPlan = { ...plan, [field]: Number(value) };

    if (field === 'tenureMonths' || field === 'interestRate') {
      updatedPlan.monthlyAmount = calculateEMI(
        currentVariant.sellingPrice,
        field === 'tenureMonths' ? value : updatedPlan.tenureMonths,
        field === 'interestRate' ? value : updatedPlan.interestRate
      );
    }

    currentVariant.emiPlans[planIdx] = updatedPlan;
    setForm({ ...form, variants: updatedVariants });
  };

  const addEmiRowToActiveVariant = () => {
    const updatedVariants = [...form.variants];
    const currentVariant = updatedVariants[activeVariantForEmi];
    const lastPlan = currentVariant.emiPlans[currentVariant.emiPlans.length - 1];
    const nextTenure = lastPlan ? lastPlan.tenureMonths + 12 : 24;

    const newPlan = {
      tenureMonths: nextTenure,
      interestRate: 10.5,
      cashback: 0,
      monthlyAmount: calculateEMI(currentVariant.sellingPrice, nextTenure, 10.5)
    };

    currentVariant.emiPlans.push(newPlan);
    setForm({ ...form, variants: updatedVariants });
  };

  const removeEmiRowFromActiveVariant = (planIdx) => {
    const updatedVariants = [...form.variants];
    const currentVariant = updatedVariants[activeVariantForEmi];
    if (currentVariant.emiPlans.length <= 1) {
      alert('At least 1 EMI plan must be maintained.');
      return;
    }
    currentVariant.emiPlans = currentVariant.emiPlans.filter((_, i) => i !== planIdx);
    setForm({ ...form, variants: updatedVariants });
  };

  // Prepopulate form when clicking Edit on a product
  const startEditingProduct = (product) => {
    setEditingId(product._id);
    setActiveVariantForEmi(0);

    const formattedVariants = product.variants.map((v) => ({
      storage: v.storage || '',
      ram: v.ram || '',
      colorName: v.colorName || '',
      colorHex: v.colorHex || '#000000',
      mrp: v.mrp || '',
      sellingPrice: v.sellingPrice || '',
      images: v.images || [],
      emiPlans: v.emiPlans?.length > 0
        ? v.emiPlans
        : STANDARD_TENURES.map((t) => ({
            monthlyAmount: calculateEMI(v.sellingPrice, t, 0),
            tenureMonths: t,
            interestRate: 0,
            cashback: 0
          }))
    }));

    setForm({
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      tag: product.tag || 'NEW',
      sellerName: product.sellerName || 'Balaji Infocom',
      shippingDays: product.shippingDays || 'Dispatch in less than 48 hours',
      description: product.description || '',
      specifications: {
        storageDetails: product.specifications?.storageDetails || '',
        screenSize: product.specifications?.screenSize || '',
        frontCamera: product.specifications?.frontCamera || '',
        rearCamera: product.specifications?.rearCamera || '',
        processor: product.specifications?.processor || '',
        battery: product.specifications?.battery || ''
      },
      variants: formattedVariants
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(BLANK_FORM);
    setActiveVariantForEmi(0);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Ensure all numeric fields in variants & emiPlans are real numbers
    const cleanedVariants = form.variants.map((v) => ({
      ...v,
      mrp: Number(v.mrp),
      sellingPrice: Number(v.sellingPrice),
      emiPlans: v.emiPlans.map((p) => ({
        monthlyAmount: Number(p.monthlyAmount),
        tenureMonths: Number(p.tenureMonths),
        interestRate: Number(p.interestRate),
        cashback: Number(p.cashback || 0)
      }))
    }));

    const payload = { ...form, variants: cleanedVariants };

    try {
      if (editingId) {
        await axiosClient.put(`/products/admin/${editingId}`, payload);
        alert('Product successfully updated in MongoDB!');
      } else {
        await axiosClient.post('/products/admin', payload);
        alert('Product published to MongoDB catalog!');
      }
      cancelEdit();
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit form');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      await axiosClient.delete(`/products/admin/${id}`);
      if (editingId === id) cancelEdit();
      loadData();
    } catch (err) {
      alert('Delete operation failed');
    }
  };

  if (loading) return <div className="p-8 text-center text-sm font-semibold">Loading Admin Console...</div>;

  const currentActiveVariant = form.variants[activeVariantForEmi] || form.variants[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <datalist id="db-brands">{suggestions.brands.map((b, i) => <option key={i} value={b} />)}</datalist>
      <datalist id="db-tags">{suggestions.tags.map((t, i) => <option key={i} value={t} />)}</datalist>
      <datalist id="db-storages">{suggestions.storages.map((s, i) => <option key={i} value={s} />)}</datalist>
      <datalist id="db-rams">{suggestions.rams.map((r, i) => <option key={i} value={r} />)}</datalist>
      <datalist id="db-colornames">{suggestions.colorNames.map((c, i) => <option key={i} value={c} />)}</datalist>

      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-5 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Admin Console</h1>
          <p className="text-xs text-gray-500 mt-0.5">Authenticated as <span className="font-semibold text-gray-700">{admin?.email}</span></p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl transition duration-150 cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-8 bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Product Details' : 'Add New Device & Configure Plans'}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {editingId ? 'Modify pricing, images, and variant parameters' : 'Fill all parameters to publish into MongoDB'}
              </p>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition"
              >
                <X className="w-3.5 h-3.5" /> Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apple iPhone 17 Pro"
                  value={form.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm({
                      ...form,
                      name: val,
                      slug: editingId ? form.slug : val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
                    });
                  }}
                  className="w-full text-xs border border-gray-200 rounded-xl p-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">SEO Slug</label>
                <input
                  type="text"
                  required
                  placeholder="apple-iphone-17-pro"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full text-xs border border-gray-200 rounded-xl p-3 outline-none font-mono bg-gray-50/60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Brand</label>
                <input
                  type="text"
                  required
                  list="db-brands"
                  placeholder="Apple, Samsung"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="w-full text-xs border border-gray-200 rounded-xl p-3 outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Badge Tag</label>
                <input
                  type="text"
                  list="db-tags"
                  placeholder="NEW, TRENDING"
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  className="w-full text-xs border border-gray-200 rounded-xl p-3 outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Seller Name</label>
                <input
                  type="text"
                  value={form.sellerName}
                  onChange={(e) => setForm({ ...form, sellerName: e.target.value })}
                  className="w-full text-xs border border-gray-200 rounded-xl p-3 outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Product Description</label>
              <textarea
                required
                rows={2}
                placeholder="Product description and highlights..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full text-xs border border-gray-200 rounded-xl p-3 outline-none focus:border-orange-500"
              />
            </div>

            {/* Specifications Section */}
            <div className="border-t border-gray-100 pt-5">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                Key Hardware Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Display (e.g. 6.3 inch Super Retina OLED)"
                  value={form.specifications.screenSize}
                  onChange={(e) => setForm({
                    ...form,
                    specifications: { ...form.specifications, screenSize: e.target.value }
                  })}
                  className="text-xs border border-gray-200 rounded-xl p-2.5"
                />
                <input
                  type="text"
                  placeholder="Processor (e.g. Apple A19 Pro Bionic)"
                  value={form.specifications.processor}
                  onChange={(e) => setForm({
                    ...form,
                    specifications: { ...form.specifications, processor: e.target.value }
                  })}
                  className="text-xs border border-gray-200 rounded-xl p-2.5"
                />
                <input
                  type="text"
                  placeholder="Rear Camera (e.g. 48MP + 48MP + 48MP)"
                  value={form.specifications.rearCamera}
                  onChange={(e) => setForm({
                    ...form,
                    specifications: { ...form.specifications, rearCamera: e.target.value }
                  })}
                  className="text-xs border border-gray-200 rounded-xl p-2.5"
                />
                <input
                  type="text"
                  placeholder="Front Camera (e.g. 18MP Center Stage)"
                  value={form.specifications.frontCamera}
                  onChange={(e) => setForm({
                    ...form,
                    specifications: { ...form.specifications, frontCamera: e.target.value }
                  })}
                  className="text-xs border border-gray-200 rounded-xl p-2.5"
                />
              </div>
            </div>

            {/* Variants Section */}
            <div className="border-t border-gray-100 pt-5">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Product Variants (Min 2 Required)
                  </h3>
                  <p className="text-[11px] text-gray-500">Each variant configures its own storage, color, and EMI tiers</p>
                </div>
                <button
                  type="button"
                  onClick={addVariantRow}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Variant
                </button>
              </div>

              {form.variants.map((v, vIdx) => (
                <div key={vIdx} className="p-4 bg-gray-50/80 rounded-2xl mb-4 border border-gray-200/80 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-gray-800">
                      Variant #{vIdx + 1}: {v.storage || 'Empty Storage'} • {v.colorName || 'Unspecified Color'}
                    </span>
                    {form.variants.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeVariantRow(vIdx)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold block mb-0.5">Storage</label>
                      <input
                        type="text"
                        required
                        list="db-storages"
                        placeholder="e.g. 256GB"
                        value={v.storage}
                        onChange={(e) => handleVariantChange(vIdx, 'storage', e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold block mb-0.5">RAM</label>
                      <input
                        type="text"
                        list="db-rams"
                        placeholder="e.g. 12GB"
                        value={v.ram}
                        onChange={(e) => handleVariantChange(vIdx, 'ram', e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold block mb-0.5">Color Name</label>
                      <input
                        type="text"
                        required
                        list="db-colornames"
                        placeholder="e.g. Silver"
                        value={v.colorName}
                        onChange={(e) => handleVariantChange(vIdx, 'colorName', e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold block mb-0.5">Color Hex</label>
                      <div className="flex gap-1.5 items-center">
                        <input
                          type="color"
                          value={v.colorHex?.startsWith('#') ? v.colorHex : `#${v.colorHex || '000000'}`}
                          onChange={(e) => handleVariantChange(vIdx, 'colorHex', e.target.value)}
                          className="w-8 h-8 rounded border p-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={v.colorHex}
                          onChange={(e) => handleVariantChange(vIdx, 'colorHex', e.target.value)}
                          className="w-full text-xs border border-gray-200 rounded-lg p-2 font-mono bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold block mb-0.5">MRP (₹)</label>
                      <input
                        type="number"
                        required
                        placeholder="134900"
                        value={v.mrp}
                        onChange={(e) => handleVariantChange(vIdx, 'mrp', Number(e.target.value))}
                        className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold block mb-0.5">
                        Selling Price (₹) <span className="text-orange-600 font-bold">*Calculates EMI</span>
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="128990"
                        value={v.sellingPrice}
                        onChange={(e) => handleVariantChange(vIdx, 'sellingPrice', Number(e.target.value))}
                        className="w-full text-xs border border-gray-200 rounded-lg p-2 font-black text-gray-900 bg-white"
                      />
                    </div>
                  </div>

                  {/* Multi-image photo upload */}
                  <div className="bg-white p-3 rounded-xl border border-dashed border-gray-300">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1 cursor-pointer">
                      <UploadCloud className="w-4 h-4 text-orange-500" />
                      <span>Upload Photos for {v.colorName || `Variant #${vIdx + 1}`}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleMultipleImageUpload(vIdx, e.target.files)}
                        className="hidden"
                      />
                    </label>

                    {v.images?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-gray-100">
                        {v.images.map((imgUrl, imgIdx) => (
                          <div key={imgIdx} className="relative group w-12 h-12 rounded-lg border overflow-hidden bg-gray-50">
                            <img
                              src={resolveMediaUrl(imgUrl, 'https://via.placeholder.com/80x80?text=NA')}
                              alt="thumbnail"
                              className="w-full h-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => removeVariantImage(vIdx, imgIdx)}
                              className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Variant EMI Plans Configurator */}
            <div className="border-t border-gray-100 pt-5">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Variant-Specific EMI Plans
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Select which variant's EMI breakdown you are customizing
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600">Active:</span>
                  <select
                    value={activeVariantForEmi}
                    onChange={(e) => setActiveVariantForEmi(Number(e.target.value))}
                    className="text-xs font-bold border border-orange-400 bg-orange-50 text-orange-900 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
                  >
                    {form.variants.map((v, i) => (
                      <option key={i} value={i}>
                        Variant #{i + 1} ({v.storage || 'No Storage'} - {v.colorName || 'No Color'} - ₹{v.sellingPrice || 0})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                {currentActiveVariant?.emiPlans?.map((emi, eIdx) => (
                  <div key={eIdx} className="grid grid-cols-5 gap-2 items-center bg-gray-50/80 p-2.5 rounded-xl border border-gray-200/80">
                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold block">Monthly ₹</label>
                      <input
                        type="number"
                        required
                        value={emi.monthlyAmount}
                        onChange={(e) => handleEmiFieldChange(eIdx, 'monthlyAmount', e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded p-1.5 font-bold bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold block">Tenure (Mo)</label>
                      <input
                        type="number"
                        required
                        value={emi.tenureMonths}
                        onChange={(e) => handleEmiFieldChange(eIdx, 'tenureMonths', e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded p-1.5 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold block">Interest (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={emi.interestRate}
                        onChange={(e) => handleEmiFieldChange(eIdx, 'interestRate', e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded p-1.5 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold block">Cashback (₹)</label>
                      <input
                        type="number"
                        value={emi.cashback}
                        onChange={(e) => handleEmiFieldChange(eIdx, 'cashback', e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded p-1.5 bg-white"
                      />
                    </div>
                    <div className="text-right pt-3">
                      {currentActiveVariant.emiPlans.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEmiRowFromActiveVariant(eIdx)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-between items-center">
                <button
                  type="button"
                  onClick={addEmiRowToActiveVariant}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New EMI Tier
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className={`w-full text-white font-bold py-3.5 rounded-xl shadow-md transition duration-150 cursor-pointer ${
                editingId ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {editingId ? 'Save & Update Product' : 'Publish Product to Catalog'}
            </button>
          </form>
        </div>

        {/* Right Inventory Column with Hover Edit Action */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm sticky top-24">
            <h2 className="text-base font-bold text-gray-900 mb-1">Catalog Inventory</h2>
            <p className="text-xs text-gray-500 mb-4">Hover over any product to edit or delete</p>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {products.map((p) => {
                const isSelectedForEdit = editingId === p._id;
                return (
                  <div
                    key={p._id}
                    className={`group relative p-3.5 rounded-2xl border transition-all duration-200 flex justify-between items-center ${
                      isSelectedForEdit
                        ? 'bg-orange-50/60 border-orange-400 ring-1 ring-orange-300'
                        : 'bg-gray-50/70 border-gray-200 hover:border-gray-300 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-orange-600 transition">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-gray-500">/{p.slug}</p>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {p.variants?.length} variants configured
                      </span>
                    </div>

                    {/* Action buttons that fade in smoothly on hover */}
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        type="button"
                        title="Edit Product"
                        onClick={() => startEditingProduct(p)}
                        className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        title="Delete Product"
                        onClick={() => handleDeleteProduct(p._id)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}