import { NextResponse } from 'next/server';

// 模拟智能助手回复
const generateResponse = (message: string) => {
  // 简单的关键词匹配逻辑
  if (message.includes('项目') && message.includes('创建')) {
    return '创建新项目很简单！点击项目页面右上角的"新建项目"按钮，填写项目信息即可。需要我为您展示具体步骤吗？';
  }
  
  if (message.includes('延期') || message.includes('风险')) {
    return '项目延期是常见的风险。建议您：1. 重新评估项目时间线；2. 识别关键路径上的任务；3. 分配更多资源到关键任务；4. 与相关方及时沟通。需要我帮您制定详细的风险应对计划吗？';
  }
  
  if (message.includes('报告') && (message.includes('分析') || message.includes('上传'))) {
    return '您可以在报告页面上传项目报告文件，系统会自动分析报告内容，提取关键信息，并生成分析结果。支持PDF、Word和Excel格式的文件。';
  }
  
  if (message.includes('统计') || message.includes('数据')) {
    return '仪表盘页面提供了项目的各项统计数据，包括项目总数、进行中项目、已完成项目等。您还可以查看项目趋势图和项目类型分布图，了解项目的整体情况。';
  }
  
  if (message.includes('团队') || message.includes('成员')) {
    return '您可以在项目详情页面管理团队成员，添加或移除项目成员，分配任务和角色。系统支持团队协作，成员可以共享文档、交流讨论。';
  }
  
  // 默认回复
  return '我是PMP.AI智能助手，可以帮您解答项目管理相关问题，提供项目管理建议，或者指导您使用系统功能。请告诉我您需要什么帮助？';
};

// 模拟建议问题
const suggestions = [
  '如何创建新项目？',
  '如何处理项目延期风险？',
  '如何上传和分析项目报告？',
  '在哪里查看项目统计数据？',
  '如何管理项目团队成员？'
];

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { success: false, error: '消息不能为空' },
        { status: 400 }
      );
    }
    
    // 模拟处理延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = generateResponse(message);
    
    return NextResponse.json({
      success: true,
      message: response,
      timestamp: new Date().toISOString(),
      suggestions: suggestions
    });
    
  } catch (error) {
    console.error('助手API错误:', error);
    return NextResponse.json(
      { success: false, error: '处理请求时出错' },
      { status: 500 }
    );
  }
} 