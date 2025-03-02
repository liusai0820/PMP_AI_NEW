"use client";

import React, { useState, useEffect } from "react";
import { getMockActivities } from "@/lib/mockData";

interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: string;
}

export default function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取模拟活动数据
    const fetchActivities = async () => {
      try {
        const data = await getMockActivities();
        setActivities(data);
      } catch (error) {
        console.error("获取活动数据失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return <div className="p-4">加载中...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">最近活动</h2>
      <div className="flow-root">
        <ul className="-mb-8">
          {activities && activities.length > 0 ? (
            activities.map((activity, index) => (
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
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        {/* 图标根据活动类型显示 */}
                        <svg
                          className="h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-800">{activity.title}</p>
                        <p className="text-xs text-gray-500">
                          {activity.description}
                        </p>
                      </div>
                      <div className="text-right text-xs whitespace-nowrap text-gray-500">
                        <time dateTime={activity.timestamp}>
                          {activity.timestamp}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li>
              <div className="text-center py-4 text-gray-500">暂无活动</div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
} 