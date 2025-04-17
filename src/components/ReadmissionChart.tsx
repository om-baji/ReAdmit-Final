
import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { monthlyTrends } from '../data/readmissionData';

const ReadmissionChart: React.FC = () => {
  // Convert readmission rates to percentages for better visualization
  const chartData = monthlyTrends.map(item => ({
    ...item,
    readmissionRate: (item.readmissionRate * 100).toFixed(1)
  }));
  
  return (
    <div className="dashboard-card h-80">
      <div className="dashboard-card-header">
        <h3 className="text-lg font-medium">Readmission Trends (Past 12 Months)</h3>
      </div>
      <div className="dashboard-card-body h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" label={{ value: 'Discharges', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Rate (%)', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Bar 
              yAxisId="left" 
              dataKey="totalDischarges" 
              name="Total Discharges" 
              fill="#0074d9" 
              barSize={20} 
              fillOpacity={0.8} 
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="readmissionRate" 
              name="Readmission Rate (%)" 
              stroke="#ff4136" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: '#ff4136', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReadmissionChart;
