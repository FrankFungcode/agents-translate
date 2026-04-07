import type { Perspective, TranslateInput, TranslateResponse } from './types';
import { detectMissingInfo, guessPerspective } from './analysis';

function buildPmToDev(input: TranslateInput): string {
  return `# 技术实现建议

- 建议先拆分为最小可交付版本（MVP），明确核心业务路径并定义接口契约。
- 采用分层方案：前端交互层、业务服务层、数据访问层，降低后续改动成本。
- 对关键路径补充埋点与日志，方便上线后验证业务效果。

# 性能与约束

- 关键页面建议控制首屏响应与渲染时间，避免明显卡顿。
- 对高频接口增加缓存与限流策略，防止峰值流量下抖动。
- 明确上下游依赖和降级策略，避免单点故障扩大影响。

# 工作量评估

- 复杂度：中
- 预估原因：包含需求拆解、接口联调、基础监控与灰度验证，协作链路较完整。

# 待确认问题

- 本次上线的核心成功指标是什么（如转化、留存、时长）？
- 可接受的性能阈值与峰值流量范围是多少？
- 是否需要灰度发布与回滚预案？
- 需求边界中哪些点可延后到下一迭代？`;
}

function buildDevToPm(input: TranslateInput): string {
  return `# 结论摘要

- 当前技术方案可落地，建议按“先上线核心能力、再逐步优化”的节奏推进。

# 对用户体验与业务的影响

- 用户侧可更快完成关键操作，页面稳定性和响应体验会提升。
- 业务侧可更快验证核心假设，减少大范围一次性投入的风险。
- 通过阶段性发布，我们可以更早拿到真实反馈并调整策略。

# 风险与代价

- 存在接口兼容与流量峰值风险，需要配套监控和降级策略。
- 首版会保留部分技术债，后续需安排优化窗口。
- 需要产品与研发同步确认验收标准，减少返工。

# 建议下一步

- 锁定首版范围与验收口径，避免需求在开发中持续扩张。
- 明确灰度发布计划与观察指标。
- 预留一次复盘，基于上线数据安排二期优化。`;
}

export function fallbackTranslate(input: TranslateInput): TranslateResponse {
  const perspective: Perspective =
    input.direction === 'AUTO'
      ? guessPerspective(input.content)
      : input.direction === 'PM_TO_DEV'
        ? 'PM'
        : 'DEV';

  const direction: TranslateResponse['direction'] =
    perspective === 'PM' ? 'PM_TO_DEV' : 'DEV_TO_PM';
  const result = direction === 'PM_TO_DEV' ? buildPmToDev(input) : buildDevToPm(input);

  return {
    result,
    direction,
    detectedPerspective: input.direction === 'AUTO' ? perspective : undefined,
    missingInfo: detectMissingInfo(input.content, perspective),
  };
}
