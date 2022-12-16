import * as anchor from '@project-serum/anchor';
import { Model } from 'mongoose';

import { BaseModel } from '../models/base.model';
import { CronjobConfigDocument } from '../schemas/config.schema';
import { SignatureDocument } from '../schemas/signature.schema';
import { TransactionDocument } from '../schemas/transaction.schema';

export class BaseJob {
  public programId = "";
  protected key = `last-signature-${this.programId}`;
  public cronjobConfigModel: Model<CronjobConfigDocument>;
  public signatureModel: Model<SignatureDocument>;
  public transactionModel: Model<TransactionDocument>;
  public connection: anchor.web3.Connection;
  public coder: anchor.BorshEventCoder;
  public parsers: Map<string, BaseModel>;
  public handles: any[];
  public idl: any;

  constructor(
    programId: string,
    connection: anchor.web3.Connection,
    cronjobConfigM: Model<CronjobConfigDocument>,
    signatureM: Model<SignatureDocument>,
    transactionM: Model<TransactionDocument>,
    parsers: any,
    idl: any,
    handles: any[]
  ) {
    this.cronjobConfigModel = cronjobConfigM;
    this.signatureModel = signatureM;
    this.transactionModel = transactionM;
    this.connection = connection;
    this.programId = programId;
    this.parsers = parsers;
    this.handles = handles;
    this.idl = idl;
  }

  public init() {
    this.coder = new anchor.BorshEventCoder(this.idl);
    console.log('inti coder complete');
  }


  public async getLastTransaction(): Promise<string> {

    // let data = await this.cronjobConfigModel.findOne({ key: this.key });
    // if (data?.valueString)
    //   return data.valueString;
    const lastTransactions = await this.connection.getConfirmedSignaturesForAddress2(
      new anchor.web3.PublicKey(this.programId),
      {
        limit: 1
      },
      'confirmed',
    );
    const signature = lastTransactions[0];
    if (!signature?.signature) {
      return null;
    }
    const data = await this.saveConfig(signature);
    return data.valueString;
  }

  public async loadSignatures(self: BaseJob): Promise<void> {
    let before = await self.getLastTransaction();
    console.log("loadSignatures:: runner", before)
    while (true) {
      const lastTransactions = await self.connection.getConfirmedSignaturesForAddress2(
        new anchor.web3.PublicKey(self.programId),
        {
          limit: 5,
          before,
        },
        'confirmed',
      );

      let is_break = false;
      console.log(lastTransactions.length, ' crawled')
      if (lastTransactions.length > 0) {
        before = lastTransactions[lastTransactions.length - 1].signature;
        for (const transaction of lastTransactions) {
          if (!!transaction.err) {
            continue;
          }
          if (await self.signatureModel.exists({ signature: transaction.signature })) {
            is_break = true;
            break;
          }

          await self.saveSignature(transaction);
        }
        if (is_break) {
          break
        }
        continue;
      }
      break;
    }
    setTimeout(self.loadSignatures, 3000, self);
  }

  public async loadTransactionDetails(self: BaseJob): Promise<void> {
    while (true) {
      const signature = await self.signatureModel.findOneAndUpdate({ status: { $nin: [1, 3] }, turn: { $lt: 100 } }, { status: 3 }, { new: true });
      if (!signature) {
        break;
      }
      try {
        const transactionDetails = await self.connection.getParsedTransactions([signature.signature],
          { maxSupportedTransactionVersion: 0 });
        let blockTime;
        if (transactionDetails) {
          blockTime = transactionDetails[0].blockTime
        }
        const logs = transactionDetails.map((txDetail, n) => {
          const logMessages = txDetail.meta.logMessages;
          return logMessages.filter(value => {
            return /^Program data:/.test(value);
          }).map(log => {
            return self.coder.decode(log.split("Program data: ")[1]);
          });
        });

        for (const log of logs) {
          const transactionOfLogs = [];
          for (const tran of log) {
            const transaction = {
              signature,
              type: tran?.name,
              raw: JSON.parse(JSON.stringify(tran?.data)),
              message: undefined as any,
              status: 0,
              turn: 0,
              data: {} as any,
            };

            try {
              const parserClass = self.parsers[transaction.type];
              console.log("parserClass", parserClass)
              const parser = new parserClass();
              if (parser) {
                tran.data.signature = transaction.signature.signature
                tran.data.blockTime = blockTime
                transaction.data = parser.parse(tran?.data);
                console.log("transaction", transaction)
              } else {
                throw { message: `No parse of '${transaction.type}'` }
              }
              transactionOfLogs.push(transaction.data);
              for (const handle of self.handles) {
                console.log(transaction.type)
                await handle.processTransaction(self.programId, transaction.type, transaction.data);
              }
            } catch (err) {
              console.log('parse error: ', err)
              transaction.message = err;
            }
            await self.transactionModel.findOneAndUpdate({ signature, type: transaction.type }, transaction, { upsert: true, new: true });
          }
          for (const handle of self.handles) {
            await handle.processLog(self.programId, transactionOfLogs);
          }
        }
        await self.signatureModel.findByIdAndUpdate(signature._id, { status: 1 });
      } catch (error) {
        await self.signatureModel.findByIdAndUpdate(signature._id, { $set: { message: error }, $inc: { turn: 1 } });
      }
    }
    await self.signatureModel.updateMany({ status: 3 }, { status: 2 });
    setTimeout(self.loadTransactionDetails, 3000, self);
  }

  public async recheckTransaction(self: BaseJob): Promise<void> {
    while (true) {
      console.log("recheckTransaction: run")
      const transaction = await self.transactionModel.findOneAndUpdate({ status: { $nin: [1, 3] }, turn: { $lt: 100 } }, { status: 3 }, { new: true });
      if (!transaction)
        break;
      try {
        const parserClass = self.parsers[transaction.type];
        const parser = new parserClass();
        if (parser) {
          transaction.data = parser.parse(transaction?.raw);
          for (const handle of self.handles) {
            await handle.processTransaction(self.programId, transaction.type, transaction.data);
          }
        } else {
          throw { message: `No parse of '${transaction.type}'` }
        }
      } catch (error) {
        await self.transactionModel.findByIdAndUpdate(transaction._id, { $set: { message: error }, $inc: { turn: 1 } });
      }
    }
    await self.transactionModel.updateMany({ status: 3 }, { status: 2 });
    setTimeout(self.loadTransactionDetails, 3000, self);
  }

  public async saveSignature(data: any): Promise<void> {
    await this.signatureModel.findOneAndUpdate({ signature: data.signature }, {
      signature: data.signature,
      raw: data,
    }, { upsert: true, new: true });
  }

  public async saveConfig(data: any): Promise<any> {
    await this.saveSignature(data);
    return await this.cronjobConfigModel.findOneAndUpdate({ key: this.key }, {
      key: this.key,
      valueString: data?.signature,
    }, { upsert: true, new: true });
  }
}