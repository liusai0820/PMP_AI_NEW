import { NextResponse } from 'next/server';

// 模拟报告分析结果
const analysisResults = {
  summary: {
    title: '项目进度报告分析',
    period: '2023年第三季度',
    overallStatus: '良好',
    completionRate: 78,
    riskLevel: '中等'
  },
  keyFindings: [
    '项目整体进度符合预期，完成率达到78%',
    '资源分配合理，团队协作良好',
    '存在部分延期风险，需要关注',
    '客户满意度较高，反馈积极'
  ],
  performanceMetrics: {
    timeEfficiency: 85,
    resourceUtilization: 72,
    qualityScore: 90,
    teamCollaboration: 88
  },
  recommendations: [
    '加强对延期风险项目的监控和管理',
    '优化资源分配，提高资源利用率',
    '加强团队沟通，提高协作效率',
    '定期进行项目回顾，总结经验教训'
  ],
  charts: {
    progressTrend: {
      labels: ['7月', '8月', '9月'],
      data: [65, 72, 78]
    },
    resourceAllocation: {
      labels: ['开发', '设计', '测试', '管理', '其他'],
      data: [40, 20, 15, 15, 10]
    }
  }
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: '未找到文件' },
        { status: 400 }
      );
    }
    
    // 检查文件类型
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: '不支持的文件类型，请上传PDF、Word或Excel文件' },
        { status: 400 }
      );
    }
    
    // 模拟文件处理和分析过程
    // 在实际应用中，这里会解析文件内容并进行分析
    // 这里只是返回模拟的分析结果
    
    // 模拟API延迟，模拟分析过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      analysisResults
    });
    
  } catch (error) {
    console.error('报告分析错误:', error);
    return NextResponse.json(
      { success: false, error: '处理文件时出错' },
      { status: 500 }
    );
  }
} 