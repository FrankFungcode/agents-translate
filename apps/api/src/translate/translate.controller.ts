import {
  Body,
  Controller,
  Get,
  MessageEvent,
  Post,
  Query,
  Sse,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TranslateDto, TranslateStreamDto } from './dto/translate.dto';
import { TranslateService } from './translate.service';

@Controller('api/translate')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
  }),
)
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @Post()
  translate(@Body() dto: TranslateDto) {
    return this.translateService.translate(dto);
  }

  @Sse('stream')
  stream(@Query() dto: TranslateStreamDto): Observable<MessageEvent> {
    return new Observable<MessageEvent>((subscriber) => {
      void (async () => {
        try {
          const generator = this.translateService.stream(dto);
          let finalValue:
            | Awaited<ReturnType<TranslateService['translate']>>
            | undefined;

          while (true) {
            const next = await generator.next();
            if (next.done) {
              finalValue = next.value;
              break;
            }
            subscriber.next({ data: { token: next.value } });
          }

          subscriber.next({
            data: {
              done: true,
              direction: finalValue?.direction,
              detectedPerspective: finalValue?.detectedPerspective,
              missingInfo: finalValue?.missingInfo ?? [],
              result: finalValue?.result ?? '',
            },
          });
          subscriber.complete();
        } catch (error) {
          const message =
            error instanceof Error ? error.message : '翻译服务暂时不可用，请稍后重试';
          subscriber.error({ data: { error: message } });
        }
      })();
    });
  }
}
