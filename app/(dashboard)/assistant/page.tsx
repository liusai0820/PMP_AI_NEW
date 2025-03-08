"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Send, FileText, Bot, X, User } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// 导入真实项目数据
// 不再直接导入CSV文件
// import projectsData from '/basicinfomation.csv';

// 定义 CSV 数据的类型
interface ProjectCSVData {
  '项目名称': string;
  '产业领域': string;
  '进展状态': string;
  '委托单位': string;
  '项目单位': string;
  '建设开始日期': string;
  '建设结束日期': string;
  '管理状态': string;
  '项目经理': string;
  '项目负责人': string;
  '项目简介': string;
  '项目背景': string;
  '资金来源': string;
  '政府资助（万元）': string;
  '自筹资金（万元）': string;
  [key: string]: string;
}

interface Project {
  id: string;
  name: string;
  department: string;
  progress: number;
  documents: number;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  sources?: {
    content: string;
    metadata: {
      documentId: string;
      name: string;
    };
  }[];
}

// 备用项目数据，以防CSV解析失败
const mockProjects: Project[] = [
  { id: 'proj-001', name: '高时空解析度电子显微镜关键部分研究', department: '研发部', progress: 75, documents: 12 },
  { id: 'proj-002', name: '先进航空材料预应力工程与纳米技术研发', department: '研发部', progress: 60, documents: 8 },
  { id: 'proj-003', name: '深港智慧医疗机器人开放创新平台', department: '医疗部', progress: 90, documents: 15 },
  { id: 'proj-004', name: '大湾区生物医药研发创新中心', department: '医疗部', progress: 45, documents: 7 },
  { id: 'proj-005', name: '三相位法百万级像素飞行时间成像机理研究', department: '研发部', progress: 30, documents: 5 },
  { id: 'proj-006', name: '低功耗、高速、高可靠性VCSEL光芯片机理研究', department: '研发部', progress: 85, documents: 10 },
  { id: 'proj-007', name: '香港中文大学（深圳）未来智联网络研究院', department: '研发部', progress: 50, documents: 9 },
  { id: 'proj-008', name: '面向行业赋能的计算机视觉关键技术研究', department: '研发部', progress: 70, documents: 11 },
];

// 模拟建议问题
const suggestedQuestions: string[] = [
  "如何提高研发项目的效率?",
  "医疗器械研发项目的质量控制措施有哪些?",
  "高科技项目的风险管理策略",
  "研发项目的成本控制方法",
  "如何有效管理跨部门协作项目"
];

// 添加一个格式化日期的函数，确保客户端和服务器渲染一致
const formatTime = (timestamp: string) => {
  try {
    const date = new Date(timestamp);
    // 使用固定格式而不是依赖本地化
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  } catch {
    return '00:00:00';
  }
};

export default function AssistantPage() {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: '您好！我是PMP.AI智能项目助手，可以帮您分析和管理研发项目、医疗项目等各类高科技项目。请问有什么可以帮助您的？',
      timestamp: new Date().toISOString()
    }
  ]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectsData, setProjectsData] = useState<ProjectCSVData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 获取CSV数据
  useEffect(() => {
    const fetchCSVData = async () => {
      try {
        const response = await fetch('/basicinfomation.csv');
        const csvText = await response.text();
        
        // 简单的CSV解析
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          const obj: Record<string, string> = {};
          headers.forEach((header, i) => {
            obj[header.trim()] = values[i]?.trim() || '';
          });
          return obj as ProjectCSVData;
        });
        
        setProjectsData(data);
        
        // 解析项目数据
        const parsedProjects = data.map((row, index) => ({
          id: `proj-${index + 1}`.padStart(7, '0'),
          name: row['项目名称'] || '未命名项目',
          department: row['产业领域'] || '未分类',
          progress: parseInt(row['进展状态'] === '进行中' ? '75' : row['进展状态'] === '已完结' ? '100' : '50'),
          documents: Math.floor(Math.random() * 15) + 5, // 模拟文档数量
        }));
        
        setProjects(parsedProjects.length > 0 ? parsedProjects : mockProjects);
      } catch (error) {
        console.error('获取CSV数据失败:', error);
        setProjects(mockProjects);
      }
    };
    
    fetchCSVData();
  }, []);

  // 获取项目详细信息
  const getProjectDetails = (projectName: string): ProjectCSVData | null => {
    try {
      const project = projectsData.find(p => p['项目名称'] === projectName);
      return project || null;
    } catch (error) {
      console.error('获取项目详情失败:', error);
      return null;
    }
  };

  // 过滤项目
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 发送聊天消息
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;

    // 添加用户消息
    const userMessage: Message = {
      role: 'user',
      content: chatInput,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);
    
    try {
      console.log('发送消息到助手API:', chatInput);
      
      // 准备历史消息，只包含最近的10条消息
      const recentMessages = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // 如果选择了项目，添加项目上下文
      let contextMessage = '';
      if (selectedProject) {
        const projectDetails = getProjectDetails(selectedProject.name);
        if (projectDetails) {
          contextMessage = `用户当前正在查询项目"${selectedProject.name}"的信息。以下是项目的基本信息：
项目名称：${projectDetails['项目名称'] || selectedProject.name}
委托单位：${projectDetails['委托单位'] || '未知'}
项目单位：${projectDetails['项目单位'] || '未知'}
产业领域：${projectDetails['产业领域'] || '未知'}
建设时间：${projectDetails['建设开始日期'] || '未知'} 至 ${projectDetails['建设结束日期'] || '未知'}
进展状态：${projectDetails['进展状态'] || '未知'}
管理状态：${projectDetails['管理状态'] || '未知'}
项目经理：${projectDetails['项目经理'] || '未知'}
项目负责人：${projectDetails['项目负责人'] || '未知'}
项目简介：${projectDetails['项目简介'] || '未知'}`;
        }
      }
      
      // 调用智能助手API
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: contextMessage ? `${contextMessage}\n\n用户问题: ${chatInput}` : chatInput,
          history: recentMessages
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API响应错误:', response.status, errorText);
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API响应数据:', data);
      
      if (!data.success) {
        throw new Error(data.error || '请求失败');
      }
      
      // 添加AI回复
      const aiResponse: Message = {
        role: 'ai',
        content: data.response,
        timestamp: new Date().toISOString()
      };
      
      // 如果是项目相关问题，添加知识库来源
      if (selectedProject) {
        aiResponse.sources = [
          {
            content: '回答基于项目管理系统中的项目数据和知识库。',
            metadata: {
              documentId: `project_${selectedProject.id}`,
              name: `${selectedProject.name} 项目档案`
            }
          }
        ];
      }
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('获取AI回复失败:', error);
      
      // 添加错误消息
      const errorMessage: Message = {
        role: 'ai',
        content: '抱歉，我暂时无法回答您的问题，请稍后再试。',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 选择项目
  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    
    // 当选择项目时，添加一条系统消息
    const systemMessage: Message = {
      role: 'ai',
      content: `已选择项目"${project.name}"。您现在可以询问关于该项目的具体问题，我将基于项目知识库为您提供答案。`,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, systemMessage]);
    
    // 提示用户
    toast.success(`已选择项目: ${project.name}`);
  };

  // 使用建议问题
  const handleSuggestedQuestion = (question: string) => {
    setChatInput(question);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">智能助手</h1>
          {selectedProject && (
            <Badge className="px-3 py-1.5 text-sm bg-primary/10 border-primary/20">
              当前项目: {selectedProject.name}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 ml-2 rounded-full"
                onClick={() => setSelectedProject(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-140px)]">
          {/* 左侧项目列表 */}
          <div className="col-span-3 h-full">
            <Card className="h-full">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-base">项目列表</CardTitle>
                <div className="mt-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="搜索项目..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-13rem)]">
                  <div className="space-y-1 px-2">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        className={`p-3 rounded-md cursor-pointer transition-colors ${
                          selectedProject?.id === project.id
                            ? 'bg-primary/10 hover:bg-primary/15'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => handleProjectSelect(project)}
                      >
                        <div className="text-sm font-medium break-words" title={project.name}>
                          {project.name.length > 20 ? `${project.name.substring(0, 20)}...` : project.name}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-xs truncate max-w-[60%]" title={project.department}>
                            {project.department || '未指定部门'}
                          </Badge>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="mt-2 h-1 w-full bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          {/* 右侧聊天区域 */}
          <div className="col-span-9 h-full">
            <Card className="h-full flex flex-col">
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between shrink-0">
                <div className="flex items-center">
                  <Bot className="h-4 w-4 mr-2" />
                  <CardTitle className="text-base">智能对话</CardTitle>
                </div>
                {selectedProject && (
                  <div className="text-xs text-muted-foreground">
                    您可以询问关于项目的具体问题，系统将自动查询项目知识库
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                {/* 聊天消息区域 - 使用固定高度和overflow-y-auto确保内部滚动 */}
                <div 
                  ref={chatContainerRef}
                  className="flex-1 overflow-hidden relative"
                >
                  <ScrollArea className="h-full w-full absolute inset-0">
                    <div className="p-4 space-y-4">
                      {messages.map((message, index) => (
                        <div key={index} className="space-y-2">
                          <div
                            className={`flex items-start gap-2 ${
                              message.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            {message.role === 'ai' && (
                              <Avatar className="h-8 w-8 shrink-0 bg-primary/10">
                                <AvatarImage src="/images/ai-assistant.png" alt="AI助手" />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  <Bot className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                            
                            <div
                              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                message.role === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <div className="text-sm markdown-content">
                                {message.role === 'user' ? (
                                  <div className="whitespace-pre-line">{message.content}</div>
                                ) : (
                                  <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                      // 自定义列表样式
                                      ul: ({...props}) => <ul className="list-disc pl-6 my-2" {...props} />,
                                      ol: ({...props}) => <ol className="list-decimal pl-6 my-2" {...props} />,
                                      // 自定义标题样式
                                      h1: ({...props}) => <h1 className="text-lg font-bold mt-4 mb-2" {...props} />,
                                      h2: ({...props}) => <h2 className="text-base font-bold mt-3 mb-2" {...props} />,
                                      h3: ({...props}) => <h3 className="text-sm font-bold mt-2 mb-1" {...props} />,
                                      // 自定义段落样式
                                      p: ({...props}) => <p className="my-1" {...props} />,
                                      // 自定义代码块样式
                                      code: ({inline, ...props}: {inline?: boolean, children?: React.ReactNode}) => 
                                        inline ? 
                                          <code className="bg-muted-foreground/20 px-1 py-0.5 rounded text-xs" {...props} /> : 
                                          <pre className="bg-muted-foreground/10 p-2 rounded-md overflow-x-auto my-2">
                                            <code className="text-xs" {...props} />
                                          </pre>
                                    }}
                                  >
                                    {message.content}
                                  </ReactMarkdown>
                                )}
                              </div>
                              <div className="text-xs mt-1 opacity-70">
                                {formatTime(message.timestamp)}
                              </div>
                            </div>
                            
                            {message.role === 'user' && (
                              <Avatar className="h-8 w-8 shrink-0 bg-primary/10">
                                <AvatarImage src="/images/user-avatar.png" alt="用户" />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                          
                          {/* 显示参考来源 */}
                          {message.sources && message.sources.length > 0 && (
                            <div className="ml-4 space-y-2">
                              <div className="text-xs font-medium text-muted-foreground">参考来源：</div>
                              {message.sources.map((source, sourceIndex) => (
                                <div key={sourceIndex} className="bg-muted/30 rounded-md p-2 text-xs">
                                  <div className="flex items-center gap-1 mb-1">
                                    <FileText className="h-3 w-3 text-muted-foreground" />
                                    <span className="font-medium">{source.metadata.name}</span>
                                  </div>
                                  <div className="text-muted-foreground">{source.content}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="rounded-lg px-4 py-2 bg-muted">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>
                
                {/* 输入区域 - 固定在底部 */}
                <div className="p-4 border-t shrink-0">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {suggestedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleSuggestedQuestion(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder={selectedProject ? `询问关于"${selectedProject.name}"的问题...` : "输入您的问题..."}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isLoading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 