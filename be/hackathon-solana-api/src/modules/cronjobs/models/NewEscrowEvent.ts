/* eslint-disable @typescript-eslint/ban-types */
import { BaseModel } from "./base.model";

export class NewEscrowEvent extends BaseModel {
  public parse(data: any): Object {
    return {
      escrow: data.escrow.toBase58(),
      escrowOwner: data.escrowOwner.toBase58(),
      timestamp: data.timestamp.toNumber(),
      locker: data.locker.toBase58(),
      tx_hash: data.signature,
      blockTime: data.blockTime
    }
  }
}
