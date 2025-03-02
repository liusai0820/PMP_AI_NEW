import { NextResponse } from 'next/server';

// 模拟知识库数据
const knowledgeData = [
  {
    id: 1,
    title: '项目管理基础知识',
    category: '项目管理',
    content: '项目管理是通过应用知识、技能、工具和技术于项目活动，以满足项目需求的过程。项目管理通常包括：启动、规划、执行、监控和收尾五个过程组。有效的项目管理有助于团队达成项目目标，满足相关方的期望。',
    tags: ['基础知识', '项目管理', '流程'],
    author: '项目管理研究院',
    createdAt: '2023-01-15',
    updatedAt: '2023-03-20'
  },
  {
    id: 2,
    title: '敏捷开发方法论',
    category: '开发方法',
    content: '敏捷开发是一种以人为核心、迭代、循序渐进的开发方法。在敏捷开发中，软件项目的构建被切分成多个子项目，各个子项目的成果都经过测试，具备可视、可集成和可运行使用的特征。敏捷开发强调以人为本，专注于交付对客户有价值的软件。',
    tags: ['敏捷', '开发方法', 'Scrum', 'Kanban'],
    author: '敏捷联盟',
    createdAt: '2023-02-10',
    updatedAt: '2023-04-15'
  },
  {
    id: 3,
    title: '风险管理策略',
    category: '风险管理',
    content: '项目风险管理包括风险识别、风险分析、风险应对和风险监控。有效的风险管理策略可以减少项目不确定性，提高项目成功率。常见的风险应对策略包括：规避、转移、减轻和接受。',
    tags: ['风险管理', '策略', '应对措施'],
    author: '风险管理专家组',
    createdAt: '2023-03-05',
    updatedAt: '2023-05-12'
  },
  {
    id: 4,
    title: '团队协作最佳实践',
    category: '团队管理',
    content: '有效的团队协作是项目成功的关键。最佳实践包括：明确角色和责任、建立有效的沟通渠道、定期进行团队会议、使用协作工具、建立信任和尊重的团队文化、及时解决冲突等。',
    tags: ['团队协作', '最佳实践', '沟通'],
    author: '团队管理研究中心',
    createdAt: '2023-04-20',
    updatedAt: '2023-06-05'
  },
  {
    id: 5,
    title: '项目估算技术',
    category: '项目规划',
    content: '项目估算是确定项目成本、资源和持续时间的过程。常用的估算技术包括：类比估算、参数估算、三点估算、自下而上估算等。准确的估算有助于制定合理的项目计划和预算。',
    tags: ['估算', '技术', '规划'],
    author: '项目规划专家',
    createdAt: '2023-05-15',
    updatedAt: '2023-07-10'
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category');
  
  // 过滤数据
  let results = [...knowledgeData];
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.content.toLowerCase().includes(lowerQuery) || 
      item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
  
  if (category) {
    results = results.filter(item => item.category === category);
  }
  
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json({
    success: true,
    results,
    total: results.length,
    categories: ['项目管理', '开发方法', '风险管理', '团队管理', '项目规划']
  });
}

export async function POST(request: Request) {
  try {
    const { title, category, content, tags, author } = await request.json();
    
    if (!title || !category || !content) {
      return NextResponse.json(
        { success: false, error: '标题、分类和内容不能为空' },
        { status: 400 }
      );
    }
    
    // 模拟添加新知识条目
    const newItem = {
      id: knowledgeData.length + 1,
      title,
      category,
      content,
      tags: tags || [],
      author: author || '系统用户',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    // 在实际应用中，这里会将数据保存到数据库
    // 这里只是模拟成功响应
    
    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '处理请求时出错' },
      { status: 500 }
    );
  }
} 