import { Table, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { ReactElement } from "react";
import { AssetType } from "../../types";
import PropertyInfo from "../../components/common/PropertyInfo";
import { Status } from "../../components/common/AssetStatus";
import { useRouter } from "next/router";
const { Title } = Typography;
import { URL_PROPERTIES } from "../../constants";
import MainLayout from "../../components/Main-Layout";
import { useState } from "react";
import { useEffect } from "react";
import EvaluationService from "../../service/evaluation.service";
import moment from "moment";
import { STATUS } from "../../types/asset.type";

export const requestAssetColumns: ColumnsType<AssetType> = [
  {
    title: "Property Info",
    dataIndex: "avatar",
    key: "avatar",
    render: (url, dt) => {
      return (
        <PropertyInfo imageUrl={`${dt?.avatar?.host}${dt?.avatar?.url}`} />
      );
    },
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    ellipsis: true,
  },
  {
    title: "Total Supply",
    dataIndex: "tokenSupply",
    key: "tokenSupply",
    render: (number) => (number ? number.toLocaleString("en") : "N/A"),
  },
  {
    title: "Token Price",
    dataIndex: "tokenPrice",
    key: "tokenPrice",
    render: (price) => (price ? `$${price}` : "N/A"),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => <Status status={text} />,
  },
  {
    title: "Listing Date",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (value) => moment(value).format("DD/MM/YYYY"),
  },
];

const PorpertiesPage = () => {
  const [requestAssetData, setRequestAssetData] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const [res]: any = await EvaluationService.getAllLand({
        status: [STATUS.TOKENIZED],
      });
      setRequestAssetData(res);
    };

    fetchData();
  }, []);

  return (
    <div>
      <Title level={2}>Porfolio</Title>
      <Table
        className="properties__table"
        dataSource={requestAssetData}
        columns={requestAssetColumns}
        rowKey="_id"
        pagination={{ pageSize: 6 }}
        onRow={(record: AssetType, rowIndex) => {
          return {
            onClick: (event) => {
              router.push(`${URL_PROPERTIES}/${record?._id}`);
            },
          };
        }}
      />
    </div>
  );
};

PorpertiesPage.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default PorpertiesPage;
