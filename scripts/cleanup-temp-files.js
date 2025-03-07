/**
 * 临时文件清理脚本
 * 
 * 此脚本用于清理临时文件目录中的过期文件
 * 可以通过 cron 作业定期运行，例如每小时运行一次
 * 
 * 使用方法: node scripts/cleanup-temp-files.js
 */

const fs = require('fs');
const path = require('path');

// 临时文件目录
const TEMP_DIR = path.join(process.cwd(), 'public', 'temp');
// 文件过期时间（毫秒），默认为1小时
const FILE_EXPIRY_MS = 60 * 60 * 1000; // 1小时

// 确保临时目录存在
if (!fs.existsSync(TEMP_DIR)) {
  console.log(`创建临时目录: ${TEMP_DIR}`);
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// 获取当前时间
const now = Date.now();

// 读取临时目录中的所有文件
fs.readdir(TEMP_DIR, (err, files) => {
  if (err) {
    console.error('读取临时目录失败:', err);
    process.exit(1);
  }
  
  console.log(`找到 ${files.length} 个文件`);
  
  let deletedCount = 0;
  let errorCount = 0;
  
  // 遍历所有文件
  files.forEach(file => {
    const filePath = path.join(TEMP_DIR, file);
    
    // 获取文件状态
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(`获取文件状态失败: ${filePath}`, err);
        errorCount++;
        return;
      }
      
      // 计算文件年龄（毫秒）
      const fileAge = now - stats.mtimeMs;
      
      // 如果文件超过过期时间，则删除
      if (fileAge > FILE_EXPIRY_MS) {
        fs.unlink(filePath, err => {
          if (err) {
            console.error(`删除文件失败: ${filePath}`, err);
            errorCount++;
          } else {
            console.log(`已删除: ${filePath} (年龄: ${Math.round(fileAge / 1000 / 60)} 分钟)`);
            deletedCount++;
          }
        });
      }
    });
  });
  
  // 输出统计信息
  setTimeout(() => {
    console.log(`清理完成: 删除了 ${deletedCount} 个文件，失败 ${errorCount} 个`);
  }, 1000);
}); 