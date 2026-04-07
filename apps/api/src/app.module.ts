import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TranslateModule } from './translate/translate.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TranslateModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
