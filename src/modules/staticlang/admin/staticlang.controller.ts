import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Request,
} from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { AdminStaticLangService } from './staticlang.service';
import { staticLangDto } from './dtos/staticlang.dto';
import { Public } from 'src/middlewares/authenticate/auth.guard';
// import { Model } from 'mongoose';
import { staticLang } from '../schemas/staticlang.schema';
import {
  ApiBearerAuth,
  // ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { LogService } from 'src/logger/logger.service';
import { UpdateStaticLangRequestDto } from './dtos/updatedStaticLang.dto';
import mongoose from 'mongoose';

@Controller('admin/staticlang')
@ApiBearerAuth()
export class AdminStaticLangController {
  constructor(
    private readonly adminStaticLangService: AdminStaticLangService,
    private readonly logger: LogService,
  ) {}

  @Get()
  // @Public()
  async findAll(): Promise<staticLang[]> {
    return await this.adminStaticLangService.findAll();
  }

  @Post('create')
  // @Public()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async create(
    // @Param('id') id: string,
    @Body() staticLangDto: staticLangDto,
    @Req() request: Request,
  ): Promise<any> {
    return await this.adminStaticLangService.create(staticLangDto, request);
  }

  @Get(':id')
  // @Public()
  async findOne(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<staticLang> {
    // const isValid = mongoose.Types.ObjectId.isValid(id);
    // if(!isValid) {
    //   throw new NotFoundException('Geçersiz ID');
    // }
    const findStaticlang = await this.adminStaticLangService.findOne(id, request);

    if(!findStaticlang) {
      throw new NotFoundException('Staticlang bulunamadı');
    }
    return this.adminStaticLangService.findOne(id, request);
  }

  @Patch(':id') //! patch de kullanabiliriz sunucu yükünü azaltır. Büyük schemalarda patch daha mantıklı.
  // @Public()
  async update(
    @Param('id') id: string,
    @Body() updatestaticlangDto: UpdateStaticLangRequestDto,
    @Req() request: Request,
  ): Promise<any> {
    // const isValid = mongoose.Types.ObjectId.isValid(id);
    // if(!isValid) {
    //   throw new NotFoundException('geçersiz ID');
    // }
    return await this.adminStaticLangService.update(
      id,
      updatestaticlangDto,
      request,
    );
  }

  @Delete(':id')
  // @Public()
  async remove(@Param('id') id: string, @Req() request: Request): Promise<any> {
    // const isValid = mongoose.Types.ObjectId.isValid(id);
    // if(!isValid) {
    //   throw new NotFoundException('geçersiz ID');
    // }
    return await this.adminStaticLangService.remove(id, request);
  }
}
