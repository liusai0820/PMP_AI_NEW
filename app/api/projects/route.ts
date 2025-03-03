import { NextResponse } from 'next/server';

// 项目信息接口
interface ProjectInfo {
  name: string;
  code: string;
  department: string;
  manager: string;
  startDate: string;
  endDate: string;
  budget: string;
  description: string;
  objectives: string[];
  stakeholders: string[];
}

// 模拟数据库存储
const projects: ProjectInfo[] = [];

export async function POST(request: Request) {
  try {
    // 解析请求体
    const projectInfo: ProjectInfo = await request.json();
    
    // 验证必填字段
    if (!projectInfo.name || !projectInfo.code) {
      return NextResponse.json(
        { error: '项目名称和编号为必填项' },
        { status: 400 }
      );
    }
    
    // 检查项目编号是否已存在
    const existingProject = projects.find(p => p.code === projectInfo.code);
    if (existingProject) {
      return NextResponse.json(
        { error: '项目编号已存在' },
        { status: 409 }
      );
    }
    
    // 保存项目信息（模拟数据库操作）
    projects.push(projectInfo);
    
    // 返回成功响应
    return NextResponse.json({ 
      success: true,
      message: '项目创建成功',
      project: projectInfo
    });
    
  } catch (error) {
    console.error('处理请求时出错:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器内部错误' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // 获取URL参数
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    // 如果指定了项目编号，返回特定项目
    if (code) {
      const project = projects.find(p => p.code === code);
      if (!project) {
        return NextResponse.json(
          { error: '项目不存在' },
          { status: 404 }
        );
      }
      return NextResponse.json(project);
    }
    
    // 否则返回所有项目
    return NextResponse.json(projects);
    
  } catch (error) {
    console.error('处理请求时出错:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器内部错误' },
      { status: 500 }
    );
  }
} 