import { Typography, Button, Card, Form, Input, notification } from "antd";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import UserService from "../../service/user.service";

const { Text, Title } = Typography;
type NotificationType = "success" | "error";
const SignUp = () => {
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

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
  const router = useRouter();

  const onFinish = async (formData: any) => {
    setLoading(true);
    const { email, password } = formData;
    const [response] = await UserService.signUp({ email, password });

    if (response?.error?.statusCode) {
      openNotification("error", "Fail to sign up", response.error.message);
      setLoading(false);
      return;
    }

    openNotification(
      "success",
      "Congratulations!",
      "Your registration has been successfully"
    );
    setLoading(false);
    router.push("/login").then();
  };

  return (
    <div style={{ height: "100vh", padding: "150px" }}>
      {contextHolder}
      <Card style={{ width: 400, margin: "auto" }}>
        <Title level={2} style={{ marginBottom: "30px" }}>
          Sign up
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
              { required: true, message: "Please input your username!" },
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
          <Form.Item
            label="Confirm Password"
            name="confirm-password"
            rules={[
              {
                required: true,
                message: "Please input your confirm password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading}
              size="large"
              type="primary"
              htmlType="submit"
              style={{ width: "100%", marginTop: "10px" }}
            >
              Sign up
            </Button>
          </Form.Item>
          <Text>
            Already have an account? <Link href="/login"> Sign in</Link>
          </Text>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;
