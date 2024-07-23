import { Module } from '@nestjs/common';
import { FrontLanguageController } from './language.controller';
import { FrontLanguageService } from './language.service';

@Module({
  controllers: [FrontLanguageController],
  providers: [FrontLanguageService],
})
export class FrontLanguageModule {}
