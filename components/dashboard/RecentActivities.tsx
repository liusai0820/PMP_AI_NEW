"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getMockActivities } from "@/lib/mockData";

interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'complete' | 'comment' | 'assign';
  priority: 'high' | 'medium' | 'low' | 'none';
  projectId: string;
  projectName: string;
}

export default function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取模拟活动数据
    const fetchActivities = async () => {
      try {
        const data = await getMockActivities();
        // 使用类型断言确保数据类型兼容
        setActivities(data as Activity[]);
      } catch (error) {
        console.error("获取活动数据失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // 获取活动类型对应的图标和颜色
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create':
        return {
          icon: (
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          ),
          bgColor: 'bg-green-500'
        };
      case 'update':
        return {
          icon: (
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          ),
          bgColor: 'bg-blue-500'
        };
      case 'delete':
        return {
          icon: (
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          ),
          bgColor: 'bg-red-500'
        };
      case 'complete':
        return {
          icon: (
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          bgColor: 'bg-green-600'
        };
      case 'comment':
        return {
          icon: (
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          ),
          bgColor: 'bg-indigo-500'
        };
      case 'assign':
        return {
          icon: (
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
          bgColor: 'bg-purple-500'
        };
      default:
        return {
          icon: (
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          bgColor: 'bg-gray-500'
        };
    }
  };

  // 获取优先级对应的样式和文本
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">高优先级</span>;
      case 'medium':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">中优先级</span>;
      case 'low':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">低优先级</span>;
      default:
        return null;
    }
  };

  // 将时间戳转换为相对时间
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - activityTime.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}秒前`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}分钟前`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}小时前`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays}天前`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths}个月前`;
    }
    
    return `${Math.floor(diffInMonths / 12)}年前`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">最近活动</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="rounded-full bg-gray-300 h-8 w-8"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">最近活动</h2>
      <div className="flow-root">
        <ul className="-mb-8">
          {activities && activities.length > 0 ? (
            activities.map((activity, index) => {
              const { icon, bgColor } = getActivityIcon(activity.type);
              const priorityBadge = getPriorityBadge(activity.priority);
              const relativeTime = getRelativeTime(activity.timestamp);
              
              return (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {index < activities.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      ></span>
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full ${bgColor} flex items-center justify-center ring-8 ring-white`}>
                          {icon}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            {priorityBadge && <div className="ml-2">{priorityBadge}</div>}
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {activity.description}
                          </p>
                          <div className="mt-1">
                            <Link href={`/dashboard/projects/${activity.projectId}`} className="text-xs text-blue-600 hover:underline">
                              {activity.projectName}
                            </Link>
                          </div>
                        </div>
                        <div className="text-right text-xs whitespace-nowrap text-gray-500">
                          <time dateTime={activity.timestamp} title={new Date(activity.timestamp).toLocaleString()}>
                            {relativeTime}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <li>
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2">暂无活动记录</p>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
} 