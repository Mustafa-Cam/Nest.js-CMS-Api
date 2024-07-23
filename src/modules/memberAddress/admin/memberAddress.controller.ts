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
import { AdminMemberAddressService } from './memberAddress.service';
import { memberAddressDto } from './dtos/memberAddress.dto';
import { updateMemberAddressDto } from './dtos/updateMemberAddress.dto';
import { AuthGuard, Public } from 'src/middlewares/authenticate/auth.guard';
import mongoose, { Model } from 'mongoose';
import { MemberAddress } from '../schemas/memberAddress.schema';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

@Controller('admin/memberAddress')
@ApiBearerAuth()
export class AdminMemberAddressController {
  constructor(
    private readonly adminMembersAdresService: AdminMemberAddressService,

    private jwtService: JwtService,
  ) {}

  @Get()
  // @Public()
  async findAll(): Promise<MemberAddress[]> {
    return await this.adminMembersAdresService.findAll();
  }

  @Post(':memberID/createAddress')
  // @Public()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async create(
    @Param('memberID') memberID: string,
    @Body() membersAdresDto: memberAddressDto,
    @Req() request: Request,
  ): Promise<any> {
    return await this.adminMembersAdresService.create(
      memberID,
      membersAdresDto,
      request,
    );
  }

  @Get(':id') //! : dan sonra gelen ifade param içindeki değeri ifade eder.
  // @Public()
  async findOne(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<MemberAddress> {
    // const isValid = mongoose.Types.ObjectId.isValid(id);
    // if (!isValid) {
    //   throw new NotFoundException('geçersiz ID');
    // }

    // const findStaticlang = await this.adminMembersAdresService.findOne(id, request);

    // if (!findStaticlang) {
    //   throw new NotFoundException('member bulunamadı');
    // }

    return await this.adminMembersAdresService.findOne(id, request);
  }

  @Get('/memberID/:memberId') //! : dan sonra gelen ifade param içindeki değeri ifade eder.
  // @Public()
  async findByMemberId(
    @Param('memberId') memberId: string,
    @Req() request: Request,
  ): Promise<any> {

    return await this.adminMembersAdresService.findByMemberId(memberId, request);
  }
  
  @Patch(':id')
  // @Public()
  update(
    @Param('id') id: string,
    @Body() updatemembersAdresDto: updateMemberAddressDto,
    @Req() request: Request,
  ): Promise<any> {
    // const isValid = mongoose.Types.ObjectId.isValid(id);
    // if (!isValid) {
    //   throw new NotFoundException('geçersiz ID');
    // }
    return this.adminMembersAdresService.update(
      id,
      updatemembersAdresDto,
      request,
    );
  }

  @Delete(':id')
  // @Public()
  remove(@Param('id') id: string, @Req() request: Request): Promise<any> {
    // const isValid = mongoose.Types.ObjectId.isValid(id);
    // if (!isValid) {
    //   throw new NotFoundException('geçersiz ID');
    // }
    return this.adminMembersAdresService.remove(id, request);
  }
}
