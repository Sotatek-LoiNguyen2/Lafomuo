import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Document } from 'mongoose';
export type CronjobConfigDocument = HydratedDocument<CronjobConfig>;
const options = {
  timestamps: true,
  _id: true,
  autoIndex: true,
};

@Schema(options)
export class CronjobConfig extends Document {
  @Prop({ unique: true })
  key: string;

  @Prop({})
  valueString: string;

  @Prop({})
  valueLong: number;

}
export const CronjobConfigSchema = SchemaFactory.createForClass(CronjobConfig);
