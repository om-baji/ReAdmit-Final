
import React from 'react';
import ReadmissionStats from './ReadmissionStats';
import ReadmissionChart from './ReadmissionChart';
import PatientDemographics from './PatientDemographics';
import RiskFactorAnalysis from './RiskFactorAnalysis';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="dashboard-section">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Readmission Overview</h2>
        <ReadmissionStats />
      </div>
      
      <div className="dashboard-section">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Trends & Analytics</h2>
        <div className="grid grid-cols-1 gap-6">
          <ReadmissionChart />
          <RiskFactorAnalysis />
        </div>
      </div>
      
      <div className="dashboard-section">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Patient Demographics</h2>
        <PatientDemographics />
      </div>
    </div>
  );
};

export default Dashboard;
