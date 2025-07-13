import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:1000/api/v1',
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

export default API;
