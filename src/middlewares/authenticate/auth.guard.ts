import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LogService } from 'src/logger/logger.service';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private logger: LogService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      //! 💡 See this condition
      this.logger.log('Public Route', { //! public olan endpointlerde devreye girecek.
        action: context.switchToHttp().getRequest()['url'],
        createdDate: new Date(),
      });
      return true; 
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'CHANGE_ME',
      });
      if(!payload.sub) {
        throw new UnauthorizedException();
      };
      console.log("guard:", payload);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload; //! burda req nesnesini kullanmamız için metodun public olmaması gerekli. @Req() request objesini controller da parametre olarak ekleyerek kullanabiliriz. 

      
      this.logger.log(request['method'], {
        action: request['url'],
        userId: payload.sub,
        details: JSON.stringify(
          request['body'] || request['params'] || request['query'],
        ),
        role: payload.role,
        createdDate: new Date(),
      });

      
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}


