import React, { useState } from "react";
import { web3 } from "@project-serum/anchor";
import { Button } from "antd";

import { getProvider } from "../programs/utils";
import CounterProgram from "../programs/CounterProgram";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

const MainLayout: React.FC<any> = () => {
  const [counter, setCounter] = useState<web3.Keypair>();
  const wallet = useAnchorWallet();
  const setupCounter = async () => {
    const provider = getProvider(wallet);
    if (!!provider) {
      const counterProgram = new CounterProgram(provider);
      const [res, err]: any = await counterProgram.setupCounter();
      if (err) {
      } else if (res) {
        setCounter(res);
      }
    }
  };

  const incrementCounter = async () => {
    const provider = getProvider(wallet);
    if (!!provider) {
      const counterProgram = new CounterProgram(provider);
      counterProgram.increment(50, counter);
    }
  };

  console.log();

  return (
    <>
      <Button type="primary" onClick={setupCounter}>
        Setup counter
      </Button>
      <p />
      <Button type="primary" onClick={incrementCounter}>
        increment counter
      </Button>
      <p />
    </>
  );
};

export default MainLayout;
