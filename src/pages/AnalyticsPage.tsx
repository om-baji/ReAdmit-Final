
import React from 'react';
import NavBar from '@/components/NavBar';
import ReadmissionChart from '@/components/ReadmissionChart';
import PatientDemographics from '@/components/PatientDemographics';
import RiskFactorAnalysis from '@/components/RiskFactorAnalysis';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-medical-dark">Advanced Analytics</h1>
          <p className="text-gray-600 mt-1">
            Analyze readmission trends, risk factors, and patient demographics in depth
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="dashboard-section">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Readmission Trends</h2>
            <ReadmissionChart />
          </div>
          
          <div className="dashboard-section">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Risk Factor Analysis</h2>
            <RiskFactorAnalysis />
          </div>
          
          <div className="dashboard-section">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Patient Demographics</h2>
            <PatientDemographics />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
