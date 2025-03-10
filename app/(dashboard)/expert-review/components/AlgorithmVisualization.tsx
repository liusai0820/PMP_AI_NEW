import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ExpertScore {
  expertId: string;
  name: string;
  scores: {
    fieldRelevance: number;
    experience: number;
    academicAchievements: number;
    availability: number;
    pastPerformance: number;
  };
  totalScore: number;
}

interface AlgorithmVisualizationProps {
  expertScores: ExpertScore[];
}

const AlgorithmVisualization: React.FC<AlgorithmVisualizationProps> = ({ expertScores }) => {
  const formatRadarData = (scores: ExpertScore['scores']) => {
    return Object.entries(scores).map(([key, value]) => ({
      dimension: key,
      score: value,
    }));
  };

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>专家匹配算法可视化</CardTitle>
        <CardDescription>基于多维度评分的专家匹配分析</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {expertScores.map((expert) => (
            <div key={expert.expertId} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">{expert.name}</h3>
              <p className="text-sm text-gray-600 mb-4">总评分: {expert.totalScore}</p>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={formatRadarData(expert.scores)}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dimension" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name={expert.name}
                      dataKey="score"
                      stroke="#2563eb"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-4">
              了解算法原理
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>专家匹配算法说明</DialogTitle>
              <DialogDescription>
                <div className="space-y-4 mt-4">
                  <section>
                    <h4 className="font-semibold mb-2">算法概述</h4>
                    <p>我们的专家匹配算法采用多维度评分机制，通过AI技术对专家进行全方位评估，确保为每个项目找到最合适的评审专家。</p>
                  </section>

                  <section>
                    <h4 className="font-semibold mb-2">评分维度</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>领域相关度 (Field Relevance): 评估专家研究领域与项目的匹配程度</li>
                      <li>专业经验 (Experience): 考虑专家的工作年限和项目经验</li>
                      <li>学术成就 (Academic Achievements): 包括论文发表、专利等学术指标</li>
                      <li>时间可用性 (Availability): 评估专家的档期匹配度</li>
                      <li>历史表现 (Past Performance): 基于历史评审的质量和及时性</li>
                    </ul>
                  </section>

                  <section>
                    <h4 className="font-semibold mb-2">算法流程</h4>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>数据收集：收集专家档案信息和项目需求</li>
                      <li>特征提取：使用NLP技术分析项目文本，提取关键特征</li>
                      <li>多维度评分：对每个维度进行独立评分</li>
                      <li>权重计算：根据项目特点动态调整各维度权重</li>
                      <li>综合排名：计算加权总分并生成最终匹配结果</li>
                    </ol>
                  </section>

                  <section>
                    <h4 className="font-semibold mb-2">算法优势</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>客观公正：基于数据驱动的评分机制</li>
                      <li>全面评估：考虑多个维度的匹配度</li>
                      <li>动态优化：通过机器学习持续改进匹配效果</li>
                      <li>高效精准：快速筛选最适合的专家人选</li>
                    </ul>
                  </section>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AlgorithmVisualization; 