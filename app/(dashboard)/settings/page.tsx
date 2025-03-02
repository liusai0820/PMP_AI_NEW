import React from 'react';

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">系统设置</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-4">个人信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                  defaultValue="管理员" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                  defaultValue="admin@pmp.ai" 
                />
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-4">通知设置</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <input 
                  id="email-notifications" 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded" 
                  defaultChecked 
                />
                <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                  接收邮件通知
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  id="project-updates" 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded" 
                  defaultChecked 
                />
                <label htmlFor="project-updates" className="ml-2 block text-sm text-gray-700">
                  项目更新提醒
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  id="report-notifications" 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded" 
                  defaultChecked 
                />
                <label htmlFor="report-notifications" className="ml-2 block text-sm text-gray-700">
                  报告分析完成通知
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-4">系统主题</h2>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                默认主题
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">
                暗色主题
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">
                高对比度
              </button>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
              保存设置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 