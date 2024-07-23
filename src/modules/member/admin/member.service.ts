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

import { Member } from '../schemas/member.schema';
import { memberDto } from './dtos/member.dto';
import { NotFoundError } from 'rxjs';
import { updateMemberDto } from './dtos/updateMember.dto';
import { LogService } from 'src/logger/logger.service';
import { json } from 'node:stream/consumers';
import { type } from 'node:os';
import { MemberAddress } from 'src/modules/memberaddress/schemas/memberAddress.schema';
import { creatememberDto } from './dtos/createmember.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminMemberService {
  constructor(
    @Inject('MEMBER_MODEL') private readonly membersModel: Model<Member>, //! members.schema.ts dosyamızdaki provider'ı inject ediyoruz.
    @Inject('MEMBERADDRESS_MODEL')
    private readonly memberAdresModel: Model<MemberAddress>,
    private readonly logger: LogService,
  ) {}

  // const { memberAdres, ...restFields } = membersDto

  public async createMember(
    createmembersDto: creatememberDto,
    request: Request,
  ): Promise<any> {
    // console.log(request.user);
    const payload = request['user'];
    console.log(payload);
    const userId = payload.sub;
    const role = payload.role;
    // const username = payload.username;

    try {
      //!Buraya sonra bakacağım.
      // const MemberExists = await this.membersModel.findOne({
      //   lang: createMemberDto.lang,
      // });
      // console.log(MemberExists);

      // if (MemberExists) {

      //   throw new BadRequestException('members zaten mevcut');
      // }
      //! async olarak tanımlanan bir metot her zaman promise döndürür. Yazmamıza gerek yok zaten otomatik promise döndürüyor ama yine de yazabiliriz.
      const existingMember = await this.membersModel.findOne({
        email: createmembersDto.email,
      });

      if (existingMember) {
        throw new BadRequestException('mail zaten mevcut');
      }

      const createdmembers = new this.membersModel(createmembersDto);

      // const createdmembers =  new this.membersModel(createmembersDto);
      //! model interface'inden membersModel nesnesi oluşturuluyor ve bu nesne save metodu sayesinde veritabanına kayedilir.

      const savedmembers = await createdmembers.save(); //! save metodu veri tabanına kaydeder.
      // console.log("savedmemeber"+savedmembers)

      if (savedmembers) {
        // console.log(req.user._id);
        this.logger.log('members created successfully', {
          action: 'create',
          role: role,
          userId: userId,
          details: JSON.stringify(createmembersDto),
          createdDate: new Date(),
        });
        // const { _id,  ...dataWithoutId } = savedMember.toObject();

        //! const member = await this.membersModel
        //!   .findById(savedmembers._id)
        //!   .populate('memberAdres');

        // const data = member.toObject();g4uıj
        const data = savedmembers.toObject();
        delete data['__v'];
        delete data._id;
        delete data['password'];

        // console.log(data);
        return {
          message: 'Member Kaydı Başarılı bir şekilde oluşturuldu.',
          data: data,
          success: true,
        };
      }
    } catch (error) {
      // console.log(error);
      this.logger.error('Error while creating members', {
        action: 'create',
        details: JSON.stringify(createmembersDto),
        role: role,
        userId: userId,
        createdDate: new Date(),
      }); // Hata durumunda bir hata günlüğü kaydeder
      throw error;
    }
  }

  //! public async createwithaddress(
  //   createmembersDto: membersDto,
  //   request: Request,
  // ): Promise<any> {
  //   // console.log(request.user);
  //   const payload = request['user'];
  //   console.log(payload);
  //   const userId = payload.sub;
  //   const role = payload.role;
  //   // const username = payload.username;

  //   try {
  //     //!Buraya sonra bakacağım.
  //     // const MemberExists = await this.membersModel.findOne({
  //     //   lang: createMemberDto.lang,
  //     // });
  //     // console.log(MemberExists);

  //     // if (MemberExists) {

  //     //   throw new BadRequestException('members zaten mevcut');
  //     // }
  //     //! async olarak tanımlanan bir metot her zaman promise döndürür. Yazmamıza gerek yok zaten otomatik promise döndürüyor ama yine de yazabiliriz.
  //     const address = new this.memberAdresModel(createmembersDto.memberAdres);
  //     const savedAddress = await address.save();

  //     console.log('saved adres' + savedAddress);

  //     const createdmembers = new this.membersModel({
  //       ...createmembersDto,
  //       memberAdres: savedAddress._id, // Adresin ID'sini Member'a atayın
  //     });
  //     //! model interface'inden membersModel nesnesi oluşturuluyor ve bu nesne save metodu sayesinde veritabanına kayedilir.
  //     console.log('createdmemeber' + createdmembers);

  //     const savedmembers = await createdmembers.save(); //! save metodu veri tabanına kaydeder.
  //     console.log('savedmemeber' + savedmembers);

  //     if (savedmembers) {
  //       // console.log(req.user._id);
  //       this.logger.log('members created successfully', {
  //         action: 'create',
  //         role: role,
  //         userId: userId,
  //         details: JSON.stringify(createmembersDto),
  //         createdDate: new Date(),
  //       });
  //       // const { _id,  ...dataWithoutId } = savedMember.toObject();

  //       const member = await this.membersModel
  //         .findById(savedmembers._id)
  //         .populate('memberAdres');
  //       const data = member.toObject();
  //       delete data['__v'];
  //       delete data._id;

  //       // console.log(data);
  //       return {
  //         message: 'Member Kaydı Başarılı bir şekilde oluşturuldu.',
  //         data: data,
  //         success: true,
  //       };
  //     }
  //   } catch (error) {
  //     // console.log(error);
  //     this.logger.error('Error while creating members', {
  //       action: 'create',
  //       details: JSON.stringify(createmembersDto),
  //       role: role,
  //       userId: userId,
  //       createdDate: new Date(),
  //     }); // Hata durumunda bir hata günlüğü kaydeder
  //     throw error;
  //   }
  //! }

  async findAll(): Promise<any> {
    try {
      const members = await this.membersModel.find().lean();
      console.log(typeof members);

      //! for (const member of members) {
      //   // Üyenin adreslerini kontrol et
      //   // Üyenin adreslerini kontrol et
      //   const memberAdresIds = member.memberAdres.map((adres) =>
      //     adres.toString(),
      //   );

      //   // Her bir adres ID için döngü
      //   for (const adresId of memberAdresIds) {
      //     // Adresin memberAdres koleksiyonunda olup olmadığını kontrol et
      //     const adresExists = await this.memberAdresModel
      //       .findById(adresId)
      //       .lean();

      //     // Eğer adres yoksa, üyeden bu adresi sil
      //     if (!adresExists) {
      //       await this.membersModel.updateOne(
      //         { _id: member._id },
      //         { $pull: { memberAdres: adresId } },
      //       );
      //     }
      //   }
      //! }
      //! console.log('Yetim memberAdresler temizlendi.');

      if (members) {
        this.logger.log('members found successfully', {
          action: 'findAll',
          role: 4,
          userId: 'asd',
          createdDate: new Date(),
        });
      }

      console.log(members);

      members.map((item) => {
        delete item.password;
      });

      return {
        members,
        message: 'members listesi getirildi',
        success: true,
      };
    } catch (error) {
      this.logger.error('Error while finding members', {
        action: 'findAll',
        role: 2,
        userId: 'asd',
        createdDate: new Date(),
      }); // Hata durumunda bir hata günlüğü kaydeder.
      throw error;
    }
  }
  async findOne(id: string, request: Request): Promise<any> {
    const payload = request['user'];
    console.log(payload);
    const userId = payload.sub;
    const role = payload.role;

    try {
      const finddata = await this.membersModel.findById(id);

      if (finddata) {
        const data = finddata.toObject();

        // Başarılı bir şekilde bulunan veriyi logla
        this.logger.log('Member found successfully', {
          action: 'findOne',
          details: JSON.stringify(payload),
          role: role,
          userId: userId,
          createdDate: new Date(),
        });

        delete data['__v'];
        delete data._id;
        delete data['password'];

        return {
          message: 'Member bulundu.',
          data,
          success: true,
        };
      } else {
        throw new NotFoundException('Member bulunamadı');
      }
    } catch (error) {
      // Hata durumunda bir hata günlüğü kaydet
      this.logger.error('Error while finding Member', {
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
    updatemembersDto: updateMemberDto,
    request: Request,
  ): Promise<any> {
    // const { lang } = updatemembersDto;
    const payload = request['user'];
    const userId = payload.sub;
    const role = payload.role;
    try {
      // const existingLang = await this.membersModel.findOne({ lang });
      // console.log(existingLang);
      // if (existingLang && existingLang.lang == lang) {
      //   throw new BadRequestException('Bu lang zaten kullanımda.');
      // }

      const existingEmail = await this.membersModel.findOne({
        email: updatemembersDto.email,
      });

      if (existingEmail && existingEmail._id.toString() !== id) {
        throw new BadRequestException('Bu email zaten mevcut');
      }
      if(updatemembersDto.password && updatemembersDto.password.length > 0  && updatemembersDto.password.length < 8){
        throw new BadRequestException('Sifre 8 karakterden uzun olmali');
        }
      // Check if password field exists in updatemembersDto and is an empty string
      if (!updatemembersDto.password) {  //! eğer password falsy değer ise (false, 0, "" (boş string), null, undefined, ve NaN) sifreyi dto'dan sil. yani gönderme.
        // If password is an empty string, delete it from updatemembersDto
        delete updatemembersDto.password;
      }
      else{ //! eğer falsy değer değilse şifreyi hashle.
        const saltOrRounds = 10;
          const hash = await bcrypt.hash(updatemembersDto.password, saltOrRounds);
          updatemembersDto.password = hash;
      }
      const updatedMember = await this.membersModel.findByIdAndUpdate(
        id,
        updatemembersDto,
        { new: true },
      );
      if (!updatedMember) {
        throw new NotFoundException('Belirtilen ID ile dil bulunamadı');
       }
       
       /*
       else {
         if (updatemembersDto.password && updatemembersDto.password.length > 0) { //! 0 dan büyük yazmamızın sebebi "" şeklinde gönderilse password null sayılmıyor ve 1. koşuldan geçiyor. en az bir karakter girilmeli. 
           const saltOrRounds = 10;
           const hash = await bcrypt.hash(updatedMember.password, saltOrRounds);
           updatedMember.password = hash;

      //     // Save the updated member with hashed password back to the database
           await updatedMember.save();
         } 
       }
      */
      this.logger.log('Member updated successfully', {
        action: 'update',
        details: JSON.stringify(payload),
        role: role,
        userId: userId,
        createdDate: new Date(),
      });

      const data = updatedMember.toObject();
      delete data._id;
      delete data['__v'];
      delete data['password'];

      return {
        message: 'Member güncellendi',
        data: data,
        success: true,
      };
    } catch (error) {
      // Hata durumunda bir hata günlüğü kaydet
      this.logger.error('Error while updating Member', {
        action: 'update',
        details: JSON.stringify(payload),
        role: role,
        userId: userId,
        createdDate: new Date(),
      });
      console.log(error.message);

      // throw new NotFoundException(`Güncelleme sırasında bir hata oluştu. Belirtilen id ile Member bulunamadı`);
      throw error;
    }
  }

  async remove(id: string, request: Request): Promise<any> {
    const payload = request['user'];
    const userId = payload.sub;
    const role = payload.role;
    try {
      const removedMember = await this.membersModel.findByIdAndDelete(id);
      //! Burada hata yakaladığı için direkt catch'e iletiyor. uygun id ile istek atılmadığı için. Alt satıra geçmiyor.
      // const { _id,  ...dataWithoutId } = removedMember.toObject(); object  Destructuring işlemi

      this.logger.log('Member deleted successfully', {
        action: 'delete',
        details: JSON.stringify(payload),
        role: role,
        userId: userId,
        createdDate: new Date(),
      });

      if (!removedMember) {
        // console.log("not found");
        throw new NotFoundException('Belirtilen ID ile Member bulunamadı');
      }

      const data = removedMember.toObject();
      delete data['__v'];
      delete data._id;
      delete data['password'];

      return {
        message: 'Member Silindi',
        data: data,
        success: true,
      };
    } catch (error) {
      this.logger.error('Error while deleting Member', {
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
