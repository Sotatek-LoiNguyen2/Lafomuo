import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { Button, Form, Input, message, Typography } from "antd";
import React, { useEffect, useState } from "react";
import mainProgram from "../../programs/MainProgram";
import { getProvider } from "../../programs/utils";
import checkSignatureStatus, {
  Message,
} from "../../utils/checkSignatureStatus.util";
import TransactionModal from "../common/TransactionModal";
import * as anchor from "@project-serum/anchor";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import Link from "next/link";

const { Text } = Typography;

const LockForm = ({
  fractionalizeTokenMint,
  checkpointDetail,
  onDone,
}: any) => {
  const [form] = Form.useForm();
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useAnchorWallet();
  const [tx, setTx] = useState<any>("");
  const [isShownModalTx, setIsShownModalTx] = useState<boolean>(false);
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState("");
  const [decimals, setDecimals] = useState(0);

  useEffect(() => {
    const initData = async () => {
      if (!publicKey || !fractionalizeTokenMint) {
        return;
      }

      const tokenPublicKey = new anchor.web3.PublicKey(fractionalizeTokenMint);

      const tokenOwner = await getAssociatedTokenAddress(
        tokenPublicKey,
        publicKey
      );

      const tokenOwnerAccount = await connection.getParsedAccountInfo(
        tokenOwner
      );
      if (!tokenOwnerAccount.value) {
        setBalance("0");
        setDecimals(0);
        return;
      }
      let tokenAccountInfo = await connection.getTokenAccountBalance(
        tokenOwner
      );

      console.log({ tokenAccountInfo });

      setBalance(tokenAccountInfo.value.uiAmountString || "");
      setDecimals(tokenAccountInfo.value.decimals);
    };
    initData();
  }, [fractionalizeTokenMint, publicKey]);

  const onFinish = async (values: any) => {
    try {
      const provider = getProvider(wallet);
      if (provider && publicKey) {
        if (!checkpointDetail) return;
        setLoading(true);
        const program = new mainProgram(provider);
        const [txToBase64, err]: any = await program.lockEscrow(
          checkpointDetail.locker,
          fractionalizeTokenMint,
          values.amount * 10 ** decimals
        );
        console.log({ checkpointDetail });
        console.log("err: ", err);
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
      {" "}
      <TransactionModal
        close={() => setIsShownModalTx(false)}
        title="Successfully Lock!"
        tx={tx}
        isShown={isShownModalTx}
      />
      <Form
        form={form}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        onFinish={onFinish}
        autoComplete="off"
        layout="horizontal"
      >
        <Form.Item
          label="Lock Escrow"
          name="amount"
          rules={[{ required: true, message: "This field cannot be empty." }]}
          style={{ marginBottom: 10 }}
        >
          <Input />
        </Form.Item>
        <Text style={{ color: "var(--text-color)" }}>
          {`Available Balance: ${balance}`}
        </Text>
        <br />
        <br />
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
        >
          Lock
        </Button>
      </Form>
    </>
  );
};

export default LockForm;
