import type { Perspective } from './types';

const PM_HINTS = ['用户', '业务', '需求', '转化', '留存', '活动', '页面', '流程', '体验'];
const DEV_HINTS = ['接口', '数据库', '缓存', '并发', '延迟', '字段', '服务', '部署', '监控'];

export function guessPerspective(content: string): Perspective {
  const normalized = content.toLowerCase();
  const pmScore = PM_HINTS.filter((item) => normalized.includes(item)).length;
  const devScore = DEV_HINTS.filter((item) => normalized.includes(item)).length;
  return devScore > pmScore ? 'DEV' : 'PM';
}

export function detectMissingInfo(content: string, perspective: Perspective): string[] {
  const missing: string[] = [];

  if (content.length < 30) {
    missing.push('业务背景或技术上下文仍然偏少，建议补充目标场景');
  }

  if (perspective === 'PM') {
    if (!/性能|秒|并发|峰值|延迟|响应/.test(content)) {
      missing.push('缺少明确的性能或响应要求');
    }
    if (!/时间|周期|排期|优先级/.test(content)) {
      missing.push('缺少交付节奏或优先级信息');
    }
  } else {
    if (!/影响|收益|业务|用户|体验/.test(content)) {
      missing.push('缺少业务影响或用户价值描述');
    }
    if (!/风险|回滚|兼容|成本/.test(content)) {
      missing.push('缺少风险、兼容性或成本说明');
    }
  }

  return missing;
}
