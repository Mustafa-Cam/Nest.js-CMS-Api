import { Module } from '@nestjs/common';
import { AdminLanguageController } from './language.controller';
import { AdminLanguageService } from './language.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/middlewares/authenticate/auth.guard';
import { DatabaseModule } from 'src/providers/database/database.module';
import { languageModelProviders } from '../schemas/language.providers';
import { LogModule } from 'src/logger/logger.module';
import { LogService } from 'src/logger/logger.service';

@Module({
  imports: [
    DatabaseModule,
    // JwtModule.register({
    //   global: true,
    //   secret: 'CHANGE_ME',
    //   signOptions: { expiresIn: '2h' },
    // }),
    
     LogModule

  ],
  controllers: [AdminLanguageController],
  providers: [
    
    ...languageModelProviders,
    AdminLanguageService,

    //  LogService,

  ],
})
export class AdminLanguageModule {}
