import { Module } from '@nestjs/common';
import { FrontStaticLangModule } from './front/staticlang.module';
import { AdminStaticLangModule } from './admin/staticlang.module';
import { LogModule } from 'src/logger/logger.module';


@Module({
  imports: [FrontStaticLangModule, AdminStaticLangModule],
})
export class staticLangModule {}
