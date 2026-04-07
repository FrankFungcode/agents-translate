# agents-translate

一个面向 PM 与开发协作场景的职能沟通翻译助手。

## 核心能力

- `PM -> DEV`：把业务需求翻译为可落地的技术描述
- `DEV -> PM`：把技术方案翻译为业务可理解语言
- `AUTO`：自动识别当前输入更像 PM 还是 DEV 视角
- `SSE`：服务端流式返回翻译结果
- `会话隔离`：三个方向分别保留输入和输出内容

## 技术方案

- Monorepo：`pnpm + Turborepo`
- 前端：`React 18 + TypeScript + Tailwind CSS + react-markdown`
- 后端：`NestJS + Hono + LangChain.js`
- 模型：默认 `OpenAI`
- 部署：`Cloudflare Pages + Cloudflare Workers`

## 本地启动

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm dev
```

- 前端：`http://localhost:3721`
- 后端：`http://localhost:3000`

## 本地联调说明

- 若已配置 `OPENAI_API_KEY`，后端会调用真实模型并流式返回。
- 若未配置 `OPENAI_API_KEY`，后端自动进入本地 fallback 模式，仍可完整演示三方向和 SSE 链路。

健康检查：

```bash
curl http://localhost:3000/api/health
```

SSE 延迟检查（目标首字 < 2s）：

```bash
pnpm check:latency
```

## API

### `POST /api/translate`

```json
{
  "content": "我们要做一个推荐系统，首页首屏不能卡顿。",
  "direction": "PM_TO_DEV"
}
```

### `GET /api/translate/stream`

查询参数：

- `content`
- `direction`
- `context`（可选）

SSE 返回：

```text
data: {"token":"#"}
data: {"token":" 技术实现建议"}
data: {"done":true}
```

## 部署与验收文档

- Cloudflare 部署：[`docs/deployment-cloudflare.md`](/Users/zhihao/agents-translate/docs/deployment-cloudflare.md)
- 上线前验收：[`docs/release-checklist.md`](/Users/zhihao/agents-translate/docs/release-checklist.md)
