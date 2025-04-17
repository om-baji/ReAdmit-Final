
import React from 'react';
import { Activity, Clock, AlertTriangle, Users } from 'lucide-react';
import { calculateStats } from '../data/readmissionData';
import { Progress } from '@/components/ui/progress';

const ReadmissionStats: React.FC = () => {
  const stats = calculateStats();
  
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
          <Progress value={stats.avgLengthOfStay * 10} className="h-2 bg-blue-100" 
                   indicatorClassName="bg-medical-secondary" />
        </div>
        <p className="mt-3 text-sm text-gray-500">
          Average duration from admission to discharge
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
            indicatorClassName="bg-medical-warning" 
          />
        </div>
        <p className="mt-3 text-sm text-gray-500">
          Patients with risk score > 70
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
            indicatorClassName="bg-gray-500" 
          />
        </div>
        <p className="mt-3 text-sm text-gray-500">
          Total patients in database
        </p>
      </div>
    </div>
  );
};

export default ReadmissionStats;
