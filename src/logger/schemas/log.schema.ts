import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type LogDocument = HydratedDocument<Log>;

@Schema()
export class Log {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id: number;

  @Prop()
  userId: string;

  @Prop()
  message: string; 

  @Prop()
  action: string;

  @Prop()
  details: string;

  @Prop()
  type: string;

  @Prop()
  role: number;

  @Prop({ type: mongoose.Schema.Types.Date })
  createdDate: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
