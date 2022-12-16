import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityHistory, ActivityHistoryDocument } from 'src/modules/activity-history/schemas/activity-history.schema';
import { CheckPoint, CheckPointDocument } from 'src/modules/evaluation/schemas/check-point.schema';
import { ActivityType } from 'src/shared/constants';

import { BaseHandle } from './base.handle';

export class DividendClaimedHandle extends BaseHandle {
  constructor(
    @InjectModel(CheckPoint.name) private checkPointSchema: Model<CheckPointDocument>,
    @InjectModel(ActivityHistory.name) private activityHistoryModel: Model<ActivityHistoryDocument>,
  ) {
    super();
    this.programId = "7RLLimHKvGkFGZSiVipaBDYGZNKGCve9twDHfdsBDsN9";
    this.type = "DividendClaimed";
  }

  public async processTransaction(programId: string, type: string, data: any): Promise<any> {
    console.log("Gg")
    console.log(type)
    console.log(this.type)
    console.log("Gg")
    if (programId != this.programId || type !== this.type )
      return;
    console.log("processTransaction DividendClaimedHandle handle: ", data)

    const checkpoint = await this.checkPointSchema.findOne({
      dividend_distributor: data.distributor
    });

    console.log("claim handle")
    console.log(checkpoint)
    console.log("claim handle")

    if (checkpoint) {
      const activity = new this.activityHistoryModel({
        locker: checkpoint.locker,
        type: ActivityType.DIVIDEND_CLAIMED,
        escrowOwner: data.owner,
        data: JSON.stringify(data)
      })
      await activity.save()
    }
    return null;
  }

}
