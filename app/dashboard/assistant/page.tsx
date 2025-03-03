"use client";

import React, { useState, useEffect, useRef } from 'react';
import MessageList from '@/components/assistant/MessageList';
import InputArea from '@/components/assistant/InputArea';
import Suggestions from '@/components/assistant/Suggestions';
import ProjectSelector from '@/components/assistant/ProjectSelector';
import { initialSuggestions, initialAIMessage as initialMessage, projectList } from '@/lib/mockData';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface Project {
  id: string;
  name: string;
  department: string;
  progress: number;
  documents: number;
}

export default function AssistantPage() {
  const initialAIMessage: Message = {
    ...initialMessage,
    sender: 'ai' as const
  };
  
  const [messages, setMessages] = useState<Message[]>([initialAIMessage]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(initialSuggestions);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = (content: string) => {
    if (content.trim() === '') return;
    
    // 添加用户消息
    const userMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    // 模拟AI响应
    setTimeout(() => {
      let aiResponse: Message;
      
      if (selectedProject) {
        // 如果选择了项目，生成与项目相关的回复
        aiResponse = {
          id: messages.length + 2,
          sender: 'ai',
          content: `关于"${selectedProject.name}"项目的问题，根据项目档案显示，该项目目前进度为${selectedProject.progress}%，已上传${selectedProject.documents}份相关文档。

最近的项目报告提到了几个关键点：
1. 系统集成测试预计下周开始
2. 目前项目进度略微落后于计划，但仍在可控范围内
3. 主要风险点在于第三方接口的稳定性

您是否需要了解更多关于该项目的具体信息？`,
          timestamp: new Date().toISOString()
        };
        
        // 更新建议问题为项目相关问题
        setSuggestions([
          `${selectedProject.name}的主要风险是什么？`,
          `${selectedProject.name}的进度为什么延迟？`,
          `${selectedProject.name}的预算使用情况如何？`,
          `${selectedProject.name}的团队构成是怎样的？`,
          `如何提高${selectedProject.name}的执行效率？`
        ]);
      } else {
        // 通用回复
        aiResponse = {
          id: messages.length + 2,
          sender: 'ai',
          content: `您好！关于"${content}"的问题，我可以提供以下信息：

在项目管理中，这类问题通常涉及到以下几个方面：
1. 项目范围管理：确保项目目标明确，交付物定义清晰
2. 进度管理：制定合理的时间计划，跟踪项目进展
3. 风险管理：识别潜在风险并制定应对策略
4. 沟通管理：确保所有相关方及时获取项目信息

您是否需要我针对某个具体项目提供更详细的建议？可以从右侧选择一个项目进行深入分析。`,
          timestamp: new Date().toISOString()
        };
        
        // 重置为默认建议
        setSuggestions(initialSuggestions);
      }
      
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1500);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage((e.target as HTMLTextAreaElement).value);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };
  
  const handleProjectSelect = (project: Project | null) => {
    setSelectedProject(project);
  };
  
  return (
    <div className="container mx-auto px-2 py-3 h-[calc(100vh-64px)]">
      <div className="flex h-full overflow-hidden bg-white rounded-lg shadow-sm">
        <ProjectSelector 
          onProjectSelect={handleProjectSelect}
          selectedProject={selectedProject}
        />
        
        <div className="flex-1 flex flex-col">
          <MessageList 
            messages={messages}
            loading={loading}
          />
          
          <Suggestions 
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
          
          <InputArea 
            onSendMessage={handleSendMessage}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
} 