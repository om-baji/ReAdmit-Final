
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const getPatients = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`/patients?page=${page}&limit=${limit}`);
  return response.data;
};

export const getPatientById = async (id: string) => {
  const response = await api.get(`/patients/${id}`);
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
  });
};

export const usePatients = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['patients', page, limit],
    queryFn: () => getPatients(page, limit),
    staleTime: 1000 * 60 * 5,
  });
};

export const usePatient = (id: string) => {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => getPatientById(id),
    enabled: !!id,
  });
};

export const useAnalytics = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: getAnalytics,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 15,
  });
};

export default api;
