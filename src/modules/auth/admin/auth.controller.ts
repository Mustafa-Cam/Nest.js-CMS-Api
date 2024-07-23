import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Request,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminAuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { Public } from 'src/middlewares/authenticate/auth.guard';
import mongoose, { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import {
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { LogService } from 'src/logger/logger.service';
import { userDto } from './dtos/user.dto';
import { updateUserDto } from './dtos/updateuser.dto';

@Controller('admin/auth')
@ApiBearerAuth()
export class AdminAuthController {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      fullname: 'John Doe',
      password: 'changeme',
      email: 'jhondoe@email.com',
      role: 1, // role.db -> id 1
      createdAt: new Date(), // Date
      deletedAt: false,
    },
    {
      userId: 2,
      username: 'jane',
      fullname: 'Jane Doe',
      password: 'changeme',
      email: 'janedoe@email.com',
      role: 1, // role.db -> id 1
      createdAt: new Date(), // Date
      deletedAt: false,
    },
    {
      userId: 3,
      username: 'ivan',
      fullname: 'Ivan Doe',
      password: 'changeme',
      email: 'janedoe@email.com',
      role: 1, // role.db -> id 1
      createdAt: new Date(), // Date
      deletedAt: true,
    },
  ];

  constructor(
    private readonly authService: AdminAuthService,
    private jwtService: JwtService,
    @Inject('USER_MODEL') private userModel: Model<User>,
    private readonly logger: LogService,
  ) {}

  @Post('login')
  @Public()
  public async login(@Body() body: LoginDto) {
    // this.logger.log('Login', {
    //   userId: "asd",
    //   action: 'login',
    //   role: 1,
    //   createdDate: new Date(),
    // });

    // if (user.active === 1) {
    //   const payload = {
    //     sub: user._id,
    //     username: user.username,
    //     role: user.role,
    //   };

    //! Buraya usermodel boş ise bunu ekle diye bir kontrol yapabiliriz.

    // TODO move this logic to the service
    const user = await this.userModel
      .findOne({ username: body.username })
      .lean();
    if (user && user.password === body.password) {
      
      console.log(user._id);
      if(user.active==1){
        const payload = {
          sub: user._id,
          username: user.username,
          role: user.role,
        };
      this.logger.log('Login Success', {
        userId:user._id,
        action: 'login',
        role: user.role,
        createdDate: new Date(),
      });
      const data = user
      // delete data._id
     
      return {
        ...user,
        token: await this.jwtService.signAsync(payload),
        success: true,
      }}
      else{
        this.logger.error('Unauthorized', {
          userId:user._id,
          action: 'login',
          role: user.role,
          createdDate: new Date(),
        });
        throw new HttpException(
          'Kullanıcı aktif degil',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } else {
      this.logger.error('Unauthorized', {
        userId:user._id,
        action: 'login',
        role: user.role,
        createdDate: new Date(),
      });
      throw new HttpException(
        'username veya password yanlış',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('test')
  public async test() {
    this.userModel.create({
      fullname: 'Onur',
      username: 'onur',
      password: 'onur',
      email: 'abc@ab',
      createdAt: new Date(),
      role: 1,
    });

    return 'Ok';
  }

  @Get()
  // @Public()
  async findAll(@Req() request: Request): Promise<any> {
    return await this.authService.findAll(request);
  }

  @Post('create')
  // @Public()
  async create(
    @Body() userdto: userDto,
    @Req() request: Request,
  ): Promise<any> {
    return await this.authService.create(userdto, request);
  }

  @Get(':id') //! : dan sonra gelen ifade param içindeki değeri ifade eder.
  // @Public()
  async findOne(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<any> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotFoundException('geçersiz ID');
    }
    const findUser = await this.authService.findOne(id, request);

    if (!findUser) {
      throw new NotFoundException('user bulunamadı');
    }
    return await this.authService.findOne(id, request);
  }

  @Patch(':id')
  // @Public()
  update(
    @Param('id') id: string,
    @Body() updateuserdto: updateUserDto,
    @Req() request: Request,
  ): Promise<any> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotFoundException('geçersiz ID');
    }
    return this.authService.update(id, updateuserdto, request);
    
  }

  @Delete(':id')
  // @Public()
  remove(@Param('id') id: string, @Req() request: Request): Promise<any> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotFoundException('geçersiz ID');
    }
    return this.authService.remove(id, request);
  }
}
