/* eslint-disable @typescript-eslint/ban-types */
import { BaseModel } from "./base.model";

export class AssetFractionalize extends BaseModel {
  public parse(data: any): Object {
    return {
      assetBasket: data.assetBasket.toBase58(),
      governor: data.governor.toBase58(),
      mint: data.mint.toBase58(),
      totalSupply: data.totalSupply.toNumber(),
    }
  }
}
