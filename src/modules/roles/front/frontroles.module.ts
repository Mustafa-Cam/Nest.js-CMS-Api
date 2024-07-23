import { Module } from '@nestjs/common';
import { FrontLanguageController } from './frontroles.controller';
import { FrontLanguageService } from './frontroles.service';

@Module({
  controllers: [FrontLanguageController],
  providers: [FrontLanguageService],
})
export class FrontRolesModule {}
