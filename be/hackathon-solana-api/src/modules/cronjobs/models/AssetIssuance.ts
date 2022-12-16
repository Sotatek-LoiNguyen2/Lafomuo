/* eslint-disable @typescript-eslint/ban-types */
import { BaseModel } from "./base.model";

export class AssetIssuance extends BaseModel {
  public parse(data: any): Object {
    return {
      owner: data.owner.toBase58(),
      assetId: data.assetId.toBase58(),
      assetTokenAccount: data.assetTokenAccount.toBase58(),
      assetBasket: data.assetBasket.toBase58(),
      masterEdition: data.masterEdition.toBase58(),
      metadata: data.metadata.toBase58(),
      iat: data.iat.toNumber(),
      basketId: data.basketId.toNumber(),
    }
  }
}
