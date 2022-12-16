import React, { FC } from "react";
import { Avatar } from "antd";

interface IProps {
  imageUrl: string;
}

const PropertyInfo: FC<IProps> = ({ imageUrl }) => {
  return (
    <Avatar shape="square" src={imageUrl} style={{ width: 64, height: 50 }} />
  );
};

export default PropertyInfo;