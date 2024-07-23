import { Module, forwardRef } from '@nestjs/common';
import { AdminMemberController } from './member.controller';
import { AdminMemberService } from './member.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/middlewares/authenticate/auth.guard';
import { DatabaseModule } from 'src/providers/database/database.module';
import { memberModelProviders } from '../schemas/member.providers';
import { LogModule } from 'src/logger/logger.module';
import { LogService } from 'src/logger/logger.service';
import { AdminMemberAddressService } from 'src/modules/memberaddress/admin/memberAddress.service';
import { memberAddressModelProviders } from 'src/modules/memberaddress/schemas/memberAddress.providers';
import { AdminMemberAddressModule } from 'src/modules/memberaddress/admin/memberAddress.module';

@Module({
  imports: [
    DatabaseModule,
    // JwtModule.register({
    //   global: true,
    //   secret: 'CHANGE_ME',
    //   signOptions: { expiresIn: '2h' },
    // }),
    forwardRef(() => AdminMemberAddressModule),
    LogModule,
  ],
  controllers: [AdminMemberController],
  providers: [
    ...memberModelProviders, // model provider enject ediliyor bağımlılık conn vs için.
    AdminMemberService,
    //  LogService,
  ],
  exports: ['MEMBER_MODEL'],
})
export class AdminMemberModule {}
