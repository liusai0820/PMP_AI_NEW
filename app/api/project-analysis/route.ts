import { NextResponse } from 'next/server';

// 项目信息接口
interface ProjectInfo {
  name: string;
  code: string;
  department: string;
  manager: string;
  startDate: string;
  endDate: string;
  budget: string;
  description: string;
  objectives: string[];
  stakeholders: string[];
}

// 分析提示词模板
const ANALYSIS_PROMPT = `
你是一位专业的项目管理顾问，擅长分析项目文档并提取关键信息。
请分析以下项目文档内容，并提取以下关键信息：

1. 项目名称：提取完整的项目名称
2. 项目编号：提取项目的唯一标识符或编号
3. 所属部门：提取负责该项目的部门名称
4. 项目经理：提取项目经理或负责人的姓名
5. 开始日期：提取项目的计划开始日期（格式：YYYY-MM-DD）
6. 结束日期：提取项目的计划结束日期（格式：YYYY-MM-DD）
7. 预算：提取项目的总预算金额
8. 项目描述：提取项目的简要描述或概述
9. 项目目标：提取项目的主要目标（列表形式）
10. 项目干系人：提取项目的主要干系人或相关方（列表形式）

请以结构化的JSON格式返回分析结果，必须严格遵循以下结构：
{
  "name": "项目名称",
  "code": "项目编号",
  "department": "所属部门",
  "manager": "项目经理",
  "startDate": "开始日期",
  "endDate": "结束日期",
  "budget": "预算",
  "description": "项目描述",
  "objectives": ["目标1", "目标2", "目标3", ...],
  "stakeholders": ["干系人1", "干系人2", "干系人3", ...]
}

如果某些信息在文档中未明确提及，请尽量根据上下文推断，或者留空。
`;

// 从文件中提取文本内容
const extractTextFromFile = (fileContent: string, fileType: string): string => {
  // 这里简化处理，实际项目中可能需要更复杂的文本提取逻辑
  // 例如对PDF、Word等格式的特殊处理
  
  if (fileType.includes('pdf')) {
    // 实际项目中，这里应该使用PDF解析库
    return `[PDF内容] ${fileContent.substring(0, 1000)}...`;
  } else if (fileType.includes('word') || fileType.includes('doc')) {
    // 实际项目中，这里应该使用Word文档解析库
    return `[Word文档内容] ${fileContent.substring(0, 1000)}...`;
  } else {
    // 纯文本文件
    return fileContent;
  }
};

// 使用AI分析文本并提取项目信息
const analyzeTextWithAI = async (_text: string): Promise<ProjectInfo> => {
  try {
    // 实际项目中，这里应该调用OpenAI或其他AI服务
    // 这里使用模拟数据
    
    // 模拟AI处理延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 返回模拟的项目信息
    return {
      name: "智慧城市交通管理系统升级项目",
      code: "P2023-TC-001",
      department: "交通管理局",
      manager: "张明",
      startDate: "2023-06-15",
      endDate: "2024-12-31",
      budget: "¥3,500,000",
      description: "本项目旨在升级现有的城市交通管理系统，引入人工智能和大数据分析技术，提高交通流量监控和管理效率，减少交通拥堵，提升市民出行体验。",
      objectives: [
        "提高交通监控覆盖率达到98%以上",
        "减少主要路段交通拥堵时间30%",
        "建立实时交通数据分析平台",
        "优化交通信号灯控制系统"
      ],
      stakeholders: [
        "交通管理局",
        "市政府",
        "公安交警部门",
        "系统开发供应商",
        "市民代表"
      ]
    };
    
    // 实际项目中，应该是类似这样的代码：
    /*
    const apiKey = process.env.OPENAI_API_KEY;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: ANALYSIS_PROMPT },
          { role: 'user', content: text }
        ],
        temperature: 0.3
      })
    });
    
    const result = await response.json();
    return JSON.parse(result.choices[0].message.content);
    */
  } catch (error) {
    console.error('AI分析失败:', error);
    throw new Error('项目信息提取失败，请重试');
  }
};

export async function POST(request: Request) {
  try {
    // 解析请求体
    const body = await request.json();
    const { fileContent, fileType } = body;
    
    if (!fileContent) {
      return NextResponse.json(
        { error: '文件内容不能为空' },
        { status: 400 }
      );
    }
    
    // 提取文本内容
    const extractedText = extractTextFromFile(fileContent, fileType);
    
    // 使用AI分析文本
    const projectInfo = await analyzeTextWithAI(extractedText);
    
    // 返回分析结果
    return NextResponse.json({ projectInfo });
    
  } catch (error) {
    console.error('处理请求时出错:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器内部错误' },
      { status: 500 }
    );
  }
} 