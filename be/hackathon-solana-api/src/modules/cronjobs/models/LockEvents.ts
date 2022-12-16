/* eslint-disable @typescript-eslint/ban-types */
import { BaseModel } from "./base.model";

export class LockEvent extends BaseModel {
  public parse(data: any): Object {
    return {
      amount: data.amount.toNumber(),
      escrowOwner: data.escrowOwner.toBase58(),
      tokenMint: data.tokenMint.toBase58(),
      locker: data.locker.toBase58(),
      lockerSupply: data.lockerSupply.toNumber(),
      tx_hash: data.signature,
      blockTime: data.blockTime
    }
  }
}
