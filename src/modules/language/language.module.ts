import { Module } from '@nestjs/common';
import { FrontLanguageModule } from './front/language.module';
import { AdminLanguageModule } from './admin/language.module';
import { LogModule } from 'src/logger/logger.module';

@Module({
  imports: [FrontLanguageModule, AdminLanguageModule],
})
export class LanguageModule {}
