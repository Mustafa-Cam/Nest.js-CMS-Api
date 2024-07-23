import { Module } from '@nestjs/common';
import { AdminOptionsController } from './options.controller';
import { AdminOptionsService } from './options.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/middlewares/authenticate/auth.guard';
import { DatabaseModule } from 'src/providers/database/database.module';
import { optionsModelProviders } from '../schemas/options.providers';
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
  controllers: [AdminOptionsController],
  providers: [
    
    ...optionsModelProviders, // model provider enject ediliyor bağımlılık conn vs için.
    AdminOptionsService,

    //  LogService,
  ],
})
export class AdminOptionsModule {}
