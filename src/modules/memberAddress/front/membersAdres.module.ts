import { Module } from '@nestjs/common';
import { FrontMembersAdresController } from './membersAdres.controller';
import { FrontMembersAdresService } from './membersAdres.service';

@Module({
  controllers: [FrontMembersAdresController],
  providers: [FrontMembersAdresService],
})
export class FrontMembersAdresModule {}
