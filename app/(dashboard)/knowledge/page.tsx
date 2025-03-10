"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Upload, FileText, X, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface Document {
  id: number;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
}

export default function KnowledgePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);

  // 模拟文档数据
  const mockDocuments: Document[] = [
    { id: 1, name: '项目计划书.pdf', type: '项目计划', uploadDate: '2023-12-15', size: '2.4MB' },
    { id: 2, name: '需求分析报告.docx', type: '需求文档', uploadDate: '2023-12-10', size: '1.8MB' },
    { id: 3, name: '项目进度报告.pdf', type: '项目报告', uploadDate: '2023-11-28', size: '3.2MB' },
    { id: 4, name: '技术方案设计.pdf', type: '设计文档', uploadDate: '2023-11-15', size: '5.1MB' },
  ];

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  // 移除选中的文件
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 上传文件
  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('请选择要上传的文件');
      return;
    }

    setUploading(true);

    try {
      // 这里应该是实际的上传逻辑
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`成功上传 ${files.length} 个文件`);
      setFiles([]);
      
      // 刷新文档列表
      setDocuments([...mockDocuments]);
    } catch (err) {
      toast.error('上传失败，请重试');
      console.error('上传错误:', err);
    } finally {
      setUploading(false);
    }
  };

  // 获取要显示的文档列表
  const displayDocuments = documents.length > 0 ? documents : mockDocuments;
  
  // 过滤文档
  const filteredDocuments = displayDocuments.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">项目知识库</h1>
        </div>
        
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-140px)]">
          {/* 左侧上传区域 */}
          <div className="col-span-4 h-full flex flex-col gap-4">
            <Card className="flex-1">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-base flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  上传文档
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      multiple
                      accept=".pdf,.doc,.docx"
                      className="flex-1 text-sm"
                    />
                    <Button 
                      onClick={handleUpload} 
                      disabled={files.length === 0 || uploading}
                      size="sm"
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {files.length > 0 && (
                    <ScrollArea className="h-[calc(100vh-320px)]">
                      <div className="space-y-2">
                        <div className="text-sm font-medium">已选择 {files.length} 个文件：</div>
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50 border border-muted">
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm truncate">{file.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}

                  <div className="text-xs text-muted-foreground">
                    支持PDF和Word文档格式，系统会自动处理并建立知识索引。
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 右侧文档列表 */}
          <div className="col-span-8 h-full">
            <Card className="h-full flex flex-col">
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  已上传文档
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="搜索文档..."
                      className="pl-8 w-[250px] text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="p-4">
                    <div className="grid grid-cols-5 gap-4 p-2 text-sm font-medium text-muted-foreground border-b">
                      <div>文档名称</div>
                      <div>类型</div>
                      <div>上传日期</div>
                      <div>大小</div>
                      <div className="text-right">操作</div>
                    </div>
                    {filteredDocuments.length > 0 ? (
                      <div className="divide-y">
                        {filteredDocuments.map(doc => (
                          <div key={doc.id} className="grid grid-cols-5 gap-4 p-3 items-center hover:bg-muted/50 rounded-md transition-colors">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-sm truncate">{doc.name}</span>
                            </div>
                            <div>
                              <Badge variant="outline" className="text-xs font-normal">
                                {doc.type}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">{doc.uploadDate}</div>
                            <div className="text-sm text-muted-foreground">{doc.size}</div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" className="h-7 text-xs">
                                查看
                              </Button>
                              <Button variant="outline" size="sm" className="h-7 text-xs text-destructive hover:text-destructive">
                                删除
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
                        <h3 className="text-lg font-medium">暂无文档</h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-md">
                          上传项目文档以建立知识库
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 