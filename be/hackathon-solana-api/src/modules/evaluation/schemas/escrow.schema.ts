import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,HydratedDocument } from 'mongoose';

export type EscrowDocument = HydratedDocument<Escrow>;
const options = {
  timestamps: true,
  _id: true,
  autoIndex: true,
};

@Schema(options)
export class Escrow extends Document {

  @Prop()
  ID: number;

  @Prop()
  escrow: string;

  @Prop()
  escrowOwner: string;

  @Prop()
  locker: string;

  @Prop()
  timestamp: string;

  @Prop()
  tx_hash: string;
  
  @Prop()
  blockTime: number;
}

export const EscrowSchema = SchemaFactory.createForClass(Escrow);
