import { Module } from '@nestjs/common';
import { AdminAuthController } from './auth.controller';
import { AdminAuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/middlewares/authenticate/auth.guard';
import { DatabaseModule } from 'src/providers/database/database.module';
import { userProviders } from '../schemas/user.providers';
import { LogModule } from 'src/logger/logger.module';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: 'CHANGE_ME',
      signOptions: { expiresIn: '2h' },
    }),
    LogModule
  ],
  controllers: [AdminAuthController],
  providers: [
 
    ...userProviders,
    AdminAuthService,
  ],
})
export class AdminAuthModule {}
