import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Typography,
  Divider,
  Descriptions,
  message,
  Avatar,
  Tooltip,
} from "antd";
import EvaluationService from "../../service/evaluation.service";
import ActivityHistory from "../../components/CheckpointPage/ActivityHistory";
import MainLayout from "../../components/Main-Layout";
import { getUrl } from "../../utils/utility";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import CheckpointService from "../../service/checkpoint.service";
import { useWallet } from "@solana/wallet-adapter-react";
import moment from "moment";
import { DATE_TIME_FORMAT } from "../../constants";
import ClaimForm from "../../components/CheckpointPage/ClaimForm";
import LockForm from "../../components/CheckpointPage/LockForm";
import ExitEscrow from "../../components/CheckpointPage/ExitEscrow";
import Countdown from "../../components/common/Countdown";

let flagInterval: NodeJS.Timeout;

const { Title, Text } = Typography;

const CheckpointDetail = () => {
  const [assetInfo, setAssetInfo] = useState<any>({});
  const router = useRouter();
  const { propertyId, checkpointId } = router.query;
  const { publicKey } = useWallet();
  const [checkpointDetail, setCheckpointDetail] = useState<any>();
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [yourLock, setYourLock] = useState(0);
  const [lockSupply, setLockSupply] = useState(0);
  const [checkpointExpired, setCheckpointExpired] = useState(false);

  const fetchTranctionHistory = async (checkpointDetail: any) => {
    if (!checkpointDetail) return;
    const { locker, totalDistributionAmount, decimal } =
      checkpointDetail.checkpoint;

    if (!publicKey) return;
    const [transactionHistory, transactionError] =
      await CheckpointService.getTransactionHistory(locker);
    const [lockerData, lockerError] = await CheckpointService.getLocker(
      locker,
      publicKey?.toBase58()
    );

    if (transactionError || lockerError) {
      message.error("Failed to fetch data");
      return;
    }

    const _transactionHistory = transactionHistory.data.map((item: any) => {
      const data = JSON.parse(item.data);
      return {
        ...data,
        type: item.type,
      };
    });

    console.log({ _transactionHistory });
    setTransactionHistory(_transactionHistory);
    setTotalDeposit(totalDistributionAmount / 10 ** decimal);

    if (lockerData.data) {
      setYourLock(lockerData.data?.amount / 10 ** 8);
      setLockSupply(lockerData.data?.lockerSupply / 10 ** 8);
    }
  };

  useEffect(() => {
    (async () => {
      console.log("propertyId: ", propertyId);
      if (!propertyId || !checkpointId) return;

      //fetch property detail
      const [propertyDetail, propertyError]: any =
        await EvaluationService.getDetail(propertyId);
      setAssetInfo(propertyDetail);

      const [checkpointDetail, checkpointError]: any =
        await CheckpointService.getCheckpointDetail(checkpointId);

      if (propertyError || checkpointError) {
        message.error("Failed to fetch data");
        return;
      }

      if (!checkpointDetail || !publicKey) return;

      setCheckpointExpired(depositTimeExpired());

      setCheckpointDetail(checkpointDetail.data);

      fetchTranctionHistory(checkpointDetail.data);
    })();
    return () => {
      clearInterval(flagInterval);
    };
  }, [propertyId, checkpointId]);

  const depositTimeExpired = () => {
    if (!checkpointDetail) return false;
    const checkpointTime = moment(
      checkpointDetail.checkpoint.startDistributionAt * 1000
    );
    const now = moment();
    return checkpointTime.isBefore(now);
  };

  const onDone = () => {
    fetchTranctionHistory(checkpointDetail);
    console.log("reload");
    setTimeout(() => fetchTranctionHistory(checkpointDetail), 15000);
  };

  return (
    <>
      <Button
        type="ghost"
        shape="circle"
        size="large"
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 20 }}
        onClick={() => router.back()}
      />
      <Row gutter={[30, 0]}>
        <Col span={16}>
          <div className="box">
            <Divider orientation="left" orientationMargin={50}>
              <Title level={2}>Active History</Title>
            </Divider>
            <ActivityHistory
              data={transactionHistory}
              tokenSymbolLock={assetInfo?.tokenSymbol}
            />
          </div>
        </Col>
        <Col span={8}>
          <div
            className="box"
            style={{
              padding: "30px 40px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Tooltip title="View Property Details" placement="right">
                <Avatar
                  src={getUrl(assetInfo?.avatar)}
                  size={74}
                  onClick={() => router.push(`/properties/${propertyId}`)}
                />
              </Tooltip>
              <Text style={{ color: "var(--text-color)", marginTop: 10 }}>
                Token name: {assetInfo.tokenName}
              </Text>
              <Text style={{ color: "var(--text-color)", marginTop: 5 }}>
                Address: {assetInfo.address}
              </Text>
            </div>
            <Divider orientation="left" />
            <Row style={{ margin: "30px 0px" }}>
              <Col span={12}>
                <Text strong style={{ fontSize: 15 }}>
                  Total Deposit
                </Text>
                <br />
                <Text
                  style={{ color: "#1890ff", fontSize: 25, fontWeight: 500 }}
                >
                  {totalDeposit} token
                </Text>
              </Col>
              <Col span={12}>
                <Text strong style={{ fontSize: 15 }}>
                  Your Deposit
                </Text>
                <br />
                <Text
                  style={{ color: "#28b373", fontSize: 25, fontWeight: 500 }}
                >
                  {`${yourLock} ${assetInfo?.tokenSymbol}`}
                </Text>
              </Col>
            </Row>
            <Descriptions layout="horizontal" column={1}>
              <Descriptions.Item
                label={
                  <Text style={{ color: "var(--text-color)" }}>
                    Checkpoint ID
                  </Text>
                }
              >
                <Text style={{}}>#{checkpointDetail?.checkpoint?._id}</Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Text style={{ color: "var(--text-color)" }}>
                    {checkpointExpired ? "Checkpoint end at" : "Time remain"}
                  </Text>
                }
              >
                {checkpointExpired ? (
                  <Text>
                    {moment(
                      checkpointDetail?.checkpoint.startDistributionAt * 1000
                    ).format(DATE_TIME_FORMAT)}
                  </Text>
                ) : (
                  checkpointDetail && (
                    <Countdown
                      time={
                        checkpointDetail.checkpoint.startDistributionAt * 1000
                      }
                      onCompleted={() => setCheckpointExpired(true)}
                    />
                  )
                )}
              </Descriptions.Item>
            </Descriptions>
            <br />
            {checkpointExpired ? (
              <ClaimForm
                checkpointDetail={checkpointDetail?.checkpoint}
                yourRewards={(() => {
                  if (lockSupply === 0) return 0;
                  return (yourLock * totalDeposit) / lockSupply;
                })()}
                onDone={onDone}
                disabled={!yourLock}
              />
            ) : (
              <>
                <LockForm
                  checkpointDetail={checkpointDetail?.checkpoint}
                  fractionalizeTokenMint={
                    checkpointDetail?.fractionalizeTokenMint
                  }
                  onDone={onDone}
                />
                <br />
                {yourLock !== 0 && (
                  <ExitEscrow
                    onDone={onDone}
                    checkpointDetail={checkpointDetail?.checkpoint}
                    fractionalizeTokenMint={
                      checkpointDetail?.fractionalizeTokenMint
                    }
                  />
                )}
              </>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default CheckpointDetail;

CheckpointDetail.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};
