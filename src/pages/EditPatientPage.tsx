
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import PatientForm from '@/components/PatientForm';
import { Patient, patients } from '@/data/readmissionData';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const EditPatientPage: React.FC = () => {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  
  const patient = patients.find(p => p.id === patientId);
  
  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link to="/patients">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Patient List
              </Button>
            </Link>
          </div>
          
          <div className="dashboard-card p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Patient Not Found</h2>
            <p className="text-gray-600 mb-6">The patient record you're looking for doesn't exist.</p>
            <Link to="/patients">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Patient List
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }
  
  const handleUpdatePatient = (data: Omit<Patient, 'id' | 'riskScore'>) => {
    // Calculate risk score based on risk factors and comorbidities
    const riskScore = Math.min(
      Math.floor(
        ((data.riskFactors.length * 15) + 
        (data.comorbidities.length * 10) + 
        (data.readmitted ? 30 : 0)) / 2
      ),
      100
    );
    
    // Find patient index
    const patientIndex = patients.findIndex(p => p.id === patientId);
    
    if (patientIndex !== -1) {
      // Update patient data
      patients[patientIndex] = {
        ...patients[patientIndex],
        ...data,
        riskScore
      };
      
      // Show success message
      toast.success("Patient updated successfully!");
      
      // Navigate back to patient details
      navigate(`/patient/${patientId}`);
    } else {
      toast.error("Error updating patient!");
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to={`/patient/${patientId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Patient Details
            </Button>
          </Link>
        </div>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-medical-dark">Edit Patient</h1>
          <p className="text-gray-600 mt-1">
            Update information for patient {patient.name}
          </p>
        </div>
        
        <div className="dashboard-card">
          <PatientForm patient={patient} onSubmit={handleUpdatePatient} />
        </div>
      </main>
    </div>
  );
};

export default EditPatientPage;
