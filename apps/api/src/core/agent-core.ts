import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { detectMissingInfo } from './analysis';
import { detectPerspectivePrompt } from '../prompts/detect-perspective.prompt';
import { formatOutputPrompt } from '../prompts/format-output.prompt';
import { translateToDeveloperPrompt } from '../prompts/translate-to-developer.prompt';
import { translateToProductPrompt } from '../prompts/translate-to-product.prompt';
import type { Perspective, RuntimeConfig, TranslateInput, TranslateResponse } from './types';
import { detectPerspectiveTool } from '../agent/tools/detect-perspective.tool';
import { fallbackTranslate } from './fallback';

export class AgentCore {
  private readonly model?: ChatOpenAI;
  private readonly useFallback: boolean;

  constructor(private readonly config: RuntimeConfig) {
    this.useFallback = !config.openAIApiKey;
    if (!this.useFallback) {
      this.model = new ChatOpenAI({
        apiKey: config.openAIApiKey,
        model: config.openAIModel,
        temperature: 0.3,
        streaming: true,
        configuration: {
          baseURL: 'https://api.openai.com/v1',
        },
      });
    }
  }

  async translate(input: TranslateInput): Promise<TranslateResponse> {
    if (this.useFallback) {
      return fallbackTranslate(input);
    }

    const routing = await this.resolveDirection(input);
    const prompt = this.createTranslationPrompt(routing.perspective, input);
    const content = await this.model!.invoke(prompt);
    const formatted = await this.formatOutput(String(content.content));

    return {
      result: formatted,
      direction: routing.direction,
      detectedPerspective: input.direction === 'AUTO' ? routing.perspective : undefined,
      missingInfo: detectMissingInfo(input.content, routing.perspective),
    };
  }

  async *streamTranslate(input: TranslateInput): AsyncGenerator<string, TranslateResponse> {
    if (this.useFallback) {
      const fallback = fallbackTranslate(input);
      const parts = fallback.result.split(/(\s+)/).filter(Boolean);
      for (const part of parts) {
        yield part;
      }
      return fallback;
    }

    const routing = await this.resolveDirection(input);
    const prompt = this.createTranslationPrompt(routing.perspective, input);
    let fullText = '';

    const stream = await this.model!.stream(prompt);
    for await (const chunk of stream) {
      const token = typeof chunk.content === 'string' ? chunk.content : chunk.text ?? '';
      if (!token) {
        continue;
      }

      fullText += token;
      yield token;
    }

    const formatted = await this.formatOutput(fullText);
    return {
      result: formatted,
      direction: routing.direction,
      detectedPerspective: input.direction === 'AUTO' ? routing.perspective : undefined,
      missingInfo: detectMissingInfo(input.content, routing.perspective),
    };
  }

  private async resolveDirection(input: TranslateInput): Promise<{
    direction: 'PM_TO_DEV' | 'DEV_TO_PM';
    perspective: Perspective;
  }> {
    if (input.direction === 'PM_TO_DEV') {
      return { direction: 'PM_TO_DEV', perspective: 'PM' };
    }

    if (input.direction === 'DEV_TO_PM') {
      return { direction: 'DEV_TO_PM', perspective: 'DEV' };
    }

    const perspective = await this.detectPerspective(input.content);
    return perspective === 'PM'
      ? { direction: 'PM_TO_DEV', perspective }
      : { direction: 'DEV_TO_PM', perspective };
  }

  private async detectPerspective(content: string): Promise<Perspective> {
    const fastGuess = detectPerspectiveTool(content);
    try {
      const response = await this.model!.invoke([
        new SystemMessage(detectPerspectivePrompt),
        new HumanMessage(content),
      ]);
      const result = String(response.content).trim().toUpperCase();
      return result === 'DEV' ? 'DEV' : 'PM';
    } catch {
      return fastGuess;
    }
  }

  private createTranslationPrompt(perspective: Perspective, input: TranslateInput) {
    const systemPrompt =
      perspective === 'PM' ? translateToDeveloperPrompt : translateToProductPrompt;

    const userPayload = [
      input.context ? `补充上下文：${input.context}` : null,
      '原始内容：',
      input.content,
    ]
      .filter(Boolean)
      .join('\n\n');

    return [new SystemMessage(systemPrompt), new HumanMessage(userPayload)];
  }

  private async formatOutput(content: string): Promise<string> {
    try {
      const response = await this.model!.invoke([
        new SystemMessage(formatOutputPrompt),
        new HumanMessage(content),
      ]);
      return String(response.content).trim();
    } catch {
      return content.trim();
    }
  }
}
