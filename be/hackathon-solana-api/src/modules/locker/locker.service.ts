import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RequestContext } from "src/shared/request-context/request-context.dto";
import { LockEvent, LockEventDocument } from "../evaluation/schemas/lock-event.schema";
import { GetLockerInput } from "./dtos/get-locker-input.dto";

@Injectable()

export class LockerService {

    constructor(@InjectModel(LockEvent.name) private lockModel: Model<LockEventDocument>){}

    async getSummaryLock(ctx: RequestContext, locker: string, escrow_owner: string): Promise<LockEvent>{
        return await this.lockModel.findOne({locker: locker, escrowOwner: escrow_owner})
    }
}