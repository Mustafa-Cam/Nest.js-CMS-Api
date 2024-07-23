  import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
  import mongoose, { HydratedDocument } from 'mongoose';
  // import { v4 as uuidv4 } from 'uuid';

  export type UserDocument = HydratedDocument<User>;

  @Schema()
  export class User {
    @Prop({ type: mongoose.Schema.Types.ObjectId })
    id: number;

    @Prop({ type: mongoose.Schema.Types.String, unique: true })
    username: string;

    @Prop({ type: mongoose.Schema.Types.String })
    fullname: string;

    @Prop({ type: mongoose.Schema.Types.String })
    password: string;

    @Prop({ type: mongoose.Schema.Types.String })
    email: string;

    @Prop({ type: mongoose.Schema.Types.Number })
    role: number;

    @Prop({ type: mongoose.Schema.Types.Number,default:1 })
    active: number;

    @Prop({ type: mongoose.Schema.Types.Date })
    createdAt: Date;

    @Prop({ type: mongoose.Schema.Types.Boolean, default: false })
    deletedAt: boolean; 

    // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Roles' }] })
    // roles: Roles[]; burası sonra aktif olacak.
  }

  export const UserSchema = SchemaFactory.createForClass(User);
