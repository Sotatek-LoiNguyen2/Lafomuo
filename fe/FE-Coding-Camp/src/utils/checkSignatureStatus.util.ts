import { getProvider } from "../programs/utils";
import mainProgram from "../programs/MainProgram";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@project-serum/anchor";

export enum Message {
  PROVIDER_ERROR = "provider undefined",
  SUCCESS = "transaction successful",
  EXPIRED_ERROR = "transaction expired",
  TIMEOUT_ERROR = "time out for transaction",
}

const sleep = (ms: any) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const isBlockhashExpired = async (
  initialBlockHeight: any,
  program: mainProgram
) => {
  let currentBlockHeight = await program._provider.connection.getBlockHeight();
  console.log(currentBlockHeight);
  return currentBlockHeight > initialBlockHeight;
};

const checkSignatureStatus = async (tx: string, provider: AnchorProvider) => {
  if (!provider) {
    return Message.PROVIDER_ERROR;
  }

  let message: Message = Message.SUCCESS;
  const program = new mainProgram(provider);
  const statusCheckInterval = 300;
  const timeout = 60000;
  let isBlockhashValid = true;
  const inititalBlock = (
    await program._provider.connection.getSignatureStatus(tx)
  ).context.slot;

  console.log("initial block: ", inititalBlock);

  let done = false;
  setTimeout(() => {
    if (done) {
      return;
    }
    done = true;
    message = Message.TIMEOUT_ERROR;
    console.log("Timed out for txid", tx);
    console.log(
      `${
        isBlockhashValid
          ? "Blockhash not yet expired."
          : "Blockhash has expired."
      }`
    );
  }, timeout);

  while (!done && isBlockhashValid) {
    const confirmation = await program._provider.connection.getSignatureStatus(
      tx
    );
    console.log("confirmation: ", confirmation.context.slot);
    if (
      confirmation.value &&
      (confirmation.value.confirmationStatus === "confirmed" ||
        confirmation.value.confirmationStatus === "finalized")
    ) {
      console.log(
        `Confirmation Status: ${confirmation.value.confirmationStatus}, ${tx}`
      );
      done = true;
      message = Message.SUCCESS;
      //Run any additional code you'd like with your txId (e.g. notify user of succesful transaction)
    } else {
      console.log(
        `Confirmation Status: ${
          confirmation.value?.confirmationStatus || "not yet found."
        }`
      );
    }
    const blockHashExpired = await isBlockhashExpired(inititalBlock, program);
    if (blockHashExpired) message = Message.EXPIRED_ERROR;
    isBlockhashValid = !blockHashExpired;
    await sleep(statusCheckInterval);
  }

  return message;
};
export default checkSignatureStatus;
