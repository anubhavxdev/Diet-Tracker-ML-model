import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { MacroNutrients } from '../types';

interface MacroChartProps {
  macros: MacroNutrients;
}

const MacroChart: React.FC<MacroChartProps> = ({ macros }) => {
  const data = [
    { name: 'Protein', value: macros.protein },
    { name: 'Carbs', value: macros.carbs },
    { name: 'Fats', value: macros.fats },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b']; // Emerald, Blue, Amber

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value}%`, '']}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MacroChart;