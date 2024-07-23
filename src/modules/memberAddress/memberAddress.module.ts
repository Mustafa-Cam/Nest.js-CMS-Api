import { Module } from '@nestjs/common';
import { FrontMembersAdresModule } from './front/membersAdres.module';
import { AdminMemberAddressModule } from './admin/memberAddress.module';
import { LogModule } from 'src/logger/logger.module';


@Module({
  imports: [FrontMembersAdresModule, AdminMemberAddressModule],
})
export class MemberAddressModule {}
