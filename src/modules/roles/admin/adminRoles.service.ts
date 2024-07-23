import {
  BadRequestException,
  Body,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import mongoose, { Model } from 'mongoose';

import { Roles } from '../schemas/roles.schema';
import { rolesDto } from './dtos/roles.dto';
import { UpdateRolesRequestDto } from './dtos/updateRolesRequest.dto';
import { NotFoundError } from 'rxjs';
import { LogService } from 'src/logger/logger.service';
import { json } from 'node:stream/consumers';
import { type } from 'node:os';
@Injectable()
export class AdminRolesService {
  constructor(
    @Inject('ROLES_MODEL') private readonly rolesModel: Model<Roles>, //! language.schema.ts dosyamızdaki provider'ı inject ediyoruz.
    private readonly logger: LogService,
  ) {}

  async findAll(): Promise<any> {
    try {
      const roles = await this.rolesModel.find().lean();
      console.log(typeof roles);
      // console.log(roles);
      // console.log(request.body);

      // roles.forEach((item) => {
      //   delete item._id;
      // });

      if (roles) {
        this.logger.log('roles found successfully', {
          action: 'findAll',
          role: 4,
          userId: "asd",
          createdDate: new Date(),
        });
      }

      return {
        roles,
        message:"roles listesi getirildi",
        success:true
      }
    } catch (error) {
      this.logger.error('Error while finding role', {
        action: 'findAll',
        role: 2,
        userId: "asd",
        createdDate: new Date(),
      }); // Hata durumunda bir hata günlüğü kaydeder.
      throw error;
    }
  }

  public async create(
    createRolesDto: rolesDto,
    request: Request,
  ): Promise<any> {
    // console.log(request.user);
    const payload = request['user'];
    console.log(payload);
    const userId = payload.sub;
    const role = payload.role;
    // const username = payload.username;

    try {
      const roleExists = await this.rolesModel.findOne({
        title: createRolesDto.title,
      });
      const roleIdExists = await this.rolesModel.findOne({
        roleId: createRolesDto.roleId,
      });

      console.log(roleExists);

      if (roleExists) {
        // this.logger.error('Language already exists', {
        //   action: 'create',
        //   role: role,
        //   userId: userId,
        //   details: JSON.stringify(createLanguageDto),
        //   createdDate: new Date(),
        // });
        throw new BadRequestException('title zaten mevcut');
      }
      if (roleIdExists) {
        throw new BadRequestException('roleId zaten mevcut');
      }

      //! async olarak tanımlanan bir metot her zaman promise döndürür. Yazmamıza gerek yok zaten otomatik promise döndürüyor ama yine de yazabiliriz.
      const createdRole = new this.rolesModel(createRolesDto); //! model interface'inden languageModel nesnesi oluşturuluyor ve bu nesne save metodu sayesinde veritabanına kayedilir.

      const savedRole = await createdRole.save(); //! save metodu veri tabanına kaydeder.

      if (savedRole) {
        // console.log(req.user._id);
        this.logger.log('Role created successfully', {
          action: 'create',
          role: role,
          userId: userId,
          details: JSON.stringify(createRolesDto),
          createdDate: new Date(),
        });

        // const { _id,  ...dataWithoutId } = savedRole.toObject();

        const data = savedRole.toObject();
        delete data['__v'];
        delete data._id;

        return {
          message: 'Role Kaydı Başarılı bir şekilde oluşturuldu.',
          data: data,
          success:true
        };
      }
    } catch (error) {
      // console.log(error);
      this.logger.error('Error while creating role', {
        action: 'create',
        details: JSON.stringify(createRolesDto),
        role: role,
        userId: userId,
        createdDate: new Date(),
      }); // Hata durumunda bir hata günlüğü kaydeder
      throw error;
    }
  }

  async findOne(id: string, request: Request): Promise<any> {
    const payload = request['user'];
    console.log(payload);
    const userId = payload.sub;
    const role = payload.role;

    try {
      const finddata = await this.rolesModel.findById(id);

      if (finddata) {
        const data = finddata.toObject();
        delete data['__v'];
        delete data._id;

        // Başarılı bir şekilde bulunan veriyi logla
        this.logger.log('Role found successfully', {
          action: 'findOne',
          details: JSON.stringify(payload),
          role: role,
          userId: userId,
          createdDate: new Date(),
        });
        return {
          message: 'Role bulundu.',
          data,
          success:true
        };
      }
    } catch (error) {
      // Hata durumunda bir hata günlüğü kaydet
      this.logger.error('Error while finding role', {
        action: 'findOne',
        details: JSON.stringify(payload),
        role: role,
        userId: userId,
        createdDate: new Date(),
      });

      throw error;
    }
  }

  async update(
    id: string,
    updateRolesDto: UpdateRolesRequestDto,
    request: Request,
  ): Promise<any> {
    const { title, roleId } = updateRolesDto;
    const payload = request['user'];
    const userId = payload.sub;
    const role = payload.role;
    try {
      
      const existingRoleId = await this.rolesModel.findOne({ roleId });
      if (existingRoleId && existingRoleId.roleId == roleId) {
        throw new BadRequestException('Bu roleId zaten kullanımda.');
      }

      // const existingRole = await this.rolesModel.findOne({ title: updateRolesDto.title });

      // if (existingRole && existingRole._id.toString() !== id) {
      //   throw new BadRequestException('Bu role zaten mevcut');
      // }

      const updatedRole = await this.rolesModel.findByIdAndUpdate(
        id,
        updateRolesDto,
        { new: true },
      );

      if (!updatedRole) {
        throw new NotFoundException('Belirtilen ID ile role bulunamadı');
      }

      this.logger.log('role updated successfully', {
        action: 'update',
        details: JSON.stringify(payload),
        role: role,
        userId: userId,
        createdDate: new Date(),
      });

      const data = updatedRole.toObject();
      delete data._id;
      delete data['__v'];

      return {
        message: 'Role güncellendi',
        data: data,
        success:true
      };
    } catch (error) {
      // Hata durumunda bir hata günlüğü kaydet
      this.logger.error('Error while updating role', {
        action: 'update',
        details: JSON.stringify(payload),
        role: role,
        userId: userId,
        createdDate: new Date(),
      });
      console.log(error.message);

      // throw new NotFoundException(`Güncelleme sırasında bir hata oluştu. Belirtilen id ile role bulunamadı`);
      throw error;
    }
  }

  async remove(id: string, request: Request): Promise<any> {
    const payload = request['user'];
    const userId = payload.sub;
    const role = payload.role;
    try {
      const removedRoles = await this.rolesModel.findByIdAndDelete(id);
      //! Burada hata yakaladığı için direkt catch'e iletiyor. uygun id ile istek atılmadığı için. Alt satıra geçmiyor.
      // const { _id,  ...dataWithoutId } = removedRoles.toObject(); object  Destructuring işlemi

      this.logger.log('Role deleted successfully', {
        action: 'delete',
        details: JSON.stringify(payload),
        role: role,
        userId: userId,
        createdDate: new Date(),
      });

      if (!removedRoles) {
        // console.log("not found");
        throw new NotFoundException('Belirtilen ID ile role bulunamadı');
      }

      const data = removedRoles.toObject();
      delete data['__v'];
      delete data._id;

      return {
        message: 'role Silindi',
        data: data,
        success:true
      };
    } catch (error) {
      this.logger.error('Error while deleting role', {
        action: 'delete',
        details: JSON.stringify(Body),
        role: role,
        userId: userId,
        createdDate: new Date(),
      });
      throw error;
    }
  }
}
