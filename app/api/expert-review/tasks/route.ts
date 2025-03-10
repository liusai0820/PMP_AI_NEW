import { NextRequest, NextResponse } from 'next/server';

// 定义评审任务接口
interface ReviewTask {
  id: string;
  projectId: string;
  projectName: string;
  expertId: string;
  expertName: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
  deadline: string;
  comments?: string;
}

// 模拟数据库
let tasks: ReviewTask[] = [
  {
    id: '1',
    projectId: '101',
    projectName: '智能制造数字化转型项目',
    expertId: '201',
    expertName: '张教授',
    status: 'completed',
    createdAt: '2023-12-01',
    deadline: '2023-12-15',
    comments: '项目整体规划合理，技术路线清晰，建议加强数据安全方面的考虑。'
  },
  {
    id: '2',
    projectId: '102',
    projectName: '新能源电池研发项目',
    expertId: '202',
    expertName: '李研究员',
    status: 'pending',
    createdAt: '2024-02-15',
    deadline: '2024-03-01'
  },
  {
    id: '3',
    projectId: '103',
    projectName: '智慧城市基础设施建设',
    expertId: '203',
    expertName: '王工程师',
    status: 'accepted',
    createdAt: '2024-01-20',
    deadline: '2024-02-20'
  }
];

/**
 * 获取评审任务列表
 */
export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const expertId = searchParams.get('expertId');
    const status = searchParams.get('status');
    
    // 根据查询参数过滤任务
    let filteredTasks = [...tasks];
    
    if (projectId) {
      filteredTasks = filteredTasks.filter(task => task.projectId === projectId);
    }
    
    if (expertId) {
      filteredTasks = filteredTasks.filter(task => task.expertId === expertId);
    }
    
    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }
    
    return NextResponse.json(filteredTasks, { status: 200 });
  } catch (error) {
    console.error('获取评审任务失败:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: '获取评审任务失败',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * 创建评审任务
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求
    const data = await request.json();
    const { projectId, projectName, expertIds } = data;
    
    if (!projectId || !projectName || !expertIds || !Array.isArray(expertIds) || expertIds.length === 0) {
      return NextResponse.json(
        { error: '请提供项目ID、项目名称和专家ID列表' },
        { status: 400 }
      );
    }
    
    // 模拟专家数据
    const experts = [
      { id: '1', name: '张智能' },
      { id: '2', name: '李数据' },
      { id: '3', name: '王工程' },
      { id: '4', name: '赵学者' },
      { id: '5', name: '钱专家' }
    ];
    
    // 创建新任务
    const newTasks: ReviewTask[] = [];
    
    for (const expertId of expertIds) {
      const expert = experts.find(e => e.id === expertId);
      
      if (expert) {
        const today = new Date();
        const deadline = new Date();
        deadline.setDate(today.getDate() + 14); // 设置截止日期为两周后
        
        const newTask: ReviewTask = {
          id: `${tasks.length + newTasks.length + 1}`,
          projectId,
          projectName,
          expertId,
          expertName: expert.name,
          status: 'pending',
          createdAt: today.toISOString().split('T')[0],
          deadline: deadline.toISOString().split('T')[0]
        };
        
        newTasks.push(newTask);
      }
    }
    
    // 添加到任务列表
    tasks = [...tasks, ...newTasks];
    
    return NextResponse.json(
      { 
        success: true,
        message: `成功创建${newTasks.length}个评审任务`,
        tasks: newTasks
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('创建评审任务失败:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: '创建评审任务失败',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * 更新评审任务状态
 */
export async function PUT(request: NextRequest) {
  try {
    // 解析请求
    const data = await request.json();
    const { taskId, status, comments } = data;
    
    if (!taskId || !status) {
      return NextResponse.json(
        { error: '请提供任务ID和状态' },
        { status: 400 }
      );
    }
    
    // 查找任务
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: '未找到指定任务' },
        { status: 404 }
      );
    }
    
    // 更新任务
    const updatedTask = {
      ...tasks[taskIndex],
      status,
      ...(comments && { comments })
    };
    
    tasks[taskIndex] = updatedTask;
    
    return NextResponse.json(
      { 
        success: true,
        message: '评审任务更新成功',
        task: updatedTask
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('更新评审任务失败:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: '更新评审任务失败',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 