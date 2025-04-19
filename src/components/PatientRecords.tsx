
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Search, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight,
  PlusCircle, 
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePatients } from '../hooks/useApi';
import { Skeleton } from '@/components/ui/skeleton';

const PatientRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { data: patientsResponse, isLoading, error } = usePatients(currentPage, itemsPerPage);
  
  // Local filtering for search
  const filteredPatients = patientsResponse?.data.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  const totalPages = patientsResponse?.totalPages || 1;
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="dashboard-card">
        <div className="dashboard-card-header flex justify-between items-center">
          <h3 className="text-lg font-medium">Patient Records</h3>
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="w-full h-16" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error message
  if (error || !patientsResponse) {
    return (
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3 className="text-lg font-medium">Patient Records</h3>
        </div>
        <div className="p-8 text-center">
          <div className="text-red-500 mb-4">
            <AlertTriangle size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium mb-2">Failed to load patient data</h3>
          <p className="text-gray-500 mb-4">There was an error connecting to the server</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header flex justify-between items-center">
        <h3 className="text-lg font-medium">Patient Records</h3>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search patients..."
              className="pl-8 bg-white bg-opacity-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link to="/patients/add">
            <Button className="whitespace-nowrap">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Diagnosis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admission Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                LOS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Readmitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {patient.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="font-medium">{patient.name}</div>
                  <div className="text-xs text-gray-400">{patient.age} yrs, {patient.gender}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {patient.diagnosis}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                    {patient.admissionDate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {patient.lengthOfStay} days
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {patient.readmitted ? (
                    <div className="flex items-center text-red-600">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Yes
                    </div>
                  ) : (
                    <div className="flex items-center text-green-600">
                      <XCircle className="h-4 w-4 mr-1" />
                      No
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className={`
                    px-2 py-1 rounded-full text-xs font-medium inline-block text-white
                    ${patient.riskScore >= 70 ? 'bg-red-600' : 
                      patient.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-600'}
                  `}>
                    {patient.riskScore}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Link 
                    to={`/patient/${patient.id}`} 
                    className="text-medical-primary hover:text-medical-secondary"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-4 py-2 bg-gray-50 border-t">
        <p className="text-xs text-gray-500">
          Source: {patientsResponse.source} ({patientsResponse.responseTime}) | 
          Page {currentPage} of {totalPages}
        </p>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md"
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, patientsResponse.total)}
                </span>{' '}
                of <span className="font-medium">{patientsResponse.total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = currentPage;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                        currentPage === pageNum 
                          ? 'bg-medical-primary text-white' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecords;
