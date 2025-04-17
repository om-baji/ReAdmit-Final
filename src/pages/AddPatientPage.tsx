
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import PatientForm from '@/components/PatientForm';
import { Patient, patients } from '@/data/readmissionData';
import { toast } from 'sonner';

const AddPatientPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleAddPatient = (data: Omit<Patient, 'id' | 'riskScore'>) => {
    // Generate a new ID
    const newId = `P${10000 + patients.length}`;
    
    // Calculate risk score based on risk factors and comorbidities
    // Simple algorithm: more risk factors and comorbidities = higher score
    const riskScore = Math.min(
      Math.floor(
        ((data.riskFactors.length * 15) + 
        (data.comorbidities.length * 10) + 
        (data.readmitted ? 30 : 0)) / 2
      ),
      100
    );
    
    // Create new patient object
    const newPatient: Patient = {
      id: newId,
      ...data,
      riskScore
    };
    
    // Add to patients array
    patients.unshift(newPatient);
    
    // Show success message
    toast.success("Patient added successfully!");
    
    // Navigate back to patient list
    navigate('/patients');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-medical-dark">Add New Patient</h1>
          <p className="text-gray-600 mt-1">
            Enter patient details to add them to the system
          </p>
        </div>
        
        <div className="dashboard-card">
          <PatientForm onSubmit={handleAddPatient} />
        </div>
      </main>
    </div>
  );
};

export default AddPatientPage;
