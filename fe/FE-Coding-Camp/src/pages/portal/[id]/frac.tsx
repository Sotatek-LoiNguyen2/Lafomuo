import React, { ReactElement, useEffect, useState } from "react";
import { Typography, Button, Form, Input, message, Row, Col } from "antd";
import { onChangePrice } from "../../../utils/validate.util";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import EvaluationService from "../../../service/evaluation.service";
import { getProvider } from "../../../programs/utils";
import mainProgram from "../../../programs/MainProgram";
import MainLayout from "../../../components/Main-Layout";
import { NextPageWithLayout } from "../../_app";
import { useRouter } from "next/router";
import TransactionModal from "../../../components/common/TransactionModal";
import { Transaction } from "@solana/web3.js";
import AssetInfo from "../../../components/PortalEvaluationPage/AssetInfo";
const { Title } = Typography;
import Link from "next/link";
import { ArrowRightOutlined, CloseOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectWallet } from "../../../store/wallet/wallet.slice";

const { Text } = Typography;
let flagInterval: NodeJS.Timeout;

const MintNftPage: NextPageWithLayout = (props: any) => {
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useAnchorWallet();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [assetInfo, setAssetInfo] = useState<any>(null);
  const router = useRouter();
  const [tx, setTx] = useState<any>("");
  const [isShownModalTx, setIsShownModalTx] = useState<boolean>(false);
  const id = router?.query?.id;
  const [messageApi, contextHolder] = message.useMessage();
  const { walletAddress } = useSelector(selectWallet);

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

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    try {
      const provider = getProvider(wallet);
      if (provider && publicKey) {
        setLoading(true);
        const [res]: any = await EvaluationService.frac(assetInfo?._id, {
          tokenName: values.tokenName,
          tokenSymbol: values.tokenSymbol,
          tokenSupply: values.tokenSupply.replace(/,/g, ""),
        });
        const program = new mainProgram(provider);

        const [txToBase64, err]: any = await program.tokenizeNft(
          assetInfo?.mintKey,
          assetInfo?.assetBasket,
          assetInfo?.bigGuardian,
          values.tokenSupply.replace(/,/g, "").toString()
        )

        if (!err) {
          const [res]: any = await EvaluationService.frac_sign(txToBase64, id);

          const tx = await sendTransaction(
            Transaction.from(Buffer.from(res, "base64")),
            program._provider.connection,
            {
              skipPreflight: true,
              maxRetries: 5,
            }
          );
          console.log(tx);
          console.log("started await");

          flagInterval = setInterval(async () => {
            // const result: any = await program._provider.connection.sendRawTransaction(txToBase64);
            const result: any =
              await program._provider.connection.getSignatureStatus(tx, {
                searchTransactionHistory: true,
              });
            console.log("result value: ", result?.value);
            // confirmationStatus : "confirmed"
            if (result?.value?.confirmationStatus === "confirmed") {
              clearInterval(flagInterval);
              setTx(tx);
              setIsShownModalTx(true);

              setLoading(false);
              // router.push(`/portal/${assetInfo?._id}/tokenize`).then()
            }
          }, 1000);
          setLoading(false);
        }

        setLoading(false);
      } else {
        error();
      }
    } catch (error: any) {
      console.log({ error });
      error?.message && message.error(error?.message);
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {contextHolder}
      <TransactionModal
        close={() => setIsShownModalTx(false)}
        title="Successfully tokenized!"
        tx={tx}
        isShown={isShownModalTx}
      >
        <Link href="/properties">
          <Button block type="primary">
            Go to properties list <ArrowRightOutlined />
          </Button>
        </Link>
      </TransactionModal>

      <div className="box">
        <Row
          className="justify-center"
          style={{ position: "relative", marginBottom: 40 }}
        >
          <Title level={2} style={{ textAlign: "center" }}>
            Tokenize NFT
          </Title>
          <CloseOutlined
            style={{
              fontSize: 20,
              cursor: "pointer",
              position: "absolute",
              top: 10,
              right: 30,
            }}
            onClick={() => router.back()}
          />
          <br />
          <br />
        </Row>

        <Row gutter={25}>
          <Col
            span={16}
            style={{ overflowY: "auto", height: "calc(100vh - 280px)" }}
          >
            <AssetInfo assetInfo={assetInfo} />
          </Col>
          <Col span={8} style={{ padding: "0px 40px" }}>
            <Form
              form={form}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Token Name"
                name="tokenName"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Token Symbol"
                name="tokenSymbol"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Token Supply"
                name="tokenSupply"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
              >
                <Input
                  onChange={async (e: any) => {
                    onChangePrice({
                      val: e.target.value,
                      form,
                      fieldName: "tokenSupply",
                    });
                  }}
                />
              </Form.Item>
              <Button block loading={loading} type="primary" htmlType="submit">
                Tokenize
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default MintNftPage;

MintNftPage.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};
