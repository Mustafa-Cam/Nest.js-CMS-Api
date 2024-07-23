import { Module } from '@nestjs/common';
import { FrontOptionsController } from './options.controller';
import { FrontOptionsService } from './options.service';

@Module({
  controllers: [FrontOptionsController],
  providers: [FrontOptionsService],
})
export class FrontOptionsModule {}
