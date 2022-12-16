import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,HydratedDocument } from 'mongoose';

export type LockEventDocument = HydratedDocument<LockEvent>;
const options = {
  timestamps: true,
  _id: true,
  autoIndex: true,
};

@Schema(options)
export class LockEvent extends Document {

  @Prop()
  ID: number;

  @Prop()
  locker: string;

  @Prop()
  escrowOwner: string;

  @Prop()
  totalMint: string;

  @Prop()
  amount: string;

  @Prop()
  lockerSupply: string;

  @Prop()
  tx_hash: string;

  @Prop()
  blockTime: number;
}

export const LockEventSchema = SchemaFactory.createForClass(LockEvent);
