
import axios from 'axios';

// Create axios instance with baseURL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

// Get stats
export const getStats = async () => {
  try {
    const response = await api.get('/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

// Get patients with pagination
export const getPatients = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await api.get(`/patients?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

// Get patient details by ID
export const getPatientById = async (id: string) => {
  try {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching patient ${id}:`, error);
    throw error;
  }
};

// Get analytics data
export const getAnalytics = async () => {
  try {
    const response = await api.get('/analytics');
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

export default api;
