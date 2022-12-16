import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

import { Evaluation } from './main.schema';

export type CheckPointDocument = HydratedDocument<CheckPoint>;
const options = {
  timestamps: true,
  _id: true,
  autoIndex: true,
};
@Schema()
export class FileSchema {
  name: string;
  url: string;
  path: string;
};


@Schema(options)
export class CheckPoint extends Document {

  @Prop()
  ID: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Evaluation' })
  evaluation_id: Evaluation

  @Prop()
  dividend_distributor: string;

  @Prop()
  checkpointId: string;

  @Prop()
  locker: string;

  @Prop()
  owner: string;

  @Prop()
  totalDistributionAmount: number;

  @Prop()
  startDistributionAt: number;

  @Prop()
  description: string;

  @Prop()
  reportFile: FileSchema;

  @Prop()
  token_address: string;

  @Prop()
  checkpoint_hash: string;

  @Prop()
  decimal: number;

  @Prop()
  blockTime: number;
}

export const CheckPointSchema = SchemaFactory.createForClass(CheckPoint);
