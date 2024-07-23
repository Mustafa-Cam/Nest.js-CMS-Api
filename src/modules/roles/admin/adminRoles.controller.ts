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
import { AdminRolesService } from './adminRoles.service';
import { rolesDto } from './dtos/roles.dto';
import {  UpdateRolesRequestDto } from './dtos/updateRolesRequest.dto';
import { AuthGuard, Public } from 'src/middlewares/authenticate/auth.guard';
import mongoose, { Model } from 'mongoose';
import { Roles } from '../schemas/roles.schema';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

@Controller('admin/roles')
@ApiBearerAuth()
export class AdminRolesController {
  constructor(
    private readonly adminRolesService: AdminRolesService,

    private jwtService: JwtService,
  ) {}

  @Get()
  // @Public()
  async findAll(): Promise<Roles[]> {
    return await this.adminRolesService.findAll();
  }

  @Post('create')
  // @Public()
  async create(
    @Body() rolesDto: rolesDto,
    @Req() request: Request,
  ): Promise<any> {
    
    return await this.adminRolesService.create(rolesDto, request);
  }

  @Get(':id') //! : dan sonra gelen ifade param içindeki değeri ifade eder.
  // @Public()
  async findOne(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<Roles> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotFoundException('geçersiz ID');
    }
    const findRole = await this.adminRolesService.findOne(id, request);

    if (!findRole) {
      throw new NotFoundException('Role bulunamadı');
    }
    return await this.adminRolesService.findOne(id, request);
  }

  @Patch(':id')
  // @Public()
  update(
    @Param('id') id: string,
    @Body() updateRolesDto: UpdateRolesRequestDto,
    @Req() request: Request,
  ): Promise<any> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotFoundException('geçersiz ID');
    }
    return this.adminRolesService.update(id, updateRolesDto, request);
  }

  @Delete(':id')
  // @Public()
  remove(@Param('id') id: string, @Req() request: Request): Promise<any> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotFoundException('geçersiz ID'); //! NOT: hataları öncelendirmek istenşrse ilk gelmesini istediğiniz hata controller da yapılır sonrası service de yapılabilir.
    }
    return this.adminRolesService.remove(id, request);
  }
}
