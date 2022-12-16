import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { Button, Form, message, Typography } from "antd";
import React, { useState } from "react";
import mainProgram from "../../programs/MainProgram";
import { getProvider } from "../../programs/utils";
import checkSignatureStatus, {
  Message,
} from "../../utils/checkSignatureStatus.util";
import TransactionModal from "../common/TransactionModal";

const { Text } = Typography;

const ClaimForm = ({
  checkpointDetail,
  yourRewards,
  onDone,
  disabled = false,
}: any) => {
  const [form] = Form.useForm();
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useAnchorWallet();
  const [tx, setTx] = useState<any>("");
  const [isShownModalTx, setIsShownModalTx] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const onClaim = async () => {
    try {
      const provider = getProvider(wallet);

      if (provider && publicKey) {
        if (!checkpointDetail) return;

        setLoading(true);
        const program = new mainProgram(provider);
        const { dividend_distributor, token_address, locker } =
          checkpointDetail;
        const [txToBase64, err]: any = await program.claimRewards(
          dividend_distributor,
          token_address,
          locker
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
        title="Successfully Claim!"
        tx={tx}
        isShown={isShownModalTx}
      />
      <Form
        form={form}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        onFinish={onClaim}
        autoComplete="off"
        layout="horizontal"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 15,
          }}
        >
          <Text style={{ fontWeight: 500 }}> Claim your rewards: </Text>
          <Text style={{ fontWeight: 500 }}>
            <Text style={{ fontSize: 18 }}>{yourRewards}</Text> token
          </Text>
        </div>
        <br />
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
          disabled={disabled}
        >
          Claim
        </Button>
      </Form>
    </>
  );
};

export default ClaimForm;
