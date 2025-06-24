// src/utils/axios.js
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://kgadmin.sarithadental.com/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add a request interceptor
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('apiToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(new Error(error));
  }
);
export default axiosInstance;
