# 技术文档

## 技术栈

- Monorepo：pnpm + Turborepo
- Web：React 18 + TypeScript + Tailwind CSS
- API：NestJS（本地开发）+ Hono（Workers 生产入口）
- AI：LangChain.js + OpenAI
- 流式：SSE

## 目录

```text
agents-translate/
├── apps/
│   ├── web
│   └── api
├── docs
└── .ai/docs
```

## 设计原则

- 复用架构思路，不复制第三方作者标识或仓库身份信息
- 优先保证翻译结构稳定，其次再优化大模型自由生成能力
- 本地与 Cloudflare 入口共享一套核心翻译逻辑
