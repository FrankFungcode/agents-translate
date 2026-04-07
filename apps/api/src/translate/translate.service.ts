import { Injectable } from '@nestjs/common';
import { AgentService } from '../agent/agent.service';
import type { TranslateDto } from './dto/translate.dto';

@Injectable()
export class TranslateService {
  constructor(private readonly agentService: AgentService) {}

  translate(dto: TranslateDto) {
    return this.agentService.translate(dto);
  }

  stream(dto: TranslateDto) {
    return this.agentService.streamTranslate(dto);
  }
}
