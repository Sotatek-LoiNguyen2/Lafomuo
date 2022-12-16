/* eslint-disable @typescript-eslint/ban-types */
import { BaseModel } from "./base.model";

export class ExitEscrowEvent extends BaseModel {
  public parse(data: any): Object {
    return {
      escrowOwner: data.escrowOwner.toBase58(),
      timestamp: data.timestamp.toNumber(),
      locker: data.locker.toBase58(),
      lockerSupply: data.lockerSupply.toNumber(),
      releasedAmount: data.releasedAmount.toNumber(),
      tx_hash: data.signature,
      blockTime: data.blockTime
    }
  }
}
