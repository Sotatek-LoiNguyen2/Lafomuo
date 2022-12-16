import React, { ReactElement, useEffect, useState } from "react";
import { Typography, Button, Divider, message, Row, Col } from "antd";

const { Title } = Typography;
import { ArrowRightOutlined, CloseOutlined } from "@ant-design/icons";
import Link from "next/link";

import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import EvaluationService from "../../../service/evaluation.service";
import { getProvider } from "../../../programs/utils";
import mainProgram from "../../../programs/MainProgram";
import { Transaction } from "@solana/web3.js";
import MainLayout from "../../../components/Main-Layout";
import { NextPageWithLayout } from "../../_app";
import { useRouter } from "next/router";
import AssetInfo from "../../../components/PortalEvaluationPage/AssetInfo";
import { useSelector } from "react-redux";
import { selectWallet } from "../../../store/wallet/wallet.slice";
import MintedTransactionModal from "../../../components/PortalEvaluationPage/MintedTransactionModal";
import checkSignatureStatus, {
  Message,
} from "../../../utils/checkSignatureStatus.util";

const { Text } = Typography;
let flagInterval: NodeJS.Timeout;

const MintNftPage: NextPageWithLayout = (props: any) => {
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useAnchorWallet();
  const [loading, setLoading] = useState(false);
  const [assetInfo, setAssetInfo] = useState<any>(null);
  const router = useRouter();
  const { walletAddress } = useSelector(selectWallet);

  const [tx, setTx] = useState<any>("");
  const [mintKey, setMintKey] = useState<string>("");
  const [isShownModalTx, setIsShownModalTx] = useState<boolean>(false);
  const id = router?.query?.id;
  const [messageApi, contextHolder] = message.useMessage();
  const error = () => {
    messageApi.open({
      type: "error",
      content: (
        <Text>
          Please connect with <Text strong>{walletAddress}</Text> to continue
        </Text>
      ),
    });
  };

  useEffect(() => {
    (async () => {
      if (id) {
        const [res]: any = await EvaluationService.getDetail(id);
        if (!res?.error) {
          console.log("res: ", res);
          setAssetInfo(res);
        } else {
          message.error(res?.error?.message);
        }
      }
    })();
    return () => {
      clearInterval(flagInterval);
    };
  }, [id]);

  const mint = async () => {
    try {
      setLoading(true);
      const provider = getProvider(wallet);
      if (provider && publicKey) {
        const program = new mainProgram(provider);
        const [txToBase64, err, metadataAddress, mintKey]: any =
          await program.mintNft(
            assetInfo?.assetUrl,
            assetInfo?.bigGuardian,
            assetInfo?.name
          );
        setMintKey(mintKey.publicKey.toBase58());
        if (!err) {
          const [resUMetaDt]: any = await EvaluationService.updateAssetMetadata(
            assetInfo?._id,
            {
              assetMetadata: metadataAddress,
              mintKey: mintKey.publicKey.toBase58(),
            }
          );
          console.log("resUMetaDt", resUMetaDt);
          const [res]: any = await EvaluationService.mintNft(txToBase64, id);
          const tx = await sendTransaction(
            Transaction.from(Buffer.from(res, "base64")),
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
        setLoading(false);
        error();
      }
    } catch (err: any) {
      setLoading(false);
      console.log({ err });
    }
  };

  return (
    <>
      {contextHolder}
      <MintedTransactionModal
        close={() => {
          setIsShownModalTx(false);
          router.back();
        }}
        tx={tx}
        mintKey={mintKey}
        isShown={isShownModalTx}
      >
        <Link href={`/portal/${assetInfo?._id}/frac`}>
          <Button block type="primary">
            <ArrowRightOutlined /> Tokenize nft
          </Button>
        </Link>
      </MintedTransactionModal>

      {/* <Button onClick={warning}>Warning</Button> */}
      <Row className="justify-center">
        <Col xxl={12} md={20} xs={24}>
          <div className="box">
            <Title level={2} style={{ textAlign: "center" }}>
              Mint NFT
            </Title>
            <CloseOutlined
              style={{
                fontSize: 20,
                cursor: "pointer",
                position: "absolute",
                top: 30,
                right: 30,
              }}
              onClick={() => router.back()}
            />
            <br />
            <br />

            <AssetInfo assetInfo={assetInfo} />

            <Divider orientation="center" orientationMargin="0"></Divider>

            <div className="flex justify-center">
              <Button type="primary" onClick={mint} loading={loading}>
                Mint NFT
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default MintNftPage;

MintNftPage.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};
