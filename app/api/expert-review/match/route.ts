import { NextRequest, NextResponse } from 'next/server';

// 定义专家接口
interface Expert {
  id: string;
  name: string;
  title: string;
  organization: string;
  field: string;
  expertise: string[];
  publications: number;
  projects: number;
  patents: number;
  avatar: string;
  matchScore: number;
  matchReason: string;
}

// 定义项目接口
interface Project {
  id: string;
  name: string;
  code: string;
  type: string;
  description: string;
  keywords: string[];
}

// 定义匹配结果接口
interface MatchResult {
  analysis: string;
  experts: Expert[];
}

/**
 * 专家匹配API
 * 分析项目内容并匹配合适的专家
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求
    const data = await request.json();
    const { projectId } = data;
    
    if (!projectId) {
      return NextResponse.json(
        { error: '请提供项目ID' },
        { status: 400 }
      );
    }
    
    // 模拟项目数据获取
    const project: Project = {
      id: projectId,
      name: '深圳国际工业与应用数学中心项目',
      code: 'SZCIAM-2023-001',
      type: '研发类',
      description: '建立国际一流的应用数学研究中心，促进数学与工业应用的结合，解决实际工程问题。',
      keywords: ['应用数学', '工业应用', '数据分析', '算法研究']
    };
    
    // 模拟分析结果
    const analysisText = `项目《${project.name}》分析结果：
      
1. 项目类型：${project.type}
2. 关键技术领域：${project.keywords.join('、')}
3. 项目复杂度：中高
4. 所需专业知识：应用数学、算法设计、数据分析、工业应用

根据项目特点，系统推荐以下专业领域的专家：
- 应用数学专家
- 算法设计专家
- 数据分析专家
- 工业应用专家`;
    
    // 模拟专家匹配结果
    const matchedExperts: Expert[] = [
      {
        id: '1',
        name: '张智能',
        title: '教授/博士生导师',
        organization: '清华大学',
        field: '应用数学',
        expertise: ['数值分析', '计算数学', '优化理论'],
        publications: 78,
        projects: 12,
        patents: 5,
        avatar: '/avatars/expert1.jpg',
        matchScore: 95,
        matchReason: '专攻应用数学领域，在数值分析和优化理论方面有丰富经验，曾主持多个相关项目'
      },
      {
        id: '2',
        name: '李数据',
        title: '研究员',
        organization: '中国科学院',
        field: '数据科学',
        expertise: ['数据挖掘', '统计学习', '模式识别'],
        publications: 45,
        projects: 8,
        patents: 3,
        avatar: '/avatars/expert2.jpg',
        matchScore: 88,
        matchReason: '数据科学专家，在数据挖掘和统计学习方面有深入研究，对项目中的数据分析需求匹配度高'
      },
      {
        id: '3',
        name: '王工程',
        title: '高级工程师',
        organization: '华为技术有限公司',
        field: '工业应用',
        expertise: ['工业数学', '工程优化', '系统建模'],
        publications: 12,
        projects: 20,
        patents: 8,
        avatar: '/avatars/expert3.jpg',
        matchScore: 82,
        matchReason: '拥有丰富的工业应用经验，特别是在工程优化和系统建模方面，能够提供实用的工程建议'
      },
      {
        id: '4',
        name: '赵学者',
        title: '副教授',
        organization: '北京大学',
        field: '计算数学',
        expertise: ['算法设计', '数值模拟', '科学计算'],
        publications: 35,
        projects: 6,
        patents: 2,
        avatar: '/avatars/expert4.jpg',
        matchScore: 75,
        matchReason: '在算法设计和数值模拟方面有专长，对项目的计算方法有参考价值'
      },
      {
        id: '5',
        name: '钱专家',
        title: '首席科学家',
        organization: '百度研究院',
        field: '人工智能',
        expertise: ['机器学习', '深度学习', '优化算法'],
        publications: 60,
        projects: 15,
        patents: 10,
        avatar: '/avatars/expert5.jpg',
        matchScore: 70,
        matchReason: '人工智能领域专家，在机器学习和优化算法方面有深厚积累，可为项目提供智能化解决方案'
      }
    ];
    
    // 构建响应
    const result: MatchResult = {
      analysis: analysisText,
      experts: matchedExperts
    };
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('专家匹配失败:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: '专家匹配失败',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 