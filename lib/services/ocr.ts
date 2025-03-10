import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { uploadBase64ToR2 } from './r2Storage';

// 从环境变量获取API密钥
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || 'bXkslXgU1KbER1anYhwicgw6zFjkqKjM'; // 硬编码API密钥
// 定义 API URL
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/ocr';
// 定义最大文件大小 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;
// 定义 Cloudflare R2 公共 URL
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://pub-0711119e9c2f45d086d1017a74c99863.r2.dev';

console.log('OCR服务环境变量检查：', {
  MISTRAL_API_KEY_EXISTS: !!MISTRAL_API_KEY,
  MISTRAL_API_KEY_LENGTH: MISTRAL_API_KEY?.length || 0,
  ENV_KEYS: Object.keys(process.env).filter(key => key.includes('MISTRAL')),
  R2_PUBLIC_URL
});

export interface OCRResponse {
  pages: Array<{
    index: number;
    markdown: string;
    images: Array<{
      id: string;
      top_left_x: number;
      top_left_y: number;
      bottom_right_x: number;
      bottom_right_y: number;
      image_base64?: string;
    }>;
    dimensions?: {
      dpi: number;
      height: number;
      width: number;
    };
  }>;
  model: string;
  usage_info: {
    pages_processed: number;
    doc_size_bytes?: number;
  };
}

export class OCRService {
  private readonly apiKey: string;
  
  constructor(apiKey: string = MISTRAL_API_KEY) {
    if (!apiKey) {
      console.warn('Mistral API密钥未设置，OCR功能可能无法正常工作');
    }
    this.apiKey = apiKey;
  }
  
  /**
   * 检查文件大小
   */
  private checkFileSize(base64Data: string): void {
    // 计算 base64 数据的大小（字节）
    const base64Length = base64Data.length;
    // base64 编码后的大小约为原始大小的 4/3
    const fileSize = Math.ceil(base64Length * 0.75);
    
    console.log(`文件大小: ${(fileSize / (1024 * 1024)).toFixed(2)} MB`);
    
    if (fileSize > MAX_FILE_SIZE) {
      throw new Error(`文件太大，最大允许 ${MAX_FILE_SIZE / (1024 * 1024)} MB，当前文件大小 ${(fileSize / (1024 * 1024)).toFixed(2)} MB`);
    }
  }
  
  /**
   * 将 base64 数据上传到 Cloudflare R2 并返回公共 URL
   */
  private async uploadBase64ToR2(base64Data: string, fileExtension: string): Promise<string> {
    // 确保 base64 数据不包含前缀
    const cleanBase64 = base64Data.startsWith('data:') 
      ? base64Data.split(',')[1] 
      : base64Data;
    
    // 检查文件大小
    this.checkFileSize(cleanBase64);
    
    // 确定内容类型
    let contentType = 'application/octet-stream';
    if (fileExtension === 'pdf') {
      contentType = 'application/pdf';
    } else if (['jpg', 'jpeg'].includes(fileExtension)) {
      contentType = 'image/jpeg';
    } else if (fileExtension === 'png') {
      contentType = 'image/png';
    } else if (fileExtension === 'gif') {
      contentType = 'image/gif';
    }
    
    try {
      // 生成唯一文件名
      const uniqueFilename = `ocr-${Date.now()}-${uuidv4()}.${fileExtension}`;
      
      // 上传到 Cloudflare R2
      const fileUrl = await uploadBase64ToR2(cleanBase64, `temp/${uniqueFilename}`, contentType);
      console.log('文件已上传到 Cloudflare R2，URL:', fileUrl);
      
      return fileUrl;
    } catch (error) {
      console.error('上传到 Cloudflare R2 失败:', error);
      
      // 回退到使用 API 路由上传
      try {
        console.log('尝试使用API路由上传文件...');
        const response = await axios.post('/api/upload', {
          data: cleanBase64,
          extension: fileExtension,
          filename: `ocr-${Date.now()}-${uuidv4()}.${fileExtension}`
        });
        
        console.log('文件已通过API路由上传，URL:', response.data.url);
        return response.data.url;
      } catch (uploadError) {
        console.error('上传文件失败:', uploadError);
        throw new Error('上传文件失败，请稍后重试');
      }
    }
  }
  
  /**
   * 处理文档 - 将文档上传到 Cloudflare R2 并使用 URL 调用 Mistral OCR API
   */
  async processDocument(documentData: string, options: {
    pages?: number[];
    includeImageBase64?: boolean;
    imageLimit?: number;
    imageMinSize?: number;
    documentUrl?: string; // 可选的文档URL
  } = {}): Promise<OCRResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('Mistral API密钥未设置');
      }
      
      // 记录选项
      console.log('处理文档选项:', {
        ...options,
        documentUrl: options.documentUrl ? '(已提供)' : undefined
      });
      
      // 获取文档URL
      let documentUrl = options.documentUrl;
      
      if (!documentUrl) {
        // 判断文件类型
        let fileExtension = 'pdf';
        if (documentData.startsWith('data:')) {
          const mimeType = documentData.split(';')[0].split(':')[1];
          if (mimeType === 'application/pdf') {
            fileExtension = 'pdf';
          } else if (mimeType.startsWith('image/')) {
            fileExtension = mimeType.split('/')[1];
          }
        }
        
        // 上传文档并获取URL
        documentUrl = await this.uploadBase64ToR2(documentData, fileExtension);
        console.log('文档已上传，URL:', documentUrl);
      }
      
      // 构建请求体
      const requestBody: {
        model: string;
        document: {
          type: string;
          document_url: string;
        };
        pages?: number[];
        include_image_base64?: boolean;
        image_limit?: number;
        image_min_size?: number;
      } = {
        model: 'mistral-ocr-latest',
        document: {
          type: 'document_url',
          document_url: documentUrl
        }
      };
      
      // 添加可选参数
      if (options.pages && options.pages.length > 0) {
        requestBody.pages = options.pages;
      }
      
      if (options.includeImageBase64 !== undefined) {
        requestBody.include_image_base64 = options.includeImageBase64;
      }
      
      if (options.imageLimit !== undefined) {
        requestBody.image_limit = options.imageLimit;
      }
      
      if (options.imageMinSize !== undefined) {
        requestBody.image_min_size = options.imageMinSize;
      }
      
      console.log('OCR请求体:', JSON.stringify({
        ...requestBody,
        document: {
          ...requestBody.document,
          document_url: documentUrl // 显示完整URL用于调试
        }
      }, null, 2));
      
      // 调用 Mistral OCR API
      console.log('正在调用 Mistral OCR API...');
      const response = await axios.post(
        MISTRAL_API_URL,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          timeout: 120000 // 设置2分钟超时
        }
      );
      
      console.log('Mistral OCR API 响应状态:', response.status);
      console.log('OCR处理完成，页数:', response.data.usage_info?.pages_processed || '未知');
      
      return response.data;
    } catch (error) {
      console.error('OCR处理失败:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('API响应错误:', {
            status: error.response.status,
            data: error.response.data
          });
          throw new Error(`OCR处理失败: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.code === 'ECONNABORTED') {
          throw new Error('OCR处理超时，请尝试使用较小的文件或仅处理部分页面');
        } else if (error.request) {
          console.error('未收到响应:', error.request);
          throw new Error('OCR处理失败: 未收到API响应');
        } else {
          console.error('请求配置错误:', error.message);
          throw new Error(`OCR处理失败: 请求配置错误 - ${error.message}`);
        }
      } else if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`OCR处理失败: ${String(error)}`);
      }
    }
  }
  
  /**
   * 处理图片 - 将图片上传到 Cloudflare R2 并使用 URL 调用 Mistral OCR API
   */
  async processImage(imageData: string, options: {
    includeImageBase64?: boolean;
    imageLimit?: number;
    imageMinSize?: number;
    imageUrl?: string; // 可选的图片URL
  } = {}): Promise<OCRResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('Mistral API密钥未设置');
      }
      
      // 记录选项
      console.log('处理图片选项:', {
        ...options,
        imageUrl: options.imageUrl ? '(已提供)' : undefined
      });
      
      // 获取图片URL
      let imageUrl = options.imageUrl;
      
      if (!imageUrl) {
        // 判断图片类型
        let fileExtension = 'png';
        if (imageData.startsWith('data:')) {
          const mimeType = imageData.split(';')[0].split(':')[1];
          if (mimeType.startsWith('image/')) {
            fileExtension = mimeType.split('/')[1];
          }
        }
        
        // 上传图片并获取URL
        imageUrl = await this.uploadBase64ToR2(imageData, fileExtension);
        console.log('图片已上传，URL:', imageUrl);
      }
      
      // 构建请求体
      const requestBody: {
        model: string;
        document: {
          type: string;
          image_url: string;
        };
        include_image_base64?: boolean;
        image_limit?: number;
        image_min_size?: number;
      } = {
        model: 'mistral-ocr-latest',
        document: {
          type: 'image_url',
          image_url: imageUrl
        }
      };
      
      // 添加可选参数
      if (options.includeImageBase64 !== undefined) {
        requestBody.include_image_base64 = options.includeImageBase64;
      }
      
      if (options.imageLimit !== undefined) {
        requestBody.image_limit = options.imageLimit;
      }
      
      if (options.imageMinSize !== undefined) {
        requestBody.image_min_size = options.imageMinSize;
      }
      
      console.log('OCR图片请求体:', JSON.stringify({
        ...requestBody,
        document: {
          ...requestBody.document,
          image_url: imageUrl // 显示完整URL用于调试
        }
      }, null, 2));
      
      // 调用 Mistral OCR API
      console.log('正在调用 Mistral OCR API...');
      const response = await axios.post(
        MISTRAL_API_URL,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          timeout: 60000 // 设置1分钟超时
        }
      );
      
      console.log('Mistral OCR API 响应状态:', response.status);
      console.log('OCR处理完成，页数:', response.data.usage_info?.pages_processed || '未知');
      
      return response.data;
    } catch (error) {
      console.error('OCR处理失败:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('API响应错误:', {
            status: error.response.status,
            data: error.response.data
          });
          throw new Error(`OCR处理失败: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.code === 'ECONNABORTED') {
          throw new Error('OCR处理超时，请尝试使用较小的图片');
        } else if (error.request) {
          console.error('未收到响应:', error.request);
          throw new Error('OCR处理失败: 未收到API响应');
        } else {
          console.error('请求配置错误:', error.message);
          throw new Error(`OCR处理失败: 请求配置错误 - ${error.message}`);
        }
      } else if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`OCR处理失败: ${String(error)}`);
      }
    }
  }
}

export const ocrService = new OCRService(); 