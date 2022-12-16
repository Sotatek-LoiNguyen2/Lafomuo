import React from "react";
import { Col, Divider, Row, Tag, Typography } from "antd";
import AssetInfo from "../AssetInfo";
import ContactInfo from "./ContactInfo";
import moment from "moment";
import { DATE_TIME_FORMAT } from "../../../constants";

const { Title, Text } = Typography;
const TokenizedAsset: React.FC<{ assetInfo: any }> = ({ assetInfo }) => {
  return (
    <Row gutter={[20, 0]}>
      <Col span={16}>
        <div className="box">
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
        </ContactInfo>
      </Col>
    </Row>
  );
};

export default TokenizedAsset;
