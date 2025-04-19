
import React from 'react';
import { Activity, Clock, AlertTriangle, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useStats } from '../hooks/useApi';
import { Skeleton } from '@/components/ui/skeleton';

const ReadmissionStats: React.FC = () => {
  const { data: statsResponse, isLoading, error } = useStats();
  const stats = statsResponse?.data;
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card">
            <div className="flex items-start justify-between">
              <div className="w-full">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16 mb-4" />
                <Skeleton className="h-2 w-full mb-4" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Show error state
  if (error || !stats) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-lg">
        <p className="font-medium">Failed to load readmission statistics</p>
        <p className="text-sm mt-1">Please try refreshing the page</p>
      </div>
    );
  }

  // Format readmission rate as percentage
  const readmissionRatePercent = (stats.readmissionRate * 100).toFixed(1);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="stat-card">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Readmission Rate</p>
            <h3 className="mt-1 text-2xl font-semibold text-medical-primary">{readmissionRatePercent}%</h3>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <Activity className="h-6 w-6 text-medical-primary" />
          </div>
        </div>
        <div className="mt-3">
          <Progress value={parseFloat(readmissionRatePercent)} className="h-2" />
        </div>
        <p className="mt-3 text-sm text-gray-500">
          {stats.readmittedPatients} of {stats.totalPatients} patients readmitted
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Source: {statsResponse.source} ({statsResponse.responseTime})
        </p>
      </div>
      
      <div className="stat-card">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg. Length of Stay</p>
            <h3 className="mt-1 text-2xl font-semibold text-medical-secondary">
              {stats.avgLengthOfStay.toFixed(1)} days
            </h3>
          </div>
          <div className="p-2 bg-teal-50 rounded-lg">
            <Clock className="h-6 w-6 text-medical-secondary" />
          </div>
        </div>
        <div className="mt-3">
          <Progress value={stats.avgLengthOfStay * 10} className="h-2 bg-blue-100" />
        </div>
        <p className="mt-3 text-sm text-gray-500">
          Average duration from admission to discharge
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Source: {statsResponse.source} ({statsResponse.responseTime})
        </p>
      </div>
      
      <div className="stat-card">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">High Risk Patients</p>
            <h3 className="mt-1 text-2xl font-semibold text-medical-warning">
              {stats.highRiskPatients}
            </h3>
          </div>
          <div className="p-2 bg-orange-50 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-medical-warning" />
          </div>
        </div>
        <div className="mt-3">
          <Progress 
            value={(stats.highRiskPatients / stats.totalPatients) * 100} 
            className="h-2 bg-blue-100"
          />
        </div>
        <p className="mt-3 text-sm text-gray-500">
          Patients with risk score &gt; 70
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Source: {statsResponse.source} ({statsResponse.responseTime})
        </p>
      </div>
      
      <div className="stat-card">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Patients</p>
            <h3 className="mt-1 text-2xl font-semibold text-gray-800">
              {stats.totalPatients}
            </h3>
          </div>
          <div className="p-2 bg-gray-100 rounded-lg">
            <Users className="h-6 w-6 text-gray-600" />
          </div>
        </div>
        <div className="mt-3">
          <Progress 
            value={100} 
            className="h-2 bg-blue-100"
          />
        </div>
        <p className="mt-3 text-sm text-gray-500">
          Total patients in database
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Source: {statsResponse.source} ({statsResponse.responseTime})
        </p>
      </div>
    </div>
  );
};

export default ReadmissionStats;
