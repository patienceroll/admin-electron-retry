import styled from "styled-components";
import React, { useState } from "react";
import { FloatButton, Form, Radio, Tabs } from "antd";

import PageWrapper from "src/framework/component/page-wrapper";
import List from "./components/list";
import useWather from "src/hooks/use-wather";
import Permission from "src/util/permission";
import contextedMessage from "src/framework/component/contexted-message";
import { inventoryExport } from "src/apps/admin/api/inventory";
import Icon from "src/framework/component/icon";

import ExportSvg from "src/assets/svg/导出.svg";
function InventoryDetail(props: StyledWrapComponents) {
  const { className } = props;

  const [accordion] = useWather(true);
  const [type, setType] = useState<string>("1");

  return (
    <PageWrapper className={className}>
      <Tabs
        activeKey={type}
        onChange={setType}
        className="tabs"
        type="card"
        tabBarExtraContent={
          <Form.Item noStyle label="折叠方式">
            <Radio.Group
              value={accordion.whether}
              onChange={(e) => accordion.setValue(e.target.value)}
            >
              <Radio value={false}>自由折叠</Radio>
              <Radio value>手风琴折叠</Radio>
            </Radio.Group>
          </Form.Item>
        }
        items={[
          {
            label: "按仓库",
            key: "1",
            children: <List type={1} accordion={accordion.whether} />,
          },
          {
            label: "按项目",
            key: "2",
            children: <List type={2} accordion={accordion.whether} />,
          },
          {
            label: "按合同",
            key: "3",
            children: <List type={3} accordion={accordion.whether} />,
          },
          {
            label: "按订单",
            key: "4",
            children: <List type={4} accordion={accordion.whether} />,
          },
        ]}
      />
      <FloatButton.Group shape="square">
        {Permission.getPermission("export") && (
          <FloatButton
            icon={<Icon icon={ExportSvg} />}
            description="导出"
            onClick={function () {
              contextedMessage.message?.info("正在导出...");
              inventoryExport({ type }).then((res) => {
                window.preload.downloadFile(res.data.file_path);
              });
            }}
          />
        )}
      </FloatButton.Group>
    </PageWrapper>
  );
}

export default styled(InventoryDetail)`
  .tabs {
    height: calc(100vh - ${(props) => 2 * props.theme.padding}px);

    > .ant-tabs-content-holder {
      overflow-y: auto;
    }
  }
`;
