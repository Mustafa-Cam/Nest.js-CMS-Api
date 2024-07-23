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

import { MemberAddress } from '../schemas/memberAddress.schema';
import { memberAddressDto } from './dtos/memberAddress.dto';
import { NotFoundError } from 'rxjs';
import { updateMemberAddressDto } from './dtos/updateMemberAddress.dto';
import { LogService } from 'src/logger/logger.service';
import { json } from 'node:stream/consumers';
import { type } from 'node:os';
import { Member } from 'src/modules/member/schemas/member.schema';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class AdminMemberAddressService {
  constructor(
    @Inject('MEMBERADDRESS_MODEL')
    private readonly membersAddressModel: Model<MemberAddress>, //! members.schema.ts dosyamızdaki provider'ı inject ediyoruz.
    @Inject('MEMBER_MODEL') private readonly membersModel: Model<Member>,

    private readonly logger: LogService,
  ) {}

  //! memberAddress ilk kayıt olunca 1 olarak kaydedilecek. sonra diğer member adresleri varsa sıfır olarak kaydedilecek. Ardından başka bir adres 1 yapılmak isterse o adres, 1 yapılacak  diğer memberAddress'ler 0 olacak. Hadi başlayalım. 
  
  //! 1. ilk create işleminde ilk kayıt da 1 olmasını sağlayalım. 
  //! 2. sonra diğer memeberAddress kaydı yapılacaksa aynı isim için onun default eğeri 0 olacak. 
  //! 3. bu adımda da eğer default değeri 0 olan address 1 yapılacaksa aynı ismin diğer adresleri hepsi 0 olacak. 
  //! yani default 1 demek ana address demek.



  async findAll(): Promise<any> {
    try {
      const memberAddress = await this.membersAddressModel.find().lean();
      console.log(typeof memberAddress);
      // console.log(members);
      // console.log(request.body);

      // members.forEach((item) => {
      //   delete item._id;
      // });

      if (memberAddress) {
        this.logger.log('memberAddress found successfully', {
          action: 'findAll',
          role: 4,
          userId: 'asd',
          createdDate: new Date(),
        });
      }
      console.log(memberAddress);
      return {
        memberAddress,
        message: 'memberAddress listesi getirildi',
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

  public async create(
    memberID: string,
    createmembersDto: memberAddressDto,
    request: Request,
  ): Promise<any> {
    // console.log(request.user);
    const payload = request['user'];
    console.log(payload);
    const userId = payload.sub;
    const role = payload.role;
    // const username = payload.username; 

    try {
      //!---------------- isExist?
      const MemberExists = await this.membersModel.findOne({_id:memberID});
      console.log(MemberExists);

      if (!MemberExists) {

        throw new BadRequestException('id bulunamadı');
      }
      //!----------------

      //! async olarak tanımlanan bir metot her zaman promise döndürür. Yazmamıza gerek yok zaten otomatik promise döndürüyor ama yine de yazabiliriz.

       //! model interface'inden membersModel nesnesi oluşturuluyor ve bu nesne save metodu sayesinde veritabanına kayedilir.


       //! Burda da eğer aynı memberID ye sahip bir değer var ise demekkki önceden kayıt olmuş ve bu ilk kayıt anlamına gelmez eğer yok ise bu ilk kayıt anlamına gelir.  eğer ilk kayıt ise default 1 olarak ayarlanır değilse 0 olarak ayarlanır. 
      const isFind = await this.membersAddressModel.findOne({memberId: memberID});
      console.log(isFind);

      let createdmembers: any;
      if(isFind){
         createdmembers = new this.membersAddressModel({
          ...createmembersDto,
          memberId: memberID,
          default: 0,
        });
      }else{
        createdmembers = new this.membersAddressModel({
          ...createmembersDto,
          memberId: memberID,
          default: 1,
        });
      }
      const savedmembersAdres = await createdmembers.save(); //! save metodu veri tabanına kaydeder.

      if (savedmembersAdres) {
        // console.log(req.user._id);
        this.logger.log('memberAddress created successfully', {
          action: 'create',
          role: role,
          userId: userId,
          details: JSON.stringify(createmembersDto),
          createdDate: new Date(),
        });
        console.log('savedmemberAddress' + savedmembersAdres);

        // const member = await this.membersModel.findById(memberID);
        // member.memberAdres.push(savedmembersAdres);
        // await member.save();
        // console.log(member)

        const data = savedmembersAdres.toObject();
        delete data['__v'];
        delete data._id;

        console.log(data);
        return {
          message: 'MemberAddress Kaydı Başarılı bir şekilde oluşturuldu.',
          data: data,
          success: true,
        };
      }
   
    } catch (error) {
      // console.log(error);
      this.logger.error('Error while creating memberAddress', {
        action: 'create',
        details: JSON.stringify(createmembersDto),
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
      const finddata = await this.membersAddressModel.findById(id);

      if (finddata) {
        const data = finddata.toObject();
        delete data['__v'];

        delete data._id;

        // Başarılı bir şekilde bulunan veriyi logla
        this.logger.log('MemberAddress found successfully', {
          action: 'findOne',
          details: JSON.stringify(payload),
          role: role,
          userId: userId,
          createdDate: new Date(),
        });
        return {
          message: 'MemberAddress bulundu.',
          data,
          success: true,
        };
      } else {
        throw new NotFoundException('MemberAddress bulunamadı');
      }
    } catch (error) {
      // Hata durumunda bir hata günlüğü kaydet
      this.logger.error('Error while finding MemberAddress', {
        action: 'findOne',
        details: JSON.stringify(payload),
        role: role,
        userId: userId,
        createdDate: new Date(),
      });
      throw error;
    }
  }

  async findByMemberId(memberId: string, request: Request): Promise<any> {
    const payload = request['user'];
    console.log(payload);
    const userId = payload.sub;
    const role = payload.role;
    // memberId ye göre memberadresden o memberoıd ye ait verileri getir. 
    console.log("MEMBERID"+memberId)
    try {
      const finddata = await this.membersAddressModel.find({memberId:memberId});
      console.log(finddata)
     

      if (finddata) {
        let finddataa = finddata.map(a => {
          let data = a.toObject();
          delete data['__v'];
          delete data.memberId;
          delete data._id;
          return data;
        });

        // Başarılı bir şekilde bulunan veriyi logla
        this.logger.log('MemberAddress found successfully', {
          action: 'findByMemberId',
          details: JSON.stringify(payload),
          role: role,
          userId: userId,
          createdDate: new Date(),
        });
        return {
          message: 'MemberAddress bulundu.',
          finddataa,
          success: true,
        };
      } else {
        throw new NotFoundException('MemberAddress bulunamadı');
      }
    } catch (error) {
      // Hata durumunda bir hata günlüğü kaydet
      this.logger.error('Error while finding MemberAddress', {
        action: 'findByMemberId',
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
    updatemembersDto: updateMemberAddressDto,
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

      // const existingEmail = await this.membersModel.findOne({ email: updatemembersDto.email });

      // if (existingEmail && existingEmail._id.toString() !== id) {
      //   throw new BadRequestException('Bu email zaten mevcut');
      // }

      const membersAddressModel = await this.membersAddressModel.findByIdAndUpdate(
        id,
        updatemembersDto,
        { new: true },
      );

      if (updatemembersDto.default === 1) { //! aynı memberId değerine sahip memberAddress'ler için  eğer bir tanesinin default degeri 1 olarak isteniyorsa diğer aynı memberID ye sahip memberAddress'lerin default değerleri 0 olacak. kısaca aynı kullanıcının bir tane default değeri olacak. 
        // Bu id'ye sahip olan diğer tüm kayıtların default değerlerini 0 yap
        await this.membersAddressModel.updateMany(
          { memberId: membersAddressModel.memberId, _id: { $ne: id } }, //! kendi hariç diğer tüm belgeleri getir.
          { default: 0 } //! default değerini 0 yap. 
        );
      }

      if (!membersAddressModel) {
        throw new NotFoundException('Belirtilen ID ile memberAddress bulunamadı');
      }

      this.logger.log('MemberAddress updated successfully', {
        action: 'update',
        details: JSON.stringify(payload),
        role: role,
        userId: userId,
        createdDate: new Date(),
      });

      const data = membersAddressModel.toObject();
      delete data._id;
      delete data['__v'];

      return {
        message: 'MemberAddress güncellendi',
        data: data,
        success: true,
      };
    } catch (error) {
      // Hata durumunda bir hata günlüğü kaydet
      this.logger.error('Error while updating MemberAddress', {
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
      const removedMember =
        await this.membersAddressModel.findByIdAndDelete(id);
      //! Burada hata yakaladığı için direkt catch'e iletiyor. uygun id ile istek atılmadığı için. Alt satıra geçmiyor.
      // const { _id,  ...dataWithoutId } = removedMember.toObject(); object  Destructuring işlemi

      this.logger.log('MemberAddress deleted successfully', {
        action: 'delete',
        details: JSON.stringify(payload),
        role: role,
        userId: userId,
        createdDate: new Date(),
      });

      if (!removedMember) {
        // console.log("not found");
        throw new NotFoundException('Belirtilen ID ile MemberAddress bulunamadı');
      }

      const deletefrommembers = await this.membersModel.findOne({
        memberAdres: removedMember._id,
      });

      if (deletefrommembers) {
        console.log('bulundu' + deletefrommembers);
        await this.membersModel.updateMany(
          { _id: deletefrommembers._id },
          {
            $pull: { memberAdres: removedMember._id },
          },
        );
      } else {
        console.log('bulunamadı');
      }

      const data = removedMember.toObject();
      delete data['__v'];
      delete data._id;

      return {
        message: 'MemberAddress Silindi',
        data: data,
        success: true,
      };
    } catch (error) {
      this.logger.error('Error while deleting MemberAddress', {
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
