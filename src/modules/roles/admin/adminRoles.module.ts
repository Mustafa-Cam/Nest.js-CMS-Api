import { Module } from '@nestjs/common';
import { AdminRolesController } from './adminRoles.controller';
import { AdminRolesService } from './adminRoles.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/middlewares/authenticate/auth.guard';
import { DatabaseModule } from 'src/providers/database/database.module';
import { rolesModelProviders } from '../schemas/roles.providers';
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

    LogModule,
  ],
  controllers: [AdminRolesController],
  providers: [
    ...rolesModelProviders,
    AdminRolesService,

    //  LogService,
  ],
})
export class AdminRolesModule {}
