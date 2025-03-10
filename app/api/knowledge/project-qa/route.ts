import { NextRequest, NextResponse } from 'next/server';
import { knowledgeService } from '@/lib/services/knowledgeService';

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { 
      question, 
      projectId,
      filter = {}
    } = body;
    
    // 验证必要字段
    if (!question) {
      return NextResponse.json(
        { error: '缺少必要字段：question' },
        { status: 400 }
      );
    }
    
    // 记录开始时间，用于计算处理耗时
    const startTime = Date.now();
    
    // 调用知识库服务进行问答
    const result = await knowledgeService.retrievalQA(question, projectId, filter);
    
    // 计算处理耗时
    const timeTaken = (Date.now() - startTime) / 1000;
    
    // 构建响应
    const response = {
      answer: result.answer,
      sources: result.sources,
      question,
      timeTaken
    };
    
    // 返回成功响应
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('项目问答处理错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '处理问答请求时发生错误' },
      { status: 500 }
    );
  }
} 