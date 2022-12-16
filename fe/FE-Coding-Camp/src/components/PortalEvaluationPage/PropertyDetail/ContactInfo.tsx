import React from "react";
import { Affix, Col, Divider, Row, Typography } from "antd";
import Link from "next/link";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ContactInfo: React.FC<{ assetInfo: any; children: any }> = ({
  assetInfo,
  children,
}) => {
  return (
    <Affix offsetTop={80}>
      <div className="box">
        {children}
        <Divider
          orientation="left"
          orientationMargin={0}
          style={{ marginTop: 40 }}
        >
          <Text style={{ fontSize: 20 }}>Contact this property</Text>
        </Divider>
        <Row style={{ color: " var(--text-color)" }}>
          <Col span={12}>
            <PhoneOutlined />
            <Text style={{ color: " var(--text-color)" }}>
              {" "}
              {assetInfo?.phone}
            </Text>
          </Col>
          <Col span={12}>
            <MailOutlined />
            <Text style={{ color: " var(--text-color)" }}>
              {" "}
              {assetInfo?.email}
            </Text>
          </Col>
        </Row>
      </div>
    </Affix>
  );
};

export default ContactInfo;
