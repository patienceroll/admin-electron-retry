import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  Button,
  Checkbox,
  Flex,
  Form,
  Input,
  List,
  Modal,
  notification,
} from "antd";

import Icon from "src/framework/component/icon";
import closeSvg from "src/assets/svg/close.svg";

import {
  getUser,
  getUsersMenu,
  login as loginApi,
} from "src/apps/admin/api/login";

import images from "src/assets/images";
import useWather from "src/hooks/use-wather";

function Login(props: StyledWrapComponents) {
  const { className } = props;
  const chooseCompanyPromise = useRef({
    resolve: () => {},
    reject: () => {},
  });

  const [form] = Form.useForm();

  const [loading] = useWather();
  const [open] = useWather();

  const [companyList, setCompanyList] = useState<Company[]>([]);

  function login() {
    loading.setTrue();
    let tempStore: any;
    form
      .validateFields()
      .then((store) => {
        tempStore = store;
        return loginApi(store);
      })
      .then((res) => {
        window.preload.setLocalToken(res.data.token);
        return getUser();
      })
      .then((res) => {
        window.preload.setLocalUser(res.data);
        if (res.data.company_list.length === 0) {
          notification.error({
            message: "温馨提示",
            description: "您暂无入职的公司",
          });
        } else if (res.data.company_list.length > 1) {
          return new Promise<void>((resolve, reject) => {
            chooseCompanyPromise.current = { reject, resolve };
            setCompanyList(res.data.company_list);
            open.setTrue();
          });
        } else {
          window.preload.setLocalCompany(res.data.company_list[0]);
        }
      })
      .then(() => getUsersMenu())
      .then((res) => {
        localStorage.setItem("rememberData", JSON.stringify(tempStore));
        window.preload.setLocalUserMenu(res.data);
        window.preload.loginSuccess();
      })
      .finally(loading.setFalse);
  }

  function onPressEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      login();
    }
  }

  useEffect(() => {
    const rememberData = localStorage.getItem("rememberData");
    if (rememberData) {
      const data = JSON.parse(rememberData);
      if (data.remember) {
        form.setFieldsValue(data);
      }
    }
  }, [form]);
  return (
    <div className={className}>
      <div className="left">
        <img src={images.login} />
      </div>
      <div className="right">
        <Icon className="close" onClick={window.preload.quit} icon={closeSvg} />
        <Form className="form" form={form} name="login" style={{ width: 300 }}>
          <Form.Item
            name="account"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input placeholder="用户名" onKeyDown={onPressEnter} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input
              type="password"
              placeholder="请输入密码"
              onKeyDown={onPressEnter}
            />
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

      <Modal
        open={open.whether}
        title="请选择任职公司"
        closable={false}
        footer={null}
        rootClassName="modal"
        getContainer={() => document.getElementsByClassName(className!)[0] as HTMLElement}
      >
        <List
          itemLayout="horizontal"
          dataSource={companyList}
          renderItem={(item) => {
            return (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    onClick={() => {
                      window.preload.setLocalCompany(item);
                      open.setFalse();
                      chooseCompanyPromise.current.resolve();
                    }}
                  >
                    进入
                  </Button>,
                ]}
              >
                <List.Item.Meta title={item.name} description={item.address} />
              </List.Item>
            );
          }}
        />
      </Modal>
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
    -webkit-app-region: drag;
    cursor: move;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      vertical-align: top;
    }
  }

  .right {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    -webkit-app-region: drag;
    background-color: ${(props) => props.theme.colorBgBase};
  }

  .form {
    -webkit-app-region: no-drag;
  }

  .close {
    position: absolute;
    -webkit-app-region: no-drag;
    right: ${(props) => props.theme.padding}px;
    top: ${(props) => props.theme.padding}px;
    cursor: pointer;

    &:hover {
      background-color: ${(props) => props.theme.colorPrimaryBgHover};
    }
  }

  .modal {
    .ant-modal-wrap {
      -webkit-app-region: no-drag;

    }
  }
`;
