import { LockOutlined, MailOutlined } from "@ant-design/icons";
import type { AuthTokenResponsePassword } from "@supabase/supabase-js";
import { Alert, Checkbox, Form, Input } from "antd";
import { useCallback, useState } from "react";
import { useLogin, type LoginPayload } from "@/apis";
import { KlButton, KlTitle } from "@/components";
import type { QueryError } from "@/types";
import { notify } from "@/utils";
import { IS_SANDBOX } from "@/constants";

type LoginRes = AuthTokenResponsePassword["data"];

const REMEMBERED_EMAIL_KEY = "rememberedEmail";

export const LoginForm = () => {
  const [form] = Form.useForm<LoginPayload>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const savedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
  const [isRememberMe, setIsRememberMe] = useState(!!savedEmail);

  const handleLoginSuccess = useCallback(
    (_data: LoginRes, payload: LoginPayload) => {
      if (isRememberMe) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, payload.email);
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }

      form.resetFields();
      setErrorMessage(null);
      notify.success(
        "Logged in successfully",
        "Welcome back to the dashboard.",
      );
    },
    [isRememberMe, form],
  );

  const handleLoginFailed = useCallback((error: QueryError) => {
    setErrorMessage(error.message);
  }, []);

  const { login, isLoggingIn } = useLogin({
    config: {
      onSuccess: handleLoginSuccess,
      onError: handleLoginFailed,
    },
  });

  const handleLogin = useCallback(
    (values: LoginPayload) => login(values),
    [login],
  );

  return (
    <Form
      form={form}
      layout="vertical"
      size="large"
      initialValues={{ email: savedEmail }}
      className="relative w-80 max-w-full"
      onFinish={handleLogin}
    >
      <KlTitle level={2} className="mt-2 text-center">
        Sign In
      </KlTitle>
      <Form.Item
        name="email"
        rules={[{ required: true, message: "Please enter your email" }]}
        className="mb-2!"
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="Email"
          autoFocus={!savedEmail}
          autoComplete="none"
          // autoCapitalize="none"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please enter your password" }]}
        extra={
          <Checkbox
            checked={isRememberMe}
            className="mt-2!"
            onChange={(e) => setIsRememberMe(e.target.checked)}
          >
            Remember me
          </Checkbox>
        }
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
          autoFocus={!!savedEmail}
        />
      </Form.Item>

      {errorMessage && !isLoggingIn && (
        <Form.Item>
          <Alert type="error" showIcon message={errorMessage} />
        </Form.Item>
      )}

      {IS_SANDBOX && (
        <div className="mb-4 grid grid-cols-2 gap-x-2">
          <KlButton
            variant="dashed"
            color="magenta"
            size="middle"
            onClick={() => {
              form.setFieldsValue({
                email: "ywwh5nh85o@ozsaip.com",
                password: "KeyloopSales@9999",
              });
              form.submit();
            }}
          >
            DEV ADMIN LOGIN
          </KlButton>
          <KlButton
            variant="dashed"
            color="magenta"
            size="middle"
            onClick={() => {
              form.setFieldsValue({
                email: "sale1@example.com",
                password: "KeyloopSales@9999",
              });
              form.submit();
            }}
          >
            DEV SALES_1 LOGIN
          </KlButton>
        </div>
      )}

      <Form.Item className="mb-0!">
        <KlButton type="primary" htmlType="submit" block loading={isLoggingIn}>
          Log in
        </KlButton>
      </Form.Item>
    </Form>
  );
};
