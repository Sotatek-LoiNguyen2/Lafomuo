import { Avatar, Button, Image, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import { ButtonGroupProps, ButtonType } from "antd/lib/button";

interface PropertyInfoProps {
  imageUrl: string;
}
interface StatusProps {
  status: string;
}
interface DetailButtonProps {
  assetId: string;
}

interface ActionProps {
  action: string;
  assetId: string;
}

export const PropertyInfo = ({ imageUrl }: PropertyInfoProps) => {
  return (
    <Avatar shape="square" src={imageUrl} style={{ width: 64, height: 50 }} />
  );
};

export const Status = ({ status }: StatusProps) => {
  let color = "";
  switch (status.toLowerCase()) {
    case "pending":
      color = "default";
      break;
    case "tokenized":
      color = "success";
      break;
    case "passed":
      color = "processing";
      break;
    case "rejected":
      color = "red";
      break;
    default:
      break;
  }
  return (
    <Tag color={color} key={status}>
      {status.toUpperCase()}
    </Tag>
  );
};

export const Action = ({ action, assetId }: ActionProps) => {
  let type: ButtonType = "primary";
  switch (action) {
    case "fractionalize":
      type = "primary";
      break;
    default:
      break;
  }

  const handleClick = () => {
    console.log("redirect to detail page with asset's id: ", assetId);
  };

  return (
    <Button type={type} onClick={handleClick}>
      {action}
    </Button>
  );
};

export const DetailButton = ({ assetId }: DetailButtonProps) => {
  const handleClick = () => {
    console.log("redirect to detail page with asset's id: ", assetId);
  };
  return <Button onClick={handleClick}>Detail</Button>;
};
