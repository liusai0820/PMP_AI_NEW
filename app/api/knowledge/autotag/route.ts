import { NextRequest, NextResponse } from 'next/server';
import { AutoTagRequest, AutoTagResponse } from '@/types';
import { generateAutoTags } from '@/lib/mockKnowledgeData';

// 知识分类选项
const KNOWLEDGE_CATEGORIES = [
  '项目管理基础',
  '风险管理',
  '质量管理',
  '进度管理',
  '成本管理',
  '沟通管理',
  '采购管理',
  '人力资源管理',
];

/**
 * 处理自动标签生成请求
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json() as AutoTagRequest;
    const { knowledgeId, content, existingTags = [] } = body;
    
    // 验证必要字段
    if (!knowledgeId || !content) {
      return NextResponse.json(
        { error: '缺少必要字段：knowledgeId和content' },
        { status: 400 }
      );
    }
    
    // 生成自动标签
    // 实际应用中，这里应该调用OpenAI API或其他NLP模型
    const suggestedTags = await generateTagsFromContent(content, existingTags);
    
    // 推荐最匹配的分类
    const suggestedCategory = await suggestCategory(content);
    
    // 生成摘要
    const suggestedSummary = await generateSummary(content);
    
    // 构建响应
    const response: AutoTagResponse = {
      knowledgeId,
      suggestedTags,
      suggestedCategory,
      suggestedSummary,
      confidence: 0.85 // 模拟置信度
    };
    
    // 返回成功响应
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('自动标签生成错误:', error);
    return NextResponse.json(
      { error: '自动标签生成失败', details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * 从内容生成标签
 * 注意：这是一个模拟实现，实际应用中应该调用OpenAI API或其他NLP模型
 */
async function generateTagsFromContent(content: string, existingTags: string[] = []): Promise<string[]> {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 使用模拟函数生成标签
  const autoTags = generateAutoTags(content);
  
  // 合并现有标签和自动生成的标签，去重
  const allTags = [...new Set([...existingTags, ...autoTags])];
  
  // 实际应用中，应该调用OpenAI API，例如：
  /*
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的文档分析助手，擅长从文本中提取关键概念作为标签。'
        },
        {
          role: 'user',
          content: `从以下文本中提取5-8个关键概念作为标签，以JSON数组格式返回：\n\n${content}`
        }
      ]
    })
  });
  
  const data = await response.json();
  const tagsText = data.choices[0].message.content;
  return JSON.parse(tagsText);
  */
  
  return allTags;
}

/**
 * 推荐最匹配的分类
 * 注意：这是一个模拟实现，实际应用中应该调用OpenAI API或其他NLP模型
 */
async function suggestCategory(content: string): Promise<string> {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // 简单模拟：根据内容长度选择一个分类
  const index = content.length % KNOWLEDGE_CATEGORIES.length;
  return KNOWLEDGE_CATEGORIES[index];
  
  // 实际应用中，应该调用OpenAI API，例如：
  /*
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `你是一个专业的文档分类助手。请从以下分类中选择最匹配的一个：${KNOWLEDGE_CATEGORIES.join(', ')}`
        },
        {
          role: 'user',
          content: `根据以下文本内容，选择最匹配的一个分类：\n\n${content}`
        }
      ]
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content.trim();
  */
}

/**
 * 生成内容摘要
 * 注意：这是一个模拟实现，实际应用中应该调用OpenAI API或其他NLP模型
 */
async function generateSummary(content: string): Promise<string> {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // 简单模拟：截取内容的前200个字符作为摘要
  const summary = content.substring(0, 200).replace(/\s+/g, ' ').trim();
  return summary + (content.length > 200 ? '...' : '');
  
  // 实际应用中，应该调用OpenAI API，例如：
  /*
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的文档摘要生成助手，擅长生成简洁明了的摘要。'
        },
        {
          role: 'user',
          content: `为以下文本生成一个100-150字的摘要：\n\n${content}`
        }
      ]
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content.trim();
  */
} 