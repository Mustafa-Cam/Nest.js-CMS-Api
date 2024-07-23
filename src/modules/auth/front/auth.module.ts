import { Module } from '@nestjs/common';
import { FrontAuthController } from './auth.controller';
import { FrontAuthService } from './auth.service';

@Module({
  controllers: [FrontAuthController],
  providers: [FrontAuthService],
})
export class FrontAuthModule {}
