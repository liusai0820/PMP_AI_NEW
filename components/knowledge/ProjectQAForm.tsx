"use client";

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProjectQAFormProps {
  projectId: string;
}

interface Source {
  content: string;
  metadata: Record<string, unknown>;
}

export function ProjectQAForm({ projectId }: ProjectQAFormProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setError('');
    setAnswer('');
    setSources([]);

    try {
      const response = await fetch('/api/knowledge/project-qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          projectId,
        }),
      });

      if (!response.ok) {
        throw new Error('请求失败');
      }

      const data = await response.json();
      setAnswer(data.answer);
      setSources(data.sources);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取答案时发生错误');
    } finally {
      setLoading(false);
    }
  };

  const renderSourceMetadata = (metadata: Record<string, unknown>) => {
    const documentName = metadata.name || metadata.documentId;
    return documentName ? `来源文档：${String(documentName)}` : null;
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Textarea
            placeholder="请输入您的问题..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !question.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              正在思考...
            </>
          ) : (
            '提交问题'
          )}
        </Button>
      </form>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      {answer && (
        <div className="space-y-4">
          <Card className="p-4 bg-gray-50">
            <div className="prose max-w-none">
              {answer.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </Card>

          {sources.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">参考来源：</h3>
              <div className="space-y-2">
                {sources.map((source, index) => (
                  <Card key={index} className="p-3 text-sm bg-gray-50">
                    <div className="text-gray-700">{source.content}</div>
                    {source.metadata.documentId && (
                      <div className="mt-1 text-xs text-gray-500">
                        {renderSourceMetadata(source.metadata)}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 