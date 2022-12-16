import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Evaluation, EvaluationDocument } from 'src/modules/evaluation/schemas/main.schema';
import { EVALUATION_STATUS } from 'src/shared/constants';

import { BaseHandle } from './base.handle';

export class MintHandle extends BaseHandle {
  constructor(
    @InjectModel(Evaluation.name) private evaluationModel: Model<EvaluationDocument>,
  ) {
    super();
    this.programId = "7RLLimHKvGkFGZSiVipaBDYGZNKGCve9twDHfdsBDsN9";
    this.type = "AssetIssuance";
  }

  public async processTransaction(programId: string, type: string, data: any): Promise<any> {
    if (programId != this.programId || type != this.type )
      return;
    console.log("processTransaction mint-nft handle: ", data)
    await this.evaluationModel.findOneAndUpdate({
      assetMetadata: data.metadata
    }, {
      status: EVALUATION_STATUS.MINTED,
      mintKey: data.assetId,
      assetBasket: data.assetBasket
    })
    return null;
  }


  public async processLog(programId: string, data: any): Promise<any> {
      // console.log({programId, data})
  }
}
