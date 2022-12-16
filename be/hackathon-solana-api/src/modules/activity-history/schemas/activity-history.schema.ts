import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { ActivityType } from 'src/shared/constants';


export type ActivityHistoryDocument = HydratedDocument<ActivityHistory>;
const options = {
  timestamps: true,
  _id: true,
  autoIndex: true,
};

@Schema(options)
export class ActivityHistory extends Document {

  @Prop()
  locker: string;

  @Prop({
    enum: ActivityType
  })
  type: ActivityType

  @Prop()
  data: string;

  @Prop()
  escrowOwner: string;

}

export const ActivityHistorySchema = SchemaFactory.createForClass(ActivityHistory);
