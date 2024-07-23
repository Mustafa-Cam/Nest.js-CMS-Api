import { Module } from '@nestjs/common';
import { AdminStaticLangController } from './staticlang.controller';
import { AdminStaticLangService } from './staticlang.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/middlewares/authenticate/auth.guard';
import { DatabaseModule } from 'src/providers/database/database.module';
import { languageModelProviders } from '../schemas/staticlang.providers';
import { LogService } from 'src/logger/logger.service';
import { LogModule } from 'src/logger/logger.module';

@Module({
  imports: [
    DatabaseModule,
    // JwtModule.register({
    //   global: true,
    //   secret: 'CHANGE_ME',
    //   signOptions: { expiresIn: '2h' },
    // }),
    LogModule,
  ],

  controllers: [AdminStaticLangController],
  providers: [
    ...languageModelProviders,
    AdminStaticLangService,
    //  LogService
  ],
})
export class AdminStaticLangModule {}
