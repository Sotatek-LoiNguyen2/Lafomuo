import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
export type UserDocument = HydratedDocument<User>;

const options = {
  timestamps: true,
  _id: true,
  autoIndex: true,
};
@Schema(options)
export class User extends Document {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  wallet_address: string;

  @Prop()
  created_at: Date

  @Prop()
  updated_at: Date

}

export const UserSchema = SchemaFactory.createForClass(User);
