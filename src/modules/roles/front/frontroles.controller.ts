import { Controller, Get } from '@nestjs/common';
import { FrontLanguageService } from './frontroles.service';

@Controller('language')
export class FrontLanguageController {
  constructor(private readonly languageService: FrontLanguageService) {}
}
