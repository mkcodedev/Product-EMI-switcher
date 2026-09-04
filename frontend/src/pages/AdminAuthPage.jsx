import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { KeyRound, ShieldAlert, CheckCircle2, Copy } from 'lucide-react';

export default function AdminAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFillDemo = () => {
    setFormData({
      name: 'Test Administrator',
      email: 'test@gmail.com',
      password: 'test123@',
      confirmPassword: 'test123@'
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        await axiosClient.post('/admin/login', {
          email: formData.email,
          password: formData.password
        });
        navigate('/super/admin/dashboard');
      } else {
        const res = await axiosClient.post('/admin/signup', formData);
        setSuccess(res.data.message || 'Admin account created. Log in now.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-50 px-4 py-12 gap-8">
      
      {/* Demo Credentials Helper Box */}
      <div className="max-w-xs w-full bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-3xl shadow-xl border border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <KeyRound className="w-5 h-5 text-orange-400" />
          <h3 className="font-bold text-sm tracking-wide uppercase text-orange-400">Reviewer Credentials</h3>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed mb-4">
          Use the registered test administrator credentials to test product management:
        </p>
        <div className="bg-gray-800/80 p-3 rounded-xl border border-gray-700 text-xs font-mono space-y-1 mb-4 select-text">
          <p><span className="text-gray-400">mail:</span> test@gmail.com</p>
          <p><span className="text-gray-400">password:</span> test123@</p>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition duration-150"
        >
          <Copy className="w-3.5 h-3.5" /> Auto-fill Credentials
        </button>
        <p className="text-[11px] text-gray-400 mt-3 text-center">
          Enforced security: Maximum 5 admin accounts in MongoDB.
        </p>
      </div>

      {/* Main Authentication Box */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-6">
          <div className="inline-flex bg-orange-500 text-white font-black px-3 py-1 rounded-lg text-lg mb-2">1Fi</div>
          <h2 className="text-2xl font-black text-gray-900">
            {isLogin ? 'Administrator Access' : 'Create Admin Account'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {isLogin ? 'Sign in to manage catalog, variants & EMI tiers' : 'System capped at 5 verified accounts'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-orange-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-orange-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-orange-500"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-orange-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-bold py-3 rounded-xl text-xs transition shadow-md mt-2"
          >
            {loading ? 'Authenticating...' : isLogin ? 'Sign In to Dashboard' : 'Register Administrator'}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
            className="text-xs text-orange-600 hover:underline font-semibold"
          >
            {isLogin ? 'Need an account? Sign Up (Max 5 Admins)' : 'Existing Admin? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}