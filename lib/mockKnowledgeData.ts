import { KnowledgeItem, KnowledgeChunk } from '@/types';

// 模拟知识库数据
export const mockKnowledgeItems: KnowledgeItem[] = [
  {
    id: '1',
    title: '项目范围管理的最佳实践',
    category: '项目管理基础',
    content: `
      <h2>项目范围管理概述</h2>
      <p>项目范围管理是项目管理中最重要的领域之一，它确保项目包含完成项目所需的所有工作，且仅包含必要的工作。有效的范围管理对于项目成功至关重要。</p>
      
      <h3>范围管理的关键过程</h3>
      <ol>
        <li><strong>规划范围管理</strong>：创建范围管理计划，确定如何定义、验证和控制项目范围。</li>
        <li><strong>收集需求</strong>：确定、记录并管理相关方的需求，以满足项目目标。</li>
        <li><strong>定义范围</strong>：制定项目和产品的详细描述。</li>
        <li><strong>创建WBS</strong>：将项目可交付成果和项目工作分解为更小、更易于管理的组件。</li>
        <li><strong>确认范围</strong>：正式验收已完成的项目可交付成果。</li>
        <li><strong>控制范围</strong>：监控项目和产品范围状态，管理范围基准变更。</li>
      </ol>
      
      <h3>工作分解结构(WBS)</h3>
      <p>WBS是将项目工作分解为较小、更易管理的部分的层级分解。WBS组织并定义了项目的总范围，代表了项目团队已确定的工作。</p>
      
      <h3>范围蔓延的管理</h3>
      <p>范围蔓延是指项目范围的不受控制的扩展。这通常发生在没有适当的变更控制流程或需求管理不当时。有效的范围管理包括建立变更控制流程和保持项目文档的更新。</p>
    `,
    summary: '本文介绍了项目范围管理的关键步骤和最佳实践，包括如何定义项目范围、创建工作分解结构(WBS)、验证和控制范围等内容。',
    tags: ['范围管理', 'WBS', '需求分析'],
    autoTags: ['项目管理', '范围蔓延', 'PMBOK'],
    author: '张明',
    createdAt: '2023-05-15T08:30:00Z',
    updatedAt: '2023-05-15T08:30:00Z',
    sourceDocument: '/documents/项目范围管理最佳实践.pdf',
    sourceType: 'pdf',
    fileSize: 2.5 * 1024 * 1024,
    embeddings: true,
    vectorId: 'vec_1',
    relatedItems: ['2', '4', '7'],
    views: 1245
  },
  {
    id: '2',
    title: '如何有效识别和应对项目风险',
    category: '风险管理',
    content: `
      <h2>项目风险管理简介</h2>
      <p>风险管理是项目成功的关键因素之一。项目风险是不确定的事件或条件，如果发生，会对项目目标产生积极或消极的影响。</p>
      
      <h3>风险管理过程</h3>
      <ol>
        <li><strong>规划风险管理</strong>：定义如何开展项目风险管理活动。</li>
        <li><strong>识别风险</strong>：确定可能影响项目的风险并记录其特征。</li>
        <li><strong>定性风险分析</strong>：评估风险的优先级，以便进一步分析或采取行动。</li>
        <li><strong>定量风险分析</strong>：对项目整体目标的已识别风险的综合影响进行数值分析。</li>
        <li><strong>规划风险应对</strong>：制定提高机会、降低威胁的方案和行动。</li>
        <li><strong>实施风险应对</strong>：执行商定的风险应对计划。</li>
        <li><strong>监控风险</strong>：监控已识别风险的状态，识别新风险，评估风险过程的有效性。</li>
      </ol>
      
      <h3>常见的风险应对策略</h3>
      <h4>消极风险或威胁的应对策略：</h4>
      <ul>
        <li><strong>规避</strong>：改变项目计划，以消除威胁。</li>
        <li><strong>转移</strong>：将风险影响及应对责任转移给第三方。</li>
        <li><strong>减轻</strong>：采取行动降低风险发生的概率或影响。</li>
        <li><strong>接受</strong>：承认风险的存在，但不采取任何行动。</li>
      </ul>
      
      <h4>积极风险或机会的应对策略：</h4>
      <ul>
        <li><strong>利用</strong>：确保机会一定会实现。</li>
        <li><strong>共享</strong>：将部分或全部机会的所有权分配给最能捕获机会的第三方。</li>
        <li><strong>提高</strong>：增加机会发生的概率或积极影响。</li>
        <li><strong>接受</strong>：愿意在机会出现时利用它，但不主动追求。</li>
      </ul>
    `,
    summary: '风险管理是项目成功的关键因素之一。本文详细介绍了风险识别、分析、应对和监控的完整流程，并提供了实用的风险登记表模板。',
    tags: ['风险识别', '风险评估', '风险应对'],
    autoTags: ['PMBOK', '风险登记册', '不确定性'],
    author: '李华',
    createdAt: '2023-06-22T10:15:00Z',
    updatedAt: '2023-06-22T10:15:00Z',
    sourceDocument: '/documents/项目风险管理指南.docx',
    sourceType: 'docx',
    fileSize: 1.8 * 1024 * 1024,
    embeddings: true,
    vectorId: 'vec_2',
    relatedItems: ['1', '5', '8'],
    views: 986
  },
  {
    id: '3',
    title: '项目质量保证与控制技术',
    category: '质量管理',
    content: `
      <h2>项目质量管理概述</h2>
      <p>项目质量管理包括将组织的质量政策应用于项目的过程和活动。它确保项目满足既定需求和相关方的期望。</p>
      
      <h3>质量管理的关键过程</h3>
      <ol>
        <li><strong>规划质量管理</strong>：识别项目的质量要求和标准，并记录项目如何证明符合性。</li>
        <li><strong>管理质量</strong>：将组织的质量政策转化为项目的可执行质量活动。</li>
        <li><strong>控制质量</strong>：监控和记录质量活动的结果，以评估绩效并确保项目输出完整、正确且满足客户期望。</li>
      </ol>
      
      <h3>常用的质量管理工具</h3>
      <h4>七种基本质量工具：</h4>
      <ul>
        <li><strong>因果图（鱼骨图）</strong>：识别问题的潜在原因。</li>
        <li><strong>流程图</strong>：显示一个过程中的步骤序列和可能的分支。</li>
        <li><strong>核对表</strong>：结构化的工具，用于收集和分析数据。</li>
        <li><strong>直方图</strong>：显示数值数据的频率分布。</li>
        <li><strong>帕累托图</strong>：识别造成大多数问题的少数关键原因。</li>
        <li><strong>控制图</strong>：确定一个过程是否稳定或是否具有可预测的性能。</li>
        <li><strong>散点图</strong>：显示两个变量之间的关系。</li>
      </ul>
      
      <h3>质量管理的成本</h3>
      <p>质量成本包括为确保质量而进行的所有工作的成本，以及由于未达到质量而产生的成本。这些通常分为：</p>
      <ul>
        <li><strong>预防成本</strong>：防止缺陷发生的成本。</li>
        <li><strong>评估成本</strong>：评估产品或服务质量的成本。</li>
        <li><strong>失败成本</strong>：由于产品或服务未能满足要求或相关方需求而产生的成本。</li>
      </ul>
    `,
    summary: '本文探讨了项目质量管理的核心概念，包括质量规划、质量保证和质量控制。文章还介绍了几种常用的质量管理工具，如因果图、控制图和帕累托分析等。',
    tags: ['质量保证', '质量控制', '质量工具'],
    autoTags: ['PMBOK', '质量成本', '持续改进'],
    author: '王强',
    createdAt: '2023-04-10T14:20:00Z',
    updatedAt: '2023-04-10T14:20:00Z',
    sourceDocument: '/documents/项目质量管理技术.pdf',
    sourceType: 'pdf',
    fileSize: 3.2 * 1024 * 1024,
    embeddings: true,
    vectorId: 'vec_3',
    relatedItems: ['1', '2', '6'],
    views: 754
  },
  {
    id: '4',
    title: '敏捷项目管理方法论概述',
    category: '项目管理基础',
    content: `
      <h2>敏捷项目管理简介</h2>
      <p>敏捷项目管理是一种迭代的项目管理方法，强调灵活性、协作和客户价值。它源于软件开发领域，但现已扩展到各种类型的项目中。</p>
      
      <h3>敏捷宣言的核心价值观</h3>
      <ul>
        <li>个体和互动高于流程和工具</li>
        <li>工作的软件高于详尽的文档</li>
        <li>客户合作高于合同谈判</li>
        <li>响应变化高于遵循计划</li>
      </ul>
      
      <h3>常见的敏捷方法论</h3>
      <h4>Scrum</h4>
      <p>Scrum是最流行的敏捷框架之一，它将工作分解为固定长度的迭代（称为Sprint），通常为2-4周。关键角色包括：</p>
      <ul>
        <li><strong>产品负责人</strong>：定义产品愿景，管理产品待办事项列表。</li>
        <li><strong>Scrum主管</strong>：促进Scrum过程，移除障碍。</li>
        <li><strong>开发团队</strong>：自组织团队，负责交付产品增量。</li>
      </ul>
      
      <h4>看板（Kanban）</h4>
      <p>看板是一种可视化工作流程的方法，强调持续交付而不是固定的迭代。它限制在制品数量，帮助识别瓶颈并优化流程。</p>
      
      <h4>极限编程（XP）</h4>
      <p>XP专注于技术实践，如测试驱动开发、持续集成、结对编程和简单设计，以提高软件质量和响应变化的能力。</p>
      
      <h3>敏捷与传统项目管理的比较</h3>
      <table>
        <tr>
          <th>特性</th>
          <th>敏捷方法</th>
          <th>传统方法（瀑布）</th>
        </tr>
        <tr>
          <td>需求</td>
          <td>迭代发现和细化</td>
          <td>前期完全定义</td>
        </tr>
        <tr>
          <td>交付</td>
          <td>增量式和迭代式</td>
          <td>项目结束时一次性交付</td>
        </tr>
        <tr>
          <td>变更</td>
          <td>欢迎变更，即使在后期</td>
          <td>通过严格的变更控制流程管理</td>
        </tr>
        <tr>
          <td>团队结构</td>
          <td>自组织，跨职能</td>
          <td>层级式，专业化</td>
        </tr>
        <tr>
          <td>文档</td>
          <td>适量，按需</td>
          <td>全面，详尽</td>
        </tr>
      </table>
    `,
    summary: '本文介绍了敏捷项目管理的基本原则和实践，包括Scrum、看板和极限编程等方法论。文章还对比了传统瀑布式方法与敏捷方法的异同。',
    tags: ['敏捷', 'Scrum', '看板'],
    autoTags: ['迭代开发', '自组织团队', '持续交付'],
    author: '赵燕',
    createdAt: '2023-07-05T09:45:00Z',
    updatedAt: '2023-07-05T09:45:00Z',
    sourceDocument: '/documents/敏捷项目管理概述.docx',
    sourceType: 'docx',
    fileSize: 2.1 * 1024 * 1024,
    embeddings: true,
    vectorId: 'vec_4',
    relatedItems: ['1', '7', '9'],
    views: 1102
  },
  {
    id: '5',
    title: '项目成本估算与预算编制指南',
    category: '成本管理',
    content: `
      <h2>项目成本管理概述</h2>
      <p>项目成本管理包括规划、估算、预算和控制成本的过程，确保项目在批准的预算内完成。</p>
      
      <h3>成本估算技术</h3>
      <ol>
        <li><strong>类比估算</strong>：使用类似项目的实际成本作为当前项目成本的基础。这是一种自上而下的估算技术，通常在项目早期阶段使用。</li>
        <li><strong>参数估算</strong>：使用统计关系将历史数据和其他变量（如建筑面积）与成本联系起来。</li>
        <li><strong>自下而上估算</strong>：通过估算单个工作包的成本，然后汇总得到项目总成本。这种方法最准确，但也最耗时。</li>
        <li><strong>三点估算</strong>：使用最乐观（O）、最可能（M）和最悲观（P）三种估算，计算期望值：(O + 4M + P) / 6。</li>
        <li><strong>储备分析</strong>：包括应急储备（已知风险）和管理储备（未知风险）。</li>
      </ol>
      
      <h3>项目预算编制</h3>
      <p>项目预算是经批准的成本估算，包括所有授权的资金。预算编制过程包括：</p>
      <ul>
        <li>汇总估算的成本</li>
        <li>添加应急储备</li>
        <li>建立成本基准</li>
        <li>添加管理储备</li>
        <li>确定资金需求</li>
      </ul>
      
      <h3>成本控制</h3>
      <p>成本控制包括监控项目状态，更新项目成本，管理成本变更。常用的工具和技术包括：</p>
      <ul>
        <li><strong>挣值管理（EVM）</strong>：将范围、进度和资源测量结合起来，评估项目绩效和进展。</li>
        <li><strong>偏差分析</strong>：比较计划与实际绩效。</li>
        <li><strong>趋势分析</strong>：检查项目绩效随时间的变化。</li>
        <li><strong>绩效审查</strong>：比较成本绩效与进度和技术绩效。</li>
      </ul>
      
      <h3>挣值管理关键指标</h3>
      <ul>
        <li><strong>计划价值（PV）</strong>：截至某日应完成的预算工作。</li>
        <li><strong>挣值（EV）</strong>：已完成工作的预算价值。</li>
        <li><strong>实际成本（AC）</strong>：完成工作的实际成本。</li>
        <li><strong>成本偏差（CV）</strong>：EV - AC，负值表示超支。</li>
        <li><strong>进度偏差（SV）</strong>：EV - PV，负值表示落后于计划。</li>
        <li><strong>成本绩效指数（CPI）</strong>：EV / AC，小于1表示成本效率低于计划。</li>
        <li><strong>进度绩效指数（SPI）</strong>：EV / PV，小于1表示进度落后于计划。</li>
        <li><strong>完工估算（EAC）</strong>：预计的总成本。</li>
        <li><strong>完工尚需估算（ETC）</strong>：完成剩余工作的预计成本。</li>
      </ul>
    `,
    summary: '准确的成本估算是项目成功的基础。本文详细介绍了自下而上估算、类比估算和参数估算等技术，以及如何编制和管理项目预算。',
    tags: ['成本估算', '预算编制', '挣值管理'],
    autoTags: ['PMBOK', '成本控制', '储备分析'],
    author: '陈明',
    createdAt: '2023-03-18T11:30:00Z',
    updatedAt: '2023-03-18T11:30:00Z',
    sourceDocument: '/documents/项目成本管理指南.xlsx',
    sourceType: 'xlsx',
    fileSize: 1.5 * 1024 * 1024,
    embeddings: true,
    vectorId: 'vec_5',
    relatedItems: ['2', '6', '8'],
    views: 876
  }
];

// 模拟向量数据
export const mockVectors: Record<string, number[]> = {
  'vec_1': Array.from({ length: 384 }, () => Math.random() * 2 - 1), // 随机生成384维向量
  'vec_2': Array.from({ length: 384 }, () => Math.random() * 2 - 1),
  'vec_3': Array.from({ length: 384 }, () => Math.random() * 2 - 1),
  'vec_4': Array.from({ length: 384 }, () => Math.random() * 2 - 1),
  'vec_5': Array.from({ length: 384 }, () => Math.random() * 2 - 1),
};

// 模拟知识块数据
export const mockKnowledgeChunks: KnowledgeChunk[] = [
  {
    id: 'chunk_1_1',
    knowledgeId: '1',
    content: '项目范围管理是项目管理中最重要的领域之一，它确保项目包含完成项目所需的所有工作，且仅包含必要的工作。有效的范围管理对于项目成功至关重要。',
    index: 0,
    vector: mockVectors['vec_1'].slice(0, 128), // 使用部分向量作为示例
    metadata: {
      title: '项目范围管理概述',
      position: 'beginning'
    }
  },
  {
    id: 'chunk_1_2',
    knowledgeId: '1',
    content: '范围管理的关键过程包括：规划范围管理、收集需求、定义范围、创建WBS、确认范围和控制范围。',
    index: 1,
    vector: mockVectors['vec_1'].slice(128, 256),
    metadata: {
      title: '范围管理的关键过程',
      position: 'middle'
    }
  },
  {
    id: 'chunk_1_3',
    knowledgeId: '1',
    content: 'WBS是将项目工作分解为较小、更易管理的部分的层级分解。WBS组织并定义了项目的总范围，代表了项目团队已确定的工作。',
    index: 2,
    vector: mockVectors['vec_1'].slice(256, 384),
    metadata: {
      title: '工作分解结构(WBS)',
      position: 'end'
    }
  },
  {
    id: 'chunk_2_1',
    knowledgeId: '2',
    content: '风险管理是项目成功的关键因素之一。项目风险是不确定的事件或条件，如果发生，会对项目目标产生积极或消极的影响。',
    index: 0,
    vector: mockVectors['vec_2'].slice(0, 128),
    metadata: {
      title: '项目风险管理简介',
      position: 'beginning'
    }
  },
  {
    id: 'chunk_2_2',
    knowledgeId: '2',
    content: '风险管理过程包括：规划风险管理、识别风险、定性风险分析、定量风险分析、规划风险应对、实施风险应对和监控风险。',
    index: 1,
    vector: mockVectors['vec_2'].slice(128, 256),
    metadata: {
      title: '风险管理过程',
      position: 'middle'
    }
  }
];

// 模拟相似度计算函数
export function calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
  // 确保向量长度相同
  const minLength = Math.min(vec1.length, vec2.length);
  const v1 = vec1.slice(0, minLength);
  const v2 = vec2.slice(0, minLength);
  
  // 计算点积
  let dotProduct = 0;
  for (let i = 0; i < minLength; i++) {
    dotProduct += v1[i] * v2[i];
  }
  
  // 计算向量模长
  const magnitude1 = Math.sqrt(v1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(v2.reduce((sum, val) => sum + val * val, 0));
  
  // 计算余弦相似度
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }
  
  return dotProduct / (magnitude1 * magnitude2);
}

// 模拟向量搜索函数
export function searchSimilarVectors(queryVector: number[], threshold: number = 0.7): KnowledgeChunk[] {
  const results = mockKnowledgeChunks
    .map(chunk => ({
      ...chunk,
      similarity: calculateCosineSimilarity(queryVector, chunk.vector)
    }))
    .filter(chunk => chunk.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity);
  
  return results;
}

// 模拟文本到向量的转换函数
export function textToVector(text: string): number[] {
  // 这里只是模拟，实际应用中应该调用OpenAI API或其他嵌入模型
  // 生成一个随机向量作为示例
  // 使用文本长度作为随机种子，使相同文本产生相似向量
  const seed = text.length % 10;
  return Array.from({ length: 384 }, (_, i) => Math.cos(i + seed) * Math.random());
}

// 模拟自动标签生成函数
export function generateAutoTags(content: string): string[] {
  // 这里只是模拟，实际应用中应该调用OpenAI API或其他NLP模型
  // 从内容中提取一些关键词作为标签
  const commonTags = ['项目管理', 'PMBOK', '最佳实践', '方法论', '工具', '技术', '流程', '框架'];
  // 使用内容长度作为随机种子
  const seed = content.length % commonTags.length;
  // 随机选择2-4个标签
  const numTags = Math.floor(Math.random() * 3) + 2;
  const shuffled = [...commonTags].sort((a, b) => 
    (a.charCodeAt(0) + seed) - (b.charCodeAt(0) + seed)
  );
  return shuffled.slice(0, numTags);
} 