/* eslint-disable @typescript-eslint/ban-types */
import { BaseModel } from "./base.model";

export class DistributionCreated extends BaseModel {
  public parse(data: any): Object {
    return {
      totalDistributionAmount: data.totalDistributionAmount.toNumber(),
      startDistributionAt: data.startDistributionAt.toNumber(),
      distributor: data.distributor.toBase58(),
      locker: data.locker.toBase58(),
      owner: data.owner.toBase58(),
      checkpointId: data.checkpointId.toNumber(),
      checkpoint_hash: data.signature,
      blockTime: data.blockTime
    }
  }
}
