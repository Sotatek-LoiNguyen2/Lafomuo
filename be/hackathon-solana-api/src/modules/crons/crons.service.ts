import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { lastValueFrom, map } from 'rxjs';
import { EVALUATION_STATUS } from 'src/shared/constants';

import { Evaluation, EvaluationDocument } from '../evaluation/schemas/main.schema';

@Injectable()
export class CronsService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Evaluation.name) private evaluationModel: Model<EvaluationDocument>,
  ){}
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async main(): Promise<void> {
    const query = `{
      accounts(types: ["AssetBasket"]) {
        address
        name
        type
        data {
          __typename
          ... on AssetBasket {
            assetMetadata
            assetId
            governor
            owner
            bump,
            iat
          }
        }
        programId
        
      }
    }`;
    const uri = "https://solana-crawler.yangyinhouse.com/";
    const res = await lastValueFrom(this.httpService.post(uri, {
      query: query,
      variables: null
    }).pipe(
      map(res => res.data)
    ))
    if (res.data && res.data.accounts && Array.isArray(res.data.accounts)) {
      for(let index=0; index<res.data.accounts.length; index++) {
        const acc = res.data.accounts[index];
        await this.evaluationModel.findOneAndUpdate({
          assetMetadata: acc.data.assetMetadata
        }, {
          status: EVALUATION_STATUS.MINTED,
          mintKey: acc.data.assetId
        })
      }
    }
  }
}
