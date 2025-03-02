import { NextResponse } from 'next/server';

// 模拟项目数据
const projectsData = [
  {
    id: 1,
    name: 'PMP.AI平台开发',
    description: '开发智能项目管理平台，集成AI功能',
    status: '进行中',
    progress: 75,
    startDate: '2023-07-15',
    dueDate: '2023-12-30',
    manager: '张三',
    members: ['李四', '王五', '赵六', '钱七'],
    priority: '高',
    type: '软件开发'
  },
  {
    id: 2,
    name: '市场推广活动',
    description: '策划并执行产品市场推广活动',
    status: '进行中',
    progress: 45,
    startDate: '2023-09-01',
    dueDate: '2023-11-15',
    manager: '李四',
    members: ['王五', '赵六'],
    priority: '中',
    type: '市场营销'
  },
  {
    id: 3,
    name: '用户体验优化',
    description: '优化产品用户界面和交互体验',
    status: '已完成',
    progress: 100,
    startDate: '2023-08-10',
    dueDate: '2023-10-20',
    manager: '王五',
    members: ['赵六', '钱七', '孙八'],
    priority: '中',
    type: '产品设计'
  },
  {
    id: 4,
    name: '数据分析系统',
    description: '构建数据分析和可视化系统',
    status: '延期',
    progress: 60,
    startDate: '2023-07-01',
    dueDate: '2023-10-10',
    manager: '赵六',
    members: ['钱七', '孙八', '周九'],
    priority: '高',
    type: '软件开发'
  },
  {
    id: 5,
    name: '产品需求调研',
    description: '进行市场调研，收集用户需求',
    status: '已完成',
    progress: 100,
    startDate: '2023-06-15',
    dueDate: '2023-08-15',
    manager: '钱七',
    members: ['孙八', '周九', '吴十'],
    priority: '中',
    type: '研究项目'
  },
  {
    id: 6,
    name: '移动应用开发',
    description: '开发iOS和Android移动应用',
    status: '进行中',
    progress: 30,
    startDate: '2023-09-15',
    dueDate: '2024-01-15',
    manager: '孙八',
    members: ['周九', '吴十', '郑十一'],
    priority: '高',
    type: '软件开发'
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  
  // 过滤数据
  let filteredProjects = [...projectsData];
  
  if (status) {
    filteredProjects = filteredProjects.filter(project => project.status === status);
  }
  
  if (type) {
    filteredProjects = filteredProjects.filter(project => project.type === type);
  }
  
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json(filteredProjects);
}

export async function POST(request: Request) {
  try {
    const newProject = await request.json();
    
    // 模拟添加新项目
    const project = {
      id: projectsData.length + 1,
      ...newProject,
      progress: 0
    };
    
    // 在实际应用中，这里会将数据保存到数据库
    // 这里只是模拟成功响应
    
    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request data' }, { status: 400 });
  }
} 