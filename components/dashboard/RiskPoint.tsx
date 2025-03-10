import React from 'react';

interface RiskPointProps {
  id?: string;
  name: string;
  value: number;
  category: string;
}

export function RiskPoint({ name, value, category }: RiskPointProps) {
  const getRiskLevel = (value: number) => {
    if (value >= 300) return 'bg-red-100 text-red-800';
    if (value >= 200) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="p-3 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900 line-clamp-1">{name}</h4>
          <p className="text-sm text-gray-500">{category}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevel(value)}`}>
          风险值: {value}
        </span>
      </div>
    </div>
  );
} 