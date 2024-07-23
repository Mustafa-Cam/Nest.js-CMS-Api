import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LogService } from './logger.service';
import { ValidationError } from 'class-validator';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logService: LogService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let message = "Internal server error";
    let status = 500;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    } 
    else if (exception instanceof ValidationError) { //! burası olmasa da çalışıyor. 
      message = Object.values(exception.constraints)[0];
      status = 400;
    }

    this.logService.error(exception.message, {
      action: 'http-exception',
      details: exception.stack,
      role: 0,
      userId: "asd",
      createdDate: new Date(),
    });

    
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      success:(status>=400)&&false,
      message: message,
    });
  }
}
