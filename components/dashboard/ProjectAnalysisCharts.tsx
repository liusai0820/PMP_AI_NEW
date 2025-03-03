"use client";

import React, { useState } from 'react';
import { 
  ComposedChart, 
  BarChart,
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector
} from 'recharts';

interface ProjectAnalysisChartsProps {
  trendData: Array<{
    name: string;
    在建: number;
    已完成: number;
    延期: number;
    趋势: number;
  }>;
  typeData: Array<{
    name: string;
    value: number;
  }>;
  resourceData: Array<{
    name: string;
    人力资源: number;
    资金投入: number;
    设备资源: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ProjectAnalysisCharts: React.FC<ProjectAnalysisChartsProps> = ({
  trendData,
  typeData,
  resourceData
}) => {
  const [activeTab, setActiveTab] = useState<'trend' | 'type' | 'resource'>('trend');
  const [activePieIndex, setActivePieIndex] = useState(0);
  
  // 自定义饼图活跃扇区
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}个`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">项目分析</h2>
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              activeTab === 'trend' ? 'bg-white shadow' : 'hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('trend')}
          >
            趋势分析
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              activeTab === 'type' ? 'bg-white shadow' : 'hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('type')}
          >
            类型分布
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              activeTab === 'resource' ? 'bg-white shadow' : 'hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('resource')}
          >
            资源分配
          </button>
        </div>
      </div>
      
      <div className="h-80">
        {activeTab === 'trend' && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={trendData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="在建" stackId="a" fill="#3b82f6" />
              <Bar dataKey="已完成" stackId="a" fill="#10b981" />
              <Bar dataKey="延期" stackId="a" fill="#ef4444" />
              <Line type="monotone" dataKey="趋势" stroke="#8884d8" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
        
        {activeTab === 'type' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activePieIndex}
                activeShape={renderActiveShape}
                data={typeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={(_, index) => setActivePieIndex(index)}
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
        
        {activeTab === 'resource' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={resourceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="人力资源" fill="#3b82f6" />
              <Bar dataKey="资金投入" fill="#10b981" />
              <Bar dataKey="设备资源" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ProjectAnalysisCharts; 