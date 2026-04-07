import { guessPerspective } from '../../core/analysis';
import type { Perspective } from '../../core/types';

export function detectPerspectiveTool(content: string): Perspective {
  return guessPerspective(content);
}
