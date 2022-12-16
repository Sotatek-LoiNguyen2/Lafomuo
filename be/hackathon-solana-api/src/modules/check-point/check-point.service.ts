import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as anchor from '@project-serum/anchor';
import * as bs58 from 'bs58'
import { Model } from 'mongoose';
import { EVALUATION_STATUS } from 'src/shared/constants';
import { RequestContext } from 'src/shared/request-context/request-context.dto';
import { FileUtils } from 'src/shared/utils/FileUtils';

import { CheckPoint, CheckPointDocument } from '../evaluation/schemas/check-point.schema';
import { Escrow, EscrowDocument } from '../evaluation/schemas/escrow.schema';
import { EvaluationService } from '../evaluation/services/main.service';
import { UserService } from '../user/services/user.service';
import { CreateCheckPointInput } from './dtos/create-check-point-input.dto';

@Injectable()
export class CheckPointService {

  constructor(private readonly configService: ConfigService,
    private readonly evaluationService: EvaluationService,
    private readonly userService: UserService,
    @InjectModel(CheckPoint.name) private checkPointModel: Model<CheckPointDocument>,
    @InjectModel(Escrow.name) private escrowModel: Model<EscrowDocument>,
  ) { }

  async getSignature(ctx: RequestContext, evaluation_id: string, base64_serialized_tx: string): Promise<string> {
    const evaluationInDb = await this.evaluationService.get(ctx, evaluation_id)

    if (!evaluationInDb) {
      throw new HttpException("Evaluation not found", HttpStatus.BAD_REQUEST)
    }

    if (evaluationInDb.status == EVALUATION_STATUS.TOKENIZED) {
      const secretkey = this.configService.get<string>('SECRET_KEY')
      const adminKeyPair = anchor.web3.Keypair.fromSecretKey(
        Uint8Array.from(
          bs58.decode(secretkey)
        )
      )
      const admin = new anchor.Wallet(adminKeyPair)
      const serialized_tx = Buffer.from(base64_serialized_tx, "base64")
      const mint_tx = anchor.web3.Transaction.from(serialized_tx);

      // verify info of serialized_tx
      const ownerID = evaluationInDb.owner.valueOf().toString();

      const ownerInDb = await this.userService.findUserById(ownerID)

      if (!ownerInDb) {
        throw new HttpException("Asset owner not found", HttpStatus.BAD_REQUEST)
      }

      const asset_owner_address = ownerInDb.wallet_address

      let asset_owner_flag = false;
      for (let i = 0; i < mint_tx.signatures.length; i++) {
        console.log(mint_tx.signatures[i].publicKey.toBase58())
        if (mint_tx.signatures[i].publicKey.toBase58() == asset_owner_address) {
          asset_owner_flag = true;
          break;
        }
      }
      if (!asset_owner_flag) {
        throw new HttpException("Mint tx is not belong to asset owner", HttpStatus.BAD_REQUEST)
      }

      mint_tx.partialSign(admin.payer)

      const serialized_tx_2 = mint_tx.serialize({
        requireAllSignatures: false
      });

      return serialized_tx_2.toString("base64")
    } else {
      throw new HttpException("Some thing went wrong", HttpStatus.BAD_REQUEST)
    }
  }

  async createCheckPoint(ctx: RequestContext, input: CreateCheckPointInput): Promise<CheckPoint> {
    const evaluationInDb = await this.evaluationService.get(ctx, input.evaluation_id)

    if (!evaluationInDb) {
      throw new HttpException("Evaluation not found", HttpStatus.BAD_REQUEST)
    }
    const file = await FileUtils.saveFile(input.reportFile, this.configService);
    input.reportFile = file;
    const checkPoint = new this.checkPointModel({ ...input});
    return checkPoint.save();
  }


  async getListCheckPoint(ctx: RequestContext, evaluation_id: string): Promise<CheckPoint[]> {
    return await this.checkPointModel.find({ evaluation_id }).sort({ createdAt: 'desc' })
  }

  async getListEscrow(ctx: RequestContext, locker: string): Promise<Escrow[]> {
    return this.escrowModel.find({
      locker: locker
    })
  }

  async getCheckpointById(ctx: RequestContext, checkpoint_id: string): Promise<any> {
    const checkpoint = await this.checkPointModel.findOne({_id: checkpoint_id})
    const evaluationID = checkpoint.evaluation_id.valueOf().toString();
    const evaluation = await this.evaluationService.get(ctx, evaluationID)
    const fractionalizeTokenMint = evaluation.assetFractionalize.mint
    const result = {checkpoint: checkpoint, fractionalizeTokenMint: fractionalizeTokenMint}
    return result
  }

}
