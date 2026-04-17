# AI Agent Assistant

## 项目概述

AI Agent Assistant 是一个基于 React 和 TypeScript 开发的智能助手应用，提供流式响应（SSE）、会话管理、Function Calling 等功能的 AI 聊天界面。该项目旨在为用户提供高效、便捷的 AI 交互体验，支持多轮对话和工具调用。

## 功能特性

- **AI 智能聊天**：支持与 AI 助手进行实时对话，提供流式响应（SSE）以提升用户体验。
- **会话管理**：支持多会话管理，用户可以创建、切换和查看历史会话记录。
- **Function Calling**：集成工具调用功能，包括查询城市天气、获取当前时间等实用工具。
- **多轮工具调用 Agent 循环**：支持复杂的多轮对话和工具链调用，实现更智能的交互。
- **RAG 文档助手**：提供基于检索增强生成（RAG）的文档问答功能。
- **响应式设计**：使用 Ant Design 组件库，确保在不同设备上的良好显示效果。
- **Markdown 支持**：聊天消息支持 Markdown 渲染和代码高亮。

## 技术栈

- **前端框架**：React 19.2.5
- **开发语言**：TypeScript 6.0.2
- **构建工具**：Vite 6.0.1
- **UI 组件库**：Ant Design 6.3.5
- **路由管理**：React Router DOM 7.14.1
- **HTTP 客户端**：Axios 1.15.0
- **Markdown 渲染**：React Markdown 10.1.0
- **代码高亮**：rehype-highlight 7.0.2
- **测试框架**：Jest, React Testing Library
- **部署平台**：Netlify

## 环境要求

- Node.js >= 18.0.0
- npm 或 yarn

## 安装和运行

### 1. 克隆项目

```bash
git clone https://github.com/laohanT/ai-agent-assistant.git
cd ai-agent-assistant
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env` 文件并配置以下变量：

```env
VITE_AI_AGENT_URL=<your-ai-agent-api-url>
```

### 4. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` 上运行，并自动打开浏览器。

### 5. 构建生产版本

```bash
npm run build
```

### 6. 预览构建结果

```bash
npm run preview
```

## 项目结构

```
ai-agent-assistant/
├── public/
│   └── index.html
├── src/
│   ├── components/          # 公共组件
│   ├── pages/               # 页面组件
│   │   ├── aiChat/          # AI 聊天页面
│   │   └── aiPdfChat/       # RAG 文档助手页面
│   ├── router/              # 路由配置
│   ├── utils/               # 工具函数
│   ├── App.tsx              # 主应用组件
│   ├── index.tsx            # 应用入口
│   └── vite-env.d.ts        # Vite 类型定义
├── package.json
├── tsconfig.json
├── vite.config.ts
└── netlify.toml             # Netlify 部署配置
```

## 使用说明

1. **启动应用**：运行 `npm run dev` 启动开发服务器。
2. **AI 聊天**：在主页与 AI 助手进行对话，支持流式响应。
3. **会话管理**：点击侧边栏的"新会话"按钮创建新会话，或选择历史会话继续对话。
4. **RAG 文档助手**：访问 `/ai-pdf-chat` 路径使用文档问答功能。
5. **工具调用**：AI 可以调用内置工具，如查询天气或获取时间。

## 构建和部署

### 本地构建

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 部署到 Netlify

1. 将项目推送到 GitHub 仓库。
2. 在 Netlify 中连接仓库，选择主分支。
3. 配置构建命令为 `npm run build`，发布目录为 `dist`。
4. 添加环境变量 `VITE_AI_AGENT_URL`。
5. 部署完成。

## 测试

运行测试套件：

```bash
npm test
```

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库。
2. 创建特性分支：`git checkout -b feature/your-feature-name`。
3. 提交更改：`git commit -m 'Add some feature'`。
4. 推送分支：`git push origin feature/your-feature-name`。
5. 提交 Pull Request。

请确保代码符合项目的编码规范，并包含必要的测试。

## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 联系我们

如有问题或建议，请通过以下方式联系：

- 邮箱：your-email@example.com
- 项目主页：[GitHub Repository](https://github.com/your-username/ai-agent-assistant)

---

**版本**：0.1.0
**最后更新**：2026年4月17日</content>
<parameter name="filePath">d:\React\ai-agent-assistant\README.md