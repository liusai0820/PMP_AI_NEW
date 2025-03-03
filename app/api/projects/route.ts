import { NextResponse } from 'next/server';

// 项目基本信息接口
interface ProjectInfo {
  name: string;                 // 项目名称
  code: string;                 // 项目编号/合同编号
  mainDepartment: string;       // 项目主管部门（甲方）
  executeDepartment: string;    // 项目承担单位（乙方）
  manager: string;              // 项目核心负责人
  startDate: string;           // 开始日期
  endDate: string;             // 结束日期
  totalBudget: string;         // 总预算
  supportBudget: string;       // 资助金额
  selfBudget: string;          // 自筹金额
  description: string;         // 项目描述
  type: string;                // 项目类型
}

// 项目里程碑接口
interface ProjectMilestone {
  phase: string;               // 阶段（第一阶段/第二阶段/第三阶段）
  startDate: string;          // 阶段开始时间
  endDate: string;            // 阶段结束时间
  mainTasks: string[];        // 主要研究内容
  deliverables: string[];     // 考核指标/交付物
}

// 项目预算接口
interface ProjectBudget {
  category: string;           // 预算类别
  subCategory: string;        // 子类别
  amount: number;            // 金额
  source: 'support' | 'self'; // 资金来源（资助/自筹）
  description: string;       // 说明
}

// 项目团队成员接口
interface TeamMember {
  name: string;              // 姓名
  title: string;             // 职称
  role: string;              // 项目角色
  workload: string;          // 工作量（月/年）
  unit: string;              // 所属单位
}

// 完整的项目数据接口
interface CompleteProjectData {
  basicInfo: ProjectInfo;
  milestones: ProjectMilestone[];
  budgets: ProjectBudget[];
  team: TeamMember[];
  id?: string; // 添加可选的id字段
}

// 模拟数据库存储
const projects: CompleteProjectData[] = [];

export async function POST(request: Request) {
  try {
    // 解析请求体
    const projectData: CompleteProjectData = await request.json();
    
    // 验证必填字段
    if (!projectData.basicInfo || !projectData.basicInfo.name || !projectData.basicInfo.code) {
      return NextResponse.json(
        { error: '项目名称和编号为必填项' },
        { status: 400 }
      );
    }
    
    // 检查项目编号是否已存在
    const existingProject = projects.find(p => p.basicInfo.code === projectData.basicInfo.code);
    if (existingProject) {
      return NextResponse.json(
        { error: '项目编号已存在' },
        { status: 409 }
      );
    }
    
    // 生成项目ID
    const projectId = Date.now().toString();
    
    // 保存项目信息（模拟数据库操作）
    const projectWithId = {
      ...projectData,
      id: projectId
    };
    
    projects.push(projectWithId);
    
    // 返回成功响应
    return NextResponse.json({ 
      success: true,
      message: '项目创建成功',
      projectId: projectId,
      project: projectWithId
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
    const id = searchParams.get('id');
    
    // 如果指定了项目ID，返回特定项目
    if (id) {
      const project = projects.find(p => p.id === id);
      if (!project) {
        return NextResponse.json(
          { error: '项目不存在' },
          { status: 404 }
        );
      }
      return NextResponse.json(project);
    }
    
    // 如果指定了项目编号，返回特定项目
    if (code) {
      const project = projects.find(p => p.basicInfo.code === code);
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