/* eslint-disable @typescript-eslint/ban-types */
import { BaseModel } from "./base.model";

export class DividendClaimed extends BaseModel {
  public parse(data: any): Object {
    return {
      checkpointId: data.checkpointId.toNumber(),
      totalClaimed: data.totalClaimed.toNumber(),
      distributor: data.distributor.toBase58(),
      owner: data.owner.toBase58(),
      lastClaimedAt: data.lastClaimedAt.toNumber(),
      blockTime: data.blockTime
    }
  }
}
