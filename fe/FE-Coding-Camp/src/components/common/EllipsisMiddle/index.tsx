import React from "react";
import { Typography } from "antd";

const { Text } = Typography;

const EllipsisMiddle: React.FC<any> = ({ suffixCount, children, ...props }) => {
  if (!children) return <></>;
  const start = children.slice(0, children.length - suffixCount).trim();
  const suffix = children.slice(-suffixCount).trim();
  return (
    <Text
      style={{ maxWidth: "100%" }}
      ellipsis={{ suffix }}
      {...props}
      className="link-text"
    >
      {start}
    </Text>
  );
};

export default EllipsisMiddle;
