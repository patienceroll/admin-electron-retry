import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Button, Checkbox, Input, InputNumber, Modal } from "antd";
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
import {
  salesContractDetailEdit,
  salesContractDetailRenderConfig,
  salesContractDetailUnit,
} from "src/apps/admin/api/sales-contract-detail";
import contextedMessage from "src/framework/component/contexted-message";
import useRenderNames from "src/b-hooks/use-render-names";
import Key from "src/util/key";
import FlexCenter from "src/framework/component/flex-center";

type Ref = {
  setUnit: (row: SalesContractDetail) => Promise<void>;
};

type Data = {
  use: boolean;
  main: boolean;
  num: number;
  unit: string;
  price: number;
  material_unit_id: number;
};

type ExtraAttr = {
  name: string;
  key: string;
  value: string;
};

export function createRef() {
  return useRef<Ref>(null);
}

const SetUnit = forwardRef<
  Ref,
  StyledWrapComponents<Pick<SalesContract, "id">>
>(function (props, ref) {
  const { id } = props;
  const promiseResolver = useRef<{
    resolve: (value: void | PromiseLike<void>) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const theme = useTheme();

  const [open] = useWather();
  const [loading] = useWather();
  const [item, setItem] = useState<SalesContractDetail>();

  const [renderNames] = useRenderNames(salesContractDetailRenderConfig, {
    sales_contract_id: id,
  });

  const lineUnit = useRef<Data[]>([]);
  const attrData = useRef<Map<string, string>>(new Map());
  const extraAttrData = useRef<ExtraAttr[]>([]);
  const [remark, setRemark] = useState("");

  const [update] = useUpdate();

  function submit() {
    loading.setTrue();
    salesContractDetailEdit({
      id,
      remark,
      attr_snapshoot: extraAttrData.current.reduce(
        (acc, curr) => ({ ...acc, [curr.name]: curr.value }),
        {}
      ),
      line_attr: Object.fromEntries(attrData.current.entries()),
      line_unit: lineUnit.current
        .filter((item) => item.use)
        .map((item) => ({
          is_execute: item.main ? 1 : 0,
          material_unit_id: item.material_unit_id,
          num: item.num,
          price: item.price,
        })),
    })
      .then(() => {
        promiseResolver.current.resolve();
        open.setFalse();
      })
      .finally(loading.setFalse);
  }

  useEffect(() => {
    if (item) {
      attrData.current.clear();
      renderNames.attr_fields.forEach((attr) => {
        if (item.line_attr) {
          attrData.current.set(attr.name, item.line_attr[attr.key]);
        }
      });
      update();
    }
  }, [item, renderNames.attr_fields, update]);

  useImperativeHandle(ref, () => ({
    setUnit(item) {
      return new Promise<void>((resolve, reject) => {
        open.setTrue();
        promiseResolver.current = { resolve, reject };

        extraAttrData.current = Object.keys(item.attr_snapshoot).map<ExtraAttr>(
          (key) => ({
            name: key,
            key: Key.randomString(),
            value: item.attr_snapshoot[key],
          })
        );

        setItem(item);
        setRemark(item.remark);

        salesContractDetailUnit({ id: item.id }).then((res) => {
          lineUnit.current = [];
          res.data.forEach((i) => {
            const rowUnit = item.line_unit?.find(
              (ln) => ln.material_unit_id === i.material_unit_id
            );

            lineUnit.current.push({
              unit: i.unit,
              use: !!rowUnit,
              main: !!rowUnit?.is_execute,
              price: rowUnit ? Number(rowUnit.price) : 0,
              num: rowUnit ? rowUnit.num : 0,
              material_unit_id: i.material_unit_id,
            });
          });
          update();
        });
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
      onOk={submit}
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
      <ProTable
        style={{ marginTop: theme.margin }}
        search={false}
        pagination={false}
        options={false}
        rowKey="name"
        dataSource={Array.from(attrData.current.entries()).map(
          ([key, value]) => ({
            name: key,
            value: value,
          })
        )}
        tableAlertRender={() => false}
        columns={[
          {
            title: "属性名",
            dataIndex: "name",
          },
          {
            title: "属性值",
            dataIndex: "value",
            render(_, row) {
              return (
                <Input
                  placeholder="请输入属性值"
                  value={row.value}
                  onChange={(e) => {
                    attrData.current.set(row.name, e.target.value);
                    update();
                  }}
                />
              );
            },
          },
        ]}
      />
      <div className="with-action">
        <Title style={{ flex: 1 }}>拓展属性</Title>
        <FlexCenter>
          <Button
            type="text"
            onClick={() => {
              extraAttrData.current.push({
                name: "",
                value: "",
                key: Key.randomString(),
              });
              update();
            }}
          >
            新增扩展属性
          </Button>
        </FlexCenter>
      </div>
      <ProTable
        style={{ marginTop: theme.margin }}
        search={false}
        pagination={false}
        options={false}
        rowKey="name"
        dataSource={extraAttrData.current}
        tableAlertRender={() => false}
        columns={[
          {
            title: "属性名",
            dataIndex: "name",
            render(_, row) {
              return (
                <Input
                  placeholder="请输入属性值"
                  value={row.name}
                  onChange={(e) => {
                    extraAttrData.current.forEach((item) => {
                      if (item.key === row.key) {
                        item.name = e.target.value;
                        update();
                      }
                    });
                  }}
                />
              );
            },
          },
          {
            title: "属性值",
            dataIndex: "value",
            render(_, row) {
              return (
                <Input
                  placeholder="请输入属性值"
                  value={row.value}
                  onChange={(e) => {
                    extraAttrData.current.forEach((item) => {
                      if (item.key === row.key) {
                        item.value = e.target.value;
                        update();
                      }
                    });
                  }}
                />
              );
            },
          },
          {
            title: "操作",
            render(_, row) {
              return (
                <Button
                  type="text"
                  danger
                  onClick={() => {
                    extraAttrData.current = extraAttrData.current.filter(
                      (item) => item.key !== row.key
                    );
                    update();
                  }}
                >
                  删除
                </Button>
              );
            },
          },
        ]}
      />
      <Title style={{ marginTop: theme.margin }}>备注</Title>
      <Input.TextArea
        style={{ marginTop: theme.margin }}
        placeholder="请输入备注"
        value={remark}
        onChange={(e) => {
          setRemark(e.target.value);
        }}
      />
    </Modal>
  );
});

export default styled(SetUnit)`
  .with-action {
    display: flex;
    justify-content: space-between;
    margin-top: ${(props) => props.theme.margin}px;
  }
`;
