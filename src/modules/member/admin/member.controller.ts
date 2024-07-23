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
import { AdminMemberService } from './member.service';
import { memberDto } from './dtos/member.dto';
import { updateMemberDto } from './dtos/updateMember.dto';
import { AuthGuard, Public } from 'src/middlewares/authenticate/auth.guard';
import mongoose, { Model } from 'mongoose';
import { Member } from '../schemas/member.schema';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { creatememberDto } from './dtos/createmember.dto';

@Controller('admin/members')
@ApiBearerAuth()
export class AdminMemberController {
  constructor(
    private readonly adminMembersService: AdminMemberService,

    private jwtService: JwtService,
  ) {}

  @Get()
  // @Public()
  async findAll(): Promise<Member[]> {
    return await this.adminMembersService.findAll();
  }

  // @Post('createwithaddress')
  // // @Public()
  // @ApiCreatedResponse({
  //   description: 'The record has been successfully created.',
  // })
  // @ApiForbiddenResponse({ description: 'Forbidden.' })
  // async createwithaddress(
  //   @Body() membersDto: membersDto,
  //   @Req() request: Request,
  // ): Promise<any> {
  //   return await this.adminMembersService.createwithaddress(membersDto, request);
  // }

  @Post('createMember')
  async createMember(
    @Body() createmembersDto: creatememberDto,
    @Req() request: Request,
  ): Promise<any> {
    // const { memberAdres, ...restFields } = membersDto;

    return await this.adminMembersService.createMember(
      createmembersDto,
      request,
    );
  }

  @Get(':id') //! : dan sonra gelen ifade param içindeki değeri ifade eder.
  // @Public()
  async findOne(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<Member> {
    // const isValid = mongoose.Types.ObjectId.isValid(id);
    // if (!isValid) {
    //   throw new NotFoundException('geçersiz ID');
    // }

    // const findStaticlang = await this.adminMembersService.findOne(id, request);

    // if (!findStaticlang) {
    //   throw new NotFoundException('member bulunamadı');
    // }

    return await this.adminMembersService.findOne(id, request);
  }

  @Patch(':id')
  // @Public()
  update(
    @Param('id') id: string,
    @Body() updatemembersDto: updateMemberDto,
    @Req() request: Request,
  ): Promise<any> {
    // const isValid = mongoose.Types.ObjectId.isValid(id);
    // if (!isValid) {
    //   throw new NotFoundException('geçersiz ID');
    // }
    return this.adminMembersService.update(id, updatemembersDto, request);
  }

  @Delete(':id')
  // @Public()
  remove(@Param('id') id: string, @Req() request: Request): Promise<any> {
    // const isValid = mongoose.Types.ObjectId.isValid(id);
    // if (!isValid) {
    //   throw new NotFoundException('geçersiz ID');
    // }
    return this.adminMembersService.remove(id, request);
  }
}
