import { NextResponse } from 'next/server';

// OpenRouter API配置
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// 支持的模型列表
const SUPPORTED_MODELS = [
  'anthropic/claude-3-opus',
  'anthropic/claude-3-sonnet',
  'anthropic/claude-3-haiku',
  'openai/gpt-4-turbo',
  'openai/gpt-4o',
  'google/gemini-pro',
  'meta-llama/llama-3-70b-instruct'
];

// 默认模型
const DEFAULT_MODEL = 'anthropic/claude-3-sonnet';

// 定义分析结果的接口
interface AnalysisResult {
  summary: string[];
  projectInfo: {
    name: string;
    status: string;
    completionRate: number;
    startDate: string;
    endDate: string;
  };
  metrics: Array<{
    name: string;
    value: number;
    status: 'success' | 'warning' | 'danger' | 'normal';
  }>;
  milestones: Array<{
    name: string;
    date: string;
    status: 'completed' | 'in-progress' | 'pending';
  }>;
  risks: Array<{
    name: string;
    impact: string;
    mitigation: string;
  }>;
  recommendations: string[];
}

// 分析提示词模板
const ANALYSIS_PROMPT = `
你是一位专业的项目管理顾问，擅长分析项目报告并提供洞察。
请分析以下项目报告内容，并提供以下信息：

1. 项目概述：简要总结项目的主要目标和当前状态
2. 进度分析：评估项目进度，包括完成的里程碑和延迟的任务
3. 风险评估：识别主要风险因素及其潜在影响
4. 资源分配：分析资源使用情况和效率
5. 关键指标：提取关键绩效指标并解释其意义
6. 改进建议：提供具体的改进建议和行动计划

请以结构化的JSON格式返回分析结果，必须严格遵循以下结构：
{
  "summary": ["要点1", "要点2", "要点3", ...],
  "projectInfo": {
    "name": "项目名称",
    "status": "项目状态",
    "completionRate": 数字(0-100),
    "startDate": "开始日期",
    "endDate": "结束日期"
  },
  "metrics": [
    {
      "name": "指标名称1",
      "value": 数字值,
      "status": "success|warning|danger|normal"
    },
    ...
  ],
  "milestones": [
    {
      "name": "里程碑名称1",
      "date": "日期",
      "status": "completed|in-progress|pending"
    },
    ...
  ],
  "risks": [
    {
      "name": "风险名称1",
      "impact": "高|中|低",
      "mitigation": "缓解措施"
    },
    ...
  ],
  "recommendations": ["建议1", "建议2", "建议3", ...]
}

报告内容：
{reportContent}
`;

// 文件类型处理器
const extractTextFromFile = (fileContent: string, fileType: string): string => {
  // 在实际应用中，这里会根据不同的文件类型进行处理
  // 例如，使用pdf.js处理PDF文件，使用mammoth处理DOCX文件等
  
  // 根据文件类型进行不同处理
  if (fileType.includes('pdf')) {
    // PDF处理逻辑（简化）
    return `[PDF内容] ${fileContent.substring(0, 1000)}...`;
  } else if (fileType.includes('word') || fileType.includes('docx')) {
    // Word文档处理逻辑（简化）
    return `[Word内容] ${fileContent.substring(0, 1000)}...`;
  } else if (fileType.includes('excel') || fileType.includes('xlsx')) {
    // Excel文档处理逻辑（简化）
    return `[Excel内容] ${fileContent.substring(0, 1000)}...`;
  }
  
  // 默认处理，返回原始内容
  return fileContent;
};

export async function POST(request: Request) {
  try {
    const { reportContent, fileType, modelId = DEFAULT_MODEL, maxTokens = 4000 } = await request.json();
    
    if (!reportContent) {
      return NextResponse.json(
        { success: false, error: '缺少报告内容' },
        { status: 400 }
      );
    }
    
    // 验证API密钥
    if (!OPENROUTER_API_KEY) {
      console.error('缺少OpenRouter API密钥');
      return NextResponse.json(
        { success: false, error: '服务器配置错误：缺少API密钥' },
        { status: 500 }
      );
    }
    
    // 验证模型ID
    const model = SUPPORTED_MODELS.includes(modelId) ? modelId : DEFAULT_MODEL;
    
    // 处理文件内容
    const processedContent = extractTextFromFile(reportContent, fileType || 'text/plain');
    
    // 构建提示词
    const prompt = ANALYSIS_PROMPT.replace('{reportContent}', processedContent);
    
    console.log(`开始使用模型 ${model} 分析报告...`);
    
    // 调用OpenRouter API
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'PMP AI Analyzer'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: '你是一位专业的项目管理顾问，擅长分析项目报告并提供洞察。请以JSON格式返回分析结果。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.2, // 低温度以获得更确定性的输出
        response_format: { type: 'json_object' } // 请求JSON格式的响应
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API错误:', errorData);
      
      // 更详细的错误信息
      let errorMessage = '分析服务暂时不可用';
      if (errorData.error) {
        errorMessage = `API错误: ${errorData.error.message || errorData.error}`;
      }
      
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('API响应成功，处理分析结果...');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return NextResponse.json(
        { success: false, error: 'API返回了无效的响应格式' },
        { status: 500 }
      );
    }
    
    const analysisResult = data.choices[0].message.content;
    
    // 尝试解析JSON响应
    let parsedResult: AnalysisResult;
    try {
      parsedResult = JSON.parse(analysisResult) as AnalysisResult;
      
      // 验证结果格式
      const requiredFields = ['summary', 'projectInfo', 'metrics', 'milestones', 'risks', 'recommendations'];
      const missingFields = requiredFields.filter(field => !parsedResult[field as keyof AnalysisResult]);
      
      if (missingFields.length > 0) {
        console.warn(`分析结果缺少以下字段: ${missingFields.join(', ')}`);
      }
      
    } catch (e) {
      console.error('解析AI响应失败:', e);
      return NextResponse.json(
        { 
          success: false, 
          error: '无法解析AI响应', 
          rawResponse: analysisResult,
          message: '服务器返回的数据不是有效的JSON格式'
        },
        { status: 500 }
      );
    }
    
    // 保存分析结果到数据库（模拟）
    console.log('分析完成，返回结果');
    
    return NextResponse.json({
      success: true,
      model: model,
      analysisResults: parsedResult,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('AI分析错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '处理请求时出错',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
} 