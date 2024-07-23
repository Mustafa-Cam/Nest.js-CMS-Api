import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
// import { v4 as uuidv4 } from 'uuid';
import { MemberAddress } from 'src/modules/memberaddress/schemas/memberAddress.schema';
export type MemberDocument = HydratedDocument<Member>; 

@Schema({collection: 'member'})
export class Member {

  // @ApiProperty()
  // @Prop({ type: [{type:mongoose.Schema.Types.ObjectId, ref: 'MembersAdres'}] })
  // memberAdres: MembersAdres[];

  // @ApiProperty()
  // @Prop({ type: MembersAdres })
  // memberAdres: MembersAdres;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String })
  name: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String })
  surname: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String, unique: true })
  email: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String })
  phone: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String })
  password: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String })
  token: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.Date})
  lastLogin: Date;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.Number, default: 1 })
  active: number;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  createdDate: Date;

  address:()=>{
    
  }

}

export const MemberSchema = SchemaFactory.createForClass(Member); //! service de Model<options> yazıyor ordaki options'i kullanmak için createForClass metodunu kullanıyoruz.

MemberSchema.pre('save', async function (next: Function) {
  // Yeni bir kullanıcı oluşturulduğunda veya şifre değiştirildiğinde çalışır
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});