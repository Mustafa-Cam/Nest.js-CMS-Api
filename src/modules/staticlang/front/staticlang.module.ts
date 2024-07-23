import { Module } from '@nestjs/common';
import { FrontStaticLangController } from './staticlang.controller';
import { FrontStaticLangService } from './staticlang.service';

@Module({
  controllers: [FrontStaticLangController],
  providers: [FrontStaticLangService],
})
export class FrontStaticLangModule {}
