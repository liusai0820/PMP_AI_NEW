import { NextResponse } from 'next/server';

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

// 完整的项目数据接口
interface CompleteProjectData {
  basicInfo: ProjectInfo;
  milestones: ProjectMilestone[];
  budgets: ProjectBudget[];
  team: TeamMember[];
}

// 分析提示词模板
const ANALYSIS_PROMPT = `
你是一位专业的项目管理顾问，擅长分析项目文档并提取关键信息。
请分析以下项目文档内容，并提取所有关键信息，组织成结构化数据。

请提取以下信息：

## 基本信息
1. 项目名称：提取完整的项目名称
2. 项目编号：提取项目的唯一标识符或编号
3. 项目主管部门：提取项目的主管部门（甲方）
4. 项目承担单位：提取项目的承担单位（乙方）
5. 项目核心负责人：提取项目经理或负责人的姓名
6. 开始日期：提取项目的计划开始日期（格式：YYYY-MM-DD）
7. 结束日期：提取项目的计划结束日期（格式：YYYY-MM-DD）
8. 总预算：提取项目的总预算金额
9. 资助金额：提取项目获得的资助金额
10. 自筹金额：提取项目的自筹金额
11. 项目描述：提取项目的简要描述或概述
12. 项目类型：提取项目的类型或分类

## 里程碑信息
对于文档中提到的每个项目阶段或里程碑，提取：
1. 阶段名称：如"第一阶段"、"第二阶段"等
2. 开始日期：该阶段的开始日期（格式：YYYY-MM-DD）
3. 结束日期：该阶段的结束日期（格式：YYYY-MM-DD）
4. 主要研究内容：该阶段的主要任务或研究内容（列表形式）
5. 考核指标/交付物：该阶段需要完成的交付物或考核指标（列表形式）

## 预算信息
对于文档中提到的每个预算项目，提取：
1. 预算类别：如"设备费"、"材料费"、"人员费"等
2. 子类别：预算的子类别（如有）
3. 金额：预算金额（数字形式，不含货币符号）
4. 资金来源：标明是"资助"还是"自筹"
5. 说明：关于该预算项的补充说明

## 团队成员信息
对于文档中提到的每个项目团队成员，提取：
1. 姓名：团队成员的姓名
2. 职称：团队成员的职称或职位
3. 项目角色：团队成员在项目中的角色
4. 工作量：团队成员在项目中的工作量（如"6个月"、"1年"等）
5. 所属单位：团队成员所属的单位或部门

请以结构化的JSON格式返回分析结果，必须严格遵循以下结构：
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
      "phase": "阶段名称",
      "startDate": "开始日期",
      "endDate": "结束日期",
      "mainTasks": ["主要任务1", "主要任务2", ...],
      "deliverables": ["交付物1", "交付物2", ...]
    },
    ...
  ],
  "budgets": [
    {
      "category": "预算类别",
      "subCategory": "子类别",
      "amount": 数字金额,
      "source": "support或self",
      "description": "说明"
    },
    ...
  ],
  "team": [
    {
      "name": "姓名",
      "title": "职称",
      "role": "项目角色",
      "workload": "工作量",
      "unit": "所属单位"
    },
    ...
  ]
}

如果某些信息在文档中未明确提及，请尽量根据上下文推断，或者留空。
对于列表类型的数据，如果文档中没有相关信息，请返回空数组。
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
const analyzeTextWithAI = async (_text: string): Promise<CompleteProjectData> => {
  try {
    // 实际项目中，这里应该调用OpenAI或其他AI服务
    // 这里使用模拟数据
    
    // 模拟AI处理延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 返回模拟的项目信息
    return {
      basicInfo: {
        name: "高时空解析度电子显微镜关键部件研究合作项目",
        code: "HZQB-KCZYB-2020031",
        mainDepartment: "国家重点研发计划项目管理办公室",
        executeDepartment: "中国科学院物理研究所",
        manager: "张明",
        startDate: "2020-07-01",
        endDate: "2023-06-30",
        totalBudget: "3,500,000",
        supportBudget: "2,800,000",
        selfBudget: "700,000",
        description: "本项目旨在研发高时空解析度电子显微镜的关键部件，提高国产电子显微镜的性能和可靠性，推动我国在电子显微镜领域的技术进步。",
        type: "科研合作项目"
      },
      milestones: [
        {
          phase: "第一阶段",
          startDate: "2020-07-01",
          endDate: "2021-06-30",
          mainTasks: [
            "电子光学系统设计与优化",
            "高精度电磁透镜研制",
            "初步样机装配与测试"
          ],
          deliverables: [
            "电子光学系统设计方案",
            "高精度电磁透镜样品",
            "初步测试报告"
          ]
        },
        {
          phase: "第二阶段",
          startDate: "2021-07-01",
          endDate: "2022-06-30",
          mainTasks: [
            "高稳定性电源系统开发",
            "高精度控制系统研制",
            "系统集成与性能测试"
          ],
          deliverables: [
            "高稳定性电源系统",
            "高精度控制系统",
            "系统集成测试报告"
          ]
        },
        {
          phase: "第三阶段",
          startDate: "2022-07-01",
          endDate: "2023-06-30",
          mainTasks: [
            "系统优化与性能提升",
            "应用示范与验证",
            "技术总结与成果推广"
          ],
          deliverables: [
            "优化后的系统性能报告",
            "应用示范案例",
            "技术总结报告与专利申请"
          ]
        }
      ],
      budgets: [
        {
          category: "设备费",
          subCategory: "购置设备",
          amount: 1200000,
          source: "support",
          description: "购买电子显微镜核心部件测试设备"
        },
        {
          category: "设备费",
          subCategory: "试制设备",
          amount: 500000,
          source: "support",
          description: "试制电磁透镜原型"
        },
        {
          category: "材料费",
          subCategory: "原材料",
          amount: 300000,
          source: "support",
          description: "特种合金材料采购"
        },
        {
          category: "测试化验加工费",
          subCategory: "测试费",
          amount: 200000,
          source: "support",
          description: "部件性能测试费用"
        },
        {
          category: "人员费",
          subCategory: "劳务费",
          amount: 600000,
          source: "support",
          description: "研究人员劳务支出"
        },
        {
          category: "差旅费",
          subCategory: "",
          amount: 150000,
          source: "self",
          description: "项目交流与考察差旅费"
        },
        {
          category: "会议费",
          subCategory: "",
          amount: 100000,
          source: "self",
          description: "项目研讨与成果展示会议"
        },
        {
          category: "国际合作交流费",
          subCategory: "",
          amount: 450000,
          source: "self",
          description: "国际专家咨询与技术交流"
        }
      ],
      team: [
        {
          name: "张明",
          title: "研究员",
          role: "项目负责人",
          workload: "36个月",
          unit: "中国科学院物理研究所"
        },
        {
          name: "李强",
          title: "副研究员",
          role: "电子光学系统设计",
          workload: "30个月",
          unit: "中国科学院物理研究所"
        },
        {
          name: "王华",
          title: "高级工程师",
          role: "电磁透镜研制",
          workload: "24个月",
          unit: "中国科学院物理研究所"
        },
        {
          name: "刘芳",
          title: "副研究员",
          role: "控制系统开发",
          workload: "24个月",
          unit: "中国科学院电子学研究所"
        },
        {
          name: "陈明",
          title: "工程师",
          role: "系统集成与测试",
          workload: "18个月",
          unit: "中国科学院物理研究所"
        }
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
    const projectData = await analyzeTextWithAI(extractedText);
    
    // 返回分析结果
    return NextResponse.json({ projectData });
    
  } catch (error) {
    console.error('处理请求时出错:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器内部错误' },
      { status: 500 }
    );
  }
} 