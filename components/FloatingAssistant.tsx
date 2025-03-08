"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, X, Loader2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: '您好！我是您的项目管理助手，有什么可以帮您的吗？' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 当对话框打开时，聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // 处理发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      console.log('发送消息到助手API:', inputValue);
      console.log('历史消息:', messages);
      
      // 调用智能助手API
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: inputValue,
          history: messages.map(msg => ({ role: msg.role, content: msg.content }))
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
      setMessages(prev => [...prev, { role: 'ai', content: data.response || '抱歉，我无法回答这个问题。' }]);
    } catch (error) {
      console.error('获取AI回复失败:', error);
      setMessages(prev => [...prev, { role: 'ai', content: '抱歉，发生了错误，请稍后再试。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理按键事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* 浮动按钮 */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
          style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </Button>
      </motion.div>

      {/* 聊天窗口 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-80 md:w-96"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <Card className="shadow-2xl border border-gray-300" style={{ boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
              <CardHeader className="pb-3 bg-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-lg flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  项目管理助手
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 bg-white">
                <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'ai' && (
                        <Avatar className="h-8 w-8 shrink-0 bg-blue-100">
                          <AvatarImage src="/images/ai-assistant.png" alt="AI助手" />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            <MessageSquare className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={`max-w-[75%] rounded-lg px-4 py-2 shadow-sm ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <p className="text-sm break-words">{message.content}</p>
                        ) : (
                          <div className="text-sm">
                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm]}
                              components={{
                                ul: ({...props}) => <ul className="list-disc pl-4 my-1" {...props} />,
                                ol: ({...props}) => <ol className="list-decimal pl-4 my-1" {...props} />,
                                h1: ({...props}) => <h1 className="text-base font-bold mt-3 mb-1" {...props} />,
                                h2: ({...props}) => <h2 className="text-sm font-bold mt-2 mb-1" {...props} />,
                                h3: ({...props}) => <h3 className="text-sm font-semibold mt-1 mb-1" {...props} />,
                                p: ({...props}) => <p className="my-1 break-words" {...props} />,
                                code: ({inline, ...props}: {inline?: boolean, children?: React.ReactNode}) => 
                                  inline ? 
                                    <code className="bg-gray-100 px-1 py-0.5 rounded text-xs" {...props} /> : 
                                    <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto my-1 text-xs">
                                      <code {...props} />
                                    </pre>
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                      
                      {message.role === 'user' && (
                        <Avatar className="h-8 w-8 shrink-0 bg-blue-600">
                          <AvatarImage src="/images/user-avatar.png" alt="用户" />
                          <AvatarFallback className="bg-blue-600 text-white">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start items-start gap-2">
                      <Avatar className="h-8 w-8 shrink-0 bg-blue-100">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          <MessageSquare className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="max-w-[75%] rounded-lg px-4 py-2 bg-white text-gray-800 border border-gray-200 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">正在思考...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <CardFooter className="p-3 border-t bg-white">
                <div className="flex w-full items-center space-x-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="输入您的问题..."
                    className="flex-1 bg-white"
                    disabled={isLoading}
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 