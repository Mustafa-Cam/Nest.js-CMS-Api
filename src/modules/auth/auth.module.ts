import { Module } from '@nestjs/common';
import { FrontAuthModule } from './front/auth.module';
import { AdminAuthModule } from './admin/auth.module';

@Module({
  imports: [FrontAuthModule, AdminAuthModule],
})
export class AuthModule {}
