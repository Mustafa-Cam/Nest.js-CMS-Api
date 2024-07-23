import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    NotFoundException,
    Param,
    Patch,
    Post,
    Put,
    Req,
    Request,
    UseGuards,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { AdminOptionsService } from './options.service';
  import { optionsDto } from './dtos/options.dto';
  import { UpdateOptionsDto } from './dtos/updateOptions.dto';
  import { AuthGuard, Public } from 'src/middlewares/authenticate/auth.guard';
  import mongoose, { Model } from 'mongoose';
  import { Options } from '../schemas/options.schema';
  import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
  } from '@nestjs/swagger';
  
  @Controller('admin/options')
  @ApiBearerAuth()
  export class AdminOptionsController {
    constructor(
      private readonly adminOptionsService: AdminOptionsService,
  
      private jwtService: JwtService,
    ) {}
      
    @Get()
    // @Public()
    async findAll(): Promise<Options[]> {
      return await this.adminOptionsService.findAll();
    }
  
    @Post('create')
    // @Public()
    @ApiCreatedResponse({
      description: 'The record has been successfully created.',
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async create(
      @Body() optionsDto: optionsDto,
      @Req() request: Request,
    ): Promise<any> {
      return await this.adminOptionsService.create(optionsDto, request);
    }
  //! id kontrol guard eğer istenilen formatta id gelmez ise hata verir. ve controller içine girmez.
    @Get(':id') //! : dan sonra gelen ifade param içindeki değeri ifade eder. id2 olsa param içinde de id2 olur.
    // @Public()
    async findOne(
      @Param('id') id: string,
      @Req() request: Request,
    ): Promise<Options> {
      // const isValid = mongoose.Types.ObjectId.isValid(id);
      // if(!isValid) {
      //   throw new NotFoundException('geçersiz ID');
      // }

    //! const findOption = await this.adminOptionsService.findOne(id, request);
    //! if(!findOption) {
    //!   throw new NotFoundException('Option bulunamadı');
    //! }

    
      return await this.adminOptionsService.findOne(id, request);
    }
  
    @Patch(':id')
    // @Public()
    update(
      @Param('id') id: string,
      @Body() updateOptionsDto: UpdateOptionsDto,
      @Req() request: Request,
    ): Promise<any> {
      // const isValid = mongoose.Types.ObjectId.isValid(id);
      // if(!isValid) {
      //   throw new NotFoundException('geçersiz ID');
      // }
      
      return this.adminOptionsService.update(id, updateOptionsDto, request);
    }
  
    @Delete(':id')
    // @Public()
    remove(@Param('id') id: string, @Req() request: Request): Promise<any> {
      // const isValid = mongoose.Types.ObjectId.isValid(id);
      // if(!isValid) {
      //   throw new NotFoundException('geçersiz ID');
      // }
      
      return this.adminOptionsService.remove(id, request);
    }
  }
  