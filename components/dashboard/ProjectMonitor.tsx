"use client";

import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis,
  CartesianGrid, 
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Sector
} from 'recharts';

interface RiskItem {
  id: string;
  name: string;
  impact: number;  // 影响程度 (1-10)
  probability: number;  // 发生概率 (1-10)
  value: number;  // 气泡大小
  category: string;  // 风险类别
}

interface ProjectData {
  id: string;
  name: string;
  progress: number;
  status: string;
  startDate: string;
  endDate: string;
  milestones: Array<{
    name: string;
    date: string;
    status: string;
  }>;
  risks: Array<{
    type: string;
    level: string;
    description: string;
  }>;
}

interface ChartData {
  name: string;
  value: number;
}

interface ProjectMonitorProps {
  healthScore: number;  // 项目健康度分数 (0-100)
  riskMatrix: RiskItem[];  // 风险矩阵数据
}

interface PieActiveShapeProps {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: {
    name: string;
    value: number;
  };
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      category: string;
      impact: number;
      probability: number;
    };
  }>;
}

// 健康度仪表盘的活动形状渲染
const renderActiveShape = (props: any) => {
  const { 
    cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill 
  } = props;
  
  return (
    <g>
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
    </g>
  );
};

// 获取健康度对应的颜色
const getHealthColor = (score: number) => {
  if (score >= 80) return "#10b981"; // 绿色
  if (score >= 60) return "#f59e0b"; // 黄色
  return "#ef4444"; // 红色
};

// 获取风险点的颜色
const getRiskColor = (impact: number, probability: number) => {
  const riskScore = impact * probability;
  if (riskScore >= 50) return "#ef4444"; // 高风险 - 红色
  if (riskScore >= 25) return "#f59e0b"; // 中风险 - 黄色
  return "#10b981"; // 低风险 - 绿色
};

// 风险矩阵自定义提示框
const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-gray-600">类别: {data.category}</p>
        <p className="text-sm text-gray-600">影响程度: {data.impact}</p>
        <p className="text-sm text-gray-600">发生概率: {data.probability}</p>
        <p className="text-sm text-gray-600">风险值: {data.impact * data.probability}</p>
      </div>
    );
  }
  return null;
};

const ProjectMonitor: React.FC<ProjectMonitorProps> = ({ healthScore, riskMatrix }) => {
  // 健康度数据
  const healthData = [
    { name: '健康度', value: healthScore },
    { name: '剩余', value: 100 - healthScore }
  ];
  
  // 风险矩阵坐标轴标签
  const xAxisLabels = ['极低', '低', '中', '高', '极高'];
  const yAxisLabels = ['极低', '低', '中', '高', '极高'];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        项目监控大盘
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 项目健康度 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-md font-medium mb-2">项目健康度</h3>
          <div className="flex items-center justify-center">
            <div className="relative">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    activeIndex={0}
                    activeShape={renderActiveShape}
                    data={healthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={180}
                    endAngle={0}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    <Cell key="cell-0" fill={getHealthColor(healthScore)} />
                    <Cell key="cell-1" fill="#e5e7eb" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-3xl font-bold">{healthScore}</div>
                <div className="text-xs text-gray-500">健康分</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="bg-white p-2 rounded border border-gray-200 text-center">
              <div className="text-xs text-gray-500">进度</div>
              <div className="font-medium">78%</div>
            </div>
            <div className="bg-white p-2 rounded border border-gray-200 text-center">
              <div className="text-xs text-gray-500">质量</div>
              <div className="font-medium">85%</div>
            </div>
            <div className="bg-white p-2 rounded border border-gray-200 text-center">
              <div className="text-xs text-gray-500">成本</div>
              <div className="font-medium">72%</div>
            </div>
          </div>
        </div>
        
        {/* 风险矩阵 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-md font-medium mb-2">风险矩阵</h3>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="impact" 
                name="影响程度" 
                domain={[0, 10]} 
                tickCount={5}
                tick={{fontSize: 10}}
                tickFormatter={(value) => xAxisLabels[Math.floor(value/2) - 1] || ''}
              />
              <YAxis 
                type="number" 
                dataKey="probability" 
                name="发生概率" 
                domain={[0, 10]} 
                tickCount={5}
                tick={{fontSize: 10}}
                tickFormatter={(value) => yAxisLabels[Math.floor(value/2) - 1] || ''}
              />
              <ZAxis 
                type="number" 
                dataKey="value" 
                range={[50, 400]} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter name="风险点" data={riskMatrix}>
                {riskMatrix.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getRiskColor(entry.impact, entry.probability)} 
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* 风险提示 */}
      <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              当前有 <span className="font-medium">{riskMatrix.filter(item => item.impact * item.probability >= 50).length}</span> 个高风险点需要关注。
              <a href="#" className="font-medium underline text-yellow-700 hover:text-yellow-600">
                查看详情
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMonitor; 