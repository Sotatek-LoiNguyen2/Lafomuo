import React from "react";
import { useRouter } from "next/router";
import { Typography, Button, Card, Form, Input, notification } from "antd";
import Cookies from "js-cookie";
import Link from "next/link";
import UserService from "../../service/user.service";
import { useWallet } from "@solana/wallet-adapter-react";
import { useDispatch } from "react-redux";
import { updateWalletAddress } from "../../store/wallet/wallet.slice";

const { Text, Title } = Typography;

type NotificationType = "success" | "error";

const Login = () => {
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();
  const { publicKey } = useWallet();
  const dispatch = useDispatch();

  const openNotification = (
    type: NotificationType,
    message: string,
    description: string
  ) => {
    api[type]({
      message,
      description,
    });
  };

  const onFinish = async (formData: any) => {
    const [response] = await UserService.login({
      email: formData.email,
      password: formData.password,
    });

    if (response?.error) {
      openNotification("error", "Fail to sign in", response.error.message);
      return;
    }
    const { accessToken, user } = response.data;
    const { wallet_address } = user;
    // store access token in memory and refresh token in cookies
    Cookies.set("accessToken", accessToken);
    dispatch(updateWalletAddress(wallet_address));

    if (wallet_address === "") return router.push("/connect-wallet");
    if (!publicKey) return router.push("/unmatched-wallet");
    console.log("publicKey: ", publicKey?.toBase58());
    console.log("wallet_address: ", wallet_address);
    if (publicKey?.toBase58() === wallet_address) router.push("/");
    else router.push("/unmatched-wallet");
  };

  return (
    <div style={{ height: "100vh", padding: "150px" }}>
      {contextHolder}
      <Card style={{ width: 400, margin: "auto" }}>
        <Title level={2} style={{ marginBottom: "30px" }}>
          Sign in
        </Title>

        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                pattern: new RegExp(
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                ),
                message: "Invalid email!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              style={{ width: "100%", marginTop: "10px" }}
            >
              Submit
            </Button>
          </Form.Item>
          <Text>
            Need an account? <Link href="/signup"> Sign up</Link>
          </Text>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
