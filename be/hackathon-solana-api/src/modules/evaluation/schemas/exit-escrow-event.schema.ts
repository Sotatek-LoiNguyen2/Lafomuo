import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,HydratedDocument } from 'mongoose';

export type ExitEscrowEventDocument = HydratedDocument<ExitEscrowEvent>;
const options = {
  timestamps: true,
  _id: true,
  autoIndex: true,
};

@Schema(options)
export class ExitEscrowEvent extends Document {

  @Prop()
  locker: string;

  @Prop()
  escrowOwner: string;

  @Prop()
  timestamp: string;

  @Prop()
  lockerSupply: string;

  @Prop()
  releasedAmount: string;

  @Prop()
  tx_hash: string;

  @Prop()
  blockTime: number;
}

export const ExitEscrowEventSchema = SchemaFactory.createForClass(ExitEscrowEvent);
