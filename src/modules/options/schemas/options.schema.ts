import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';

export type OptionsDocument = HydratedDocument<Options>; 

@Schema()
export class Options {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id: number;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String ,unique:true})
  lang:string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String })
  name: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String })
  value: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  createdDate: Date;
}

export const OptionsSchema = SchemaFactory.createForClass(Options); //! service de Model<options> yazıyor ordaki options'i kullanmak için createForClass metodunu kullanıyoruz.
