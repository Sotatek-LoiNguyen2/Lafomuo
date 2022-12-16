import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { Button, message } from "antd";
import React, { useState } from "react";
import mainProgram from "../../programs/MainProgram";
import { getProvider } from "../../programs/utils";
import checkSignatureStatus, {
  Message,
} from "../../utils/checkSignatureStatus.util";
import TransactionModal from "../common/TransactionModal";

const ExitEscrow = ({
  checkpointDetail,
  onDone,
  fractionalizeTokenMint,
}: any) => {
  const [loading, setLoading] = useState(false);
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useAnchorWallet();
  const [tx, setTx] = useState<any>("");
  const [isShownModalTx, setIsShownModalTx] = useState<boolean>(false);

  const handleExitEscrow = async () => {
    try {
      const provider = getProvider(wallet);

      if (provider && publicKey) {
        console.log("checkpoint detail: ", checkpointDetail);
        if (!checkpointDetail) return;
        console.log("exit escrow");

        setLoading(true);
        const program = new mainProgram(provider);
        const { locker, escrow } = checkpointDetail;
        const [txToBase64, err]: any = await program.exitEscrow(
          locker,
          fractionalizeTokenMint
        );

        if (!err) {
          console.log({ txToBase64 });

          const tx = await sendTransaction(
            Transaction.from(Buffer.from(txToBase64, "base64")),
            program._provider.connection,
            {
              skipPreflight: true,
              maxRetries: 5,
            }
          );

          setTx(tx);

          const result: Message = await checkSignatureStatus(tx, provider);
          if (result === Message.SUCCESS) {
            setIsShownModalTx(true);
            onDone();
          } else {
            message.error(
              result === Message.PROVIDER_ERROR
                ? "Please connect your wallet"
                : result === Message.EXPIRED_ERROR
                ? "Your transaction is expired"
                : "Time out for transaction"
            );
          }
        }
        setLoading(false);
      } else {
        message.error("Please connect your wallet");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <TransactionModal
        close={() => setIsShownModalTx(false)}
        title="Successfuly Exit Escrow!"
        tx={tx}
        isShown={isShownModalTx}
      />
      <Button
        type="primary"
        size="large"
        block
        loading={loading}
        onClick={handleExitEscrow}
      >
        Exit Escrow
      </Button>
    </>
  );
};

export default ExitEscrow;
