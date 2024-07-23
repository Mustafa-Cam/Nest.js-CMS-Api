import { Controller, Get } from '@nestjs/common';
import { FrontOptionsService } from './options.service';

@Controller('language')
export class FrontOptionsController {
  constructor(private readonly languageService: FrontOptionsService) {}
}
