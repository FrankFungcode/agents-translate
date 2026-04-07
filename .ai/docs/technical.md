# 技术文档

## 1. 技术栈

- Monorepo：`pnpm + Turborepo`
- Web：`React 18 + TypeScript + Vite + Tailwind CSS`
- API（本地）：`NestJS`
- API（生产）：`Hono + Cloudflare Workers`
- AI：`LangChain.js + ChatOpenAI`
- 渲染：`react-markdown + remark-gfm`
- 流式通信：`SSE`

## 2. 项目结构

```text
agents-translate/
├── apps/
│   ├── web/
│   │   ├── src/components/
│   │   ├── src/hooks/useStreamTranslate.ts
│   │   ├── src/lib/{api,env,types}.ts
│   │   └── src/App.tsx
│   └── api/
│       ├── src/main.ts                  # NestJS 入口（本地）
│       ├── src/worker.ts                # Hono 入口（Cloudflare Workers）
│       ├── src/core/agent-core.ts       # 核心翻译流程（共享）
│       ├── src/core/fallback.ts         # 无 key 兜底翻译
│       ├── src/translate/               # DTO / Controller / Service
│       └── src/prompts/                 # Prompt 模板
├── scripts/check-sse-latency.sh
├── docs/deployment-cloudflare.md
└── .ai/docs/technical.md
```

## 3. 系统架构

### 3.1 本地开发

```text
Browser (Vite :3721)
  -> /api/* proxy
NestJS API (:3000)
  -> AgentCore
  -> OpenAI / fallback
```

### 3.2 生产部署

```text
Cloudflare Pages
  -> Cloudflare Workers (Hono)
  -> AgentCore
  -> OpenAI / fallback
```

## 4. 核心能力实现

- `PM_TO_DEV`：业务需求翻译成技术表达
- `DEV_TO_PM`：技术结论翻译成业务表达
- `AUTO`：自动识别输入视角并路由
- `SSE`：token 级流式输出
- 会话隔离：前端在内存中按方向维护独立输入/输出状态

### 4.1 fallback 机制

- 若存在 `OPENAI_API_KEY`：走真实大模型翻译
- 若不存在 `OPENAI_API_KEY`：自动走 `fallbackTranslate`
- fallback 仍保留三方向流程与 SSE 输出，只是内容更模板化

## 5. API 设计

### 5.1 健康检查

- `GET /api/health`
- 返回服务状态和时间戳（Worker 版本会返回 `hasOpenAIKey`）

### 5.2 同步翻译

- `POST /api/translate`

请求：

```json
{
  "content": "我们需要一个推荐功能，首页不能卡。",
  "direction": "PM_TO_DEV",
  "context": "电商场景"
}
```

响应：

```json
{
  "result": "# 技术实现建议 ...",
  "direction": "PM_TO_DEV",
  "detectedPerspective": "PM",
  "missingInfo": ["缺少明确的性能或响应要求"]
}
```

### 5.3 流式翻译

- `GET /api/translate/stream?content=...&direction=...&context=...`

SSE 事件：

```text
data: {"token":"#"}
data: {"token":" 技术实现建议"}
...
data: {"done":true,"result":"...","direction":"PM_TO_DEV","missingInfo":[]}
```

## 6. 前端实现要点

- `DirectionSelector`：三方向切换
- `InputArea`：内容与上下文输入
- `OutputArea`：Markdown 输出与状态展示
- `TranslatePanel`：会话隔离状态管理
- `useStreamTranslate`：封装 SSE 生命周期

### 6.1 API 地址策略

- 本地：默认走相对路径 `/api`（由 Vite proxy 转发）
- 线上：通过 `VITE_API_BASE_URL` 指向 Worker 域名

## 7. 环境变量

### 7.1 API（本地 .env）

```bash
OPENAI_API_KEY=sk-xxxx           # 可选，不填则 fallback
OPENAI_MODEL=gpt-4o-mini
PORT=3000
CORS_ORIGIN=http://localhost:3721
```

### 7.2 Worker（wrangler）

- `OPENAI_MODEL`
- `CORS_ORIGIN`（支持逗号分隔多个域名）
- `OPENAI_API_KEY`（通过 secret 配置）

### 7.3 Pages

- `VITE_API_BASE_URL=https://<your-worker-domain>`

## 8. 常用命令

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm check:latency
```

子应用命令：

```bash
pnpm --filter @agents-translate/web dev
pnpm --filter @agents-translate/api dev
pnpm --filter @agents-translate/api run deploy
```

## 9. 验收要点

- 三方向翻译均可用
- `AUTO` 识别逻辑可路由到正确方向
- SSE 流式输出持续返回 token 且有 `done` 事件
- 方向切换后输入输出互不覆盖
- `pnpm check:latency` 首字延迟目标 `< 2s`
