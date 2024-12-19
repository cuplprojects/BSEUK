// File created for handling API requests
// This file contains a custom Axios instance with interceptors for authentication and error handling

import axios from 'axios';

// Set the base URL for the API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an Axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - Clear token and redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error('Access denied');
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  employees: {
    list: '/employees',
    detail: (id) => `/employees/${id}`,
  },
  departments: {
    list: '/departments',
    detail: (id) => `/departments/${id}`,
  },
  roles: {
    list: '/roles',
    detail: (id) => `/roles/${id}`,
  },
  user: {
    profile: '/user/profile',
    updateProfile: '/user/profile/update',
    changePassword: '/user/change-password',
    settings: '/user/settings',
    updateSettings: '/user/settings/update',
  },
  locations: {
    list: '/locations',
    detail: (id) => `/locations/${id}`,
  },
  designations: {
    list: '/designations',
    detail: (id) => `/designations/${id}`,
  },
};

export default API;