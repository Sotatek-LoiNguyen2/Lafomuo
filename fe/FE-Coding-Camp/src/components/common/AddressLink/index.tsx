import { Typography } from "antd";
import React from "react";
import EllipsisMiddle from "../EllipsisMiddle";

const { Link } = Typography;

const AddressLink = ({ children, address, tx = false, ...props }: any) => {
  return (
    <Link
      href={`https://solana.fm/${
        tx ? "tx" : "address"
      }/${children}?cluster=devnet-solana`}
      target="_blank"
      rel="noreferrer"
    >
      <EllipsisMiddle {...props}>{children}</EllipsisMiddle>
    </Link>
  );
};

export default AddressLink;
