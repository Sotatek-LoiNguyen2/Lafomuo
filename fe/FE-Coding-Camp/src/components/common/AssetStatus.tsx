import { Tag } from "antd";
interface StatusProps {
  status: string;
}

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
