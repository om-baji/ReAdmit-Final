
import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LabelList 
} from 'recharts';
import { analyzeRiskFactors } from '../data/readmissionData';

const RiskFactorAnalysis: React.FC = () => {
  const riskFactors = analyzeRiskFactors();
  
  // Format for chart display - convert to percentages and limit to top factors
  const chartData = riskFactors
    .slice(0, 6) // Show top 6 factors
    .map(factor => ({
      ...factor,
      rate: (factor.rate * 100).toFixed(1),
      name: factor.factor // Simplify name for better display
    }));
  
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h3 className="text-lg font-medium">Top Risk Factors for Readmission</h3>
      </div>
      <div className="dashboard-card-body h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 60, left: 140, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" domain={[0, 100]} unit="%" />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={130}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Readmission Rate']}
              labelFormatter={(name) => `Risk Factor: ${name}`}
            />
            <Legend />
            <Bar 
              dataKey="rate" 
              name="Readmission Rate" 
              fill="#ff4136" 
              animationDuration={1500}
            >
              <LabelList dataKey="rate" position="right" formatter={(v) => `${v}%`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-gray-600 px-4">
          <p>The risk factors above show the strongest correlation with readmission outcomes based on historical patient data.</p>
        </div>
      </div>
    </div>
  );
};

export default RiskFactorAnalysis;
