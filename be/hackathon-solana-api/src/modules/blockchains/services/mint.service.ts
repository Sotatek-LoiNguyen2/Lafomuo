import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as anchor from '@project-serum/anchor';
import { AnchorProvider, web3 } from '@project-serum/anchor';
const { SystemProgram } = web3;
import { ConfigService } from '@nestjs/config';
import * as bs58 from 'bs58'
import { EvaluationService } from 'src/modules/evaluation/services/main.service'
import { RequestContext } from 'src/shared/request-context/request-context.dto';
import { EVALUATION_STATUS } from 'src/shared/constants';
import { UserService } from 'src/modules/user/services/user.service'

@Injectable()
export class MintService {

  constructor(private readonly configService: ConfigService,
    private readonly evaluationService: EvaluationService,
    private readonly userService: UserService) { }

  async mint(ctx: RequestContext, evaluation_id: string, base64_serialized_tx: string) {

    const evaluationInDb = await this.evaluationService.get(ctx, evaluation_id)

    if (!evaluationInDb) {
      throw new HttpException("Evaluation not found", HttpStatus.BAD_REQUEST)
    }

    if (evaluationInDb.status == EVALUATION_STATUS.PASSED) {
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
    } else if (evaluationInDb.status == EVALUATION_STATUS.MINTED) {
      throw new HttpException("Already minted", HttpStatus.BAD_REQUEST)
    } else {
      throw new HttpException("Not satisfy condition, must be passed", HttpStatus.BAD_REQUEST)
    }
  }

}
