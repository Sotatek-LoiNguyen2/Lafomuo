import React from "react";
import { Button, Modal, Typography } from "antd";
import { CheckOutlined } from "@ant-design/icons";

const { Text, Link } = Typography;

const MintedTransactionModal: React.FC<any> = ({
  isShown,
  tx,
  mintKey,
  close,
  children,
}) => {
  return (
    <Modal width={500} onCancel={close} open={isShown} footer={null}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          margin: "10px 0px 5px",
        }}
      >
        <Button
          style={{
            backgroundColor: "#4affc578",
            borderColor: "#4affc578",
            cursor: "default",
          }}
          shape="circle"
          type="primary"
          size="large"
          icon={<CheckOutlined style={{ fontSize: 20, color: "#00d97e" }} />}
        />

        <Text style={{ fontSize: 16, fontWeight: 500 }}>
          Successfully mint!
        </Text>
      </div>
      <div style={{ textAlign: "center" }}>
        <Text style={{ color: "var(--text-color)", textAlign: "center" }}>
          Congratulations! Your property has been minted as an NFT on the Solana
          blockchain.
        </Text>
      </div>
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 5,
          alignItems: "center",
        }}
      >
        <Link
          href={`https://solana.fm/address/${mintKey}?cluster=devnet-solana`}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: "underline" }}
        >
          View NFT on Solana Explorer.
        </Link>
        <Link
          href={`https://solana.fm/tx/${tx}?cluster=devnet-solana`}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: "underline" }}
        >
          View Transaction on Solana Explorer.
        </Link>
      </div>
      <br />
      {children}
    </Modal>
  );
};

export default MintedTransactionModal;
