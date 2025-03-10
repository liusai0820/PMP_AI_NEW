import { NextRequest, NextResponse } from 'next/server';
import { projectService } from '@/lib/services/projectService';

// 获取所有项目
export async function GET() {
  try {
    const projects = await projectService.getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('获取项目列表失败:', error);
    return NextResponse.json(
      { error: '获取项目列表失败' },
      { status: 500 }
    );
  }
}

// 创建新项目
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('收到创建项目请求，数据:', JSON.stringify(data, null, 2));

    // 验证必要字段
    if (!data.name && !data.projectName) {
      console.error('项目名称未提供');
      return NextResponse.json(
        { error: '项目名称不能为空' },
        { status: 400 }
      );
    }

    // 验证其他必要字段
    const requiredFields = {
      organization: '承担单位',
      projectManager: '项目负责人',
      startDate: '开始日期',
      endDate: '结束日期'
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!data[field] || data[field] === '未提供' || data[field] === '未设置') {
        console.error(`${label}未提供或无效:`, data[field]);
        return NextResponse.json(
          { error: `${label}不能为空或无效` },
          { status: 400 }
        );
      }
    }

    // 创建项目
    console.log('开始创建项目...');
    const project = await projectService.createProject(data);
    console.log('项目创建成功:', JSON.stringify(project, null, 2));

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('创建项目失败:', error);
    return NextResponse.json(
      { 
        error: '创建项目失败',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 