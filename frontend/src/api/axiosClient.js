import axios from 'axios';

export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://product-emi-switcher.onrender.com/api').replace(/\/$/, '');
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export const resolveMediaUrl = (rawUrl, fallback) => {
  if (!rawUrl) return fallback;
  if (/^https?:\/\//i.test(rawUrl)) return rawUrl;
  return `${API_ORIGIN}/${rawUrl.replace(/^\/+/, '')}`;
};

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

export default axiosClient;