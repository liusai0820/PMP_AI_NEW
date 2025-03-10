# PMP AI - 智能项目管理平台

PMP AI 是一个基于人工智能的项目管理平台，旨在通过 AI 技术提升项目管理效率。平台支持智能文档分析、自动信息提取、项目进度跟踪和团队协作等功能。

## 🌟 特性

- 📄 **智能文档分析**：
  - OCR 文字识别（Mistral AI）
  - 智能信息提取（Google Gemini）
  - 支持扫描件和图片识别
- 🤖 **AI 助手**：实时项目咨询和智能建议
- 📊 **项目仪表盘**：直观的项目进度和状态展示
- 📈 **数据分析**：自动生成项目报告和分析
- 👥 **团队协作**：高效的团队沟通和任务管理

## 🚀 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 14+
- Yarn 或 npm

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/yourusername/pmp-ai.git
cd pmp-ai
```

2. 安装依赖
```bash
yarn install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填写必要的配置信息
```

4. 初始化数据库
```bash
yarn prisma migrate dev
```

5. 启动开发服务器
```bash
yarn dev
```

访问 http://localhost:3000 开始使用。

## 📖 文档

详细的开发文档请参考 [COMPONENTS_DOCUMENTATION.md](./COMPONENTS_DOCUMENTATION.md)。

### 主要功能模块

- **项目管理**：创建、编辑和跟踪项目
- **文档处理**：智能解析项目文档
- **团队协作**：任务分配和进度跟踪
- **数据分析**：自动生成项目报告

## 🛠️ 技术栈

- **前端框架**：Next.js 14
- **UI 框架**：Tailwind CSS + Shadcn UI
- **状态管理**：Zustand
- **数据获取**：TanStack Query
- **AI 集成**：
  - OCR 文字识别：Mistral AI
  - 文档解析：Google Gemini
- **数据库**：PostgreSQL + Prisma
- **认证**：NextAuth.js

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📝 更新日志

详见 [CHANGELOG.md](./CHANGELOG.md)

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](./LICENSE) 文件

## 🤝 支持

如果您在使用过程中遇到任何问题，请：

1. 查看 [文档](./COMPONENTS_DOCUMENTATION.md)
2. 搜索 [Issues](https://github.com/yourusername/pmp-ai/issues)
3. 提交新的 Issue

## 🌟 致谢

感谢所有为本项目做出贡献的开发者！
