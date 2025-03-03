"use client";

import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area
} from 'recharts';

interface EnhancedStatCardProps {
  title: string;
  value: string;
  change: string;
  changePercent: number;
  icon: React.ReactNode;
  trendData: { name: string; value: number }[];
  gradientFrom: string;
  gradientTo: string;
}

const EnhancedStatCard: React.FC<EnhancedStatCardProps> = ({
  title,
  value,
  change,
  changePercent,
  icon,
  trendData,
  gradientFrom,
  gradientTo
}) => {
  const isPositive = changePercent >= 0;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 relative overflow-hidden">
      <div className="flex justify-between items-start mb-2">
        <div className="z-10">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg mr-3 ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
              {icon}
            </div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-semibold">{value}</p>
            <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
              {isPositive ? (
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              {change}
            </p>
          </div>
        </div>
        
        {/* 趋势小图 */}
        <div className="h-16 w-24 z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gradientFrom} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={gradientTo} stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={gradientFrom} 
                fillOpacity={1} 
                fill={`url(#gradient-${title})`} 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* 装饰性背景 */}
      <div 
        className="absolute -right-6 -bottom-10 w-32 h-32 rounded-full opacity-10"
        style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
      />
    </div>
  );
};

export default EnhancedStatCard; 