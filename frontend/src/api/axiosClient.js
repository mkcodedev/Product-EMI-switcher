import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://product-emi-switcher.onrender.com/api',
  withCredentials: true
});

export default axiosClient;