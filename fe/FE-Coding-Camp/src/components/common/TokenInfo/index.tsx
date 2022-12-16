import { Avatar, Divider } from "antd";
import React from "react";
import style from "./TokenInfo.module.scss";

const TokenInfo = () => {
  return (
    <div className={style.tokenInfoContainer}>
      <Avatar className="logo" src="https://joeschmoe.io/api/v1/random" />
      <p className="token--name">Token Name: ABC</p>
      <p className="address">Address: 79 Cau Giay, T.P HN</p>
      <p className="address">ID: 123</p>
    </div>
  );
};

export default TokenInfo;
