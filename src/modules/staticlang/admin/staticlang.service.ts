import {
  BadRequestException,
  Body,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { staticLang } from '../schemas/staticlang.schema';
import { staticLangDto } from './dtos/staticlang.dto';
import { find } from 'rxjs';
import { LogService } from 'src/logger/logger.service';
import { UpdateLanguageRequestDto } from 'src/modules/language/admin/dtos/forupdatelanguage.dto';
import { UpdateStaticLangRequestDto } from './dtos/updatedStaticLang.dto';

@Injectable()
export class AdminStaticLangService {
  constructor(
    @Inject('STATICLANG_MODEL')
    private readonly staticlangModel: Model<staticLang>, //! language.schema.ts dosyamızdaki provider'ı inject ediyoruz.
    private readonly logger: LogService,
  ) {}

  async findAll(): Promise<any> {
    try {
      const finddata = await this.staticlangModel.find().lean();

      console.log(finddata);

      this.logger.log('staticlang found successfully', {
        action: 'findAll',
        role: 4,
        userId: "asd",
        createdDate: new Date(),
      });

      // finddata.forEach((item) => {
      //   delete item._id;
      // });

      return {
        finddata,
        message: 'staticlang listesi getirildi',
        success: true,
      }
    } catch (error) {
      this.logger.error('Error while finding staticlang', {
        action: 'findAll',
        role: 4,
        userId: "asd",
        createdDate: new Date(),
      });
    }
  }

  public async create(
    // id: string,
    createLanguageDto: staticLangDto,
    // updatestaticlangrequestDto: UpdateStaticLangRequestDto,
    request: Request,
  ): Promise<any> {
    const payload = request['user'];
    const userId = payload.sub;
    const role = payload.role;
    let date = payload.date;

    try {
      const languageExists = await this.staticlangModel.findOne({
        name: createLanguageDto.name,
      });
      console.log(languageExists);

      // if (languageExists) {
       
      //   throw new BadRequestException('staticLang zaten mevcut');
      // }
      //! async olarak tanımlanan bir metot her zaman promise döndürür. Yazmamıza gerek yok zaten otomatik promise döndürüyor ama yine de yazabiliriz.
      if(!languageExists){
      const createdLanguage = new this.staticlangModel(createLanguageDto); //! model interface'inden languageModel nesnesi oluşturuluyor ve bu nesne save metodu sayesinde veritabanına kayedilir.

      const savedLanguage = await createdLanguage.save(); //! save metodu veri tabanına kaydeder.

      if (savedLanguage) {
        // const { _id, __v, ...dataWithoutId } = savedLanguage.toObject(); //! toObject() metodu, mongoose nesneleri aslında js nesnesi değil o yüzden js nesnesine dönüşütürülmesi gerekir. Ardından "object destructuring" işlemi yapılmıştır.
        this.logger.log('staticlang created successfully', {
          action: 'create',
          role: role,
          userId: userId,
          details: JSON.stringify(createLanguageDto),
          createdDate: new Date(),
        });
        const data = createdLanguage.toObject();

        delete data['__v']; 
        delete data._id;
      
      
        return {
          message: 'Kayıt Başarılı bir şekilde oluşturuldu.',
          data: data,
          success:true
        };
      }
    }
    else{
      const updatedLanguage = await this.staticlangModel.findByIdAndUpdate(
        languageExists._id,
        createLanguageDto,
        {new: true,}
        )

        if (updatedLanguage) {
          // const { _id, __v, ...dataWithoutId } = savedLanguage.toObject(); //! toObject() metodu, mongoose nesneleri aslında js nesnesi değil o yüzden js nesnesine dönüşütürülmesi gerekir. Ardından "object destructuring" işlemi yapılmıştır.
          this.logger.log('staticlang updated successfully', {
            action: 'update',
            role: role,
            userId: userId,
            details: JSON.stringify(createLanguageDto),
            createdDate: new Date(),
          });
          const data = updatedLanguage.toObject();
  
          delete data['__v']; 
          delete data._id;

          return {
            message: 'Kayıt Başarılı bir şekilde güncellendi.',
            data: data,
            success:true
          };
        }

    }

    } catch (error) {
      this.logger.error('Error while creating staticlang', {
        action: 'create',
        userId: userId,
        role: role,
        details: JSON.stringify(createLanguageDto),
        createdDate: new Date(),
      });
       throw error;
    }
  }

  async findOne(id: string, request: Request): Promise<any> {
    const payload = request['user'];
    const userId = payload.sub;
    const role = payload.role;
    // let date = new Date();

    try {
      const finddata = await this.staticlangModel.findById(id);

      // if (!finddata) {
      //   throw new NotFoundException( 'Belirtilen ID ile staticlang bulunamadı'); //! istenilmeyen id ile istek atılırsa bu hatayı almaz isen mongodb nin id kurallarına uyulmadığı için bu hata verilmemiştir. yani 24 char'lık id de 23 char gönderilirse bu notfound değil 500 hatası verir. Mongodb nin kurallarından ötürü.
      // }


      if(finddata){
        const data = finddata.toObject();
        delete data['__v'];
        delete data._id;
        // Başarılı bir şekilde bulunan veriyi logla
        this.logger.log('staticlang found successfully', {
          action: 'findOne',
          details: JSON.stringify(id),
          role: role,
          userId: userId,
          createdDate: new Date(),
        });
        return {
          message: 'staticlang bulundu',
          data,
          success:true
        };
      }


    } catch (error) {
      // Hata durumunda bir hata günlüğü kaydet
      this.logger.error('Error while finding staticlang', {
        action: 'findOne',
        details: JSON.stringify(id),
        role: role,
        userId: userId,
        createdDate: new Date(),
      });
      console.log(error.message);
      // throw new NotFoundException('Belirtilen ID ile staticlang bulunamadı');
      throw error;
    }
  }

  async update(id: string,updatestaticlangrequestDto: UpdateStaticLangRequestDto, request: Request): Promise<any> {
    const payload = request['user'];
    const userId = payload.sub;
    const role = payload.role;
    const {name} = updatestaticlangrequestDto
    try {
      
      // const existingstaticLang = await this.staticlangModel.findOne({ name });
      // console.log(existingstaticLang);
      // console.log(name);
      // if (existingstaticLang && existingstaticLang.name == name) {
      //   throw new BadRequestException('Bu name zaten kullanımda.');
      // }

      const existingSL = await this.staticlangModel.findOne({ name: updatestaticlangrequestDto.name });

      // if (existingSL && existingSL._id.toString() !== id) {
      //   throw new BadRequestException('Bu static lang zaten mevcut');
      // }

      const updatedLanguage = await this.staticlangModel.findByIdAndUpdate(
        id,
        updatestaticlangrequestDto ,
        {new: true,}
        );

      if (!updatedLanguage) {
        throw new NotFoundException('Belirtilen ID ile staticlang bulunamadı');
      } 
      


        this.logger.log('staticlang updated successfully', {
          action: 'update',
          details: JSON.stringify(id),
          role: role,
          userId: userId,
          createdDate: new Date(),
        });
      

      const data = updatedLanguage.toObject();
      delete data._id;
      delete data['__v'];

      return {
        message: 'staticlang güncellendi',
        data: data,
        success:true
      };
    } catch (error) {
      // Hata durumunda bir hata günlüğü kaydet
      this.logger.error('Error while updating staticlang', {
        action: 'update',
        details: JSON.stringify(id),
        role: role,
        userId: userId,
        createdDate: new Date(),
      });

      // throw new NotFoundException(`Güncelleme sırasında bir hata oluştu.`);
      throw error;
    }
  }

  async remove(id: string, request: Request): Promise<any> {
    const payload = request['user'];
    const userId = payload.sub;
    const role = payload.role;
    try {
      const removedstaticLang = await this.staticlangModel.findByIdAndDelete(id);
      //! Burada hata yakaladığı için direkt catch'e iletiyor. uygun id ile istek atılmadığı için. Alt satıra geçmiyor.
      // const { _id,  ...dataWithoutId } = removedstaticLang.toObject(); object  Destructuring işlemi
      if (removedstaticLang) {
        this.logger.log('staticlang deleted successfully', {
          action: 'delete',
          details: JSON.stringify(id),
          role: role,
          userId: userId,
          createdDate: new Date(),
        });
      }
      if (!removedstaticLang) {
      // console.log("not found");
      throw new NotFoundException('Belirtilen ID ile staticlang bulunamadı');
    }

      const data = removedstaticLang.toObject();
      delete data['__v'];
      delete data._id;

      return {
        message: 'staticlang Silindi',
        data: data,
        success:true
      };
    } catch (error) {
      this.logger.error('Error while deleting staticlang', {
        action: 'delete',
        details: JSON.stringify(id),
        role: role,
        userId: userId,
        createdDate: new Date(),
      });
      throw error
      
    }
  }
}
