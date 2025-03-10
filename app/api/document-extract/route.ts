import { NextRequest, NextResponse } from 'next/server';
import * as mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';

// 配置 PDF.js worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

/**
 * 从文档中提取文本内容
 * 支持DOCX、PDF等格式
 */
export async function POST(request: NextRequest) {
  try {
    // 解析multipart/form-data请求
    const formData = await request.formData();
    
    // 获取文件
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '请提供文件' },
        { status: 400 }
      );
    }
    
    console.log(`处理文件: ${file.name}, 类型: ${file.type}, 大小: ${file.size} 字节`);
    
    // 根据文件类型选择不同的处理方法
    let extractedText = '';
    
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        file.name.toLowerCase().endsWith('.docx')) {
      // 处理DOCX文件
      extractedText = await extractTextFromDocx(file);
    } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      // 处理PDF文件
      extractedText = await extractTextFromPdf(file);
    } else {
      return NextResponse.json(
        { error: '不支持的文件类型，目前仅支持DOCX和PDF' },
        { status: 400 }
      );
    }
    
    // 检查提取的文本是否有效
    if (!extractedText || extractedText.trim().length < 10) {
      return NextResponse.json(
        { error: '无法从文件中提取有效文本' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true,
        text: extractedText,
        textLength: extractedText.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('文档提取失败:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: '文档处理失败',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * 从DOCX文件中提取文本
 */
async function extractTextFromDocx(file: File): Promise<string> {
  try {
    // 将File对象转换为ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // 使用mammoth.js提取文本
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    const text = result.value;
    
    console.log(`从DOCX提取的文本长度: ${text.length}`);
    console.log(`从DOCX提取的文本样本: ${text.substring(0, 200)}`);
    
    return text;
  } catch (error) {
    console.error('DOCX文本提取失败:', error);
    throw new Error(`DOCX文本提取失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 从PDF文件中提取文本
 */
async function extractTextFromPdf(file: File): Promise<string> {
  try {
    // 将File对象转换为ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // 加载PDF文档
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    console.log(`PDF文档加载成功，共${pdf.numPages}页`);
    
    // 提取所有页面的文本
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => 'str' in item ? item.str : '')
        .join(' ');
      
      fullText += pageText + '\n\n';
      
      console.log(`已提取第${i}页文本，长度: ${pageText.length}`);
    }
    
    console.log(`从PDF提取的总文本长度: ${fullText.length}`);
    console.log(`从PDF提取的文本样本: ${fullText.substring(0, 200)}`);
    
    return fullText;
  } catch (error) {
    console.error('PDF文本提取失败:', error);
    throw new Error(`PDF文本提取失败: ${error instanceof Error ? error.message : String(error)}`);
  }
} 