import { NextResponse } from 'next/server';

// 模拟数据库数据
const dashboardData = {
  stats: {
    totalProjects: 24,
    inProgress: 8,
    completed: 14,
    delayed: 2
  },
  projectTrends: {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
    datasets: [
      {
        name: '已完成',
        data: [3, 5, 4, 7, 5, 6]
      },
      {
        name: '进行中',
        data: [2, 3, 4, 2, 3, 2]
      }
    ]
  },
  projectTypes: [
    { type: '软件开发', count: 12 },
    { type: '市场营销', count: 5 },
    { type: '产品设计', count: 4 },
    { type: '研究项目', count: 3 }
  ],
  recentProjects: [
    { id: 1, name: 'PMP.AI平台开发', status: '进行中', progress: 75, dueDate: '2023-12-30' },
    { id: 2, name: '市场推广活动', status: '进行中', progress: 45, dueDate: '2023-11-15' },
    { id: 3, name: '用户体验优化', status: '已完成', progress: 100, dueDate: '2023-10-20' },
    { id: 4, name: '数据分析系统', status: '延期', progress: 60, dueDate: '2023-10-10' }
  ],
  recentActivities: [
    { id: 1, user: '张三', action: '更新了项目进度', project: 'PMP.AI平台开发', time: '30分钟前' },
    { id: 2, user: '李四', action: '添加了新任务', project: '市场推广活动', time: '2小时前' },
    { id: 3, user: '王五', action: '完成了任务', project: '用户体验优化', time: '昨天' },
    { id: 4, user: '赵六', action: '上传了文档', project: '数据分析系统', time: '昨天' }
  ]
};

export async function GET() {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json(dashboardData);
} 