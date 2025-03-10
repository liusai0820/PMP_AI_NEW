import { NextRequest, NextResponse } from 'next/server';

// 定义专家接口
interface Expert {
  id: string;
  name: string;
  title: string;
  organization: string;
  field: string;
  expertise: string[];
  publications: number;
  projects: number;
  patents: number;
  avatar: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

// 模拟数据库
const experts: Expert[] = [
  {
    id: '1',
    name: '张智能',
    title: '教授/博士生导师',
    organization: '清华大学',
    field: '人工智能',
    expertise: ['机器学习', '深度学习', '计算机视觉'],
    publications: 78,
    projects: 12,
    patents: 5,
    avatar: '/avatars/expert1.jpg',
    email: 'zhang@example.com',
    phone: '13800000001',
    status: 'active'
  },
  {
    id: '2',
    name: '李数据',
    title: '研究员',
    organization: '中国科学院',
    field: '数据科学',
    expertise: ['大数据分析', '数据挖掘', '统计学习'],
    publications: 45,
    projects: 8,
    patents: 3,
    avatar: '/avatars/expert2.jpg',
    email: 'li@example.com',
    phone: '13800000002',
    status: 'active'
  },
  {
    id: '3',
    name: '王工程',
    title: '高级工程师',
    organization: '华为技术有限公司',
    field: '软件工程',
    expertise: ['系统架构', '软件开发', '项目管理'],
    publications: 12,
    projects: 20,
    patents: 8,
    avatar: '/avatars/expert3.jpg',
    email: 'wang@example.com',
    phone: '13800000003',
    status: 'active'
  },
  {
    id: '4',
    name: '赵学者',
    title: '副教授',
    organization: '北京大学',
    field: '计算机科学',
    expertise: ['算法设计', '分布式系统', '云计算'],
    publications: 35,
    projects: 6,
    patents: 2,
    avatar: '/avatars/expert4.jpg',
    email: 'zhao@example.com',
    phone: '13800000004',
    status: 'inactive'
  },
  {
    id: '5',
    name: '钱专家',
    title: '首席科学家',
    organization: '百度研究院',
    field: '自然语言处理',
    expertise: ['文本分析', '语义理解', '知识图谱'],
    publications: 60,
    projects: 15,
    patents: 10,
    avatar: '/avatars/expert5.jpg',
    email: 'qian@example.com',
    phone: '13800000005',
    status: 'active'
  }
];

/**
 * 获取专家列表
 */
export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const field = searchParams.get('field');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    // 根据查询参数过滤专家
    let filteredExperts = [...experts];
    
    if (field && field !== 'all') {
      filteredExperts = filteredExperts.filter(expert => expert.field === field);
    }
    
    if (status) {
      filteredExperts = filteredExperts.filter(expert => expert.status === status);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredExperts = filteredExperts.filter(expert => 
        expert.name.toLowerCase().includes(searchLower) ||
        expert.organization.toLowerCase().includes(searchLower) ||
        expert.field.toLowerCase().includes(searchLower) ||
        expert.expertise.some(e => e.toLowerCase().includes(searchLower))
      );
    }
    
    return NextResponse.json(filteredExperts, { status: 200 });
  } catch (error) {
    console.error('获取专家列表失败:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: '获取专家列表失败',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * 添加专家
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求
    const data = await request.json();
    const { name, title, organization, field, expertise, email, phone } = data;
    
    if (!name || !organization || !field) {
      return NextResponse.json(
        { error: '请提供专家姓名、所属机构和研究领域' },
        { status: 400 }
      );
    }
    
    // 创建新专家
    const newExpert: Expert = {
      id: `${experts.length + 1}`,
      name,
      title: title || '',
      organization,
      field,
      expertise: expertise || [],
      publications: 0,
      projects: 0,
      patents: 0,
      avatar: '/avatars/default.jpg',
      email: email || '',
      phone: phone || '',
      status: 'active'
    };
    
    // 添加到专家列表
    const updatedExperts = [...experts, newExpert];
    
    // 更新模拟数据库
    experts.length = 0;
    experts.push(...updatedExperts);
    
    return NextResponse.json(
      { 
        success: true,
        message: '专家添加成功',
        expert: newExpert
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('添加专家失败:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: '添加专家失败',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * 更新专家信息
 */
export async function PUT(request: NextRequest) {
  try {
    // 解析请求
    const data = await request.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json(
        { error: '请提供专家ID' },
        { status: 400 }
      );
    }
    
    // 查找专家
    const expertIndex = experts.findIndex(expert => expert.id === id);
    
    if (expertIndex === -1) {
      return NextResponse.json(
        { error: '未找到指定专家' },
        { status: 404 }
      );
    }
    
    // 更新专家信息
    const updatedExpert = {
      ...experts[expertIndex],
      ...updateData
    };
    
    experts[expertIndex] = updatedExpert;
    
    return NextResponse.json(
      { 
        success: true,
        message: '专家信息更新成功',
        expert: updatedExpert
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('更新专家信息失败:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: '更新专家信息失败',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 