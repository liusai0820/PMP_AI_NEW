# PMP AI 组件文档

本文档详细介绍了 PMP AI 项目中各个组件的功能和结构，帮助开发者更好地理解和维护代码。

## 目录结构

项目采用 Next.js 的 App Router 结构，主要目录如下：

```
app/                  # 主应用目录
├── (auth)/           # 认证相关页面
├── (dashboard)/      # 仪表盘相关页面
├── api/              # API 路由
├── dashboard/        # 仪表盘组件
├── globals.css       # 全局样式
├── layout.tsx        # 根布局组件
└── page.tsx          # 首页组件

components/           # 可复用组件
├── assistant/        # AI 助手相关组件
├── dashboard/        # 仪表盘相关组件
├── reports/          # 报告相关组件
└── ui/               # UI 基础组件

lib/                  # 工具函数和库
public/               # 静态资源
types/                # TypeScript 类型定义
```

## 核心页面组件

### 首页 (`app/page.tsx`)

首页组件是用户访问应用时看到的第一个页面，提供了应用的概览和主要功能入口。

### 仪表盘页面 (`app/(dashboard)/page.tsx`)

仪表盘页面是用户登录后的主界面，展示项目概览、任务进度、团队活动等关键信息。

### 设置页面 (`app/(dashboard)/settings/page.tsx`)

设置页面允许用户配置个人信息、通知设置和系统主题等偏好。主要功能包括：

- 个人信息管理：修改用户名和邮箱
- 通知设置：配置邮件通知、项目更新提醒和报告分析完成通知
- 系统主题选择：默认主题、暗色主题和高对比度主题

## 功能组件

### 仪表盘组件 (`components/dashboard/`)

仪表盘相关组件包括：

- **DashboardHeader**：显示仪表盘标题和操作按钮
- **ProjectSummary**：展示项目概览和关键指标
- **TaskList**：显示待办任务和进行中的任务
- **ActivityFeed**：展示团队最近活动
- **PerformanceChart**：项目性能和进度图表

### AI 助手组件 (`components/assistant/`)

AI 助手相关组件包括：

- **AssistantChat**：AI 助手聊天界面
- **SuggestionPanel**：智能建议面板
- **AutomationTools**：自动化工具集合

### 报告组件 (`components/reports/`)

报告相关组件包括：

- **ReportGenerator**：报告生成工具
- **DataVisualization**：数据可视化组件
- **AnalyticsDashboard**：分析仪表盘

### UI 基础组件 (`components/ui/`)

基础 UI 组件采用 Shadcn UI 库，包括：

- **Button**：按钮组件
- **Input**：输入框组件
- **Checkbox**：复选框组件
- **Select**：下拉选择组件
- **Modal**：模态框组件
- **Card**：卡片组件
- **Table**：表格组件

## 状态管理

项目使用 Zustand 进行状态管理，主要包括以下几个 store：

- **userStore**：管理用户信息和认证状态
- **projectStore**：管理项目数据和操作
- **uiStore**：管理 UI 状态（如主题、侧边栏状态等）
- **notificationStore**：管理通知和提醒

## 数据获取

项目使用 TanStack Query (React Query) 进行数据获取和缓存，主要查询包括：

- **useProjects**：获取项目列表
- **useProjectDetails**：获取项目详情
- **useReports**：获取报告列表
- **useUserProfile**：获取用户资料

## 表单处理

项目使用 React Hook Form 和 Zod 进行表单处理和验证，主要表单包括：

- **LoginForm**：登录表单
- **ProjectForm**：项目创建和编辑表单
- **SettingsForm**：用户设置表单
- **ReportForm**：报告生成表单

## 路由结构

项目使用 Next.js App Router，主要路由包括：

- **/**：首页
- **/dashboard**：仪表盘
- **/projects**：项目列表
- **/projects/[id]**：项目详情
- **/assistant**：AI 助手
- **/reports**：报告列表
- **/reports/[id]**：报告详情
- **/knowledge**：知识库
- **/settings**：设置页面
- **/auth/login**：登录页面
- **/auth/register**：注册页面

## 最佳实践

在开发和维护本项目时，请遵循以下最佳实践：

1. **组件设计**：遵循单一职责原则，每个组件只负责一个功能
2. **状态管理**：合理使用 Zustand store，避免状态冗余
3. **性能优化**：使用 React.memo、useMemo 和 useCallback 优化性能
4. **类型安全**：确保所有组件和函数都有正确的 TypeScript 类型定义
5. **错误处理**：妥善处理异常情况，提供友好的错误提示
6. **响应式设计**：确保应用在不同设备上都有良好的显示效果
7. **代码风格**：遵循项目的代码风格和命名约定
8. **测试**：为关键组件和功能编写单元测试和集成测试 