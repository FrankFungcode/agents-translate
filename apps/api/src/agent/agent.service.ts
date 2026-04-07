import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AgentCore } from '../core/agent-core';
import type { TranslateInput } from '../core/types';

@Injectable()
export class AgentService {
  private readonly agentCore: AgentCore;

  constructor(private readonly configService: ConfigService) {
    this.agentCore = new AgentCore({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      openAIModel: this.configService.get<string>('OPENAI_MODEL') ?? 'gpt-4o-mini',
    });
  }

  translate(input: TranslateInput) {
    return this.agentCore.translate(input);
  }

  streamTranslate(input: TranslateInput) {
    return this.agentCore.streamTranslate(input);
  }
}
