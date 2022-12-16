import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Document } from 'mongoose';
export type SignatureDocument = HydratedDocument<Signature>;
const options = {
  timestamps: true,
  _id: true,
  autoIndex: true,
};

@Schema(options)
export class Signature extends Document {
  @Prop({ unique: true })
  signature: string;

  @Prop({ type: Object })
  raw: Record<string, any>;

  @Prop({ index: true, default: 0 }) // 0 = init, 1 = done, 2 = error, 3 = processing
  status: number;

  @Prop({ type: Object })
  message: Record<string, any>;

  @Prop({ default: 0 })
  turn: number;

}
export const SignatureSchema = SchemaFactory.createForClass(Signature);
