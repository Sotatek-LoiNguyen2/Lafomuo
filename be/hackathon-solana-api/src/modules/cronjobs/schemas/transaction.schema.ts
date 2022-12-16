import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

import { Document } from 'mongoose';
import { Signature } from './signature.schema';
export type TransactionDocument = HydratedDocument<Transaction>;
const options = {
  timestamps: true,
  _id: true,
  autoIndex: true,
};

@Schema(options)
export class Transaction extends Document {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Signature' })
  signature: Signature;

  @Prop({ index: true, required: true })
  type: string;

  @Prop({ type: Object })
  raw: Record<string, any>;

  @Prop({ type: Object })
  data: Record<string, any>;

  @Prop({ index: true })
  status: number;

  @Prop({ type: Object })
  message: Record<string, any>;

  @Prop({ default: 0 })
  turn: number;
}
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
TransactionSchema.index({ signature: 1, type: 1 }, { unique: true });
