/**
 * 批量导入合同文件并创建项目档案
 * 
 * 使用方法:
 * node scripts/batch-import-contracts.mjs <合同文件夹路径>
 * 
 * 例如:
 * node scripts/batch-import-contracts.mjs ./contracts
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import fetch from 'node-fetch';
import FormData from 'form-data';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// 配置项
const CONFIG = {
  // API端点
  PROJECT_ANALYSIS_API: 'http://localhost:3000/api/project-analysis',
  PROJECT_CREATE_API: 'http://localhost:3000/api/projects',
  OCR_API: 'http://localhost:3000/api/ocr',
  // 支持的文件类型
  SUPPORTED_EXTENSIONS: ['.pdf', '.docx'],
  // 处理文件的最大并发数
  MAX_CONCURRENT: 2,
  // 是否启用详细日志
  VERBOSE: true,
  // 文件名过滤条件
  FILE_NAME_FILTER: '项目合同'
};

// 日志函数
const log = {
  info: (message) => console.log(`[INFO] ${message}`),
  success: (message) => console.log(`[SUCCESS] ${message}`),
  error: (message) => console.error(`[ERROR] ${message}`),
  verbose: (message) => CONFIG.VERBOSE && console.log(`[VERBOSE] ${message}`)
};

/**
 * 获取文件夹中的所有文件
 * @param {string} dir 文件夹路径
 * @returns {Promise<string[]>} 文件路径数组
 */
async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      return entry.isDirectory() ? getFiles(fullPath) : fullPath;
    })
  );
  
  return files
    .flat()
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      const fileName = path.basename(file);
      
      // 检查文件扩展名和文件名是否包含指定的关键词
      return CONFIG.SUPPORTED_EXTENSIONS.includes(ext) && 
             fileName.includes(CONFIG.FILE_NAME_FILTER);
    });
}

/**
 * 将文件转换为Base64编码
 * @param {string} filePath 文件路径
 * @returns {Promise<string>} Base64编码的文件内容
 */
async function fileToBase64(filePath) {
  try {
    const fileBuffer = await fs.promises.readFile(filePath);
    return fileBuffer.toString('base64');
  } catch (error) {
    throw new Error(`读取文件失败: ${error.message}`);
  }
}

/**
 * 检查文件大小是否超过限制
 * @param {string} filePath 文件路径
 * @param {number} maxSizeMB 最大文件大小（MB）
 * @returns {Promise<{size: number, exceeds: boolean}>} 文件大小信息
 */
async function checkFileSize(filePath, maxSizeMB = 10) {
  try {
    const stats = await fs.promises.stat(filePath);
    const fileSizeMB = stats.size / (1024 * 1024);
    return {
      size: fileSizeMB,
      exceeds: fileSizeMB > maxSizeMB
    };
  } catch (error) {
    log.error(`检查文件大小失败: ${error.message}`);
    return { size: 0, exceeds: false };
  }
}

/**
 * 使用OCR处理PDF文件
 * @param {string} filePath 文件路径
 * @returns {Promise<string>} 提取的文本
 */
async function processPdfWithOcr(filePath) {
  try {
    log.info(`使用OCR处理PDF文件: ${path.basename(filePath)}`);
    
    // 检查文件大小
    const fileSizeInfo = await checkFileSize(filePath);
    if (fileSizeInfo.exceeds) {
      log.warn(`文件大小超过OCR API限制 (${fileSizeInfo.size.toFixed(2)} MB > 10 MB)，跳过OCR处理`);
      throw new Error(`文件太大，最大允许 10 MB，当前文件大小 ${fileSizeInfo.size.toFixed(2)} MB`);
    }
    
    // 将文件转换为Base64
    const base64Data = await fileToBase64(filePath);
    
    // 调用OCR API
    const response = await fetch(CONFIG.OCR_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: base64Data,
        isImage: false,
        options: {
          includeImageBase64: false
        }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OCR API响应错误: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const ocrResult = await response.json();
    
    // 提取所有页面的文本
    let extractedText = '';
    if (ocrResult.pages && Array.isArray(ocrResult.pages)) {
      extractedText = ocrResult.pages.map(page => page.markdown).join('\n\n');
      log.success(`OCR成功提取文本，共 ${ocrResult.pages.length} 页，${extractedText.length} 个字符`);
      log.verbose(`提取的文本样本: ${extractedText.substring(0, 200)}...`);
    } else {
      throw new Error('OCR结果格式不正确');
    }
    
    return extractedText;
  } catch (error) {
    log.error(`OCR处理失败: ${error.message}`);
    throw error;
  }
}

/**
 * 分析文件并提取项目信息
 * @param {string} filePath 文件路径
 * @returns {Promise<Object>} 提取的项目信息
 */
async function analyzeFile(filePath) {
  try {
    log.info(`开始分析文件: ${path.basename(filePath)}`);
    
    // 根据文件类型选择处理方法
    const fileExt = path.extname(filePath).toLowerCase();
    
    if (fileExt === '.pdf') {
      // 检查文件大小
      const fileSizeInfo = await checkFileSize(filePath);
      log.verbose(`文件大小: ${fileSizeInfo.size.toFixed(2)} MB`);
      
      // 对PDF文件使用OCR处理
      if (!fileSizeInfo.exceeds) {
        try {
          // 使用OCR提取文本
          const extractedText = await processPdfWithOcr(filePath);
          
          // 使用提取的文本调用项目分析API
          const textAnalysisResponse = await fetch(CONFIG.PROJECT_ANALYSIS_API, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: extractedText })
          });
          
          if (!textAnalysisResponse.ok) {
            throw new Error(`项目分析API响应错误: ${textAnalysisResponse.status} ${textAnalysisResponse.statusText}`);
          }
          
          const projectData = await textAnalysisResponse.json();
          
          // 输出更详细的调试信息
          if (projectData && projectData.basicInfo) {
            log.success(`成功提取项目信息: ${projectData.basicInfo.name || '未命名项目'}`);
            log.verbose(`提取的项目数据: ${JSON.stringify(projectData.basicInfo, null, 2)}`);
          } else {
            log.error(`提取的项目数据格式不正确: ${JSON.stringify(projectData, null, 2)}`);
          }
          
          return projectData;
        } catch (ocrError) {
          log.error(`OCR处理失败，尝试使用文件名提取信息: ${ocrError.message}`);
          // OCR失败，回退到使用文件名提取信息
        }
      } else {
        log.warn(`PDF文件过大 (${fileSizeInfo.size.toFixed(2)} MB)，跳过OCR处理，使用文件名提取信息`);
      }
      
      // 对于大型PDF文件或OCR失败的情况，使用文件名提取基本信息
      const fileName = path.basename(filePath, fileExt);
      const projectName = extractProjectNameFromFilePath(filePath);
      
      // 创建基本项目数据
      return {
        basicInfo: {
          name: projectName || fileName.replace(/【项目合同】\s*/g, '').trim(),
          code: "未提供",
          mainDepartment: "未提供",
          executeDepartment: "未提供",
          manager: "未提供",
          startDate: new Date().toISOString().split('T')[0],
          endDate: "",
          totalBudget: "0",
          supportBudget: "0",
          selfBudget: "0",
          description: `从文件 ${path.basename(filePath)} 导入的项目。由于文件大小限制，未能进行OCR处理。`,
          type: "未提供"
        },
        milestones: [],
        budgets: [],
        team: []
      };
    }
    
    // 对于DOCX文件，直接上传文件
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    
    const response = await fetch(CONFIG.PROJECT_ANALYSIS_API, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`API响应错误: ${response.status} ${response.statusText}`);
    }
    
    const projectData = await response.json();
    
    // 输出更详细的调试信息
    if (projectData && projectData.basicInfo) {
      log.success(`成功提取项目信息: ${projectData.basicInfo.name || '未命名项目'}`);
      log.verbose(`提取的项目数据: ${JSON.stringify(projectData.basicInfo, null, 2)}`);
    } else {
      log.error(`提取的项目数据格式不正确: ${JSON.stringify(projectData, null, 2)}`);
    }
    
    return projectData;
  } catch (error) {
    log.error(`分析文件失败 ${path.basename(filePath)}: ${error.message}`);
    return null;
  }
}

/**
 * 从文件名中提取项目名称
 * @param {string} filePath 文件路径
 * @returns {string} 提取的项目名称
 */
function extractProjectNameFromFilePath(filePath) {
  const fileName = path.basename(filePath);
  const dirName = path.basename(path.dirname(path.dirname(filePath)));
  
  // 尝试从文件名中提取项目名称
  let projectName = '';
  
  // 方法1: 从文件名中提取
  const nameMatch = fileName.match(/【项目合同】\s*(.*?)(?:\.pdf|\.docx|$)/i);
  if (nameMatch && nameMatch[1] && nameMatch[1].length > 5) {
    projectName = nameMatch[1].trim();
  }
  
  // 方法2: 如果方法1提取的名称太短，尝试从目录名中提取
  if (!projectName || projectName.length < 5) {
    // 目录名通常是"XX 项目名称（单位）"的格式
    const dirNameMatch = dirName.match(/^\d+\s+(.*?)(?:\s*\(|$)/);
    if (dirNameMatch && dirNameMatch[1]) {
      projectName = dirNameMatch[1].trim();
    }
  }
  
  // 如果仍然没有提取到有效的项目名称，使用目录名
  if (!projectName || projectName.length < 5) {
    projectName = dirName;
  }
  
  return projectName;
}

/**
 * 创建项目
 * @param {Object} projectData 项目数据
 * @param {string} filePath 文件路径，用于在提取失败时从文件名中获取项目信息
 * @returns {Promise<Object>} 创建的项目
 */
async function createProject(projectData, filePath) {
  try {
    // 从文件路径中提取项目名称作为备选
    const projectNameFromPath = extractProjectNameFromFilePath(filePath);
    log.verbose(`从文件路径提取的项目名称: ${projectNameFromPath}`);
    
    // 准备创建数据，确保即使提取的数据不完整也能创建基本项目
    const createData = {
      name: (projectData?.basicInfo?.name && projectData.basicInfo.name !== '未命名项目') 
            ? projectData.basicInfo.name 
            : projectNameFromPath,
      batch: projectData?.basicInfo?.code || '',
      client: projectData?.basicInfo?.mainDepartment || '',
      organization: projectData?.basicInfo?.executeDepartment || '',
      projectManager: projectData?.basicInfo?.manager || '',
      startDate: projectData?.basicInfo?.startDate || new Date().toISOString().split('T')[0],
      endDate: projectData?.basicInfo?.endDate || '',
      description: projectData?.basicInfo?.description || `从文件 ${path.basename(filePath)} 导入的项目`,
      governmentFunding: parseFloat(projectData?.basicInfo?.supportBudget) || 0,
      selfFunding: parseFloat(projectData?.basicInfo?.selfBudget) || 0,
      industry: projectData?.basicInfo?.type || '',
      progressStatus: '进行中',
      managementStatus: '正常'
    };
    
    // 确保项目名称不为空
    if (!createData.name || createData.name.trim() === '') {
      createData.name = `导入项目 - ${new Date().toISOString().split('T')[0]}`;
    }
    
    log.verbose(`准备创建项目: ${JSON.stringify(createData, null, 2)}`);
    
    const response = await fetch(CONFIG.PROJECT_CREATE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(createData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API响应错误: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const createdProject = await response.json();
    log.success(`成功创建项目: ${createdProject.name} (ID: ${createdProject.id})`);
    return createdProject;
  } catch (error) {
    log.error(`创建项目失败: ${error.message}`);
    return null;
  }
}

/**
 * 处理单个文件
 * @param {string} filePath 文件路径
 * @returns {Promise<Object>} 处理结果
 */
async function processFile(filePath) {
  try {
    const fileStats = await stat(filePath);
    const fileSizeMB = fileStats.size / (1024 * 1024);
    log.info(`处理文件: ${path.basename(filePath)} (${fileSizeMB.toFixed(2)} MB)`);
    
    // 分析文件
    const projectData = await analyzeFile(filePath);
    if (!projectData) {
      return { success: false, file: filePath, error: '分析失败' };
    }
    
    // 创建项目，传入文件路径作为备选信息来源
    const createdProject = await createProject(projectData, filePath);
    if (!createdProject) {
      return { success: false, file: filePath, error: '创建项目失败' };
    }
    
    return { 
      success: true, 
      file: filePath, 
      projectId: createdProject.id,
      projectName: createdProject.name
    };
  } catch (error) {
    log.error(`处理文件失败 ${path.basename(filePath)}: ${error.message}`);
    return { success: false, file: filePath, error: error.message };
  }
}

/**
 * 批量处理文件
 * @param {string[]} files 文件路径数组
 * @returns {Promise<Object[]>} 处理结果数组
 */
async function processBatch(files) {
  const results = [];
  const total = files.length;
  
  // 使用限制并发的方式处理文件
  for (let i = 0; i < total; i += CONFIG.MAX_CONCURRENT) {
    const batch = files.slice(i, i + CONFIG.MAX_CONCURRENT);
    log.info(`处理批次 ${Math.floor(i / CONFIG.MAX_CONCURRENT) + 1}/${Math.ceil(total / CONFIG.MAX_CONCURRENT)}`);
    
    const batchResults = await Promise.all(
      batch.map(file => processFile(file))
    );
    
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * 生成处理报告
 * @param {Object[]} results 处理结果数组
 */
function generateReport(results) {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log('\n========== 处理报告 ==========');
  console.log(`总文件数: ${results.length}`);
  console.log(`成功处理: ${successful.length}`);
  console.log(`处理失败: ${failed.length}`);
  
  if (failed.length > 0) {
    console.log('\n失败的文件:');
    failed.forEach((result, index) => {
      console.log(`${index + 1}. ${path.basename(result.file)} - ${result.error}`);
    });
  }
  
  if (successful.length > 0) {
    console.log('\n成功创建的项目:');
    successful.forEach((result, index) => {
      console.log(`${index + 1}. ${result.projectName} (ID: ${result.projectId})`);
    });
  }
  
  console.log('\n===============================');
}

/**
 * 主函数
 */
async function main() {
  try {
    // 获取命令行参数
    const args = process.argv.slice(2);
    if (args.length === 0) {
      console.log('请提供合同文件夹路径');
      console.log('使用方法: node scripts/batch-import-contracts.mjs <合同文件夹路径>');
      process.exit(1);
    }
    
    const contractsDir = args[0];
    
    // 检查文件夹是否存在
    if (!fs.existsSync(contractsDir)) {
      console.log(`文件夹不存在: ${contractsDir}`);
      process.exit(1);
    }
    
    log.info(`开始处理文件夹: ${contractsDir}`);
    log.info(`文件过滤条件: 扩展名为 ${CONFIG.SUPPORTED_EXTENSIONS.join('/')} 且文件名包含 "${CONFIG.FILE_NAME_FILTER}"`);
    
    // 获取所有文件
    const files = await getFiles(contractsDir);
    log.info(`找到 ${files.length} 个符合条件的文件`);
    
    if (files.length === 0) {
      log.info('没有找到支持的文件，程序退出');
      process.exit(0);
    }
    
    // 列出找到的文件
    log.info('找到以下文件:');
    files.forEach((file, index) => {
      log.info(`${index + 1}. ${path.basename(file)} (${path.dirname(file)})`);
    });
    
    // 处理文件
    const startTime = Date.now();
    const results = await processBatch(files);
    const endTime = Date.now();
    
    // 生成报告
    generateReport(results);
    
    log.info(`处理完成，耗时: ${((endTime - startTime) / 1000).toFixed(2)} 秒`);
  } catch (error) {
    log.error(`程序执行失败: ${error.message}`);
    process.exit(1);
  }
}

// 执行主函数
main(); 