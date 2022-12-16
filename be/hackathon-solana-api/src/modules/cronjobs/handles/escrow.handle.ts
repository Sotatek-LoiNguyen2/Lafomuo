import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Escrow, EscrowDocument } from 'src/modules/evaluation/schemas/escrow.schema';
import { ActivityHistory, ActivityHistoryDocument } from 'src/modules/activity-history/schemas/activity-history.schema';
import { ActivityType } from 'src/shared/constants';
import { BaseHandle } from './base.handle';

export class NewEscrowHandle extends BaseHandle {
  constructor(
    @InjectModel(Escrow.name) private escrowSchema: Model<EscrowDocument>,
    @InjectModel(ActivityHistory.name) private activityHistoryModel: Model<ActivityHistoryDocument>,
  ) {
    super();
    this.programId = "7RLLimHKvGkFGZSiVipaBDYGZNKGCve9twDHfdsBDsN9";
    this.type = "NewEscrowEvent";
  }

  public async processTransaction(programId: string, type: string, data: any): Promise<any> {
    if (programId != this.programId || type !== this.type )
      return;
    console.log("processTransaction NewEscrow handle: ", data)
    await this.escrowSchema.findOneAndUpdate({
      locker: data.locker
    }, {
      ...data
    }, {
      upsert: true
    })

    const activity = new this.activityHistoryModel({
      type: ActivityType.CREATE_ESCROW,
      data: JSON.stringify(data),
      locker: data.locker,
      escrowOwner: data.escrowOwner
    })

    await activity.save()
    return null;
  }

  public async processLog(programId: string, data: any): Promise<any> {
      // console.log({programId, data})
  }
}
