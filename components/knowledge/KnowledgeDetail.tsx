"use client";

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface KnowledgeItem {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  views: number;
  source?: string;
  fileType?: string;
  fileSize?: number;
}

interface RelatedItem {
  id: number;
  title: string;
  category: string;
  similarity: number;
}

interface KnowledgeDetailProps {
  item: KnowledgeItem;
  relatedItems?: RelatedItem[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onBack?: () => void;
}

export default function KnowledgeDetail({
  item,
  relatedItems = [],
  onEdit,
  onDelete,
  onBack
}: KnowledgeDetailProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // 格式化文件大小
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // 获取文件图标
  const getFileIcon = (fileType?: string) => {
    if (!fileType) return null;
    
    const iconMap: Record<string, React.ReactNode> = {
      'pdf': (
        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      ),
      'docx': (
        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      ),
      'xlsx': (
        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M5 4a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1H5zm1 2h8v8H6V6z" clipRule="evenodd" />
        </svg>
      ),
      'txt': (
        <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      ),
    };
    
    const type = fileType.toLowerCase();
    return iconMap[type] || (
      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    );
  };
  
  // 处理删除确认
  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(item.id);
    }
    setShowDeleteConfirm(false);
  };
  
  // 处理下载文档
  const handleDownload = () => {
    // 实际应用中，这里应该调用API下载文档
    console.log(`下载文档: ${item.id}`);
    
    // 模拟下载行为
    if (item.source) {
      const link = document.createElement('a');
      link.href = item.source;
      link.download = item.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* 返回按钮 */}
      {onBack && (
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={onBack}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回列表
          </button>
        </div>
      )}
      
      {/* 文档头部 */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
            <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {item.category}
              </span>
              <span className="mx-2">•</span>
              <span>{item.author}</span>
              <span className="mx-2">•</span>
              <span>{item.date}</span>
              <span className="mx-2">•</span>
              <span>{item.views} 次阅读</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {item.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex space-x-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(item.id)}
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                编辑
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                删除
              </Button>
            )}
          </div>
        </div>
        
        {/* 源文件信息 */}
        {item.fileType && (
          <div className="mt-4 flex items-center p-3 bg-gray-50 rounded-md">
            <div className="mr-3">
              {getFileIcon(item.fileType)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{item.title}.{item.fileType}</p>
              {item.fileSize && (
                <p className="text-xs text-gray-500">{formatFileSize(item.fileSize)}</p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              下载原文档
            </Button>
          </div>
        )}
      </div>
      
      {/* 文档内容 */}
      <div className="p-6 prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: item.content }} />
      </div>
      
      {/* 相关知识 */}
      {relatedItems.length > 0 && (
        <div className="p-6 border-t border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">相关知识</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedItems.map(related => (
              <Card key={related.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <h3 className="text-md font-medium text-gray-900">{related.title}</h3>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-500">{related.category}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    相似度: {Math.round(related.similarity * 100)}%
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">确认删除</h3>
            <p className="text-gray-600 mb-4">
              您确定要删除 &ldquo;{item.title}&rdquo; 吗？此操作无法撤销。
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                取消
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
              >
                确认删除
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 