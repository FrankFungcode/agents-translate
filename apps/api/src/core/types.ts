export const DIRECTIONS = ['PM_TO_DEV', 'DEV_TO_PM', 'AUTO'] as const;

export type Direction = (typeof DIRECTIONS)[number];
export type Perspective = 'PM' | 'DEV';

export interface TranslateInput {
  content: string;
  direction: Direction;
  context?: string;
}

export interface TranslateResponse {
  result: string;
  direction: Exclude<Direction, 'AUTO'>;
  detectedPerspective?: Perspective;
  missingInfo: string[];
}

export interface RuntimeConfig {
  openAIApiKey?: string;
  openAIModel: string;
}
