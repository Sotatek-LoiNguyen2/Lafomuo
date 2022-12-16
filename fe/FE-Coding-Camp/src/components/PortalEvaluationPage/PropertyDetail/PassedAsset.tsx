import React from "react";
import { Button, Col, Divider, Row, Tag, Typography } from "antd";
import AssetInfo from "../AssetInfo";
import ButtonDeleteDetail from "../../common/button/ButtonDeleteDetail";
import ContactInfo from "./ContactInfo";
import moment from "moment";
import { DATE_TIME_FORMAT } from "../../../constants";
import Link from "next/link";

const { Title, Text } = Typography;
const PassedAsset: React.FC<{ assetInfo: any }> = ({ assetInfo }) => {
  return (
    <Row gutter={[20, 0]}>
      <Col span={16}>
        <div className="box">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: 30 }}>
              <Title level={3}>LAND INFO</Title>
              <div>
                <Tag
                  style={{ padding: "5px 10px", fontWeight: 500 }}
                  color="#108ee9"
                >
                  {assetInfo.status}
                </Tag>
              </div>
            </div>
            <ButtonDeleteDetail id={assetInfo?._id} />
          </div>

          <Divider />
          <AssetInfo assetInfo={assetInfo} />
        </div>
      </Col>

      <Col span={8}>
        <ContactInfo assetInfo={assetInfo}>
          <Divider
            orientation="left"
            orientationMargin={0}
            style={{ marginBottom: 0 }}
          >
            <Title style={{ marginBottom: 0 }} level={2}>
              $215,900
            </Title>
          </Divider>
          <Text style={{ color: " var(--text-color)" }}>
            Approved on {moment(assetInfo?.updatedAt).format(DATE_TIME_FORMAT)}
          </Text>
          <Link href={`/portal/${assetInfo._id}/mint`}>
            <Button
              style={{
                backgroundColor: "#87d068",
                color: "white",
                margin: "30px 0px 15px",
              }}
              block
              size="middle"
            >
              MINT NFT
            </Button>
          </Link>
        </ContactInfo>
      </Col>
    </Row>
  );
};

export default PassedAsset;
