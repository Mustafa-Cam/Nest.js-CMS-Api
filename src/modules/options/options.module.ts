import { Module } from '@nestjs/common';
import { FrontOptionsModule } from './front/options.module';
import { AdminOptionsModule } from './admin/options.module';
import { LogModule } from 'src/logger/logger.module';


@Module({
  imports: [FrontOptionsModule, AdminOptionsModule],
})
export class OptionsModule {}
