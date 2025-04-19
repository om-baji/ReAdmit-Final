
import React from 'react';
import NavBar from '@/components/NavBar';
import PatientRecords from '@/components/PatientRecords';

const PatientsListPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-medical-dark">Patient Records</h1>
          <p className="text-gray-600 mt-1">
            View and manage patient records with readmission risk insights
          </p>
        </div>
        
        <PatientRecords />
      </main>
    </div>
  );
};

export default PatientsListPage;
