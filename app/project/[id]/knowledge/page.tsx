import React from 'react';
import { DocumentUploader } from '@/components/knowledge/DocumentUploader';
import { ProjectQAForm } from '@/components/knowledge/ProjectQAForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectKnowledgePageProps {
  params: {
    id: string;
  };
}

export default async function ProjectKnowledgePage({ params }: ProjectKnowledgePageProps) {
  const projectId = params.id;
  
  // 这里可以添加获取项目信息的逻辑
  // const project = await getProject(projectId);
  const projectName = "示例项目"; // 实际应用中应该从数据库获取
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{projectName} - 知识库</h1>
        <p className="text-muted-foreground mt-2">
          上传项目文档并利用AI进行智能问答
        </p>
      </div>
      
      <Tabs defaultValue="qa" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="qa">智能问答</TabsTrigger>
          <TabsTrigger value="upload">上传文档</TabsTrigger>
        </TabsList>
        
        <TabsContent value="qa" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <ProjectQAForm projectId={projectId} projectName={projectName} />
            
            <Card>
              <CardHeader>
                <CardTitle>使用提示</CardTitle>
                <CardDescription>如何有效地使用项目智能问答</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">提问技巧</h3>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground mt-2 space-y-1">
                    <li>使用清晰、具体的问题获得更准确的回答</li>
                    <li>可以询问项目目标、进展、风险、评审意见等信息</li>
                    <li>尝试使用"为什么"、"如何"、"什么时候"等开放性问题</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium">示例问题</h3>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground mt-2 space-y-1">
                    <li>这个项目的主要目标是什么？</li>
                    <li>项目的关键风险有哪些？</li>
                    <li>最近一次评审的主要意见是什么？</li>
                    <li>项目的技术路线是怎样的？</li>
                    <li>项目团队的组成情况如何？</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="upload" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DocumentUploader 
              projectId={projectId} 
              projectName={projectName}
              onUploadComplete={(documentId) => {
                console.log('文档上传完成:', documentId);
                // 可以添加上传完成后的逻辑，如刷新文档列表等
              }}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>文档上传说明</CardTitle>
                <CardDescription>如何准备和上传项目文档</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">支持的文档类型</h3>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground mt-2 space-y-1">
                    <li>PDF文档（包括扫描型和文字型）</li>
                    <li>Word文档（.doc, .docx）</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium">文档处理流程</h3>
                  <ol className="list-decimal pl-5 text-sm text-muted-foreground mt-2 space-y-1">
                    <li>上传文档后，系统会自动提取文本内容</li>
                    <li>对于扫描型PDF，系统会使用OCR技术识别文字</li>
                    <li>文本内容会被分割成小块并进行向量化处理</li>
                    <li>处理完成后，文档内容将可用于智能问答</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="font-medium">最佳实践</h3>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground mt-2 space-y-1">
                    <li>上传清晰、完整的文档以获得更好的识别效果</li>
                    <li>为文档添加准确的类型和描述，便于后续管理</li>
                    <li>建议上传项目报告、评审报告、里程碑报告等关键文档</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 