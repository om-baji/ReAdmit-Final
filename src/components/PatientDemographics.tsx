
import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { analyzeDemographics } from '../data/readmissionData';

const PatientDemographics: React.FC = () => {
  const demographics = analyzeDemographics();
  
  // Colors for charts
  const COLORS = ['#0074d9', '#39cccc', '#3d9970', '#ffdc00', '#ff851b'];
  const GENDER_COLORS = {
    'Male': '#0074d9',
    'Female': '#ff7675',
    'Other': '#6c5ce7'
  };
  
  // Convert rates to percentages for better visualization
  const ageData = demographics.ageGroups.map(group => ({
    ...group,
    rate: (group.rate * 100).toFixed(1)
  }));
  
  const genderData = demographics.genders.map(gender => ({
    ...gender,
    rate: (gender.rate * 100).toFixed(1)
  }));
  
  const insuranceData = demographics.insuranceTypes.map(insurance => ({
    ...insurance,
    rate: (insurance.rate * 100).toFixed(1)
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3 className="text-lg font-medium">Readmission by Age Group</h3>
        </div>
        <div className="dashboard-card-body h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" label={{ value: 'Patient Count', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Rate (%)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="count" name="Total Patients" fill="#0074d9" />
              <Bar yAxisId="left" dataKey="readmitted" name="Readmitted" fill="#ff4136" />
              <Bar yAxisId="right" dataKey="rate" name="Readmission Rate (%)" fill="#2ecc40" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3 className="text-lg font-medium">Gender Distribution</h3>
        </div>
        <div className="dashboard-card-body h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="gender"
                label={({ gender, count, percent }) => 
                  `${gender}: ${count} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {genderData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={GENDER_COLORS[entry.gender as keyof typeof GENDER_COLORS]} 
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="dashboard-card lg:col-span-2">
        <div className="dashboard-card-header">
          <h3 className="text-lg font-medium">Readmission by Insurance Type</h3>
        </div>
        <div className="dashboard-card-body h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={insuranceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Total Patients" fill="#0074d9" />
              <Bar dataKey="readmitted" name="Readmitted" fill="#ff4136" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PatientDemographics;
