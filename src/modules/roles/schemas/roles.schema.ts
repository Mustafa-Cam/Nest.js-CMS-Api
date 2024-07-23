import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/modules/auth/schemas/user.schema';
// import { v4 as uuidv4 } from 'uuid';

export type LanguageDocument = HydratedDocument<Roles>; 

@Schema()
export class Roles {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.Number, required:true, unique: true })
  roleId: number;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String, required: [true,'title zorunludur']  })  //! unique: true     bu şekilde de validation eklenebilir ama kedni hata mesajımızı oluşturmak için service de kontrol etmek daha iyi gibi.
  title: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String })
  action: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  createdDate: Date;

}

export const RolesSchema = SchemaFactory.createForClass(Roles); 
