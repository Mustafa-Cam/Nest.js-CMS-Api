import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';

export type LanguageDocument = HydratedDocument<staticLang>; //! burdaki staticlang aşşağdaki sınıfımızın adı

@Schema()
export class staticLang {
  // @ApiProperty()
  // @Prop({ type: mongoose.Schema.Types.ObjectId })
  // id: number ;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String })
  name: string;

  @ApiProperty()
  @Prop([{ lang: String, value: String, _id: false}])
  value: { lang: string, value: string }[];

  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  createdDate: Date;

  
}

export const StaticLangSchema = SchemaFactory.createForClass(staticLang); //! service de Model<Language> yazıyor ordaki Language'i kullanmak için createForClass metodunu kullanıyoruz.
