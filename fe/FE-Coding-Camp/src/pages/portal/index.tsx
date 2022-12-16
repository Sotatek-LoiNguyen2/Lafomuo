import { Table, Tabs, Button, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import {
  passedAssetColumns,
  requestAssetColumns,
} from "../../components/PortalEvaluationPage/AssestTable";
import Link from "next/link";
import EvaluationService from "../../service/evaluation.service";
import MainLayout from "../../components/Main-Layout";
import { NextPageWithLayout } from "../_app";
import { AssetType } from "../../types";
import { useRouter } from "next/router";
import { STATUS } from "../../types/asset.type"
const { Title } = Typography;

const PortalPage: NextPageWithLayout = (props: any) => {
  const [requestAssetData, setRequestAssetData] = useState([]);
  const [passedAssetData, setPassedAssetData] = useState([]);
  const router = useRouter();
  const [activeKey, setActiveKey] = useState("request");

  const handleTabClick = (activeKey: string) => {
    setActiveKey(activeKey);
    router.push({
      pathname: "/portal",
      query: { status: activeKey },
    });
  };
  useEffect(() => {
    (async () => {
      const [res]: any = await EvaluationService.getLand({status: [STATUS.PASSED, STATUS.MINTED]});
      const passed = [];
      const request = [];
      for (const item of res) {
        if (item.status.toUpperCase() === "PENDING") request.push(item);
        else passed.push(item);
      }

      setRequestAssetData(request as any);
      setPassedAssetData(passed as any);
    })();

    const { query } = router;
    if (query.status === "request") setActiveKey("request");
    else if (query.status === "passed") setActiveKey("passed");
  }, []);

  const items = [
    {
      label: "Request Asset",
      key: "request",
      children: (
        <>
          {requestAssetData && (
            <Table
              dataSource={requestAssetData}
              columns={requestAssetColumns}
              rowKey="_id"
              pagination={{ pageSize: 6 }}
              onRow={(record: AssetType) => {
                return {
                  onClick: (event) => {
                    router.push(`${router.asPath}/${record?._id}`);
                  },
                };
              }}
            />
          )}
        </>
      ),
    },
    {
      label: "Passed Asset",
      key: "passed",
      children: (
        <Table
          dataSource={passedAssetData}
          columns={passedAssetColumns}
          rowKey="id"
          pagination={{ pageSize: 6 }}
          onRow={(record: AssetType) => {
            return {
              onClick: (event) => {
                router.push(`${router.pathname}/${record?._id}`);
              },
            };
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Portal Evaluation</Title>
      <div>
        <Space style={{ width: "100%" }} direction="vertical" align="end">
          <Link href="/portal/new" passHref>
            <Button type="primary" icon={<PlusOutlined />}>
              Create New Land
            </Button>
          </Link>
        </Space>
      </div>
      <Tabs items={items} activeKey={activeKey} onTabClick={handleTabClick} />
    </div>
  );
};

PortalPage.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default PortalPage;
