// src/apiService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

// Create an Axios instance with base URL and default headers
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${localStorage.getItem('token')}`, 
  }
});

// 🔐 Attach JWT Token Automatically
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const logOut = () => {
  window.location.href = "/login"; // Force logout
};

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
      logOut(); // Redirect to login
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    sessionStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'An error occurred';
  }
};

// Other API calls to access data
export const getPatientList = async () => {
  try {
    const response = await api.get('/api/patient');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'An error occurred';
  }
};

export const createPatient = async (data) => {
  console.log(data);
  try {
    const response = await api.post('/api/patient', data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'An error occurred';
  }
};

export const updatePatient = async (id, data) => {
  console.log(data);
  try {
    const response = await api.patch(`/api/patient/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'An error occurred';
  }
};

export const getAppointments = async () => {
  try {
    const response = await api.get('/api/appointment');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'An error occurred';
  }
};

export const createAppointment = async () => {
  try {
    const response = await api.post('/api/appointment');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'An error occurred';
  }
};
