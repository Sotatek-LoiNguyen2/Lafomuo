import { Button, Table, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import moment from "moment";
import { DATE_TIME_FORMAT } from "../../constants";
import { getUrl } from "../../utils/utility";
import AddressLink from "../common/AddressLink";

interface IProps {
  data: any;
  loading: boolean;
  propertyId: string;
}

const { Text } = Typography;

const CheckpointTable: React.FC<IProps> = ({ data, loading, propertyId }) => {
  const router = useRouter();

  const columns = useMemo(
    () => [
      {
        title: "Id",
        dataIndex: "checkpointId",
        key: "checkpointId",
        width: "10%",
        render: (checkpointId: number) =>
          checkpointId ? `#${checkpointId}` : "Pending...",
      },
      {
        title: "Checkpoint Hash",
        dataIndex: "checkpoint_hash",
        ellipsis: true,
        key: "checkpoint_hash",
        render: (checkpoint_hash: number) =>
          checkpoint_hash ? (
            <AddressLink tx={true} suffixCount={6}>
              {checkpoint_hash}
            </AddressLink>
          ) : (
            "Pending..."
          ),
      },
      {
        title: "Quanity",
        dataIndex: "totalDistributionAmount",
        key: "totalDistributionAmount",
        render: (quanity: number, _: any) => {
          return quanity ? `${quanity / 10 ** _.decimals} USDC` : "Pending...";
        },
      },
      {
        title: "Date",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (value: string) => moment(value).format(DATE_TIME_FORMAT),
        sorter: (a: any, b: any) => {
          const firstTime = moment(a.createdAt);
          const secondTime = moment(b.createdAt);
          return firstTime.diff(secondTime);
        },
      },
      {
        title: "Token Address",
        dataIndex: "token_address",
        ellipsis: true,
        key: "token_address",
        render: (token_address) => (
          <AddressLink suffixCount={6}>{token_address}</AddressLink>
        ),
      },
      {
        title: "Report",
        dataIndex: "reportFile",
        key: "reportFile",
        ellipsis: true,
        render: (file: any) => {
          return (
            <>
              <a
                href={getUrl(file)}
                rel="noreferrer"
                target="_blank"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {file?.name}
              </a>
            </>
          );
        },
      },
      {
        title: "Action",
        dataIndex: "details",
        key: "details",
        render: (key, _: any) => {
          return (
            <Button
              onClick={(event) => {
                console.log("data: ", propertyId);
                router.push({
                  pathname: `/checkpoint`,
                  query: {
                    propertyId: propertyId,
                    checkpointId: _._id,
                  },
                });
              }}
            >
              <Text>Details</Text>
            </Button>
          );
        },
      },
    ],
    [propertyId]
  );
  return (
    <Table
      loading={loading}
      dataSource={data}
      columns={columns}
      pagination={{ pageSize: 6 }}
      key="rank"
    />
  );
};

export default CheckpointTable;
