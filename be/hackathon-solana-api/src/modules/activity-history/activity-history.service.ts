import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestContext } from 'src/shared/request-context/request-context.dto';
import { ActivityHistory, ActivityHistoryDocument } from './schemas/activity-history.schema';

@Injectable()
export class ActivityHistoryService {

    constructor(@InjectModel(ActivityHistory.name) private activityHistoryModel: Model<ActivityHistoryDocument>){}

    async getActivityHistoryByLocker(ctx: RequestContext, locker: string): Promise<ActivityHistory[]>{
        return this.activityHistoryModel.find({locker: locker})
    }
}
