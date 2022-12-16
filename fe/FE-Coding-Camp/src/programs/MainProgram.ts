import { BaseInterface } from "./interfaces";
import { getMainIdl } from "./utils";
import { web3, BN, AnchorProvider } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import {
  GOVERNOR_ADDRESS,
  PROGRAM_ADDRESS,
  SOL_TREASURY_ADDRESS,
  SETTING_ADDRESS,
} from "../constants";
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export default class mainProgram extends BaseInterface {
  _governor = new anchor.web3.PublicKey(GOVERNOR_ADDRESS);
  _sol_treasury = new anchor.web3.PublicKey(SOL_TREASURY_ADDRESS);

  constructor(provider: AnchorProvider) {
    super(provider, PROGRAM_ADDRESS, getMainIdl());
  }

  async getMetadata(mint: any) {
    const [metadataPubkey, _] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    return metadataPubkey;
  }

  async getMasterEdition(mint: any) {
    const [masterEditionPubkey, _] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
          Buffer.from("edition"),
        ],
        TOKEN_METADATA_PROGRAM_ID
      );

    return masterEditionPubkey;
  }

  async getAssetBasket(
    programID: any,
    governor: any,
    asset_owner: any,
    mint: any,
    basket_id: any
  ) {
    const [assetBasketPubkey, _] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("basket"),
          mint.toBuffer(),
          asset_owner.toBuffer(),
          governor.toBuffer(),
          basket_id.toArrayLike(Buffer),
        ],
        programID
      );

    return assetBasketPubkey;
  }

  async getAssetLocker(
    programId: any,
    governor: any,
    total_distribution_checkpoints: any,
    basket_id: any
  ) {
    const [assetLockerPubkey, _] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("locker"),
          governor.toBuffer(),
          total_distribution_checkpoints.toArrayLike(Buffer),
          basket_id.toArrayLike(Buffer),
        ],
        programId
      );

    return assetLockerPubkey;
  }

  async getTokenTreasury(programID: any) {
    const [treasuryPubkey, _] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("spl_token_treasury")],
      programID
    );

    return treasuryPubkey;
  }

  async getCheckpointEscrow(programId: any, locker: any, escrow_owner: any) {
    const [escrowPubkey, _] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("escrow"), locker.toBuffer(), escrow_owner.toBuffer()],
      programId
    );

    return escrowPubkey;
  }

  async tokenizeNft(
    mintKeyDB: any,
    assetBasket: any,
    bigGuardian: string = "8CmfvdfpbJ1atkm8ruqBG5JurgxKqAseYduDWdEiMNpX",
    totalSupply: string
  ) {
    const { publicKey } = this._provider;

    const mintKey = new anchor.web3.PublicKey(mintKeyDB);
    const governorAccount =
      await this._program.provider.connection.getAccountInfo(this._governor);

    const nftTokenAccount = await getAssociatedTokenAddress(
      mintKey,
      publicKey,
      false
    );

    if (!governorAccount) return;

    const fractionalTokenMint = anchor.web3.Keypair.generate();
    const fractionalTokenAccount = await getAssociatedTokenAddress(
      fractionalTokenMint.publicKey,
      publicKey
    );

    const treasuryPDA = await this.getTokenTreasury(this._program.programId);
    const treasuryNFTTokenAccount = await getAssociatedTokenAddress(
      mintKey,
      treasuryPDA,
      true
    );

    const lamports =
      await this._program.provider.connection.getMinimumBalanceForRentExemption(
        MINT_SIZE
      );

    const fractional_nft_tx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: fractionalTokenMint.publicKey,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
        lamports,
      }),
      createInitializeMintInstruction(
        fractionalTokenMint.publicKey,
        8,
        publicKey,
        publicKey,
        TOKEN_PROGRAM_ID
      ),
      createAssociatedTokenAccountInstruction(
        publicKey,
        fractionalTokenAccount,
        publicKey,
        fractionalTokenMint.publicKey
      ),
      createAssociatedTokenAccountInstruction(
        publicKey,
        treasuryNFTTokenAccount,
        treasuryPDA,
        mintKey
      )
    );

    console.log({
      assetBasket: new anchor.web3.PublicKey(assetBasket),
      bigGuardian,
      governor: this._governor,
      mint: fractionalTokenMint.publicKey,
      owner: publicKey,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenAccount: fractionalTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      mintNft: mintKey,
      treasuryNftTokenAccount: treasuryNFTTokenAccount,
      ownerNftTokenAccount: nftTokenAccount,
    });

    const fractionalize_nft_ix = await this._program.methods
      .fractionalizeAsset(new anchor.BN(Number(totalSupply) * 10 ** 8))
      .accounts({
        assetBasket: new anchor.web3.PublicKey(assetBasket),
        bigGuardian,
        governor: this._governor,
        mint: fractionalTokenMint.publicKey,
        owner: publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenAccount: fractionalTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        mintNft: mintKey,
        treasuryNftTokenAccount: treasuryNFTTokenAccount,
        ownerNftTokenAccount: nftTokenAccount,
      })
      .instruction();

    fractional_nft_tx.add(fractionalize_nft_ix);

    // co che confirm transaction tren solana voi ethereum
    const recentBlockhash =
      await this._program.provider.connection.getLatestBlockhash("confirmed");

    console.log("=========== Getting recent blockhash ===========");
    console.log("Recent blockhash: ", recentBlockhash);

    fractional_nft_tx.recentBlockhash = recentBlockhash.blockhash;
    fractional_nft_tx.feePayer = publicKey;

    fractional_nft_tx.partialSign(fractionalTokenMint);

    const serialized_tx = fractional_nft_tx.serialize({
      requireAllSignatures: false,
    });

    const txToBase64 = serialized_tx.toString("base64");
    console.log("Tx: ", txToBase64);
    return [txToBase64, null];
  }

  async mintNft(
    assetUrl: string = "https://basc.s3.amazonaws.com/meta/3506.json",
    bigGuardian: string = "8CmfvdfpbJ1atkm8ruqBG5JurgxKqAseYduDWdEiMNpX",
    NFTName: string = "Bored Apes"
  ) {
    const { publicKey } = this._provider;
    try {
      const mintKey = web3.Keypair.generate();
      const lamports =
        await this._provider.connection.getMinimumBalanceForRentExemption(
          MINT_SIZE
        );
      // const nftTokenAccount = anchor.web3.Keypair.generate();
      const nftTokenAccount = await getAssociatedTokenAddress(
        mintKey.publicKey,
        publicKey,
        false
      );

      const mint_tx = new anchor.web3.Transaction().add(
        anchor.web3.SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKey.publicKey,
          space: MINT_SIZE,
          programId: TOKEN_PROGRAM_ID,
          lamports,
        }),
        createInitializeMintInstruction(
          mintKey.publicKey,
          0,
          publicKey,
          publicKey,
          TOKEN_PROGRAM_ID
        ),
        createAssociatedTokenAccountInstruction(
          publicKey,
          nftTokenAccount,
          publicKey,
          mintKey.publicKey,
          TOKEN_PROGRAM_ID
        )
      );

      const metadataAddress = await this.getMetadata(mintKey.publicKey);
      const masterEdition = await this.getMasterEdition(mintKey.publicKey);
      const governorAccount =
        await this._program.provider.connection.getAccountInfo(this._governor);
      const governorDetails =
        governorAccount &&
        this._program.coder.accounts.decode(
          "PlatformGovernor",
          governorAccount.data
        );

      const assetBasketAddress = await this.getAssetBasket(
        this._program.programId,
        this._governor,
        publicKey,
        mintKey.publicKey,
        governorDetails.totalAssetsMinted
      );

      // first data will be signed by big guardian
      const ix = await this._program.methods
        .issueAsset(assetUrl, NFTName)
        .accounts({
          bigGuardian,
          governor: this._governor,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          systemProgram: anchor.web3.SystemProgram.programId,
          treasury: this._sol_treasury,
          masterEdition,
          metadata: metadataAddress,
          tokenProgram: TOKEN_PROGRAM_ID,
          mint: mintKey.publicKey,
          mintAuthority: publicKey,
          updateAuthority: publicKey,
          tokenAccount: nftTokenAccount,
          owner: publicKey,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          assetBasket: assetBasketAddress,
        })
        .instruction();

      mint_tx.add(ix);

      const recentBlockhash =
        await this._provider.connection.getLatestBlockhash("confirmed");
      console.log("recentBlockhash", recentBlockhash);

      mint_tx.recentBlockhash = recentBlockhash.blockhash;
      mint_tx.feePayer = publicKey;

      mint_tx.partialSign(mintKey);

      const serialized_tx = mint_tx.serialize({
        requireAllSignatures: false,
      });
      console.log("serialized_tx", serialized_tx);

      const txToBase64 = serialized_tx.toString("base64");
      console.log("Tx: ", txToBase64);
      return [txToBase64, null, metadataAddress, mintKey];
    } catch (err) {
      console.log({ err });
      return [null, err, null, null];
    }
  }

  async createDividendCheckpoint(
    depositAmount: number,
    assetBasketAddress: string,
    bigGuardian: string = "8CmfvdfpbJ1atkm8ruqBG5JurgxKqAseYduDWdEiMNpX",
    tokenAddress: string
  ) {
    const { publicKey } = this._provider;
    try {
      const setting = new anchor.web3.PublicKey(SETTING_ADDRESS);

      const treasuryPDA = await this.getTokenTreasury(this._program.programId);

      let paymentToken = new anchor.web3.PublicKey(tokenAddress);

      let dividend_distributor = anchor.web3.Keypair.generate();

      const assetOwnerPaymentAccount = await getAssociatedTokenAddress(
        paymentToken,
        publicKey
      );

      const treasuryPaymentAccount = await getAssociatedTokenAddress(
        paymentToken,
        treasuryPDA,
        true
      );

      // await this._provider.connection.getTokenAccountBalance
      const assetOwnerPaymentAccountInfo =
        await this._provider.connection.getParsedAccountInfo(
          assetOwnerPaymentAccount
        );
      const treasuryPaymentAccountInfo =
        await this._provider.connection.getParsedAccountInfo(
          treasuryPaymentAccount
        );

      const paymentTokenInfo =
        await this._provider.connection.getParsedAccountInfo(paymentToken);

      const data: any = paymentTokenInfo.value?.data;
      const decimal = data?.parsed.info.decimals;
      console.log(
        "init data: ",
        assetOwnerPaymentAccountInfo,
        treasuryPaymentAccountInfo,
        paymentTokenInfo
      );

      const assetBasketAccount = await this._program.account.assetBasket.fetch(
        new anchor.web3.PublicKey(assetBasketAddress)
      );
      console.log(assetBasketAccount);
      const assetLocker = await this.getAssetLocker(
        this._program.programId,
        this._governor,
        assetBasketAccount.totalDistributionCheckpoint,
        assetBasketAccount.basketId
      );

      // let mint_payment_token_tx = new anchor.web3.Transaction();

      const instructions = [];
      if (!assetOwnerPaymentAccountInfo.value) {
        instructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            assetOwnerPaymentAccount,
            publicKey,
            paymentToken
          )
        );
      }

      if (!treasuryPaymentAccountInfo.value) {
        instructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            treasuryPaymentAccount,
            treasuryPDA,
            paymentToken
          )
        );
      }

      let mint_payment_token_tx;
      if (!instructions.length)
        mint_payment_token_tx = new anchor.web3.Transaction();
      else
        mint_payment_token_tx = new anchor.web3.Transaction().add(
          ...instructions
        );

      const create_dividend_ix = await this._program.methods
        .createDividendCheckpoint(new anchor.BN(depositAmount * 10 ** decimal))
        .accounts({
          dividendDistributor: dividend_distributor.publicKey,
          governor: this._governor,
          mint: paymentToken,
          owner: publicKey,
          ownerTokenAccount: assetOwnerPaymentAccount,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          treasuryTokenAccount: treasuryPaymentAccount,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          assetBasket: assetBasketAddress,
          fractionalizeTokenLocker: assetLocker,
          bigGuardian,
          setting: setting,
        })
        .instruction();

      mint_payment_token_tx.add(create_dividend_ix);
      const recentBlockhash =
        await this._program.provider.connection.getLatestBlockhash("confirmed");

      mint_payment_token_tx.recentBlockhash = recentBlockhash.blockhash;
      mint_payment_token_tx.feePayer = publicKey;

      // mint_payment_token_tx.partialSign(paymentToken);
      mint_payment_token_tx.partialSign(dividend_distributor);

      const serialized_tx = mint_payment_token_tx.serialize({
        requireAllSignatures: false,
      });

      const txToBase64 = serialized_tx.toString("base64");
      console.log("Tx: ", txToBase64);
      return [txToBase64, null, dividend_distributor];
    } catch (err) {
      console.log({ err });
      return [null, err, null, null];
    }
  }

  async createEscrow(
    escrowOwner: PublicKey,
    assetLocker: PublicKey,
    governor: PublicKey,
    payer: PublicKey
  ) {
    let escrow = await this.getCheckpointEscrow(
      this._program.programId,
      assetLocker,
      escrowOwner
    );
    const tx = await this._program.methods
      .newEscrow()
      .accounts({
        escrow,
        escrowOwner,
        governor,
        locker: assetLocker,
        payer,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .instruction();

    return { escrow, tx };
  }

  async lock(
    assetLocker: PublicKey,
    fractionalTokenMint: PublicKey,
    escrow: PublicKey,
    escrowOwner: PublicKey,
    amount: number,
    tx?: web3.TransactionInstruction
  ) {
    let assetOwnerTokenAccount = await getAssociatedTokenAddress(
      fractionalTokenMint,
      escrowOwner
    );

    let escrowHodl = await getAssociatedTokenAddress(
      fractionalTokenMint,
      escrow,
      true
    );
    const escrow_account_hodl = new anchor.web3.Transaction();

    if (tx) {
      escrow_account_hodl.add(
        createAssociatedTokenAccountInstruction(
          escrowOwner,
          escrowHodl,
          escrow,
          fractionalTokenMint
        )
      );
      escrow_account_hodl.add(tx);
    }

    const lock_ix = await this._program.methods
      .lock(new anchor.BN(amount))
      .accounts({
        escrow,
        escrowOwner,
        locker: assetLocker,
        escrowTokenHodl: escrowHodl,
        sourceTokens: assetOwnerTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction();

    escrow_account_hodl.add(lock_ix);

    // co che confirm transaction tren solana voi ethereum
    const recentBlockhash = await this._provider.connection.getLatestBlockhash(
      "confirmed"
    );

    console.log("=========== Getting recent blockhash ===========");
    console.log("Recent blockhash: ", recentBlockhash);

    escrow_account_hodl.recentBlockhash = recentBlockhash.blockhash;
    escrow_account_hodl.feePayer = this._provider.publicKey;

    return escrow_account_hodl
      .serialize({
        requireAllSignatures: false,
      })
      .toString("base64");
  }

  async lockEscrow(
    assetLocker: string,
    fractionalTokenMint: string,
    amount: number
  ) {
    try {
      console.log({ assetLocker, fractionalTokenMint });
      const assetLockerPublicKey = new anchor.web3.PublicKey(assetLocker);
      let escrow: any = await this.getCheckpointEscrow(
        this._program.programId,
        assetLockerPublicKey,
        this._provider.publicKey
      );
      const escrowAccount =
        await this._provider.connection.getParsedAccountInfo(escrow);

      if (!escrowAccount.value) {
        const { escrow, tx } = await this.createEscrow(
          this._provider.publicKey,
          assetLockerPublicKey,
          this._governor,
          this._provider.publicKey
        );

        if (!escrow) return [null, "create escrow failed"];
        const escrow_account_hodl = await this.lock(
          assetLockerPublicKey,
          new anchor.web3.PublicKey(fractionalTokenMint),
          escrow,
          this._provider.publicKey,
          amount,
          tx
        );
        return [escrow_account_hodl, null];
      } else {
        const escrow_account_hodl = await this.lock(
          assetLockerPublicKey,
          new anchor.web3.PublicKey(fractionalTokenMint),
          escrow,
          this._provider.publicKey,
          amount
        );
        return [escrow_account_hodl, null];
      }
    } catch (err) {
      return [null, err, null, null];
    }
  }

  async getDividendClaimedDetails(
    programId: anchor.web3.PublicKey,
    dividend_distributor: anchor.web3.PublicKey,
    claimer: anchor.web3.PublicKey
  ): Promise<anchor.web3.PublicKey> {
    const [metadataPubkey, _] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("claim_dividend"),
        dividend_distributor.toBuffer(),
        claimer.toBuffer(),
      ],
      programId
    );

    return metadataPubkey;
  }

  async claimRewards(
    dividendDistributorAddress: string,
    tokenAddress: string,
    assetLocker: string
  ) {
    try {
      const publicKey = this._provider.publicKey;
      const dividendDistributor = new anchor.web3.PublicKey(
        dividendDistributorAddress
      );
      const paymentToken = new anchor.web3.PublicKey(tokenAddress);
      const treasuryPDA = await this.getTokenTreasury(this._program.programId);

      const dividendClaimDetails = await this.getDividendClaimedDetails(
        this._program.programId,
        dividendDistributor,
        publicKey
      );
      const adminPaymentAccount = await getAssociatedTokenAddress(
        paymentToken,
        publicKey
      );

      const assetLockerPublicKey = new anchor.web3.PublicKey(assetLocker);
      const escrow = await this.getCheckpointEscrow(
        this._program.programId,
        assetLockerPublicKey,
        this._provider.publicKey
      );

      const treasuryPaymentAccount = await getAssociatedTokenAddress(
        paymentToken,
        treasuryPDA,
        true
      );

      const assetOwnerPaymentAccount = await getAssociatedTokenAddress(
        paymentToken,
        publicKey
      );

      const treasuryPaymentAccountInfo =
        await this._provider.connection.getParsedAccountInfo(
          treasuryPaymentAccount
        );

      const assetOwnerPaymentAccountInfo =
        await this._provider.connection.getParsedAccountInfo(
          assetOwnerPaymentAccount
        );

      const mint_payment_token_tx = new anchor.web3.Transaction();

      if (!treasuryPaymentAccountInfo.value) {
        mint_payment_token_tx.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            treasuryPaymentAccount,
            treasuryPDA,
            paymentToken
          )
        );
      }

      if (!assetOwnerPaymentAccountInfo.value) {
        mint_payment_token_tx.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            assetOwnerPaymentAccount,
            publicKey,
            paymentToken
          )
        );
      }

      const claim_rewards_ix = await this._program.methods
        .claimDividendByCheckpoint()
        .accounts({
          claimedDividend: dividendClaimDetails,
          claimer: this._provider.publicKey,
          claimerTokenAccount: adminPaymentAccount,
          dividendDistributor: dividendDistributor,
          treasuryTokenAccountAuthority: treasuryPDA,
          treasuryTokenAccount: treasuryPaymentAccount,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          escrow,
          governor: this._governor,
          locker: new anchor.web3.PublicKey(assetLocker),
        })
        .instruction();

      mint_payment_token_tx.add(claim_rewards_ix);

      const recentBlockhash =
        await this._program.provider.connection.getLatestBlockhash("confirmed");

      mint_payment_token_tx.recentBlockhash = recentBlockhash.blockhash;
      mint_payment_token_tx.feePayer = publicKey;

      const serialized_tx = mint_payment_token_tx.serialize({
        requireAllSignatures: false,
      });
      6;

      const txToBase64 = serialized_tx.toString("base64");
      console.log("Tx: ", txToBase64);
      return [txToBase64, null];
    } catch (err) {
      return [null, err, null, null];
    }
  }

  async exitEscrow(
    assetLockerAddress: string,
    fractionalTokenMintAddress: string
  ) {
    try {
      const assetLocker = new anchor.web3.PublicKey(assetLockerAddress);
      const publicKey = this._provider.publicKey;
      const fractionalTokenMint = new anchor.web3.PublicKey(
        fractionalTokenMintAddress
      );

      const escrow = await this.getCheckpointEscrow(
        this._program.programId,
        assetLocker,
        this._provider.publicKey
      );

      const escrowHodl = await getAssociatedTokenAddress(
        fractionalTokenMint,
        escrow,
        true
      );

      const escrowHodlInfo =
        await this._provider.connection.getParsedAccountInfo(escrowHodl);

      console.log({ escrowHodlInfo });

      const destinationTokens = await getAssociatedTokenAddress(
        fractionalTokenMint,
        publicKey
      );
      const destinationTokensInfo =
        await this._provider.connection.getParsedAccountInfo(escrowHodl);

      console.log({ destinationTokensInfo });
      console.log("exit escrow");
      const ix = await this._program.methods
        .exit()
        .accounts({
          locker: assetLocker,
          escrow,
          escrowOwner: publicKey,
          escrowHodl,
          destinationTokens,
          payer: publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction();

      const tx = new anchor.web3.Transaction().add(ix);
      const recentBlockhash =
        await this._program.provider.connection.getLatestBlockhash("confirmed");

      tx.recentBlockhash = recentBlockhash.blockhash;
      tx.feePayer = publicKey;

      const serialized_tx = tx.serialize({
        requireAllSignatures: false,
      });

      const txToBase64 = serialized_tx.toString("base64");
      return [txToBase64, null];
    } catch (err) {
      console.log({ err });
      return [null, err];
    }
  }
}
