import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Generic fetch with filtering, sorting and pagination
export const fetchData = async (endpoint, { page = 1, limit = 10, sort, filter } = {}) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    
    if (sort) {
      params.append('sort', sort);
    }
    
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        params.append(key, value);
      });
    }

    const response = await api.get(`${endpoint}?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

// Calculate bonus based on salary range
export const calculateBonus = async (salary) => {
  try {
    const response = await api.post('/calculate-bonus', { salary });
    return response.data;
  } catch (error) {
    throw new Error(`Error calculating bonus: ${error.message}`);
  }
};

// Employee specific endpoints
export const employeeAPI = {
  getAll: (params) => fetchData('/employees', params),
  getOne: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`)
};

// Department specific endpoints  
export const departmentAPI = {
  getAll: (params) => fetchData('/departments', params),
  getOne: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`)
};

// Position specific endpoints
export const positionAPI = {
  getAll: (params) => fetchData('/positions', params),
  getOne: (id) => api.get(`/positions/${id}`),
  create: (data) => api.post('/positions', data),
  update: (id, data) => api.put(`/positions/${id}`, data),
  delete: (id) => api.delete(`/positions/${id}`)
};

// Add authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
