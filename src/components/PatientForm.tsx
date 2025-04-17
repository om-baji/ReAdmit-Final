
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Patient, patients, departments, diagnoses, comorbidityList, riskFactorList, insuranceTypes } from '@/data/readmissionData';
import { toast } from 'sonner';

// Form schema for validation
const patientFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  age: z.coerce.number().min(18).max(120),
  gender: z.enum(["Male", "Female", "Other"]),
  diagnosis: z.string().min(1, { message: "Please select a diagnosis" }),
  admissionDate: z.string().min(1, { message: "Please enter admission date" }),
  dischargeDate: z.string().optional(),
  department: z.string().min(1, { message: "Please select a department" }),
  insurance: z.string().min(1, { message: "Please select an insurance type" }),
  lengthOfStay: z.coerce.number().min(1).max(365),
  readmitted: z.boolean().default(false),
  readmissionDate: z.string().optional(),
  riskFactors: z.array(z.string()).default([]),
  comorbidities: z.array(z.string()).default([])
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (data: PatientFormValues) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ patient, onSubmit }) => {
  const navigate = useNavigate();
  const [selectedRiskFactors, setSelectedRiskFactors] = useState<string[]>(
    patient?.riskFactors || []
  );
  const [selectedComorbidities, setSelectedComorbidities] = useState<string[]>(
    patient?.comorbidities || []
  );
  
  // Default values for the form
  const defaultValues: Partial<PatientFormValues> = {
    name: patient?.name || '',
    age: patient?.age || 30,
    gender: patient?.gender || 'Male',
    diagnosis: patient?.diagnosis || '',
    admissionDate: patient?.admissionDate || new Date().toISOString().split('T')[0],
    dischargeDate: patient?.dischargeDate || '',
    department: patient?.department || '',
    insurance: patient?.insurance || '',
    lengthOfStay: patient?.lengthOfStay || 1,
    readmitted: patient?.readmitted || false,
    readmissionDate: patient?.readmissionDate || '',
    riskFactors: patient?.riskFactors || [],
    comorbidities: patient?.comorbidities || []
  };

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues
  });
  
  const handleFormSubmit = (data: PatientFormValues) => {
    data.riskFactors = selectedRiskFactors;
    data.comorbidities = selectedComorbidities;
    onSubmit(data);
  };
  
  const toggleRiskFactor = (factor: string) => {
    setSelectedRiskFactors(current => 
      current.includes(factor) 
        ? current.filter(f => f !== factor)
        : [...current, factor]
    );
  };
  
  const toggleComorbidity = (comorbidity: string) => {
    setSelectedComorbidities(current => 
      current.includes(comorbidity) 
        ? current.filter(c => c !== comorbidity)
        : [...current, comorbidity]
    );
  };
  
  const watchReadmitted = form.watch("readmitted");
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter patient name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" min={18} max={120} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="diagnosis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diagnosis</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select diagnosis" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {diagnoses.map((diagnosis) => (
                      <SelectItem key={diagnosis} value={diagnosis}>{diagnosis}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department} value={department}>{department}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="insurance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insurance</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select insurance" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {insuranceTypes.map((insurance) => (
                      <SelectItem key={insurance} value={insurance}>{insurance}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="admissionDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admission Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dischargeDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discharge Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lengthOfStay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Length of Stay (days)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="readmitted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Patient was readmitted
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          {watchReadmitted && (
            <FormField
              control={form.control}
              name="readmissionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Readmission Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <FormLabel>Risk Factors</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
              {riskFactorList.map((factor) => (
                <div 
                  key={factor} 
                  className={`
                    cursor-pointer p-2 rounded-md text-sm
                    ${selectedRiskFactors.includes(factor) 
                      ? 'bg-red-100 text-red-700 border border-red-200' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200'}
                  `}
                  onClick={() => toggleRiskFactor(factor)}
                >
                  {factor}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <FormLabel>Comorbidities</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
              {comorbidityList.map((comorbidity) => (
                <div 
                  key={comorbidity} 
                  className={`
                    cursor-pointer p-2 rounded-md text-sm
                    ${selectedComorbidities.includes(comorbidity) 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200'}
                  `}
                  onClick={() => toggleComorbidity(comorbidity)}
                >
                  {comorbidity}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit">Save Patient</Button>
        </div>
      </form>
    </Form>
  );
};

export default PatientForm;
