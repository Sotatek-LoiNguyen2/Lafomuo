import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityHistory, ActivityHistoryDocument } from 'src/modules/activity-history/schemas/activity-history.schema';
import { ExitEscrowEventDocument } from 'src/modules/evaluation/schemas/exit-escrow-event.schema';
import { LockEventDocument } from 'src/modules/evaluation/schemas/lock-event.schema';
import { ActivityType } from 'src/shared/constants';

import { ExitEscrowEvent } from '../models/ExitEscrowEvent';
import { LockEvent } from '../models/LockEvents';
import { BaseHandle } from './base.handle';

export class ExitEscrowEventHandle extends BaseHandle {
  constructor(
    @InjectModel(ExitEscrowEvent.name) private exitEscrowEventModel: Model<ExitEscrowEventDocument>,
    @InjectModel(ActivityHistory.name) private activityHistoryModel: Model<ActivityHistoryDocument>,
    @InjectModel(LockEvent.name) private lockEventScheme: Model<LockEventDocument>
  ) {
    super();
    this.programId = "7RLLimHKvGkFGZSiVipaBDYGZNKGCve9twDHfdsBDsN9";
    this.type = "ExitEscrowEvent";
  }

  public async processTransaction(programId: string, type: string, data: any): Promise<any> {
    if (programId != this.programId || type != this.type)
      return;
    console.log("processTransaction exitEscrowEventModel handle: ", data)
    await this.exitEscrowEventModel.findOneAndUpdate({
      locker: data.locker,
      escrowOwner: data.escrowOwner
    }, {
      ...data
    }, {
      upsert: true
    })

    const activity = new this.activityHistoryModel({
      type: ActivityType.EXIT_ESCROW,
      data: JSON.stringify(data),
      locker: data.locker,
      escrowOwner: data.escrowOwner
    })
    await activity.save()

    const locker = await this.lockEventScheme.findOne({locker: data.locker})
    let remainAmount: number
    if(locker){
      remainAmount = (Number(locker.amount) - Number(data.amount) >= 0) ? (Number(locker.amount) - Number(data.amount)) : 0
      await this.lockEventScheme.findOneAndUpdate({
        locker: data.locker
      }, {
        amount: remainAmount
      })
    }

    return null;
  }

}
