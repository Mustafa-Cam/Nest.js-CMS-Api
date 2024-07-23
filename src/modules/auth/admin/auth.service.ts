import { BadRequestException, Body, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { LogService } from 'src/logger/logger.service';
import { userDto } from './dtos/user.dto';
import { updateUserDto } from './dtos/updateuser.dto';

@Injectable()
export class AdminAuthService {

    constructor(
      // private jwtService: JwtService,
      @Inject('USER_MODEL') private userModel: Model<User>,
      private readonly logger: LogService,
      
    ) {}
      

  async findAll(request: Request): Promise<any> {
    const payload = request['user'];
    try {
      const users = await this.userModel.find().lean();
      console.log(typeof users);
      // console.log(users);
      // console.log(request.body);
      
      // users.forEach((item) => {
      //   delete item._id;
      // });

      if (users) {
        this.logger.log('User found successfully', {
          action: 'findAll',
          role: payload.role,
          userId: payload.sub,
          createdDate: new Date(),
        });
      }

      return {
        users, 
        message:"Users listesi getirildi",
        success:true
      };
    } catch (error) {
      this.logger.error('Error while finding users', {
        action: 'findAll',
        role: payload.role,
        userId: payload.sub,
        createdDate: new Date(),
      }); // Hata durumunda bir hata günlüğü kaydeder.
      throw error;
    }
  }

  public async create(
    userdto: userDto,
    request: Request,
  ): Promise<any> {
    // console.log(request.user);
    const payload = request['user'];
    console.log(payload);
    const userId = payload.sub;
    const role = payload.role;
    // const username = payload.username;

    try {
      const userExists = await this.userModel.findOne({
        username: userdto.username,
      });
      console.log(userExists);

      if (userExists) {
        throw new BadRequestException('User zaten mevcut');
      }
      //! async olarak tanımlanan bir metot her zaman promise döndürür. Yazmamıza gerek yok zaten otomatik promise döndürüyor ama yine de yazabiliriz.
      const createdUser = new this.userModel(userdto); //! model interface'inden languageModel nesnesi oluşturuluyor ve bu nesne save metodu sayesinde veritabanına kayedilir.

      const savedUser = await createdUser.save(); //! save metodu veri tabanına kaydeder.

      if (savedUser) {
        // console.log(req.user._id);
        this.logger.log('User created successfully', {
          action: 'create',
          role: role,
          userId: userId,
          details: JSON.stringify(userdto),
          createdDate: new Date(),
        });

        // const { _id,  ...dataWithoutId } = savedLanguage.toObject();


        const data = savedUser.toObject();
        delete data['__v'];

        delete data._id;

        return {
          message: 'User Kaydı Başarılı bir şekilde oluşturuldu.',
          data: data,
          success:true
        };

      }
    } catch (error) {
      // console.log(error);
      this.logger.error('Error while creating user', {
        action: 'create',
        details: JSON.stringify(userdto),
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
      const finddata = await this.userModel.findById(id);

      if (finddata) {   
        const data = finddata.toObject();
        delete data['__v'];

        delete data._id;
        
        // Başarılı bir şekilde bulunan veriyi logla
        this.logger.log('User found successfully', {
          action: 'findOne',
          details: JSON.stringify(payload),
          role: role,
          userId: userId,
          createdDate: new Date(),
        }); 
        return {
          message: 'User bulundu.',
          data,
          success:true
        };
      }

    } catch (error) {
      // Hata durumunda bir hata günlüğü kaydet
      this.logger.error('Error while finding user', {
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
    updateuserDto: updateUserDto,
    request: Request,
  ): Promise<any> {
    const { username } = updateuserDto;
    const payload = request['user'];
    const userId = payload.sub;
    const role = payload.role;
    try {
      // const existingUser = await this.userModel.findOne({username});
      // console.log(existingUser);
      // if (existingUser && existingUser.username == username) {
      //   throw new BadRequestException('Bu user zaten kullanımda.');
      // }
      const existingUser = await this.userModel.findOne({ username: updateuserDto.username });

    if (existingUser && existingUser._id.toString() !== id) {
      throw new BadRequestException('Bu kullanıcı adı zaten mevcut');
    }
    
      const updatedLanguage = await this.userModel.findByIdAndUpdate(
        id,
        updateuserDto,
        { new: true },
      );

      if (!updatedLanguage) {
        throw new NotFoundException('Belirtilen ID ile user bulunamadı');
      }
      


      this.logger.log('user updated successfully', {
        action: 'update',
        details: JSON.stringify(payload),
        role: role,
        userId: userId,
        createdDate: new Date(),
      });

      const data = updatedLanguage.toObject();
      // delete data._id;
      delete data['__v'];

      return {
        message: 'User güncellendi',
        data: data,
        success:true
      };
    } catch (error) {
      // Hata durumunda bir hata günlüğü kaydet
      this.logger.error('Error while updating user', {
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
      const removedUser = await this.userModel.findByIdAndDelete(id);
      //! Burada hata yakaladığı için direkt catch'e iletiyor. uygun id ile istek atılmadığı için. Alt satıra geçmiyor.
      // const { _id,  ...dataWithoutId } = removedLanguage.toObject(); object  Destructuring işlemi

      this.logger.log('User deleted successfully', {
        action: 'delete',
        details: JSON.stringify(payload),
        role: role,
        userId: userId,
        createdDate: new Date(),
      });
      
      if (!removedUser) {
        // console.log("not found");
        throw new NotFoundException('Belirtilen ID ile user bulunamadı');
      }

      const data = removedUser.toObject();
      delete data['__v'];
      delete data._id;

      return {
        message: 'User Silindi',
        data: data,
        success:true
      };
    } catch (error) {
      this.logger.error('Error while deleting user', {
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
