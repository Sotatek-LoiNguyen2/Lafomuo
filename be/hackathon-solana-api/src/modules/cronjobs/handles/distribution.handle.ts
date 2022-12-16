import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CheckPoint, CheckPointDocument } from 'src/modules/evaluation/schemas/check-point.schema';
import { Distribution, DistributionDocument } from 'src/modules/evaluation/schemas/distribution.schema';
import * as anchor from '@project-serum/anchor';

import { BaseHandle } from './base.handle';

export class DistributionHandle extends BaseHandle {
  constructor(
    @InjectModel(Distribution.name) private distributionSchema: Model<DistributionDocument>,
    @InjectModel(CheckPoint.name) private checkPointSchema: Model<CheckPointDocument>,
  ) {
    super();
    this.programId = "7RLLimHKvGkFGZSiVipaBDYGZNKGCve9twDHfdsBDsN9";
    this.type = "DistributionCreated";
  }

  public async processTransaction(programId: string, type: string, data: any): Promise<any> {
    if (programId != this.programId || type != this.type )
      return;
    console.log("processTransaction DistributionCreated handle: ", data)
    await this.distributionSchema.findOneAndUpdate({
      locker: data.locker
    }, {
      ...data
    }, {
      upsert: true
    })
    const checkpoint = await this.checkPointSchema.findOne({dividend_distributor: data.distributor})
    const token_address = checkpoint.token_address
    
    const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl("devnet"), "confirmed");
    const tokenInfo = await connection.getParsedAccountInfo(new anchor.web3.PublicKey(token_address))
    const token_data: any = tokenInfo.value?.data
    const decimal = token_data?.parsed.info.decimals;
    
    await this.checkPointSchema.findOneAndUpdate({
      dividend_distributor: data.distributor
    }, {
      ...data,
      dividend_distributor: data.distributor,
      checkpoint_hash: data.checkpoint_hash,
      decimal: decimal
    })
    

    return null;
  }

}
