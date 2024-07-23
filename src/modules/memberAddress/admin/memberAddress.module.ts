import { Module, forwardRef } from '@nestjs/common';
import { AdminMemberAddressController } from './memberAddress.controller';
import { AdminMemberAddressService } from './memberAddress.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/middlewares/authenticate/auth.guard';
import { DatabaseModule } from 'src/providers/database/database.module';
import { memberAddressModelProviders } from '../schemas/memberAddress.providers';
import { LogModule } from 'src/logger/logger.module';
import { LogService } from 'src/logger/logger.service';
import { AdminMemberService } from 'src/modules/member/admin/member.service';
import { memberModelProviders } from 'src/modules/member/schemas/member.providers';
import { MemberModule } from 'src/modules/member/member.module';
import { AdminMemberModule } from 'src/modules/member/admin/member.module';

@Module({
  imports: [
    DatabaseModule,
    // JwtModule.register({
    //   global: true,
    //   secret: 'CHANGE_ME',
    //   signOptions: { expiresIn: '2h' },
    // }),
    forwardRef(() => AdminMemberModule),
    LogModule,
  ],
  controllers: [AdminMemberAddressController],
  providers: [
    ...memberAddressModelProviders, // model provider enject ediliyor bağımlılık conn vs için.
    AdminMemberAddressService,
    //  LogService,
  ],
  exports: ['MEMBERADDRESS_MODEL'],
})
export class AdminMemberAddressModule {}
