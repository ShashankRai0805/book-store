import axios from 'axios';
import { handleAuthError, isAuthError } from '../utils/auth';

const API = axios.create({
  baseURL: import.meta.env.PROD 
    ? '/api/v1'  // For Vercel deployment
    : 'http://localhost:1000/api/v1',  // For local development
});

// Request interceptor to add token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('id');
  
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  
  if (userId) {
    config.headers.id = userId;
  }
  
  return config;
});

// Response interceptor to handle token verification errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check for authentication errors
    if (isAuthError(error)) {
      handleAuthError();
    }
    
    return Promise.reject(error);
  }
);

export default API;
