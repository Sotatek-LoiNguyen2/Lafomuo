import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Evaluation, EvaluationDocument } from 'src/modules/evaluation/schemas/main.schema';
import { EVALUATION_STATUS } from 'src/shared/constants';

import { BaseHandle } from './base.handle';

export class FractionalizeHandle extends BaseHandle {
  constructor(
    @InjectModel(Evaluation.name) private evaluationSchema: Model<EvaluationDocument>,
  ) {
    super();
    this.programId = "7RLLimHKvGkFGZSiVipaBDYGZNKGCve9twDHfdsBDsN9";
    this.type = "AssetFractionalize";
  }

  public async processTransaction(programId: string, type: string, data: any): Promise<any> {
    if (programId != this.programId || type != this.type )
      return;
    console.log("processTransaction Fractionalize handle: ", data)
    await this.evaluationSchema.findOneAndUpdate({
      assetBasket: data.assetBasket
    }, {
      assetFractionalize: {
        ...data,
      },
      status: EVALUATION_STATUS.TOKENIZED
    }, {
      upsert: true
    })
    return null;
  }


  public async processLog(programId: string, data: any): Promise<any> {
      // console.log({programId, data})
  }
}
