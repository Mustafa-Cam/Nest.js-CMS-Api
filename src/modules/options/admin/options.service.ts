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
  
  import { Options } from '../schemas/options.schema';
  import { optionsDto } from './dtos/options.dto';
  import { NotFoundError } from 'rxjs';
    import { UpdateOptionsDto } from './dtos/updateOptions.dto';
  import { LogService } from 'src/logger/logger.service';
  import { json } from 'node:stream/consumers';
  import { type } from 'node:os';
  @Injectable()
  export class AdminOptionsService {
    constructor(
      @Inject('OPTIONS_MODEL') private readonly optionsModel: Model<Options>, //! options.schema.ts dosyamızdaki provider'ı inject ediyoruz.
      private readonly logger: LogService,
    ) {}
  
    async findAll(): Promise<any> {
      try {
        const options = await this.optionsModel.find().lean();
        console.log(typeof options);
        // console.log(options);
        // console.log(request.body);
  
        // options.forEach((item) => {
        //   delete item._id;
        // });
  
        if (options) {
          this.logger.log('Options found successfully', {
            action: 'findAll',
            role: 4,
            userId: "asd",
            createdDate: new Date(),
          });
        }
        console.log(options);
        return {
          options, 
          message:"Options listesi getirildi",
          success:true
        };
      } catch (error) {
        this.logger.error('Error while finding options', {
          action: 'findAll',
          role: 2,
          userId: "asd",
          createdDate: new Date(),
        }); // Hata durumunda bir hata günlüğü kaydeder.
        throw error;
      }
    }
  
    public async create(
      createOptionsDto: optionsDto,
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
        const langExists = await this.optionsModel.findOne({
          lang: createOptionsDto.lang,
        });
        console.log(langExists);
  
        if (langExists) {
          
          throw new BadRequestException('lang zaten mevcut');
        }
        //! async olarak tanımlanan bir metot her zaman promise döndürür. Yazmamıza gerek yok zaten otomatik promise döndürüyor ama yine de yazabiliriz.
       
        const createdOptions = new this.optionsModel(createOptionsDto); //! model interface'inden optionsModel nesnesi oluşturuluyor ve bu nesne save metodu sayesinde veritabanına kayedilir.
  
        const savedOptions = await createdOptions.save(); //! save metodu veri tabanına kaydeder.
  
        if (savedOptions) {
          // console.log(req.user._id);
          this.logger.log('Options created successfully', {
            action: 'create',
            role: role,
            userId: userId,
            details: JSON.stringify(createOptionsDto),
            createdDate: new Date(),
          });
  
  
  
          const data = savedOptions.toObject();
          delete data['__v'];
          delete data._id;
  
          console.log(data);
          return {
            message: 'Option Kaydı Başarılı bir şekilde oluşturuldu.',
            data: data,
            success:true
          };
  
        }
      } catch (error) {
        // console.log(error);
        this.logger.error('Error while creating options', {
          action: 'create',
          details: JSON.stringify(createOptionsDto),
          role: role,
          userId: userId,
          createdDate: new Date(),
        }); // Hata durumunda bir hata günlüğü kaydeder
        throw error;
      }
    }
  
    async findOne(id: string, request: Request): Promise<any> {
      const payload = request['user'];
      // console.log(payload);
      const userId = payload.sub;
      const role = payload.role;
  
      try {
        const finddata = await this.optionsModel.findById(id);

        if (!finddata) {
          throw new NotFoundException('Option bulunamadı');
        }

        if (finddata) {   
          const data = finddata.toObject();
          delete data['__v'];
  
          delete data._id;
          
          // Başarılı bir şekilde bulunan veriyi logla
          this.logger.log('Option found successfully', {
            action: 'findOne',
            details: JSON.stringify(payload),
            role: role,
            userId: userId,
            createdDate: new Date(),
          }); 
          return {
            message: 'Option bulundu.',
            data,
            success:true
          };
        }
  
      } catch (error) {
        // Hata durumunda bir hata günlüğü kaydet
        this.logger.error('Error while finding option', {
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
      updateOptionsDto: UpdateOptionsDto,
      request: Request,
    ): Promise<any> {
      const { lang } = updateOptionsDto;
      const payload = request['user'];
      const userId = payload.sub;
      const role = payload.role;
      try {


        //! her lang değeri için sadece bir kayıt olacak diğer kombinasyonlar olmayacak denirse bu kodu açarız.
        const existingLang = await this.optionsModel.findOne({ lang: updateOptionsDto.lang });
  
        if (existingLang && existingLang._id.toString() !== id) { 
          throw new BadRequestException('Bu lang değeri zaten mevcut. Mevcut olmayan bir değer ile değiştirebilirsiniz.');
        }

        const updatedOption = await this.optionsModel.findByIdAndUpdate(
          id,
          updateOptionsDto,
          { new: true },
        );
  
        if (!updatedOption) {
          throw new NotFoundException('Belirtilen ID ile dil bulunamadı');
        }
        
        this.logger.log('Option updated successfully', {
          action: 'update',
          details: JSON.stringify(payload),
          role: role,
          userId: userId,
          createdDate: new Date(),
        });
  
        const data = updatedOption.toObject();
        delete data._id;
        delete data['__v'];
  
        return {
          message: 'Option güncellendi',
          data: data,
          success:true
        };
      } catch (error) {
        // Hata durumunda bir hata günlüğü kaydet
        this.logger.error('Error while updating option', {
          action: 'update',
          details: JSON.stringify(payload),
          role: role,
          userId: userId,
          createdDate: new Date(),
        });
        console.log(error.message);
  
        // throw new NotFoundException(`Güncelleme sırasında bir hata oluştu. Belirtilen id ile option bulunamadı`);
        throw error;
      }
    }

    async remove(id: string, request: Request): Promise<any> {
      const payload = request['user'];
      const userId = payload.sub;
      const role = payload.role;
      try {
        const removedOption = await this.optionsModel.findByIdAndDelete(id);
        //! Burada hata yakaladığı için direkt catch'e iletiyor. uygun id ile istek atılmadığı için. Alt satıra geçmiyor.
        // const { _id,  ...dataWithoutId } = removedOption.toObject(); object  Destructuring işlemi
          if (!removedOption) {
           // console.log("not found");
           throw new NotFoundException('Belirtilen ID ile Option bulunamadı');
          }


        this.logger.log('Option deleted successfully', {
          action: 'delete',
          details: JSON.stringify(payload),
          role: role,
          userId: userId,
          createdDate: new Date(),
        });
        
        
  
        const data = removedOption.toObject();
        delete data['__v'];
        delete data._id;
  
        return {
          message: 'Option Silindi',
          data: data,
          success:true
        };
      } catch (error) {
        this.logger.error('Error while deleting Option', {
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
  