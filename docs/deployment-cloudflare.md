# Cloudflare 部署指南

## 1. 前置准备

- 已有 Cloudflare 账号
- 已安装依赖：`pnpm install`
- 可选：本地已验证 `pnpm build` 通过

## 2. 部署后端（Workers）

进入 API 项目目录：

```bash
cd apps/api
```

登录 Wrangler：

```bash
pnpm wrangler login
```

配置 OpenAI Key（生产强烈建议）：

```bash
pnpm wrangler secret put OPENAI_API_KEY
```

部署：

```bash
pnpm deploy
```

部署后建议先验证：

```bash
curl https://<your-worker-domain>/api/health
```

## 3. 部署前端（Pages）

在 Cloudflare Pages 创建项目并连接当前仓库，配置：

- Build command：`pnpm --filter @agents-translate/web build`
- Build output：`apps/web/dist`
- Root directory：`/`

## 4. 环境变量建议

Workers（`apps/api/wrangler.toml` + secret）：

- `OPENAI_MODEL`：如 `gpt-4o-mini`
- `CORS_ORIGIN`：你的 Pages 域名，例如 `https://xxx.pages.dev`
- `OPENAI_API_KEY`：通过 secret 配置

Pages：

- 如需跨域直连 Worker，可在前端环境变量中配置 API 基础地址
- 默认可继续使用 `/api` 代理策略（按实际部署方式调整）

## 5. 生产验收

上线后依次验证：

1. `GET /api/health` 可用。
2. `POST /api/translate` 返回结构化结果。
3. `GET /api/translate/stream` 能持续返回 token 并含 `done` 事件。
4. `AUTO` 输入 PM/DEV 两类文案均能正确路由。
