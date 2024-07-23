import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';

export type LanguageDocument = HydratedDocument<Language>; //! burdaki language aşşağdaki sınıfımızın adı

@Schema()
export class Language {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id: number;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String })
  lang: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String })
  language: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.Number })
  current: number; //! burayı current olarak değiştirmiştik. 

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.Boolean })
  deletedAt: boolean;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.Number, default: 1 })
  active: number;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  createdDate: Date;  
}

export const LanguageSchema = SchemaFactory.createForClass(Language); //! service de Model<Language> yazıyor ordaki Language'i kullanmak için createForClass metodunu kullanıyoruz.
