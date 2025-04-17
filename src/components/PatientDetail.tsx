
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Activity,
  User, 
  Heart, 
  Building, 
  CreditCard,
  ArrowLeft
} from 'lucide-react';
import { patients } from '../data/readmissionData';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const PatientDetail: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  
  const patient = patients.find(p => p.id === patientId);
  
  if (!patient) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Patient Not Found</h2>
        <p className="text-gray-600 mb-6">The patient record you're looking for doesn't exist.</p>
        <Link to="/patients">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patient List
          </Button>
        </Link>
      </div>
    );
  }
  
  // Determine risk level class
  const getRiskLevelClass = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };
  
  // Determine risk level text
  const getRiskLevelText = (score: number) => {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Medium Risk';
    return 'Low Risk';
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link to="/patients">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patient List
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Summary Card */}
        <div className="lg:col-span-1">
          <div className="dashboard-card">
            <div className="dashboard-card-header flex items-center">
              <User className="h-5 w-5 mr-2" />
              <h3 className="text-lg font-medium">Patient Summary</h3>
            </div>
            <div className="dashboard-card-body">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-medical-primary bg-opacity-10 text-medical-primary mb-4">
                  <User className="h-10 w-10" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{patient.name}</h2>
                <p className="text-gray-500">{patient.age} yrs, {patient.gender}</p>
                <p className="text-gray-500 text-sm">ID: {patient.id}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Diagnosis</div>
                  <div className="font-medium">{patient.diagnosis}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Department</div>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{patient.department}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Insurance</div>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{patient.insurance}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Risk Score</div>
                  <div className="mb-2">
                    <Progress value={patient.riskScore} className="h-2" />
                  </div>
                  <div className="flex items-center">
                    <AlertTriangle className={`h-4 w-4 mr-1 ${getRiskLevelClass(patient.riskScore)}`} />
                    <span className={`font-medium ${getRiskLevelClass(patient.riskScore)}`}>
                      {patient.riskScore} - {getRiskLevelText(patient.riskScore)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stay and Readmission Details */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            {/* Stay Information */}
            <div className="dashboard-card">
              <div className="dashboard-card-header flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <h3 className="text-lg font-medium">Stay Information</h3>
              </div>
              <div className="dashboard-card-body">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Admission Date</div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{patient.admissionDate}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Discharge Date</div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{patient.dischargeDate}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Length of Stay</div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{patient.lengthOfStay} days</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">Readmission Status</div>
                  <div className="flex items-center">
                    <Activity className={`h-5 w-5 mr-2 ${patient.readmitted ? 'text-red-600' : 'text-green-600'}`} />
                    <span className={`font-medium ${patient.readmitted ? 'text-red-600' : 'text-green-600'}`}>
                      {patient.readmitted ? 'Readmitted' : 'Not Readmitted'}
                    </span>
                    
                    {patient.readmitted && patient.readmissionDate && (
                      <div className="ml-4 flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        <span>Readmitted on {patient.readmissionDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Risk Factors */}
            <div className="dashboard-card">
              <div className="dashboard-card-header flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <h3 className="text-lg font-medium">Risk Factors</h3>
              </div>
              <div className="dashboard-card-body">
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {patient.riskFactors.map((factor, index) => (
                      <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="text-sm font-medium text-gray-500 mb-2">Comorbidities</div>
                <div className="flex flex-wrap gap-2">
                  {patient.comorbidities.map((comorbidity, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Heart className="h-3 w-3 mr-1" />
                      {comorbidity}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Intervention Suggestions - Example of how the system could provide actionable insights */}
            <div className="dashboard-card">
              <div className="dashboard-card-header bg-medical-secondary text-white flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <h3 className="text-lg font-medium">Suggested Interventions</h3>
              </div>
              <div className="dashboard-card-body">
                <ul className="space-y-2">
                  {patient.riskScore >= 70 && (
                    <>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-600 mr-2">1</span>
                        <span>Schedule follow-up appointment within 7 days of discharge</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-600 mr-2">2</span>
                        <span>Coordinate with social services for post-discharge support</span>
                      </li>
                    </>
                  )}
                  
                  {patient.riskFactors.includes('Multiple Medications') && (
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 text-amber-600 mr-2">3</span>
                      <span>Conduct medication reconciliation and simplify regimen if possible</span>
                    </li>
                  )}
                  
                  {patient.riskFactors.includes('Poor Social Support') && (
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 text-amber-600 mr-2">4</span>
                      <span>Connect patient with community support resources</span>
                    </li>
                  )}
                  
                  {(patient.riskFactors.includes('Low Health Literacy') || 
                   patient.riskFactors.includes('Complex Treatment Regimen')) && (
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600 mr-2">5</span>
                      <span>Provide simplified discharge instructions with visual aids</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
