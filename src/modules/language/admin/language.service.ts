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

import { Language } from '../schemas/language.schema';
import { LanguageDto } from './dtos/language.dto';
import { UpdateLanguageRequestDto } from './dtos/forupdatelanguage.dto';
import { NotFoundError } from 'rxjs';
import { LogService } from 'src/logger/logger.service';
import { json } from 'node:stream/consumers';
import { type } from 'node:os';
@Injectable()
export class AdminLanguageService {
  constructor(
    @Inject('LANGUAGE_MODEL') private readonly languageModel: Model<Language>, //! language.schema.ts dosyamızdaki provider'ı inject ediyoruz.
    private readonly logger: LogService,
  ) {}

  async findAll(): Promise<any> {
    try {
      const languages = await this.languageModel.find().lean();
      console.log(typeof languages);
      // console.log(languages);
      // console.log(request.body);

      // languages.forEach((item) => {
      //   delete item._id;
      // });

      if (languages) {
        this.logger.log('Languages found successfully', {
          action: 'findAll',
          role: 4,
          userId: "asd",
          createdDate: new Date(),
        });
      }
      console.log(languages);
      return {
        languages, 
        message:"Dil listesi getirildi",
        success:true
      };
    } catch (error) {
      this.logger.error('Error while finding languages', {
        action: 'findAll',
        role: 2,
        userId: "asd",
        createdDate: new Date(),
      }); // Hata durumunda bir hata günlüğü kaydeder.
      throw error;
    }
  }

  public async create(
    createLanguageDto: LanguageDto,
    request: Request,
  ): Promise<any> {
    // console.log(request.user);
    const payload = request['user'];
    console.log(payload);
    const userId = payload.sub;
    const role = payload.role;
    // const username = payload.username;

    try {
      const languageExists = await this.languageModel.findOne({
        lang: createLanguageDto.lang,
      });

      console.log(languageExists);
      if (languageExists) {
        
        throw new BadRequestException('Dil zaten mevcut');
      }
      //! async olarak tanımlanan bir metot her zaman promise döndürür. Yazmamıza gerek yok zaten otomatik promise döndürüyor ama yine de yazabiliriz.
      const createdLanguage = new this.languageModel(createLanguageDto); //! model interface'inden languageModel nesnesi oluşturuluyor ve bu nesne save metodu sayesinde veritabanına kayedilir.

      const savedLanguage = await createdLanguage.save(); //! save metodu veri tabanına kaydeder.

      if (savedLanguage) {
        // console.log(req.user._id);
        this.logger.log('Language created successfully', {
          action: 'create',
          role: role,
          userId: userId,
          details: JSON.stringify(createLanguageDto),
          createdDate: new Date(),
        });

        // const { _id,  ...dataWithoutId } = savedLanguage.toObject();


        const data = savedLanguage.toObject();
        delete data['__v'];

        delete data._id;
        console.log(data);
        return {
          message: 'Dil Kaydı Başarılı bir şekilde oluşturuldu.',
          data: data,
          success:true
        };

      }
    } catch (error) {
      // console.log(error);
      this.logger.error('Error while creating languages', {
        action: 'create',
        details: JSON.stringify(createLanguageDto),
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
      const finddata = await this.languageModel.findById(id);

      if (finddata) {   
        const data = finddata.toObject();
        delete data['__v'];

        delete data._id;
        
        // Başarılı bir şekilde bulunan veriyi logla
        this.logger.log('Language found successfully', {
          action: 'findOne',
          details: JSON.stringify(payload),
          role: role,
          userId: userId,
          createdDate: new Date(),
        }); 
        return {
          message: 'Dil bulundu.',
          data,
          success:true
        };
      }

    } catch (error) {
      // Hata durumunda bir hata günlüğü kaydet
      this.logger.error('Error while finding language', {
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
      updateLanguageDto: UpdateLanguageRequestDto,
      request: Request,
    ): Promise<any> {
      const { lang } = updateLanguageDto;
      const payload = request['user'];
      const userId = payload.sub;
      const role = payload.role;
      try {
        // const existingLang = await this.languageModel.findOne({ lang });
        // console.log(existingLang);
        // if (existingLang && existingLang.lang == lang) {
        //   throw new BadRequestException('Bu lang zaten kullanımda.');
        // }
      
        const existingLang = await this.languageModel.findOne({ lang: updateLanguageDto.lang });

        if (existingLang && existingLang._id.toString() !== id) {
          throw new BadRequestException('Bu Dil zaten mevcut');
        }

        if(updateLanguageDto.current==1){

          await this.languageModel.updateMany(
            { current: 1 },
            { current: 0 },
          );
        } 

        const updatedLanguage = await this.languageModel.findByIdAndUpdate(
          id,
          updateLanguageDto,
          { new: true },
        );

        if (!updatedLanguage) {
          throw new NotFoundException('Belirtilen ID ile dil bulunamadı');
        }
        
        this.logger.log('Language updated successfully', {
          action: 'update',
          details: JSON.stringify(payload),
          role: role,
          userId: userId,
          createdDate: new Date(),
        });

        const data = updatedLanguage.toObject();
        delete data._id;
        delete data['__v'];

        return {
          message: 'Dil güncellendi',
          data: data,
          success:true
        };
      } catch (error) {
        // Hata durumunda bir hata günlüğü kaydet
        this.logger.error('Error while updating language', {
          action: 'update',
          details: JSON.stringify(payload),
          role: role,
          userId: userId,
          createdDate: new Date(),
        });
        console.log(error.message);

        // throw new NotFoundException(`Güncelleme sırasında bir hata oluştu. Belirtilen id ile language bulunamadı`);
        throw error;
      }
    }

  async remove(id: string, request: Request): Promise<any> {
    const payload = request['user'];
    const userId = payload.sub;
    const role = payload.role;
    try {
      const removedLanguage = await this.languageModel.findByIdAndDelete(id);
      //! Burada hata yakaladığı için direkt catch'e iletiyor. uygun id ile istek atılmadığı için. Alt satıra geçmiyor.
      // const { _id,  ...dataWithoutId } = removedLanguage.toObject(); object  Destructuring işlemi

      this.logger.log('Language deleted successfully', {
        action: 'delete',
        details: JSON.stringify(payload),
        role: role,
        userId: userId,
        createdDate: new Date(),
      });
      
      if (!removedLanguage) {
        // console.log("not found");
        throw new NotFoundException('Belirtilen ID ile dil bulunamadı');
      }

      const data = removedLanguage.toObject();
      delete data['__v'];
      delete data._id;

      return {
        message: 'Dil Silindi',
        data: data,
        success:true
      };
    } catch (error) {
      this.logger.error('Error while deleting language', {
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
