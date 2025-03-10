import { NextRequest, NextResponse } from 'next/server';
import { projectService } from '@/lib/services/projectService';

// 获取单个项目详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 确保params.id存在
    if (!params?.id) {
      return NextResponse.json(
        { error: '项目ID不能为空' },
        { status: 400 }
      );
    }

    const id = params.id;
    console.log('正在获取项目详情，ID:', id);

    const project = await projectService.getProjectById(id);
    console.log('获取到的项目数据:', project);
    
    if (!project) {
      console.log('项目不存在，ID:', id);
      return NextResponse.json(
        { error: '项目不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('获取项目详情失败:', error);
    return NextResponse.json(
      { error: '获取项目详情失败' },
      { status: 500 }
    );
  }
}

// 更新项目
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: '项目ID不能为空' },
        { status: 400 }
      );
    }

    const data = await request.json();
    const project = await projectService.updateProject(id, data);
    return NextResponse.json(project);
  } catch (error) {
    console.error('更新项目失败:', error);
    return NextResponse.json(
      { error: '更新项目失败' },
      { status: 500 }
    );
  }
}

// 删除项目
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: '项目ID不能为空' },
        { status: 400 }
      );
    }

    const result = await projectService.deleteProject(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('删除项目失败:', error);
    return NextResponse.json(
      { error: '删除项目失败' },
      { status: 500 }
    );
  }
} 