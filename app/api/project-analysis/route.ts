import { NextResponse } from 'next/server';
import mammoth from 'mammoth';

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

// 完整项目数据接口
interface CompleteProjectData {
  basicInfo: ProjectInfo;
  milestones: ProjectMilestone[];
  budgets: ProjectBudget[];
  team: TeamMember[];
}

// 分析提示词模板
// 注意：此提示词已被CHINESE_ANALYSIS_PROMPT替代，保留作为参考
/* 
const ANALYSIS_PROMPT = `
你是一位专业的项目管理顾问，擅长分析项目文档并提取关键信息。
请分析以下项目文档内容，并提取所有关键信息，组织成结构化数据。

请仔细阅读文档，尽可能提取以下信息。如果某项信息在文档中确实不存在，才填写"未提供"。
请不要轻易放弃，尝试从文档的各个部分寻找相关信息，包括标题、正文、表格等。

请从文档中提取以下信息：

1. 项目基本信息：
   - 项目名称：通常在文档标题或开头部分
   - 项目编号/合同编号：通常有特定格式，如字母+数字组合
   - 项目主管部门（甲方）：通常是政府部门或机构名称
   - 项目承担单位（乙方）：通常是执行项目的公司或机构
   - 项目核心负责人：通常有姓名和职位
   - 开始日期：查找项目开始或合同生效的日期
   - 结束日期：查找项目结束或合同到期的日期
   - 总预算：查找总金额相关信息
   - 资助金额：查找外部资助或拨款金额
   - 自筹金额：查找自筹或配套资金金额
   - 项目描述：查找项目概述、背景、目标等描述性内容
   - 项目类型：如研发项目、基础设施项目等

2. 项目里程碑：
   - 阶段（第一阶段/第二阶段/第三阶段）
   - 阶段开始时间
   - 阶段结束时间
   - 主要研究内容（数组）：每个阶段的主要任务或研究内容
   - 考核指标/交付物（数组）：每个阶段需要完成的指标或交付物

3. 项目预算：
   - 预算类别：如设备费、材料费、人员费等
   - 子类别：预算类别的细分
   - 金额：对应的金额数值
   - 资金来源（资助/自筹）：标明资金来源
   - 说明：预算项目的补充说明

4. 项目团队：
   - 姓名：团队成员姓名
   - 职称：如教授、工程师等
   - 项目角色：如项目负责人、技术负责人等
   - 工作量：如工作时间或工作比例
   - 所属单位：团队成员所属的机构或部门

请以JSON格式返回结果，格式如下：

\`\`\`json
{
  "basicInfo": {
    "name": "项目名称",
    "code": "项目编号",
    "mainDepartment": "项目主管部门",
    "executeDepartment": "项目承担单位",
    "manager": "项目核心负责人",
    "startDate": "开始日期",
    "endDate": "结束日期",
    "totalBudget": "总预算",
    "supportBudget": "资助金额",
    "selfBudget": "自筹金额",
    "description": "项目描述",
    "type": "项目类型"
  },
  "milestones": [
    {
      "phase": "第一阶段",
      "startDate": "阶段开始时间",
      "endDate": "阶段结束时间",
      "mainTasks": ["主要任务1", "主要任务2"],
      "deliverables": ["交付物1", "交付物2"]
    }
  ],
  "budgets": [
    {
      "category": "设备费",
      "subCategory": "计算机设备",
      "amount": 10000,
      "source": "support",
      "description": "购买服务器"
    }
  ],
  "team": [
    {
      "name": "张三",
      "title": "教授",
      "role": "项目负责人",
      "workload": "12个月",
      "unit": "某大学"
    }
  ]
}
\`\`\`

如果某些信息在文档中没有明确提及，请尽量根据上下文推断，或者填写合理的默认值。
请确保返回的JSON格式正确，可以被直接解析。

以下是需要分析的文档内容：
`;
*/

// 从文件中提取文本内容
const extractTextFromFile = async (fileContent: string, fileType: string): Promise<string> => {
  try {
    console.log('开始提取文本，文件类型:', fileType);
    
    // 检查文件内容是否为空或无效
    if (!fileContent || fileContent.length < 10) {
      console.error('文件内容为空或过短');
      return '文件内容为空或无效';
    }
    
    // 检查是否是带有二进制标记的内容
    if (fileContent.startsWith('[BINARY_')) {
      console.log('检测到二进制标记内容');
      
      // 提取文件类型和Base64内容
      const endOfHeader = fileContent.indexOf(']');
      if (endOfHeader > 0) {
        const binaryType = fileContent.substring(8, endOfHeader);
        console.log('二进制内容类型:', binaryType);
        
        // 对于Word文档，使用mammoth库解析
        if (binaryType.includes('docx') || binaryType.includes('openxmlformats-officedocument.wordprocessingml.document')) {
          console.log('使用mammoth解析Word文档');
          
          // 从Base64中提取二进制内容
          const base64Content = fileContent.substring(endOfHeader + 1);
          const buffer = Buffer.from(base64Content, 'base64');
          
          try {
            // 使用mammoth将docx转换为文本
            const result = await mammoth.extractRawText({ buffer });
            const extractedText = result.value;
            
            console.log('mammoth提取的文本样本(前300字符):', extractedText.substring(0, 300));
            
            // 如果提取的文本太短，返回错误信息
            if (!extractedText || extractedText.length < 100) {
              console.warn('从Word文档中提取的文本太短');
              return '无法从Word文档中提取足够的文本内容';
            }
            
            return extractedText.substring(0, 20000); // 限制长度
          } catch (mammothError) {
            console.error('mammoth解析Word文档出错:', mammothError);
            return '解析Word文档时出错';
          }
        } else if (binaryType.includes('doc') && !binaryType.includes('docx') && !binaryType.includes('openxmlformats-officedocument.wordprocessingml.document')) {
          // 旧版Word文档(.doc)格式，mammoth不支持
          console.log('不支持旧版Word文档(.doc)格式');
          return '不支持旧版Word文档(.doc)格式，请转换为.docx格式后重试';
        } else if (binaryType.includes('pdf')) {
          console.log('处理PDF二进制内容');
          // PDF处理逻辑需要专门的库
          return '暂不支持PDF文件解析，请使用Word文档(.docx)格式';
        }
      }
      
      return '无法处理此类型的二进制内容';
    }
    
    // 记录文件内容的字节长度和字符长度
    const byteLength = Buffer.from(fileContent).length;
    const charLength = fileContent.length;
    console.log(`文件内容字节长度: ${byteLength}, 字符长度: ${charLength}`);
    
    // 检查文件内容是否包含常见的文档标记
    const containsXML = fileContent.includes('<?xml') || fileContent.includes('<w:');
    const containsPDF = fileContent.includes('%PDF');
    console.log(`文件内容特征: 包含XML标记: ${containsXML}, 包含PDF标记: ${containsPDF}`);
    
    let extractedText = '';
    
    // 根据文件类型处理文本提取
    if (fileType.includes('pdf')) {
      // PDF文件处理逻辑
      console.log('处理PDF文件');
      extractedText = fileContent.substring(0, 20000); // 限制长度
    } else if (fileType.includes('docx') || fileType.includes('doc')) {
      // Word文档处理逻辑 - 尝试提取纯文本内容
      console.log('处理Word文档');
      
      // 如果是Word文档，可能包含XML标记，尝试提取纯文本
      if (containsXML) {
        console.log('检测到XML标记，尝试提取纯文本');
        // 简单的XML标记移除，实际项目中应使用专门的库
        extractedText = fileContent
          .replace(/<[^>]+>/g, ' ') // 移除XML标签
          .replace(/\s+/g, ' ')     // 合并多个空格
          .trim();
      } else {
        // 如果没有检测到XML标记，可能是二进制格式，直接使用原始内容
        console.log('未检测到XML标记，使用原始内容');
        extractedText = fileContent;
      }
      
      // 输出提取后的文本样本
      console.log('Word文档提取的文本样本(前200字符):', extractedText.substring(0, 200));
      extractedText = extractedText.substring(0, 20000); // 限制长度
    } else if (fileType.includes('txt')) {
      // 纯文本文件
      console.log('处理纯文本文件');
      extractedText = fileContent.substring(0, 20000); // 限制长度
    } else {
      // 其他类型文件
      console.log('处理其他类型文件:', fileType);
      extractedText = fileContent.substring(0, 20000); // 限制长度
    }
    
    // 检查提取的文本是否有效
    if (!extractedText || extractedText.length < 10) {
      console.warn('提取的文本内容过短或为空');
      return '无法从文件中提取有效文本';
    }
    
    // 记录提取的文本长度
    console.log(`成功提取文本，长度: ${extractedText.length} 字符`);
    return extractedText;
  } catch (error) {
    console.error('提取文本时出错:', error);
    return '无法提取文本内容';
  }
};

// 使用OpenRouter API分析文本并提取项目信息
const analyzeTextWithAI = async (text: string): Promise<CompleteProjectData> => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('OpenRouter API密钥未配置，将使用模拟数据');
      throw new Error('OpenRouter API密钥未配置');
    }

    console.log('正在调用OpenRouter API分析文档...');
    
    // 检查文本内容是否有效
    if (!text || text.length < 100 || text.includes('不支持旧版Word文档') || text.includes('无法从文件中提取有效文本')) {
      console.error('提供给AI的文本内容无效:', text);
      throw new Error('提供给AI的文本内容无效，无法进行分析');
    }
    
    console.log('处理后的文本前200个字符:', text.substring(0, 200));
    
    // 使用更明确的中文提示词
    const CHINESE_ANALYSIS_PROMPT = `
你是一位专业的项目管理顾问，擅长分析中文项目文档并提取关键信息。
请分析以下项目文档内容，并提取所有关键信息，组织成结构化数据。

请仔细阅读文档，尽可能提取以下信息。如果某项信息在文档中确实不存在，才填写"未提供"。
请不要轻易放弃，尝试从文档的各个部分寻找相关信息，包括标题、正文、表格等。

请特别注意：这是一份中文项目文档，请认真分析所有中文内容。

请从文档中提取以下信息：

1. 项目基本信息：
   - 项目名称：通常在文档标题或开头部分，如"XXX项目"、"XXX工程"等
   - 项目编号/合同编号：通常有特定格式，如字母+数字组合，例如"HZQB-KCZYB-2020031"
   - 项目主管部门（甲方）：通常是政府部门或机构名称
   - 项目承担单位（乙方）：通常是执行项目的公司或机构
   - 项目核心负责人：通常有姓名和职位
   - 开始日期：查找项目开始或合同生效的日期
   - 结束日期：查找项目结束或合同到期的日期
   - 总预算：查找总金额相关信息
   - 资助金额：查找外部资助或拨款金额
   - 自筹金额：查找自筹或配套资金金额
   - 项目描述：查找项目概述、背景、目标等描述性内容
   - 项目类型：如研发项目、基础设施项目等

2. 项目里程碑：
   - 阶段（第一阶段/第二阶段/第三阶段）
   - 阶段开始时间
   - 阶段结束时间
   - 主要研究内容（数组）：每个阶段的主要任务或研究内容
   - 考核指标/交付物（数组）：每个阶段需要完成的指标或交付物

3. 项目预算：
   - 预算类别：如设备费、材料费、人员费等
   - 子类别：预算类别的细分
   - 金额：对应的金额数值
   - 资金来源（资助/自筹）：标明资金来源
   - 说明：预算项目的补充说明

4. 项目团队：
   - 姓名：团队成员姓名
   - 职称：如教授、工程师等
   - 项目角色：如项目负责人、技术负责人等
   - 工作量：如工作时间或工作比例
   - 所属单位：团队成员所属的机构或部门

你必须以JSON格式返回结果，格式如下：

\`\`\`json
{
  "basicInfo": {
    "name": "项目名称",
    "code": "项目编号",
    "mainDepartment": "项目主管部门",
    "executeDepartment": "项目承担单位",
    "manager": "项目核心负责人",
    "startDate": "开始日期",
    "endDate": "结束日期",
    "totalBudget": "总预算",
    "supportBudget": "资助金额",
    "selfBudget": "自筹金额",
    "description": "项目描述",
    "type": "项目类型"
  },
  "milestones": [
    {
      "phase": "第一阶段",
      "startDate": "阶段开始时间",
      "endDate": "阶段结束时间",
      "mainTasks": ["主要任务1", "主要任务2"],
      "deliverables": ["交付物1", "交付物2"]
    }
  ],
  "budgets": [
    {
      "category": "设备费",
      "subCategory": "计算机设备",
      "amount": 10000,
      "source": "support",
      "description": "购买服务器"
    }
  ],
  "team": [
    {
      "name": "张三",
      "title": "教授",
      "role": "项目负责人",
      "workload": "12个月",
      "unit": "某大学"
    }
  ]
}
\`\`\`

如果某些信息在文档中没有明确提及，请尽量根据上下文推断，或者填写合理的默认值。
请确保返回的JSON格式正确，可以被直接解析。不要在JSON外添加任何解释性文字。

以下是需要分析的文档内容：
`;
    
    // 使用中文提示词
    const prompt = CHINESE_ANALYSIS_PROMPT + text;
    
    // 构建请求体，使用更适合中文处理的模型
    const requestBody = {
      model: 'anthropic/claude-3-sonnet', // 更换为更强大的模型
      messages: [
        {
          role: 'system',
          content: '你是一位专业的项目管理顾问，擅长分析中文项目文档并提取关键信息。请以JSON格式返回分析结果，不要添加任何额外的解释文字。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 4000,
      response_format: { type: "json_object" } // 请求JSON格式的响应
    };
    
    console.log('API请求体构建完成，准备发送请求...');
    
    // 将请求体转换为JSON字符串
    const requestBodyString = JSON.stringify(requestBody);
    
    try {
      // 发送请求到OpenRouter API
      console.log('开始发送请求到OpenRouter API...');
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'PMP.AI Project Management Platform'
        },
        body: requestBodyString
      });
      
      console.log('收到API响应，状态码:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: '无法解析错误响应' }));
        console.error('OpenRouter API调用失败:', errorData);
        throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('OpenRouter API响应成功，开始处理数据...');
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        console.error('API响应格式不正确:', data);
        throw new Error('API响应格式不正确，缺少必要字段');
      }
      
      // 从AI响应中提取JSON
      const aiMessage = data.choices[0].message.content;
      console.log('AI返回的消息内容:', aiMessage.substring(0, 200) + '...');
      
      // 尝试从响应中提取JSON
      let jsonData: CompleteProjectData;
      
      try {
        // 首先尝试直接解析整个响应
        jsonData = JSON.parse(aiMessage);
        console.log('成功直接解析JSON响应');
      } catch {
        // 如果直接解析失败，尝试从文本中提取JSON部分
        console.log('直接解析JSON失败，尝试提取JSON部分');
        const jsonMatch = aiMessage.match(/```json\n([\s\S]*?)\n```/) || 
                      aiMessage.match(/```\n([\s\S]*?)\n```/) ||
                      aiMessage.match(/{[\s\S]*}/);
                      
        if (!jsonMatch) {
          console.error('无法从AI响应中提取JSON:', aiMessage);
          
          // 如果无法提取JSON，则生成一个基本的JSON结构
          console.log('生成默认的JSON结构');
          
          // 从AI响应中提取可能的项目名称
          let possibleName = "未命名项目";
          if (aiMessage.includes("项目名称") || aiMessage.includes("项目:")) {
            const nameMatch = aiMessage.match(/项目名称[：:]\s*([^\n,，.。]+)/) || 
                          aiMessage.match(/项目[：:]\s*([^\n,，.。]+)/);
            if (nameMatch && nameMatch[1]) {
              possibleName = nameMatch[1].trim();
            }
          }
          
          // 从AI响应中提取可能的项目编号
          let possibleCode = "未提供";
          if (aiMessage.includes("项目编号") || aiMessage.includes("合同编号")) {
            const codeMatch = aiMessage.match(/项目编号[：:]\s*([^\n,，.。]+)/) || 
                          aiMessage.match(/合同编号[：:]\s*([^\n,，.。]+)/);
            if (codeMatch && codeMatch[1]) {
              possibleCode = codeMatch[1].trim();
            }
          }
          
          // 创建默认的项目数据结构
          jsonData = {
            basicInfo: {
              name: possibleName,
              code: possibleCode,
              mainDepartment: "未提供",
              executeDepartment: "未提供",
              manager: "未提供",
              startDate: "未提供",
              endDate: "未提供",
              totalBudget: "未提供",
              supportBudget: "未提供",
              selfBudget: "未提供",
              description: "AI无法从文档中提取结构化信息，请检查文档格式或内容",
              type: "未提供"
            },
            milestones: [],
            budgets: [],
            team: []
          };
        } else {
          try {
            // 尝试解析提取的JSON部分
            const jsonString = jsonMatch[0].startsWith('```') ? jsonMatch[1] : jsonMatch[0];
            jsonData = JSON.parse(jsonString);
            console.log('成功解析提取的JSON部分');
          } catch (nestedParseError) {
            console.error('解析提取的JSON失败:', nestedParseError);
            throw new Error('解析AI返回的JSON数据失败');
          }
        }
      }
      
      // 验证JSON数据结构
      if (!jsonData.basicInfo) {
        console.warn('AI返回的数据缺少basicInfo字段，创建默认值');
        jsonData.basicInfo = {
          name: "未命名项目",
          code: "未提供",
          mainDepartment: "未提供",
          executeDepartment: "未提供",
          manager: "未提供",
          startDate: "未提供",
          endDate: "未提供",
          totalBudget: "未提供",
          supportBudget: "未提供",
          selfBudget: "未提供",
          description: "未提供项目描述",
          type: "未分类"
        };
      }
      
      if (!jsonData.milestones) {
        console.warn('AI返回的数据缺少milestones字段，创建默认值');
        jsonData.milestones = [];
      }
      
      if (!jsonData.budgets) {
        console.warn('AI返回的数据缺少budgets字段，创建默认值');
        jsonData.budgets = [];
      }
      
      if (!jsonData.team) {
        console.warn('AI返回的数据缺少team字段，创建默认值');
        jsonData.team = [];
      }
      
      // 确保所有必要字段都存在，如果不存在则使用默认值
      const validatedData: CompleteProjectData = {
        basicInfo: {
          name: jsonData.basicInfo.name || '未命名项目',
          code: jsonData.basicInfo.code || '未提供',
          mainDepartment: jsonData.basicInfo.mainDepartment || '未提供',
          executeDepartment: jsonData.basicInfo.executeDepartment || '未提供',
          manager: jsonData.basicInfo.manager || '未提供',
          startDate: jsonData.basicInfo.startDate || '未提供',
          endDate: jsonData.basicInfo.endDate || '未提供',
          totalBudget: jsonData.basicInfo.totalBudget || '0',
          supportBudget: jsonData.basicInfo.supportBudget || '0',
          selfBudget: jsonData.basicInfo.selfBudget || '0',
          description: jsonData.basicInfo.description || '未提供项目描述',
          type: jsonData.basicInfo.type || '未分类'
        },
        milestones: Array.isArray(jsonData.milestones) ? jsonData.milestones : [],
        budgets: Array.isArray(jsonData.budgets) ? jsonData.budgets : [],
        team: Array.isArray(jsonData.team) ? jsonData.team : []
      };
      
      console.log('数据验证完成，返回处理后的项目数据');
      return validatedData;
      
    } catch (fetchError) {
      console.error('API请求过程中出错:', fetchError);
      throw new Error(`API请求失败: ${fetchError instanceof Error ? fetchError.message : '未知错误'}`);
    }
  } catch (error) {
    console.error('分析文本时出错:', error);
    throw error; // 向上传递错误，由调用者处理
  }
};

export async function POST(request: Request) {
  try {
    // 解析请求体
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: '未提供文件' }, { status: 400 });
    }
    
    console.log('接收到文件上传:', file.name, '类型:', file.type, '大小:', file.size);
    
    // 检查API密钥是否配置
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('OpenRouter API密钥未配置，将使用模拟数据');
      const mockData = getMockProjectData();
      return NextResponse.json({ 
        success: true, 
        data: mockData,
        error: 'OpenRouter API密钥未配置，返回模拟数据',
        mockData: true
      });
    }
    
    try {
      // 读取文件内容为ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      console.log(`文件读取完成，大小: ${buffer.length} 字节`);
      
      // 将Buffer转换为字符串，使用utf-8编码，并限制长度
      let fileContent = '';
      try {
        // 检查文件类型
        const isWordDocument = file.type.includes('docx') || file.type.includes('doc');
        const isPdfDocument = file.type.includes('pdf');
        
        if (isWordDocument || isPdfDocument) {
          // 对于Word和PDF文档，使用二进制方式处理
          console.log('检测到Word或PDF文档，使用二进制方式处理');
          
          // 将二进制数据转换为Base64字符串
          fileContent = buffer.toString('base64');
          console.log(`转换为Base64字符串，长度: ${fileContent.length}`);
          
          // 添加文件类型标记，帮助提取函数识别
          fileContent = `[BINARY_${file.type}]` + fileContent;
        } else {
          // 对于文本文件，使用UTF-8编码
          console.log('使用UTF-8编码读取文件内容');
          // 只取前100KB的内容，避免处理过大的文件
          fileContent = buffer.slice(0, 100 * 1024).toString('utf-8');
        }
      } catch (encodingError) {
        console.error('文件编码转换错误:', encodingError);
        fileContent = '无法正确解析文件内容，可能是编码问题';
      }
      
      const fileType = file.type;
      
      console.log('文件内容读取完成，开始提取文本...');
      
      // 提取文本
      const extractedText = await extractTextFromFile(fileContent, fileType);
      
      // 检查提取的文本是否有效
      if (!extractedText || extractedText === '无法提取文本内容' || extractedText === '无法从文件中提取有效文本') {
        console.error('无法从文件中提取有效文本');
        return NextResponse.json({ 
          success: false, 
          error: '无法从文件中提取有效文本，请检查文件格式或内容'
        }, { status: 400 });
      }
      
      console.log('文本提取完成，开始调用AI分析...');
      
      // 使用AI分析文本
      try {
        // 强制使用AI分析，不返回模拟数据
        const analysisResult = await analyzeTextWithAI(extractedText);
        
        console.log('AI分析完成，返回结果...');
        
        // 返回分析结果
        return NextResponse.json({ 
          success: true, 
          data: analysisResult,
          mockData: false
        });
      } catch (aiError) {
        console.error('AI分析出错:', aiError);
        
        // 重试一次AI分析
        try {
          console.log('尝试重新调用AI分析...');
          const retryResult = await analyzeTextWithAI(extractedText);
          
          console.log('AI重试分析完成，返回结果...');
          return NextResponse.json({ 
            success: true, 
            data: retryResult,
            mockData: false
          });
        } catch (retryError) {
          console.error('AI重试分析也失败，返回错误:', retryError);
          
          // 返回错误信息，而不是模拟数据
          return NextResponse.json({ 
            success: false, 
            error: '无法分析文件内容，请检查文件格式或稍后重试',
            details: retryError instanceof Error ? retryError.message : '未知错误'
          }, { status: 500 });
        }
      }
    } catch (processError) {
      console.error('处理文件内容时出错:', processError);
      
      // 返回错误信息，而不是模拟数据
      return NextResponse.json({ 
        success: false, 
        error: '处理文件时出错，请检查文件格式或稍后重试',
        details: processError instanceof Error ? processError.message : '未知错误'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('处理请求时出错:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : '未知错误' 
    }, { status: 500 });
  }
}

// 获取模拟项目数据
function getMockProjectData(): CompleteProjectData {
  return {
    basicInfo: {
      name: "智慧城市交通管理系统",
      code: "SCTS-2023-001",
      mainDepartment: "市交通局",
      executeDepartment: "智慧科技有限公司",
      manager: "张明",
      startDate: "2023-01-15",
      endDate: "2023-12-31",
      totalBudget: "2,500,000",
      supportBudget: "1,800,000",
      selfBudget: "700,000",
      description: "本项目旨在建设智能交通管理系统，提高城市交通效率，减少交通拥堵，降低交通事故率。",
      type: "信息化建设"
    },
    milestones: [
      {
        phase: "第一阶段",
        startDate: "2023-01-15",
        endDate: "2023-03-31",
        mainTasks: ["需求分析", "系统设计", "数据库设计"],
        deliverables: ["需求规格说明书", "系统设计文档", "数据库设计文档"]
      },
      {
        phase: "第二阶段",
        startDate: "2023-04-01",
        endDate: "2023-09-30",
        mainTasks: ["系统开发", "单元测试", "集成测试"],
        deliverables: ["系统源代码", "测试报告", "用户手册"]
      },
      {
        phase: "第三阶段",
        startDate: "2023-10-01",
        endDate: "2023-12-31",
        mainTasks: ["系统部署", "用户培训", "系统验收"],
        deliverables: ["部署文档", "培训材料", "验收报告"]
      }
    ],
    budgets: [
      {
        category: "设备费",
        subCategory: "硬件设备",
        amount: 800000,
        source: "support",
        description: "服务器、存储设备等"
      },
      {
        category: "人员费",
        subCategory: "研发人员",
        amount: 1000000,
        source: "support",
        description: "开发人员工资"
      },
      {
        category: "其他费用",
        subCategory: "办公费",
        amount: 200000,
        source: "self",
        description: "办公用品、差旅费等"
      }
    ],
    team: [
      {
        name: "张明",
        title: "高级工程师",
        role: "项目负责人",
        workload: "12个月",
        unit: "智慧科技有限公司"
      },
      {
        name: "李强",
        title: "系统架构师",
        role: "技术负责人",
        workload: "10个月",
        unit: "智慧科技有限公司"
      },
      {
        name: "王华",
        title: "开发工程师",
        role: "开发人员",
        workload: "8个月",
        unit: "智慧科技有限公司"
      }
    ]
  };
} 