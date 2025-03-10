"use client";

import React, { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface DocumentUploaderProps {
  projectId: string;
  projectName?: string;
  onUploadComplete?: (documentId: string) => void;
}

export default function DocumentUploader({ projectId, projectName, onUploadComplete }: DocumentUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [documentType, setDocumentType] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // 检查文件类型
      if (!selectedFile.type.includes('pdf') && !selectedFile.type.includes('document')) {
        toast.error('只支持PDF和Word文档格式');
        return;
      }
      // 检查文件大小（限制为50MB）
      if (selectedFile.size > 50 * 1024 * 1024) {
        toast.error('文件大小不能超过50MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('请选择要上传的文件');
      return;
    }
    if (!documentType) {
      toast.error('请选择文档类型');
      return;
    }

    setUploading(true);
    setProgress(0);
    setError('');
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectId);
      formData.append('type', documentType);
      formData.append('description', description);

      const response = await fetch('/api/knowledge/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const result = await response.json();
      setSuccess(true);
      toast.success('文档上传成功');
      
      // 重置表单
      setFile(null);
      setDocumentType('');
      setDescription('');
      setProgress(100);

      // 调用回调函数
      if (onUploadComplete) {
        onUploadComplete(result.documentId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败');
      toast.error('文档上传失败');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>上传项目文档</CardTitle>
        <CardDescription>
          {projectName ? `上传"${projectName}"项目的文档` : '上传项目相关文档'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); handleUpload(); }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">选择文件</Label>
            <div className="flex items-center space-x-4">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                disabled={uploading}
              />
              {file && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <FileText className="h-4 w-4" />
                  <span>{file.name}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="documentType">文档类型</Label>
            <Select
              value={documentType}
              onValueChange={setDocumentType}
              disabled={uploading}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择文档类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project_plan">项目计划</SelectItem>
                <SelectItem value="requirement">需求文档</SelectItem>
                <SelectItem value="design">设计文档</SelectItem>
                <SelectItem value="report">项目报告</SelectItem>
                <SelectItem value="meeting">会议记录</SelectItem>
                <SelectItem value="other">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">文档描述</Label>
            <Input
              id="description"
              placeholder="请输入文档描述"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={uploading}
            />
          </div>
          
          {error && (
            <div className="text-sm text-red-500 flex items-center">
              <AlertCircle className="mr-2 h-4 w-4" />
              {error}
            </div>
          )}
          
          {uploading || success && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {uploading && '正在上传...'}
                  {success && '上传成功'}
                </span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          <Button 
            type="submit" 
            disabled={!file || !documentType || uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                正在上传...
              </>
            ) : success ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                上传成功
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                上传文档
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        支持PDF和Word文档格式，最大文件大小50MB
      </CardFooter>
    </Card>
  );
} 