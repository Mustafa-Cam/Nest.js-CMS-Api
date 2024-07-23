import { Injectable } from '@nestjs/common';

@Injectable()
export class FrontAuthService {
  getHello(): string {
    return 'Hello World!';
  }
}
