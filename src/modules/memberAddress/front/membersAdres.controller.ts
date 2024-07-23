import { Controller } from '@nestjs/common';
import { FrontMembersAdresService } from './membersAdres.service';

@Controller('membersAdres')
export class FrontMembersAdresController {
  constructor(private readonly membersAdresService: FrontMembersAdresService) {}
}
