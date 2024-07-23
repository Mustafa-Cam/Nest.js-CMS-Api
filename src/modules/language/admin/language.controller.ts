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
import { AdminLanguageService } from './language.service';
import { LanguageDto } from './dtos/language.dto';
import { UpdateLanguageRequestDto } from './dtos/forupdatelanguage.dto';
import { AuthGuard, Public } from 'src/middlewares/authenticate/auth.guard';
import mongoose, { Model } from 'mongoose';
import { Language } from '../schemas/language.schema';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { IdValidationGuard } from 'src/middlewares/idValidation.guard';

@Controller('admin/language')
@ApiBearerAuth()
export class AdminLanguageController {
  constructor(
    private readonly adminLanguageService: AdminLanguageService,

    private jwtService: JwtService,
  ) {}

  @Get()
  // @Public()
  async findAll(): Promise<Language[]> {
    return await this.adminLanguageService.findAll();
  }

  @Post('create')
  // @Public()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async create(
    @Body() languageDto: LanguageDto,
    @Req() request: Request,
  ): Promise<any> {
    return await this.adminLanguageService.create(languageDto, request);
  }

  @Get(':id') //! : dan sonra gelen ifade param içindeki değeri ifade eder.
  // @Public()
  async findOne(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<Language> {
    // const isValid = mongoose.Types.ObjectId.isValid(id);
    // if(!isValid) {
    //   throw new NotFoundException('geçersiz ID');
    // }
    const findStaticlang = await this.adminLanguageService.findOne(id, request);

    if (!findStaticlang) {
      throw new NotFoundException('language bulunamadı');
    }
    return await this.adminLanguageService.findOne(id, request);
  }

  @Patch(':id')
  // @Public()
  update(
    @Param('id') id: string,
    @Body() updateLanguageDto: UpdateLanguageRequestDto,
    @Req() request: Request,
  ): Promise<any> {
    // const isValid = mongoose.Types.ObjectId.isValid(id);
    // if(!isValid) {
    //   throw new NotFoundException('geçersiz ID');
    // }
    return this.adminLanguageService.update(id, updateLanguageDto, request);
  }
  @Delete(':id')
  // @Public()
  remove(@Param('id') id: string, @Req() request: Request): Promise<any> {
    // const isValid = mongoose.Types.ObjectId.isValid(id);
    // if(!isValid) {
    //   throw new NotFoundException('geçersiz ID');
    // }
    return this.adminLanguageService.remove(id, request);
  }
}
