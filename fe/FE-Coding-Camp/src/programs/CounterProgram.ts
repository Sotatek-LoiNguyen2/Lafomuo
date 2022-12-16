import { BaseInterface } from "./interfaces";
import { getCounterIdl } from "./utils/getIdls";
import { web3, BN, AnchorProvider } from "@project-serum/anchor";

export default class CounterProgram extends BaseInterface {
  _counter: web3.Keypair;
  constructor(provider: AnchorProvider) {
    super(provider, getCounterIdl().metadata.address, getCounterIdl());
    this._counter = web3.Keypair.generate();
  }

  async setupCounter() {
    this._counter = web3.Keypair.generate();
    try {
      const res = await this._program.methods
        .setupCounter()
        .accounts({
          authority: this._provider.wallet.publicKey,
          counter: this._counter.publicKey,
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([this._counter])
        .rpc();
      return [this._counter, null]
    } catch (err) {
      return [null, err]
    }
  }

  async increment(val: number, counter: any) {
    try {
      if (counter) {
        // console.log(counter?.publicKey.toBase58(), await program.account.counter.fetch(counter?.publicKey))

        const res = await this._program.methods
          .increment(new BN(val))
          .accounts({
            authority: this._provider.wallet.publicKey,
            counter: counter.publicKey,
            systemProgram: web3.SystemProgram.programId,
            rent: web3.SYSVAR_RENT_PUBKEY,
          })
          .signers([])
          .rpc();
          return [res, null]
      }
    } catch (err) {
      return [null, err]
    }
  }
}
