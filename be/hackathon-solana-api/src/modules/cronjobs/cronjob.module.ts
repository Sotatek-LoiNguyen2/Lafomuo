import { Module } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as anchor from '@project-serum/anchor';
import { Model } from 'mongoose';

import { SharedModule } from '../../shared/shared.module';
import { BaseHandle } from './handles/base.handle';
import { DividendClaimedHandle } from './handles/claim.handle';
import { DistributionHandle } from './handles/distribution.handle';
import { NewEscrowHandle } from './handles/escrow.handle';
import { ExitEscrowEventHandle } from './handles/exit-escrow-event.handle';
import { FractionalizeHandle } from './handles/fractionalize.handle';
import { LockEventHandle } from './handles/lock-event.handle';
import { MintHandle } from './handles/mint-nft.handle';
import * as solana_real_estate_tokenization from './idls/solana_real_estate_tokenization.json'
import { AssetFractionalize } from './models/AssetFractionlize';
import { AssetIssuance } from './models/AssetIssuance';
import { DistributionCreated } from './models/DistributionCreated';
import { ExitEscrowEvent } from './models/ExitEscrowEvent';
import { LockEvent } from './models/LockEvents';
import { NewEscrowEvent } from './models/NewEscrowEvent';
import { CronjobConfig, CronjobConfigDocument } from './schemas/config.schema';
import { Signature, SignatureDocument } from './schemas/signature.schema';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { BaseJob } from './services/base.job';
import { DividendClaimed } from './models/DividendClaimed'

@Module({
  imports: [
    SharedModule,
  ],
  providers: [BaseHandle, MintHandle, BaseJob, FractionalizeHandle, DistributionHandle, NewEscrowHandle, LockEventHandle, ExitEscrowEventHandle, DividendClaimedHandle],
})
export class CronjobModule {

  constructor(
    @InjectModel(CronjobConfig.name) private cronjobConfigM: Model<CronjobConfigDocument>,
    @InjectModel(Signature.name) private signatureM: Model<SignatureDocument>,
    @InjectModel(Transaction.name) private transactionM: Model<TransactionDocument>,
    private mintHandle: MintHandle,
    private fractionalizeHandle: FractionalizeHandle,
    private distributionHandle: DistributionHandle,
    private escrowNewHandle: NewEscrowHandle,
    private lockEventHandle: LockEventHandle,
    private exitEscrowEventHandle: ExitEscrowEventHandle,
    private dividendClaimedHandle: DividendClaimedHandle
  ) {
    console.log('init cronjob')
    const parsers = {
      'AssetIssuance': AssetIssuance,
      'AssetFractionalize': AssetFractionalize,
      'LockEvent': LockEvent,
      'DistributionCreated': DistributionCreated,
      'NewEscrowEvent': NewEscrowEvent,
      'ExitEscrowEvent': ExitEscrowEvent,
      'DividendClaimed': DividendClaimed
    };
    const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl("devnet"), "confirmed");

    const PROGRAM_ID = "7RLLimHKvGkFGZSiVipaBDYGZNKGCve9twDHfdsBDsN9";
    const job = new BaseJob(
      PROGRAM_ID,
      connection,
      this.cronjobConfigM,
      this.signatureM,
      this.transactionM,
      parsers,
      solana_real_estate_tokenization,
      [
        this.mintHandle,
        this.distributionHandle,
        this.escrowNewHandle,
        this.fractionalizeHandle,
        this.lockEventHandle,
        this.exitEscrowEventHandle,
        this.dividendClaimedHandle
      ]);
    job.init();
    job.loadSignatures(job);
    job.loadTransactionDetails(job);
    job.recheckTransaction(job);
  }
}
