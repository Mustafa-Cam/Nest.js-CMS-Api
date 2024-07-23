import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import mongoose from 'mongoose';

@Injectable()
export class IdValidationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = request.params.id || request.params.memberID;
    console.log("params id değeri"+id)
    if (id && !mongoose.Types.ObjectId.isValid(id)) { //! id var ve geçersiz ise hata ver
      throw new BadRequestException('Geçersiz ID');
    }
    return true;
  }
}