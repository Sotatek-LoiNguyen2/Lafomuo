import { HttpException, HttpStatus,Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as anchor from '@project-serum/anchor';
import * as bs58 from 'bs58'
import { EvaluationService } from 'src/modules/evaluation/services/main.service'
import { UserService } from 'src/modules/user/services/user.service'
import { EVALUATION_STATUS } from 'src/shared/constants';
import { RequestContext } from 'src/shared/request-context/request-context.dto';

@Injectable()
export class FractionalizeService {

    constructor(private readonly configService: ConfigService,
        private readonly evaluationService: EvaluationService,
        private readonly userService: UserService) { }

    async fractionalize(ctx: RequestContext, evaluation_id: string, base64_serialized_tx: string) {

        const evaluationInDb = await this.evaluationService.get(ctx, evaluation_id)

        if (!evaluationInDb) {
            throw new HttpException("Evaluation not found", HttpStatus.BAD_REQUEST)
        }

        if (evaluationInDb.status == EVALUATION_STATUS.MINTED) {
            const secretkey = this.configService.get<string>('SECRET_KEY')
            const adminKeyPair = anchor.web3.Keypair.fromSecretKey(
                Uint8Array.from(
                    bs58.decode(secretkey)
                )
            )
            const admin = new anchor.Wallet(adminKeyPair)
            const serialized_tx = Buffer.from(base64_serialized_tx, "base64")
            const fractionalize_tx = anchor.web3.Transaction.from(serialized_tx);

            // verify info of serialized_tx
            const ownerID = evaluationInDb.owner.valueOf().toString();

            const ownerInDb = await this.userService.findUserById(ownerID)

            if (!ownerInDb) {
                throw new HttpException("Asset owner not found", HttpStatus.BAD_REQUEST)
            }

            const asset_owner_address = ownerInDb.wallet_address

            let asset_owner_flag = false;
            for (let i = 0; i < fractionalize_tx.signatures.length; i++) {
                console.log(fractionalize_tx.signatures[i].publicKey.toBase58())
                if (fractionalize_tx.signatures[i].publicKey.toBase58() == asset_owner_address) {
                    asset_owner_flag = true;
                    break;
                }
            }
            if (!asset_owner_flag) {
                throw new HttpException("Fractionalize tx is not belong to asset owner", HttpStatus.BAD_REQUEST)
            }

            fractionalize_tx.partialSign(admin.payer)

            const serialized_tx_2 = fractionalize_tx.serialize({
                requireAllSignatures: false
            });

            return serialized_tx_2.toString("base64")
        } else if (evaluationInDb.status == EVALUATION_STATUS.TOKENIZED) {
            throw new HttpException("Already tokenized", HttpStatus.BAD_REQUEST)
        } else {
            throw new HttpException("Not satisfy condition, must be minted", HttpStatus.BAD_REQUEST)
        }

    }
}
