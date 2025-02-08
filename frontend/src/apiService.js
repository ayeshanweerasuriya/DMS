// src/apiService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; // replace with your API base URL

// Create an Axios instance with base URL and default headers
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Optionally add Authorization if needed
    // Authorization: `Bearer ${localStorage.getItem('token')}`, 
  }
});

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
export const getAppointment = async () => {
  try {
    const response = await api.get('/api/appointment');  // Adjust the endpoint accordingly
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'An error occurred';
  }
};

// You can add more functions for other API endpoints as needed
