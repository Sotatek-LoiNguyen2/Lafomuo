import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,HydratedDocument } from 'mongoose';

export type DistributionDocument = HydratedDocument<Distribution>;
const options = {
  timestamps: true,
  _id: true,
  autoIndex: true,
};

@Schema(options)
export class Distribution extends Document {

  @Prop()
  ID: number;

  @Prop()
  checkpointId: string;

  @Prop()
  distributor: string;

  @Prop()
  locker: string;

  @Prop()
  owner: string;

  @Prop()
  totalDistributionAmount: string;

  @Prop()
  startDistributionAt: string;

  @Prop()
  blockTime: number;
}

export const DistributionSchema = SchemaFactory.createForClass(Distribution);
