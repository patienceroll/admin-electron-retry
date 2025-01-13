import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Checkbox, InputNumber, Modal } from "antd";
import styled, { useTheme } from "styled-components";
import ProTable from "@ant-design/pro-table";

import useWather from "src/hooks/use-wather";
import Title from "src/framework/component/title";
import MoneyInput from "src/framework/component/money-input";
import {
  tableColumn,
  tableMeasureColumnWidth,
} from "src/hooks/use-search-table";
import useUpdate from "src/hooks/use-update";
import { salesContractDetailUnit } from "src/apps/admin/api/sales-contract-detail";
import contextedMessage from "src/framework/component/contexted-message";

type Ref = {
  setUnit: (row: SalesContractDetail) => Promise<void>;
};

type Data = {
  use: boolean;
  main: boolean;
  num: number;
  unit: string;
  price: number;
};

export function createRef() {
  return useRef<Ref>(null);
}

const SetUnit = forwardRef<Ref, StyledWrapComponents>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: (value: void | PromiseLike<void>) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const theme = useTheme();

  const [open] = useWather();
  const [loading] = useWather();

  const lineUnit = useRef<Data[]>([]);
  const LineAttr = useRef<SalesContractDetail["line_attr"]>(null);

  const [update] = useUpdate();

  useImperativeHandle(ref, () => ({
    setUnit(item) {
      return new Promise<void>((resolve, reject) => {
        open.setTrue();
        promiseResolver.current = { resolve, reject };
        salesContractDetailUnit({ id: item.id }).then((res) => {
          lineUnit.current = res.data.map<Data>((i) => {
            const rowUnit = item.line_unit?.find(
              (ln) => ln.material_unit_id === i.material_unit_id
            );
            return {
              unit: i.unit,
              use: !!rowUnit,
              main: !!rowUnit?.is_execute,
              price: rowUnit ? Number(rowUnit.price) : 0,
              num: rowUnit ? rowUnit.num : 1,
            };
          });
          update();
        });
        LineAttr.current = item.line_attr
      });
    },
  }));

  const column = tableColumn<Data>([
    {
      title: "是否启用",
      dataIndex: "use",
      render(_, row) {
        return (
          <Checkbox
            checked={row.use}
            onChange={(e) => {
              lineUnit.current.forEach((item) => {
                if (item.unit === row.unit) {
                  if (item.main && !e.target.checked) {
                    contextedMessage.message?.info("主单位必须启用");
                  } else {
                    item.use = e.target.checked;
                    update();
                  }
                }
              });
            }}
          />
        );
      },
    },
    {
      title: "单位",
      dataIndex: "unit",
    },
    {
      title: "数量",
      dataIndex: "num",
      render: (_, row) => (
        <InputNumber
          style={{ width: "auto" }}
          value={row.num}
          min={0}
          onChange={(e) => {
            lineUnit.current.forEach((item) => {
              if (item.unit === row.unit) {
                item.num = e || 0;
                update();
              }
            });
          }}
        />
      ),
    },
    {
      title: "单价",
      dataIndex: "price",
      render: (_, row) => (
        <MoneyInput
          value={row.price}
          onChange={(e) => {
            lineUnit.current.forEach((item) => {
              if (item.unit === row.unit) {
                item.price = e ? Number(e) : 0;
                update();
              }
            });
          }}
        />
      ),
    },
    {
      title: "主单位",
      dataIndex: "main",
      render(_, row) {
        return (
          <Checkbox
            checked={row.main}
            onChange={(e) => {
              if (e.target.checked) {
                lineUnit.current.forEach((item) => {
                  if (item.unit === row.unit) {
                    item.main = true;
                    item.use = true;
                  } else {
                    item.main = false;
                  }
                });
                update();
              }
            }}
          />
        );
      },
    },
  ]);

  return (
    <Modal
      width="60vw"
      open={open.whether}
      maskClosable={!loading.whether}
      closeIcon={loading.whether}
      onCancel={open.setFalse}
      footer={null}
      className={props.className}
    >
      <Title>执行单位</Title>
      <ProTable
        style={{ marginTop: theme.margin }}
        search={false}
        pagination={false}
        options={false}
        rowKey="material_unit_id"
        dataSource={lineUnit.current}
        tableAlertRender={() => false}
        columns={column}
        scroll={{ x: tableMeasureColumnWidth(column) }}
      />

      <Title style={{ marginTop: theme.margin }}>属性信息</Title>
    </Modal>
  );
});

export default styled(SetUnit)``;
