import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityHistory, ActivityHistoryDocument } from 'src/modules/activity-history/schemas/activity-history.schema';
import { LockEvent, LockEventDocument } from 'src/modules/evaluation/schemas/lock-event.schema';
import { ActivityType } from 'src/shared/constants';

import { BaseHandle } from './base.handle';

export class LockEventHandle extends BaseHandle {
  constructor(
    @InjectModel(LockEvent.name) private lockEventSchema: Model<LockEventDocument>,
    @InjectModel(ActivityHistory.name) private activityHistoryModel: Model<ActivityHistoryDocument>,
  ) {
    super();
    this.programId = "7RLLimHKvGkFGZSiVipaBDYGZNKGCve9twDHfdsBDsN9";
    this.type = "LockEvent";
  }

  public async processTransaction(programId: string, type: string, data: any): Promise<any> {
    if (programId != this.programId || type != this.type)
      return;
    console.log("processTransaction LockEvent handle: ", data)
    
    const activity = new this.activityHistoryModel({
      type: ActivityType.LOCK,
      data: JSON.stringify(data),
      locker: data.locker,
      escrowOwner: data.escrowOwner
    })

    await activity.save()
    
    const locker = await this.lockEventSchema.findOne({locker: data.locker})
    if(locker){
      data.amount = Number(locker.amount) + Number(data.amount)
    }

    await this.lockEventSchema.findOneAndUpdate({
      locker: data.locker
    }, {
      ...data
    }, {
      upsert: true
    })


    
    return null;
  }

}
