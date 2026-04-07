# 上线前检查清单

## 本地检查

1. 依赖安装：`pnpm install`
2. 静态检查：`pnpm lint`
3. 构建检查：`pnpm build`
4. 启动开发：`pnpm dev`
5. 健康检查：`curl http://localhost:3000/api/health`
6. SSE 延迟：`pnpm check:latency`

## 功能验收

1. `PM_TO_DEV` 输出包含：技术实现建议、性能与约束、工作量评估、待确认问题。
2. `DEV_TO_PM` 输出包含：结论摘要、体验/业务影响、风险与代价、建议下一步。
3. `AUTO` 能区分 PM 与 DEV 视角并自动路由。
4. 三种方向切换后，输入与输出互不覆盖。
5. 错误场景（空输入、后端异常）前端有可读提示。

## 部署验收

1. Workers 部署成功，`/api/health` 正常。
2. Pages 部署成功，页面可访问，调用 API 无跨域问题。
3. 生产环境存在 `OPENAI_API_KEY` 且可调用模型。
4. SSE 在生产环境下可稳定结束并返回 `done` 事件。
