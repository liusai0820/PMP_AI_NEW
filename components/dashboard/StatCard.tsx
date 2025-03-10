import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  trend: number;
  type?: 'totalProjects' | 'completedProjects' | 'inProgressProjects' | 'riskProjects';
  icon?: React.ReactNode;
}

export function StatCard({ title, value, trend, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-opacity-20 bg-blue-100">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium flex items-center ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend > 0 ? (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          )}
          {Math.abs(trend)}%
        </span>
        <span className="text-gray-500 text-sm ml-2">较上月</span>
      </div>
    </div>
  );
} 