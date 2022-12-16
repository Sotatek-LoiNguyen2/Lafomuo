import {
  Button,
  Row,
  Col,
  Form,
  Input,
  Typography,
  Table,
  Popover,
} from "antd";
import React, { ReactElement } from "react";
import style from "../../components/BuyOutPage/BuyOutPage.module.scss";
import MainLayout from "../../components/Main-Layout";
import { NextPageWithLayout } from "../_app";
import TokenInfo from "../../components/common/TokenInfo";
import Title from "antd/lib/typography/Title";
import { MoreOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";

const { Text } = Typography;

interface DataType {
  key: string;
  rank: string;
  walletAddress: string;
  quantity: number;
  percentage: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
    render: (text) => <a>#{text}</a>,
  },
  {
    title: "Wallet Address",
    dataIndex: "walletAddress",
    key: "walletAddress",
  },
  {
    title: "Quanity",
    dataIndex: "quanity",
    key: "quanity",
    render: (text) => <a>{text} ABC</a>,
  },
  {
    title: "Percentage",
    key: "percentage",
    dataIndex: "percentage",
    render: (text) => <a>{text}%</a>,
  },
];

const data: DataType[] = [
  {
    key: "1",
    rank: "1",
    walletAddress: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    quantity: 5000000,
    percentage: 50,
  },
  {
    key: "2",
    rank: "2",
    walletAddress: "1A1zP1eP5QGefi2DMPTfTL5dufJv7DivfNa",
    quantity: 2000000,
    percentage: 20,
  },
  {
    key: "3",
    rank: "3",
    walletAddress: "1A1zP1eP5QGefidfbdjMPTfTL5SLmv7DivfNa",
    quantity: 1000000,
    percentage: 10,
  },
];

const content = (
  <div>
    <div style={{ cursor: "pointer" }}>Asset detail</div>
  </div>
);

const BuyOutPage: NextPageWithLayout = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <Row gutter={[20, 0]}>
        <Col span={10}>
          <div
            className="box"
            style={{ position: "relative", background: "white" }}
          >
            <Popover placement="rightTop" content={content} trigger="click">
              <MoreOutlined
                style={{
                  position: "absolute",
                  right: 15,
                  top: 15,
                  fontSize: 20,
                  cursor: "pointer",
                }}
              />
            </Popover>
            <TokenInfo />
            <div className={style.bidAuctionContainer}>
              <Row>
                <Col span={12}>
                  <p className="key">Highest Bid</p>
                  <p className="value">600000 USDT</p>
                </Col>
                <Col span={12}>
                  <p className="key">Auction Ending In</p>
                  <p className="value">2 days 1 hours 22 minutes</p>
                </Col>
              </Row>
            </div>

            <Form
              form={form}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="horizontal"
            >
              <Form.Item
                label="Your Bid Amount"
                name="amount"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
              >
                <Input />
              </Form.Item>
              <p className="available--balance">
                Available Balance: 97,420,234.49 USDC
              </p>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Place Bid
              </Button>
            </Form>
          </div>
        </Col>
        <Col span={14}>
          <div className={`${style.buyOutInfoContainer} box`}>
            <Row>
              <Col span={8}>
                <p className="key">Listing date</p>
                <p className="value">12/12/2022</p>
              </Col>
              <Col span={8}>
                <p className="key">AVG Monthly Reward</p>
                <p className="value">$10000</p>
              </Col>
              <Col span={8}>
                <p className="key">Total Investors</p>
                <p className="value">12</p>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <p className="key">Asset Value</p>
                <p className="value">$ 500000</p>
              </Col>
              <Col span={8}>
                <p className="key">Total Fractions</p>
                <p className="value">10000000 ABC</p>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <p className="key">Remain Fractions</p>
                <p className="value">10000000 ABC</p>
              </Col>
              <Col span={8}>
                <p className="key">Unique Owner</p>
                <p className="value">3</p>
              </Col>
            </Row>
          </div>

          <div className="box" style={{ marginTop: 20 }}>
            <Title level={4}>Activity</Title>
            <div className={style.activityContainer}>
              <Row className="row">
                <Col span={6}>12/12/2022</Col>
                <Col span={6}>Created</Col>
                <Col span={6}>Quan</Col>
                <Col span={6}>65000 USDT</Col>
              </Row>
              <Row className="row">
                <Col span={6}>12/12/2022</Col>
                <Col span={6}>Created</Col>
                <Col span={6}>Quan</Col>
                <Col span={6}>65000 USDT</Col>
              </Row>
              <Row className="row">
                <Col span={6}>12/12/2022</Col>
                <Col span={6}>Created</Col>
                <Col span={6}>Quan</Col>
                <Col span={6}>65000 USDT</Col>
              </Row>
              <Row className="row">
                <Col span={6}>12/12/2022</Col>
                <Col span={6}>Created</Col>
                <Col span={6}>Quan</Col>
                <Col span={6}>65000 USDT</Col>
              </Row>
              <Row className="row">
                <Col span={6}>12/12/2022</Col>
                <Col span={6}>Created</Col>
                <Col span={6}>Quan</Col>
                <Col span={6}>65000 USDT</Col>
              </Row>
              <Row className="row">
                <Col span={6}>12/12/2022</Col>
                <Col span={6}>Created</Col>
                <Col span={6}>Quan</Col>
                <Col span={6}>65000 USDT</Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      <div style={{ marginTop: 30 }}>
        <Title level={4}>Top Vault Owners</Title>
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
};

export default BuyOutPage;

BuyOutPage.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};
