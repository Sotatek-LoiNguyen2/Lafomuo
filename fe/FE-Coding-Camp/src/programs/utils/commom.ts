import {AnchorWallet} from "@solana/wallet-adapter-react";
import {AnchorProvider} from "@project-serum/anchor";
import {clusterApiUrl, Connection} from "@solana/web3.js";
import {network} from "../../constants"

export const getProvider = (wallet: AnchorWallet | undefined): AnchorProvider | undefined => {
  if (!wallet) {
    return;
  }
  const connection = new Connection(clusterApiUrl(network), "confirmed");
  return new AnchorProvider(connection, wallet, {
    // preflightCommitment: "",
  });
};
