import React from "react";
import { Affix, Button, Col, Divider, Row, Tag, Typography } from "antd";
import AssetInfo from "../AssetInfo";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import ContactInfo from "./ContactInfo";

const { Title, Text } = Typography;
const PendingAsset: React.FC<{ assetInfo: any }> = ({ assetInfo }) => {
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
          <ContactInfo assetInfo={assetInfo}>
            <Text style={{ fontSize: 20, fontWeight: 500 }}>
              Your property is waiting for approval!
            </Text>
          </ContactInfo>
        </ContactInfo>
      </Col>
    </Row>
  );
};

export default PendingAsset;
