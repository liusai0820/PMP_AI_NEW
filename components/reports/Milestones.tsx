"use client";

import React from 'react';

interface Milestone {
  name: string;
  date: string;
  status: 'completed' | 'in-progress' | 'pending';
}

interface MilestonesProps {
  milestones: Milestone[];
}

const Milestones: React.FC<MilestonesProps> = ({ milestones }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'in-progress':
        return '进行中';
      case 'pending':
        return '未开始';
      default:
        return '未知';
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">项目里程碑</h3>
      </div>
      
      <div className="p-4">
        <div className="flow-root">
          <ul className="-mb-8">
            {milestones.map((milestone, index) => (
              <li key={index}>
                <div className="relative pb-8">
                  {index !== milestones.length - 1 ? (
                    <span 
                      className={`absolute top-4 left-4 -ml-px h-full w-0.5 ${
                        milestone.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                      }`} 
                      aria-hidden="true"
                    ></span>
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getStatusColor(milestone.status)}`}>
                        {milestone.status === 'completed' ? (
                          <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : milestone.status === 'in-progress' ? (
                          <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{milestone.name}</p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap">
                        <div className="text-gray-500">{milestone.date}</div>
                        <div className={`mt-1 text-xs font-medium ${
                          milestone.status === 'completed' ? 'text-green-600' : 
                          milestone.status === 'in-progress' ? 'text-blue-600' : 
                          'text-gray-500'
                        }`}>
                          {getStatusText(milestone.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Milestones; 