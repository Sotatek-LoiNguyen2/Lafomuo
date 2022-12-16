import React from "react";
import { ColumnsType } from "antd/lib/table";
import { Action, DetailButton, PropertyInfo, Status } from "./Column.component";
import Link from "next/link";
import { Button } from "antd";

export enum AssetStatusType {
  PASSED = "PASSED",
  MINTED = "MINTED",
  TOKENIZED = "TOKENIZED",
  PENDING = "PENDING",
}

export const requestAssetColumns: ColumnsType<any> = [
  {
    title: "Logo",
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
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => <Status status={text} />,
  },
];

export const passedAssetColumns: ColumnsType<any> = [
  {
    title: "Logo",
    dataIndex: "avatar",
    key: "avatar",
    render: (url, dt) => {
      return (
        <PropertyInfo imageUrl={`${dt?.avatar?.host}${dt?.avatar?.url}`} />
      );
    },
  },
  {
    title: "NFT Name",
    dataIndex: "nftName",
    key: "nftName",
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
    title: "Action",
    dataIndex: "_id",
    key: "_id",
    render: (_, { _id, status }) => {
      let linkTo = "";
      let buttonContent = "";
      // let ButtonDelete = <Button className="btn--delete">Delete</Button>;
      switch (status) {
        case AssetStatusType.PASSED: {
          linkTo = `/portal/${_id}/mint`;
          buttonContent = "Mint NFT";
          break;
        }
        case AssetStatusType.MINTED: {
          linkTo = `/portal/${_id}/frac`;
          buttonContent = "Tokenize NFT";
          break;
        }
        default: {
          return "";
        }
      }
      return (
        <>
          <Link
            href={linkTo}
            onClick={(e: Event) => {
              e.stopPropagation();
            }}
          >
            <Button type="default">{buttonContent}</Button>
          </Link>
        </>
      );
    },
  },
];
