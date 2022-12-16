import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import UserService from "../../service/user.service";

const ConnectWalletPage = () => {
  const router = useRouter();
  const { publicKey } = useWallet();
  const { signMessage } = useWallet();
  const verifyWallet = useRef(false);

  const verifyWalletAddress = async (publicKey: PublicKey) => {
    try {
      if (!publicKey) return;
      const base58 = publicKey.toBase58();
      console.log(base58);
      if (!base58 || !signMessage) return;
      var enc = new TextEncoder();
      const signature = await signMessage(enc.encode("solana-coding-camp"));
      await UserService.updateWalletAddress({
        message: Buffer.from(signature).toString("base64"),
        wallet_address: base58,
      });

      Cookies.set("walletAddress", base58);
      router.push("/");
    } catch (error) {
      console.log("Faild to sign message: ", error);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    verifyWallet.current = true;
    if (!publicKey) return;
    e.preventDefault();
    verifyWalletAddress(publicKey);
  };

  useEffect(() => {
    if (!verifyWallet.current || !publicKey) return;
    verifyWalletAddress(publicKey);
  }, [publicKey]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="box">
        <WalletMultiButton onClick={handleClick} />
      </div>
    </div>
  );
};

export default ConnectWalletPage;
