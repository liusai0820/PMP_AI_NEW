"use client";

import React from 'react';

interface RiskItem {
  id: string;
  description: string;
  probability: string;
  impact: string;
  response: string;
}

interface RiskItemsProps {
  risks: RiskItem[];
}

const RiskItems: React.FC<RiskItemsProps> = ({ risks }) => {
  const getProbabilityColor = (probability: string) => {
    switch (probability.toLowerCase()) {
      case '高':
        return 'bg-red-100 text-red-800';
      case '中':
        return 'bg-yellow-100 text-yellow-800';
      case '低':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case '高':
        return 'bg-red-100 text-red-800';
      case '中':
        return 'bg-yellow-100 text-yellow-800';
      case '低':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">风险项</h3>
      </div>
      
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  风险ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  描述
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  概率
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  影响
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  应对措施
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {risks.map((risk) => (
                <tr key={risk.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {risk.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {risk.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getProbabilityColor(risk.probability)}`}>
                      {risk.probability}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getImpactColor(risk.impact)}`}>
                      {risk.impact}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {risk.response}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RiskItems; 