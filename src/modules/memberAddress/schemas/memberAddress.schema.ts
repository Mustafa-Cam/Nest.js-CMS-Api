import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
// import * as bcrypt from 'bcrypt';
// import { v4 as uuidv4 } from 'uuid';

export type MemberAddressDocument = HydratedDocument<MemberAddress>; 

@Schema({collection: 'memberAddress'})
export class MemberAddress {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Members'})
  memberId: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.Number })
  default: number;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String })
  title: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String })
  name: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String })
  surname: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String })
  email: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String })
  phone: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String })
  idNo: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String })
  tax: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String})
  town: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String})
  address: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.Number})
  type: number;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.Number, default: 1 })
  active: number;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  createdDate: Date;
}

export const MemberAddressSchema = SchemaFactory.createForClass(MemberAddress); //! service de Model<options> yazıyor ordaki options'i kullanmak için createForClass metodunu kullanıyoruz.

