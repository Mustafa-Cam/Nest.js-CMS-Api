import { Module } from '@nestjs/common';
import { FrontMembersController } from './members.controller';
import { FrontMembersService } from './members.service';

@Module({
  controllers: [FrontMembersController],
  providers: [FrontMembersService],
})
export class FrontMembersModule {}
