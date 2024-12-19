import React, { useCallback, useEffect, useState } from "react";
import { Anchor, Col, Row } from "antd/es";
import { useLocation } from "react-router/dist";
import styled, { useTheme } from "styled-components";
import { ProTable } from "@ant-design/pro-components/es";

import PageWrapper from "src/framework/component/page-wrapper";
import { getClient } from "src/apps/admin/api/client";
import { projectTypeMap } from "src/apps/admin/api/project";
import InfoItem from "src/framework/component/info-item";

import Title from "src/framework/component/title";
import { getClientContactList } from "src/apps/admin/api/client-concat";
import useSearchTable, {
  tableColumn,
  tableMeasureColumnWidth,
} from "src/hooks/use-search-table";
import { getBankAccountList } from "src/apps/admin/api/bank-account";
import { getSalesContractList } from "src/apps/admin/api/sales-contract";
import { getSalesOrderList } from "src/apps/admin/api/sales-order";
import { getSalesDeliverList } from "src/apps/admin/api/sales-deliver";
import { getSalesReturnList } from "src/apps/admin/api/sales-return";

function Detail(props: StyledWrapComponents) {
  const { className } = props;
  const params = useLocation();
  const search = new URLSearchParams(params.search);
  const id = search.get("id")!;

  const theme = useTheme();
  const concat = useSearchTable(getClientContactList);
  const bankAccount = useSearchTable(getBankAccountList);
  const saleContact = useSearchTable(getSalesContractList);
  const saleOrder = useSearchTable(getSalesOrderList);
  const saleDeliver = useSearchTable(getSalesDeliverList);
  const saleReturn = useSearchTable(getSalesReturnList)

  const [detail, setDetail] = useState<ClientListItem>();

  const getDetail = useCallback(
    function () {
      getClient({ id: Number(id) }).then((res) => {
        setDetail(res.data);
      });
    },
    [id]
  );

  useEffect(() => {
    getDetail();
    concat.extraParams.current.client_id = Number(id);
    concat.reload();
    bankAccount.extraParams.current.table_id = Number(id);
    bankAccount.extraParams.current.type = 2;
    bankAccount.extraParams.current.table = "client";
    bankAccount.reload();
    saleContact.extraParams.current.client_id = Number(id);
    saleContact.extraParams.current.is_show_detail = 1;
    saleContact.reload();
    saleOrder.extraParams.current.client_id = Number(id);
    saleOrder.extraParams.current.is_show_detail = 1;
    saleOrder.reload();
    saleDeliver.extraParams.current.client_id = Number(id);
    saleDeliver.extraParams.current.is_show_detail = 1;
    saleDeliver.reload();
    saleReturn.extraParams.current.client_id = Number(id);
    saleReturn.extraParams.current.is_show_detail = 1;
    saleReturn.reload();
  }, []);

  const column = tableColumn<
    NonNullable<SalesContract["detail"]>[number]
  >([
    {
      title: "物资",
      dataIndex: "material",
      renderText: (_, row) => row.material?.name,
      fixed: "left",
    },
    {
      title: "拓展属性",
      dataIndex: "material_sku",
      width: 200,
      renderText: (_, row) => {
        const value = row.material_sku?.attr_snapshoot || {};
        return Object.keys(value)
          .map((key) => `${key}:${value[key]}`)
          .join(" ");
      },
    },
    {
      title: "图片",
      valueType: "image",
      renderText(_, row) {
        return row.material_sku?.picture_path || row.material?.picture_path;
      },
    },
    {
      title: "规格型号",
      dataIndex: "material",
      renderText: (_, row) => row.material?.model,
    },
    {
      title: "数量",
      dataIndex: "num",
    },
    {
      title: "单价",
      dataIndex: "price",
    },
    {
      title: "金额",
      dataIndex: "amount",
    },
    {
      title: "单位",
      dataIndex: "material",
      renderText: (_, row) => row.material?.unit,
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
  ]);

  return (
    <PageWrapper className={className}>
      <Title id="基本信息">基本信息</Title>
      {detail && (
        <Row
          style={{ marginTop: theme.margin }}
          gutter={[theme.padding, theme.padding]}
        >
          <Col flex="300px">
            <InfoItem label="客户">{detail.name}</InfoItem>
          </Col>
          <Col flex="300px">
            <InfoItem label="简称">{detail.short_name}</InfoItem>
          </Col>
          <Col flex="300px">
            <InfoItem label="类型">
              {projectTypeMap.get(detail.type)?.text}
            </InfoItem>
          </Col>
          <Col flex="300px">
            <InfoItem label="详细地址">{detail.address}</InfoItem>
          </Col>
          <Col flex="300px">
            <InfoItem label="是否签约">{detail.is_sign ? "是" : "否"}</InfoItem>
          </Col>
        </Row>
      )}
      <Title style={{ marginTop: theme.margin }} id="联系人">
        联系人
      </Title>
      <ProTable
        className="custom-pro-table"
        search={false}
        rowKey="id"
        style={{ marginTop: theme.margin }}
        scroll={{ y: 400 }}
        options={concat.options}
        loading={concat.loading}
        dataSource={concat.dataSource}
        pagination={concat.pagination}
        onChange={concat.onChange}
        columns={concat.column([
          {
            title: "姓名",
            dataIndex: "name",
          },
          {
            title: "职位",
            dataIndex: "job_title",
          },
          {
            title: "手机",
            dataIndex: "phone",
          },
          {
            title: "微信",
            dataIndex: "wechat",
          },
          {
            title: "身份证",
            dataIndex: "ID_card",
          },
        ])}
      />
      <Title style={{ marginTop: theme.margin }} id="账号信息">
        账号信息
      </Title>
      <ProTable
        search={false}
        rowKey="id"
        style={{ marginTop: theme.margin }}
        options={bankAccount.options}
        loading={bankAccount.loading}
        dataSource={bankAccount.dataSource}
        pagination={bankAccount.pagination}
        onChange={bankAccount.onChange}
        columns={bankAccount.column([
          {
            title: "公司",
            dataIndex: "company_name",
          },
          {
            title: "地址",
            dataIndex: "company_address",
          },
          {
            title: "联系人",
            dataIndex: "linkman",
          },
          {
            title: "电话",
            dataIndex: "phone",
          },
          {
            title: "银行",
            dataIndex: "bank_name",
          },
          {
            title: "开户行",
            dataIndex: "bank_address",
          },
          {
            title: "税号",
            dataIndex: "tax_code",
          },
          {
            title: "账号",
            dataIndex: "account",
          },
        ])}
      />

      <Title style={{ marginTop: theme.margin }} id="销售合同">
        销售合同
      </Title>

      <ProTable
        search={false}
        rowKey="id"
        style={{ marginTop: theme.margin }}
        options={saleContact.options}
        loading={saleContact.loading}
        dataSource={saleContact.dataSource}
        pagination={saleContact.pagination}
        onChange={saleContact.onChange}
        columns={saleContact.column([
          {
            title: "合同编号",
            dataIndex: "code",
          },
          {
            title: "合同名称",
            dataIndex: "name",
          },
          {
            title: "签约日期",
            dataIndex: "sign_date",
          },
        ])}
        scroll={{ x: tableMeasureColumnWidth(column) }}
        expandable={{
          childrenColumnName: "detail",
          columnWidth: 100,
          rowExpandable(record) {
            return Boolean(record.detail && record.detail.length !== 0);
          },
          expandedRowRender(row) {
            if (!row.detail) return null;

            return (
              <ProTable
                style={{ width: "100%" }}
                rowKey="id"
                search={false}
                options={false}
                pagination={false}
                dataSource={row.detail}
                columns={column}
              />
            );
          },
        }}
      />

      <Title style={{ marginTop: theme.margin }} id="销售订单">
        销售订单
      </Title>

      <ProTable
        search={false}
        rowKey="id"
        style={{ marginTop: theme.margin }}
        options={saleOrder.options}
        loading={saleOrder.loading}
        dataSource={saleOrder.dataSource}
        pagination={saleOrder.pagination}
        onChange={saleOrder.onChange}
        columns={saleOrder.column([
          {
            title: "销售订单编号",
            dataIndex: "code",
          },
          {
            title: "销售订单日期",
            dataIndex: "bill_date",
          },
        ])}
        scroll={{ x: tableMeasureColumnWidth(column) }}
        expandable={{
          childrenColumnName: "detail",
          columnWidth: 100,
          rowExpandable(record) {
            return Boolean(record.detail && record.detail.length !== 0);
          },
          expandedRowRender(row) {
            if (!row.detail) return null;

            return (
              <ProTable
                style={{ width: "100%" }}
                rowKey="id"
                search={false}
                options={false}
                pagination={false}
                dataSource={row.detail}
                columns={column}
              />
            );
          },
        }}
      />
      <Title style={{ marginTop: theme.margin }} id="销售发货">
        销售发货
      </Title>
      <ProTable
        search={false}
        rowKey="id"
        style={{ marginTop: theme.margin }}
        options={saleDeliver.options}
        loading={saleDeliver.loading}
        dataSource={saleDeliver.dataSource}
        pagination={saleDeliver.pagination}
        onChange={saleDeliver.onChange}
        columns={saleDeliver.column([
          {
            title: "销售订单编号",
            dataIndex: "code",
          },
          {
            title: "销售订单日期",
            dataIndex: "bill_date",
          },
        ])}
        scroll={{ x: tableMeasureColumnWidth(column) }}
        expandable={{
          childrenColumnName: "detail",
          columnWidth: 100,
          rowExpandable(record) {
            return Boolean(record.detail && record.detail.length !== 0);
          },
          expandedRowRender(row) {
            if (!row.detail) return null;

            return (
              <ProTable
                style={{ width: "100%" }}
                rowKey="id"
                search={false}
                options={false}
                pagination={false}
                dataSource={row.detail}
                columns={column}
              />
            );
          },
        }}
      />
      <Title style={{ marginTop: theme.margin }} id="销售退货">
        销售退货
      </Title>
      <ProTable
        search={false}
        rowKey="id"
        style={{ marginTop: theme.margin }}
        options={saleReturn.options}
        loading={saleReturn.loading}
        dataSource={saleReturn.dataSource}
        pagination={saleReturn.pagination}
        onChange={saleReturn.onChange}
        columns={saleReturn.column([
          {
            title: "销售订单编号",
            dataIndex: "code",
          },
          {
            title: "销售订单日期",
            dataIndex: "bill_date",
          },
        ])}
        scroll={{ x: tableMeasureColumnWidth(column) }}
        expandable={{
          childrenColumnName: "detail",
          columnWidth: 100,
          rowExpandable(record) {
            return Boolean(record.detail && record.detail.length !== 0);
          },
          expandedRowRender(row) {
            if (!row.detail) return null;

            return (
              <ProTable
                style={{ width: "100%" }}
                rowKey="id"
                search={false}
                options={false}
                pagination={false}
                dataSource={row.detail}
                columns={column}
              />
            );
          },
        }}
      />

      <Title style={{ marginTop: theme.margin }} id="系统信息">
        系统信息
      </Title>
      {detail && (
        <Row
          style={{ marginTop: theme.margin }}
          gutter={[theme.padding, theme.padding]}
        >
          <Col flex="300px">
            <InfoItem label="创建人">{detail.created_user?.name}</InfoItem>
          </Col>
          <Col flex="300px">
            <InfoItem label="创建时间">
              {detail.created_user?.created_at}
            </InfoItem>
          </Col>
          <Col flex="300px">
            <InfoItem label="更新时间">
              {detail.created_user?.updated_at}
            </InfoItem>
          </Col>
        </Row>
      )}

      <Anchor
        className="anchor"
        replace
        // onClick={e => e.preventDefault()}
        items={[
          "基本信息",
          "联系人",
          "账号信息",
          "销售合同",
          "销售订单",
          "销售发货",
          "销售退货",
          "系统信息",
        ].map((item) => ({
          key: item,
          title: item,
          href: `#${item}`,
        }))}
      />
    </PageWrapper>
  );
}

export default styled(Detail)`
  padding-right: 200px;

  .anchor {
    position: fixed;
    top: 50%;
    right: 50px;
    transform: translateY(-50%);
  }
`;
