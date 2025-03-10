# PMP AI 项目管理平台文档

PMP AI 是一个基于人工智能的项目管理平台，集成了智能文档分析、项目跟踪、团队协作和自动化报告等功能。本文档详细介绍了项目的架构、组件和功能。

## 技术栈

- **前端框架**：Next.js 14 (App Router)
- **UI 框架**：Tailwind CSS + Shadcn UI
- **状态管理**：Zustand
- **数据获取**：TanStack Query (React Query)
- **表单处理**：React Hook Form + Zod
- **AI 集成**：
  - OCR 文字识别：Mistral AI
  - 文档解析：Google Gemini
- **数据库**：Prisma + PostgreSQL
- **认证**：NextAuth.js

## 目录结构

```
app/                  # 主应用目录
├── (auth)/           # 认证相关页面
│   ├── login/       # 登录页面
│   └── register/    # 注册页面
├── (dashboard)/      # 仪表盘相关页面
│   ├── dashboard/   # 主仪表盘
│   ├── projects/    # 项目管理
│   ├── reports/     # 报告管理
│   └── settings/    # 系统设置
├── api/              # API 路由
│   ├── auth/        # 认证相关 API
│   ├── projects/    # 项目相关 API
│   └── reports/     # 报告相关 API
└── layout.tsx        # 根布局组件

components/           # 可复用组件
├── projects/         # 项目相关组件
│   ├── ProjectCreator.tsx    # 项目创建组件
│   ├── ProjectList.tsx       # 项目列表组件
│   └── ProjectDetail.tsx     # 项目详情组件
├── reports/          # 报告相关组件
├── ui/              # UI 基础组件
└── assistant/       # AI 助手组件

lib/                 # 工具函数和服务
├── prisma/         # Prisma 数据库配置
├── services/       # 业务服务层
└── utils/          # 工具函数

types/              # TypeScript 类型定义
```

## 核心功能模块

### 1. 项目管理模块

#### ProjectCreator 组件
- **路径**：`components/projects/ProjectCreator.tsx`
- **功能**：
  - 支持文档上传和智能信息提取
  - 表单化项目创建界面
  - 支持里程碑、预算和团队成员管理
- **主要 Props**：
```typescript
interface ProjectCreatorProps {
  onProjectCreate: (projectInfo: ProjectInfo) => Promise<void>;
  disabled?: boolean;
}
```
- **使用示例**：
```tsx
<ProjectCreator 
  onProjectCreate={handleProjectCreate}
  disabled={isCreating}
/>
```

#### ProjectInfo 接口
```typescript
interface ProjectInfo {
  name: string;
  projectName: string;
  projectCode: string;
  organization: string;
  client: string;
  projectManager: string;
  startDate: string;
  endDate: string;
  description: string;
  budget?: number;
  governmentFunding?: number;
  selfFunding?: number;
  milestones: Array<{
    name: string;
    date: string;
    status: string;
  }>;
  teamMembers: string[];
  budgets: Array<{
    category: string;
    subCategory: string;
    amount: number;
    source: 'support' | 'self';
    description: string;
  }>;
  team: Array<{
    name: string;
    title: string;
    role: string;
    workload: string;
    unit: string;
  }>;
}
```

### 2. 文档处理模块

#### DocumentProcessor 服务
- **路径**：`lib/services/documentProcessor.ts`
- **功能**：
  - 支持 DOCX、PDF 文件解析
  - OCR 文字识别（基于 Mistral AI）
  - 智能信息提取（基于 Google Gemini）
  - 数据结构化和验证

#### 文档分析流程
1. 文件上传和类型验证
2. OCR 文字识别（对于扫描件和图片）
3. 文本内容提取
4. Gemini 模型解析和结构化
5. 数据验证和清理
6. 结果返回

### 3. AI 助手模块

#### AssistantChat 组件
- **路径**：`components/assistant/AssistantChat.tsx`
- **功能**：
  - 实时项目咨询
  - 智能建议生成
  - 自动化任务执行

### 4. 数据库模型

#### Project 模型
```prisma
model Project {
  id              String      @id @default(cuid())
  name            String
  code            String?
  organization    String?
  client          String?
  manager         String?
  startDate       DateTime?
  endDate         DateTime?
  description     String?
  budget          Float?
  progress        Float       @default(0)
  status          String      @default("active")
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  milestones      Milestone[]
  team            TeamMember[]
  budgets         Budget[]
}
```

## API 路由

### 项目相关 API

#### 创建项目
- **路径**：`POST /api/projects`
- **功能**：创建新项目
- **请求体**：`ProjectInfo` 类型
- **响应**：创建的项目信息

#### 获取项目详情
- **路径**：`GET /api/projects/[id]`
- **功能**：获取项目详细信息
- **响应**：项目完整信息

## 最佳实践

### 1. 组件开发规范

- 使用 TypeScript 类型定义
- 组件文件命名采用 PascalCase
- 工具函数文件命名采用 camelCase
- 每个组件都应该有对应的文档注释

### 2. 状态管理

- 使用 Zustand 进行全局状态管理
- 组件内部状态使用 useState
- 复杂表单状态使用 React Hook Form

### 3. 错误处理

- 使用 try-catch 包装异步操作
- 统一的错误提示组件
- 详细的错误日志记录

### 4. 性能优化

- 使用 React.memo 优化组件重渲染
- 使用 useMemo 和 useCallback 优化性能
- 图片懒加载和组件动态导入

### 5. 安全性

- 输入数据验证和清理
- API 请求认证和授权
- 敏感信息加密存储

## 开发流程

1. **功能开发**
   - 创建功能分支
   - 编写代码和测试
   - 提交 PR 和代码审查

2. **测试**
   - 单元测试
   - 集成测试
   - E2E 测试

3. **部署**
   - 开发环境部署
   - 测试环境部署
   - 生产环境部署

## 环境变量配置

```env
# 数据库
DATABASE_URL="postgresql://..."

# AI API Keys
OPENAI_API_KEY="..."
GOOGLE_API_KEY="..."

# 认证
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="..."

# 其他配置
NODE_ENV="development"
```

## 常见问题解决

1. **项目创建失败**
   - 检查表单数据完整性
   - 验证文件上传状态
   - 查看服务器错误日志

2. **文档解析错误**
   - 确认文件格式支持
   - 检查文件内容完整性
   - 验证 AI 服务状态

3. **性能问题**
   - 检查组件重渲染
   - 优化数据获取策略
   - 分析网络请求

## 更新日志

### v1.0.0 (2024-03)
- 初始版本发布
- 基础项目管理功能
- 集成 Mistral AI 实现 OCR 功能
- 集成 Google Gemini 实现智能文档解析

### v1.1.0 (计划中)
- 团队协作功能增强
- 报告生成功能优化
- OCR 识别准确率提升
- 性能优化 