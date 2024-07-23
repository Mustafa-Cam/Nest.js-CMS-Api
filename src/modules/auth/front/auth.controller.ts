import { Controller, Get } from '@nestjs/common';
import { FrontAuthService } from './auth.service';

@Controller('auth')
export class FrontAuthController {
  constructor(private readonly authService: FrontAuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }
}
