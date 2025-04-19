
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStats, getPatients, getPatientById, getAnalytics } from '../api/api';

// Hook for stats data
export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook for patients data with pagination
export const usePatients = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['patients', page, limit],
    queryFn: () => getPatients(page, limit),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};

// Hook for single patient details
export const usePatient = (id: string) => {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => getPatientById(id),
    enabled: !!id, // Only run if id is provided
    refetchOnWindowFocus: false,
  });
};

// Hook for analytics data
export const useAnalytics = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: getAnalytics,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 15, // 15 minutes
  });
};
