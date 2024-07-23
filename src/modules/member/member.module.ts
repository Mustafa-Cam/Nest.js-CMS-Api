import { Module } from '@nestjs/common';
import { FrontMembersModule } from './front/members.module';
import { AdminMemberModule } from './admin/member.module';
import { LogModule } from 'src/logger/logger.module';


@Module({
  imports: [FrontMembersModule, AdminMemberModule],
})
export class MemberModule {}
