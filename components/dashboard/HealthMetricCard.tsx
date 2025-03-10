import React from 'react';

interface HealthMetricCardProps {
  title: string;
  score: number;
  type?: 'progress' | 'quality' | 'cost';
  status: 'success' | 'warning' | 'error';
}

export function HealthMetricCard({ title, score, status }: HealthMetricCardProps) {
  const getStatusColor = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTextColor = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        <span className={`text-sm font-medium ${getTextColor(status)}`}>{score}分</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${getStatusColor(status)}`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
} 