
import React from 'react';
import NavBar from '@/components/NavBar';
import PatientDetail from '@/components/PatientDetail';

const PatientPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PatientDetail />
      </main>
    </div>
  );
};

export default PatientPage;
