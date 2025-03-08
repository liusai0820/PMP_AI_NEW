import { NextResponse } from 'next/server';

interface Message {
  role: 'user' | 'ai' | 'system' | 'assistant';
  content: string;
}

// 直接调用大模型API
async function getAIResponse(message: string, history: Message[] = []) {
  try {
    console.log('开始处理用户消息:', message);
    console.log('历史消息数量:', history.length);
    
    // 使用OpenRouter API
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.MISTRAL_API_KEY || 'bXkslXgU1KbER1anYhwicgw6zFjkqKjM';
    console.log('使用API密钥:', apiKey ? '已配置' : '未配置');
    
    // 转换历史记录格式
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'ai' ? 'assistant' : msg.role,
      content: msg.content
    }));
    
    // 构建请求体
    const requestBody = {
      model: 'google/gemini-2.0-flash-001', // 可以替换为其他模型
      messages: [
        {
          role: 'system',
          content: '你是PMP.AI智能助手，一个专业的项目管理顾问。你可以帮助用户解答项目管理相关问题，提供项目管理建议，或者指导用户使用系统功能。请用中文回答用户的问题，保持专业、简洁和友好的语气。'
        },
        ...formattedHistory,
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    };
    
    console.log('发送请求到OpenRouter API...');
    console.log('请求模型:', requestBody.model);
    console.log('消息数量:', requestBody.messages.length);
    
    // 发送请求到OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'PMP.AI Project Management Platform'
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('OpenRouter API响应状态:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: '无法解析错误响应' }));
      console.error('OpenRouter API调用失败:', errorData);
      throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('OpenRouter API响应成功');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('API响应格式不正确:', data);
      throw new Error('API响应格式不正确，缺少必要字段');
    }
    
    // 返回AI回复
    const aiResponse = data.choices[0].message.content;
    console.log('AI回复:', aiResponse.substring(0, 100) + '...');
    return aiResponse;
  } catch (error) {
    console.error('获取AI回复失败:', error);
    return '抱歉，我暂时无法回答您的问题，请稍后再试。';
  }
}

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
    const body = await request.json();
    const { message, history = [] } = body;
    
    if (!message) {
      return NextResponse.json(
        { success: false, error: '消息不能为空' },
        { status: 400 }
      );
    }
    
    // 调用大模型API获取回复
    const response = await getAIResponse(message, history);
    
    return NextResponse.json({
      success: true,
      response: response,
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