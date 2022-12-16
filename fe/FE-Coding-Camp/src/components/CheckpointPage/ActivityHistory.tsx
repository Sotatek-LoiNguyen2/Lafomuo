import { Table } from "antd";
import moment from "moment";
import React, { useMemo } from "react";
import { DATE_TIME_FORMAT } from "../../constants";
import AddressLink from "../common/AddressLink";
import EllipsisMiddle from "../common/EllipsisMiddle";

const ActivityHistory = ({ data, tokenSymbolLock }: any) => {
  const columns = useMemo(
    () => [
      {
        title: "Transaction Hash",
        dataIndex: "tx_hash",
        key: "tx_hash",
        ellipsis: true,
        render: (tx_hash: string) => (
          <AddressLink tx={true} suffixCount={6}>
            {tx_hash}
          </AddressLink>
        ),
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        render: (type: string) => type,
      },

      {
        title: "User Addrress",
        dataIndex: "escrowOwner",
        key: "escrowOwner",
        render: (address: number) => (
          <EllipsisMiddle suffixCount={6}>{address}</EllipsisMiddle>
        ),
        ellipsis: true,
      },
      {
        title: "Quanity",
        dataIndex: "amount",
        key: "amount",
        render: (amount: number, _: any) => {
          const { type } = _;
          return type === "LOCK"
            ? `${(amount / 10 ** 8).toLocaleString("en")} ${tokenSymbolLock}`
            : type === "DIVIDEND_CLAIMED"
            ? `${_.totalClaimed.toLocaleString("en")} USDT`
            : type === "CREATE_ESCROW"
            ? ""
            : `${(_.releasedAmount / 10 ** 8).toLocaleString(
                "en"
              )} ${tokenSymbolLock}`;
        },
      },
      {
        title: "Date",
        dataIndex: "blockTime",
        key: "blockTime",
        render: (date: any) =>
          `${moment(date * 1000).format(DATE_TIME_FORMAT)}`,
      },
    ],
    [tokenSymbolLock]
  );

  return (
    <Table
      dataSource={data}
      columns={columns}
      pagination={{ pageSize: 6 }}
      key="rank"
    />
  );
};

export default ActivityHistory;
