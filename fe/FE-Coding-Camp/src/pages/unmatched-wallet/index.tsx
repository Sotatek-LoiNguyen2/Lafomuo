import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Typography } from "antd";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectWallet } from "../../store/wallet/wallet.slice";

const { Text } = Typography;

const VerifyWalletPage = () => {
  const { walletAddress } = useSelector(selectWallet);
  const { publicKey } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (publicKey?.toBase58() === walletAddress) router.push("/");
  }, [publicKey]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {publicKey && (
        <Text style={{ fontSize: 18 }}>
          <Text strong style={{ fontSize: 14, marginTop: 5 }}>
            {publicKey.toBase58()}
          </Text>{" "}
          is active now
        </Text>
      )}

      <Text style={{ fontSize: 18 }}>
        Please connect to{" "}
        <Text strong style={{ fontSize: 14, marginTop: 5 }}>
          {walletAddress}
        </Text>{" "}
        to continue
      </Text>

      {!publicKey && (
        <div style={{ marginTop: 25 }}>
          <WalletMultiButton />
        </div>
      )}
    </div>
  );
};

export default VerifyWalletPage;
