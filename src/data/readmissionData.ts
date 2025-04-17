
// Types for our data structures
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  diagnosis: string;
  admissionDate: string;
  dischargeDate: string;
  readmitted: boolean;
  readmissionDate?: string;
  riskScore: number;
  riskFactors: string[];
  comorbidities: string[];
  department: string;
  insurance: string;
  lengthOfStay: number;
}

export interface Department {
  name: string;
  readmissionRate: number;
  avgLengthOfStay: number;
  totalPatients: number;
}

export interface ReadmissionTrend {
  month: string;
  readmissionRate: number;
  totalDischarges: number;
}

// Generate a realistic dataset
export const diagnoses = [
  'Heart Failure', 'Pneumonia', 'COPD', 'Diabetes', 'Stroke', 
  'Urinary Tract Infection', 'Sepsis', 'Kidney Failure', 'Gastrointestinal Bleeding',
  'Cardiac Arrhythmia'
];

export const departments = [
  'Cardiology', 'Pulmonology', 'Neurology', 'Gastroenterology', 
  'Nephrology', 'Internal Medicine', 'Geriatrics', 'Oncology'
];

export const insuranceTypes = [
  'Medicare', 'Medicaid', 'Private', 'Self-Pay', 'Other'
];

export const comorbidityList = [
  'Hypertension', 'Diabetes', 'Obesity', 'COPD', 'Depression',
  'Chronic Kidney Disease', 'Congestive Heart Failure', 'Atrial Fibrillation',
  'Coronary Artery Disease', 'Dementia', 'Cancer', 'Arthritis'
];

// Risk factors that can lead to readmission
export const riskFactorList = [
  'Multiple Medications', 'Poor Social Support', 'History of Readmission',
  'Low Health Literacy', 'Complex Treatment Regimen', 'Depression',
  'Poor Nutrition', 'Medication Non-adherence', 'Limited Access to Care',
  'Substance Abuse'
];

// Generate a random date within range
const randomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

// Random subset of array
const randomSubset = <T>(array: T[], max: number): T[] => {
  const count = Math.floor(Math.random() * max) + 1;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate patients
export const generatePatients = (count: number): Patient[] => {
  const patients: Patient[] = [];
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  for (let i = 0; i < count; i++) {
    const admissionDate = randomDate(oneYearAgo, today);
    const admissionDateTime = new Date(admissionDate);
    
    // Length of stay between 1 and 14 days
    const lengthOfStay = Math.floor(Math.random() * 14) + 1;
    const dischargeDateObj = new Date(admissionDateTime);
    dischargeDateObj.setDate(dischargeDateObj.getDate() + lengthOfStay);
    const dischargeDate = dischargeDateObj.toISOString().split('T')[0];
    
    // 30% chance of readmission within 30 days
    const readmitted = Math.random() < 0.3;
    let readmissionDate;
    
    if (readmitted) {
      const readmissionDateObj = new Date(dischargeDateObj);
      readmissionDateObj.setDate(readmissionDateObj.getDate() + Math.floor(Math.random() * 30) + 1);
      readmissionDate = readmissionDateObj.toISOString().split('T')[0];
    }
    
    // Risk score from 0-100
    const riskScore = Math.floor(Math.random() * 101);
    
    // Generate more risk factors for patients with higher risk scores
    const maxRiskFactors = Math.floor(riskScore / 20) + 1;
    const riskFactors = randomSubset(riskFactorList, maxRiskFactors);
    
    // Generate comorbidities - more likely with higher risk
    const maxComorbidities = Math.floor(riskScore / 15) + 1;
    const comorbidities = randomSubset(comorbidityList, maxComorbidities);
    
    patients.push({
      id: `P${10000 + i}`,
      name: `Patient ${10000 + i}`,
      age: Math.floor(Math.random() * 50) + 30, // Ages 30-80
      gender: Math.random() < 0.48 ? 'Male' : Math.random() < 0.96 ? 'Female' : 'Other',
      diagnosis: diagnoses[Math.floor(Math.random() * diagnoses.length)],
      admissionDate,
      dischargeDate,
      readmitted,
      readmissionDate,
      riskScore,
      riskFactors,
      comorbidities,
      department: departments[Math.floor(Math.random() * departments.length)],
      insurance: insuranceTypes[Math.floor(Math.random() * insuranceTypes.length)],
      lengthOfStay
    });
  }
  
  return patients;
};

// Generate department statistics
export const generateDepartmentStats = (): Department[] => {
  return departments.map(dept => ({
    name: dept,
    readmissionRate: Math.random() * 0.3 + 0.05, // 5-35%
    avgLengthOfStay: Math.random() * 6 + 2, // 2-8 days
    totalPatients: Math.floor(Math.random() * 500) + 100 // 100-600 patients
  }));
};

// Generate monthly trends for the past year
export const generateMonthlyTrends = (): ReadmissionTrend[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  return Array.from({ length: 12 }, (_, i) => {
    const monthIndex = (currentMonth - 11 + i) % 12;
    return {
      month: months[monthIndex],
      readmissionRate: Math.random() * 0.25 + 0.1, // 10-35%
      totalDischarges: Math.floor(Math.random() * 300) + 100 // 100-400 discharges
    };
  });
};

// Pre-generate our dataset
export const patients = generatePatients(200);
export const departmentStats = generateDepartmentStats();
export const monthlyTrends = generateMonthlyTrends();

// Utility function to calculate stats
export const calculateStats = () => {
  const totalPatients = patients.length;
  const readmittedPatients = patients.filter(p => p.readmitted).length;
  const readmissionRate = readmittedPatients / totalPatients;
  
  const avgLengthOfStay = patients.reduce((sum, p) => sum + p.lengthOfStay, 0) / totalPatients;
  
  const highRiskPatients = patients.filter(p => p.riskScore >= 70).length;
  
  return {
    totalPatients,
    readmittedPatients,
    readmissionRate,
    avgLengthOfStay,
    highRiskPatients
  };
};

// Risk factor analysis
export const analyzeRiskFactors = () => {
  const riskFactorCounts: Record<string, { total: number, readmitted: number }> = {};
  
  // Initialize counts
  riskFactorList.forEach(factor => {
    riskFactorCounts[factor] = { total: 0, readmitted: 0 };
  });
  
  // Count occurrences
  patients.forEach(patient => {
    patient.riskFactors.forEach(factor => {
      riskFactorCounts[factor].total++;
      if (patient.readmitted) {
        riskFactorCounts[factor].readmitted++;
      }
    });
  });
  
  // Calculate readmission rates per risk factor
  return Object.entries(riskFactorCounts).map(([factor, counts]) => ({
    factor,
    total: counts.total,
    readmitted: counts.readmitted,
    rate: counts.total > 0 ? counts.readmitted / counts.total : 0
  })).sort((a, b) => b.rate - a.rate);
};

// Demographic analysis
export const analyzeDemographics = () => {
  // Age groups
  const ageGroups = [
    { name: '30-40', min: 30, max: 40, count: 0, readmitted: 0 },
    { name: '41-50', min: 41, max: 50, count: 0, readmitted: 0 },
    { name: '51-60', min: 51, max: 60, count: 0, readmitted: 0 },
    { name: '61-70', min: 61, max: 70, count: 0, readmitted: 0 },
    { name: '71-80', min: 71, max: 80, count: 0, readmitted: 0 }
  ];
  
  // Gender counts
  const genderCounts = {
    Male: { count: 0, readmitted: 0 },
    Female: { count: 0, readmitted: 0 },
    Other: { count: 0, readmitted: 0 }
  };
  
  // Insurance type counts
  const insuranceCounts: Record<string, { count: number, readmitted: number }> = {};
  insuranceTypes.forEach(type => {
    insuranceCounts[type] = { count: 0, readmitted: 0 };
  });
  
  // Process patients
  patients.forEach(patient => {
    // Age groups
    const ageGroup = ageGroups.find(g => patient.age >= g.min && patient.age <= g.max);
    if (ageGroup) {
      ageGroup.count++;
      if (patient.readmitted) {
        ageGroup.readmitted++;
      }
    }
    
    // Gender
    genderCounts[patient.gender].count++;
    if (patient.readmitted) {
      genderCounts[patient.gender].readmitted++;
    }
    
    // Insurance
    insuranceCounts[patient.insurance].count++;
    if (patient.readmitted) {
      insuranceCounts[patient.insurance].readmitted++;
    }
  });
  
  return {
    ageGroups: ageGroups.map(group => ({
      ...group,
      rate: group.count > 0 ? group.readmitted / group.count : 0
    })),
    genders: Object.entries(genderCounts).map(([gender, data]) => ({
      gender,
      count: data.count,
      readmitted: data.readmitted,
      rate: data.count > 0 ? data.readmitted / data.count : 0
    })),
    insuranceTypes: Object.entries(insuranceCounts).map(([type, data]) => ({
      type,
      count: data.count,
      readmitted: data.readmitted,
      rate: data.count > 0 ? data.readmitted / data.count : 0
    }))
  };
};
