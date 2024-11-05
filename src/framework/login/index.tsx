import React from "react";
import styled from "styled-components";
import { Button, Checkbox, Flex, Form, Input } from "antd";

import { login as loginApi, getUser } from "src/apps/admin/api/login";

import images from "src/assets/images";
import useWather from "src/hooks/use-wather";

function Login(props: StyledWrapComponents) {
  const { className } = props;

  const [form] = Form.useForm();

  const [loading] = useWather();

  function login() {
    loading.setTrue();
    form
      .validateFields()
      .then((store) => {
        return loginApi(store);
      })
      .then((res) => {
        window.preload.setLocalToken(res.data.token);
        return getUser();
      })
      .finally(loading.setFalse);
  }

  return (
    <div className={className}>
      <div className="left">
        <img src={images.login} />
        <div className="action">
          <Button onClick={window.preload.quit}>退出应用</Button>
          <Button
            onClick={() => {
              window.preload.loginSuccess();
            }}
          >
            登录成功
          </Button>
        </div>
      </div>
      <div className="right">
        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          style={{ width: 300 }}
        >
          <Form.Item
            name="account"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input type="password" placeholder="请输入密码" />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button
              block
              type="primary"
              onClick={login}
              loading={loading.whether}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default styled(Login)`
  height: 100vh;
  width: 100vw;
  display: flex;

  .left {
    flex: 1;
    height: 100%;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      vertical-align: top;
    }

    .action {
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .right {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
