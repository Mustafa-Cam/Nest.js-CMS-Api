import { Controller, Get } from '@nestjs/common';
import { FrontMembersService } from './members.service';

@Controller('members')
export class FrontMembersController {
  constructor(private readonly membersService: FrontMembersService) {}
}
