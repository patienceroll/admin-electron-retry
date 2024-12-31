import {
  Tag,
  Typography,
  Collapse,
  Steps,
  StepsProps,
  Space,
  Avatar,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "styled-components";

import DefaultAvatar from "src/assets/svg/默认头像.svg";
import Icon from "src/framework/component/icon";

export default function ApprovalRecord<T>(props: {
  id: T;
  recordApi: (params: { id: T }) => Promise<BaseResponse<ApprovalRecord[]>>;
  style?: React.CSSProperties;
}) {
  const { id, recordApi, style } = props;
  const theme = useTheme();
  const [approvalData, setApprovalData] = useState<ApprovalRecord[]>([]);
  const [activeKes, setActiveKeys] = useState<(string | number)[]>([]);

  const _getApprovalRecord = useCallback(
    function () {
      recordApi({ id }).then((res) => setApprovalData(res.data));
    },
    [id, recordApi]
  );

  useEffect(() => {
    _getApprovalRecord();
  }, [_getApprovalRecord]);

  return (
    <Collapse
      activeKey={activeKes}
      style={style}
      onChange={(keys) => {
        if (keys instanceof Array) setActiveKeys(keys);
      }}
      items={approvalData.map((i) => ({
        key: i.id,
        label: i.approval?.name,
        extra: {
          0: <Tag color="warning">待审批</Tag>,
          1: <Tag color="processing">审批中</Tag>,
          2: <Tag color="success">已通过</Tag>,
          3: <Tag color="error">未通过</Tag>,
        }[i.status],
        children: (
          <Steps
            direction="vertical"
            items={i.record.map((record) => ({
              status: {
                0: "finish",
                1: "wait",
                2: "process",
                3: "finish",
                4: "error",
                5: "wait",
                6: "wait",
              }[record.status] as StepsProps["status"],
              title: (
                <Space>
                  <Avatar
                    src={
                      record.staff?.avatar_path || (
                        <Icon
                          width={theme.Avatar?.containerSize}
                          height={theme.Avatar?.containerSize}
                          icon={DefaultAvatar}
                        />
                      )
                    }
                  />
                  <span>{record.staff?.name}</span>
                </Space>
              ),
              subTitle: record.staff?.job?.name,
              description: (
                <>
                  <Space style={{ marginTop: theme.padding / 2 }}>
                    {
                      {
                        0: <Tag color="pink">发起</Tag>,
                        1: <Tag color="rgba(141, 126, 126, 0.45)">未审批</Tag>,
                        2: <Tag color="processing">待审批</Tag>,
                        3: <Tag color="success">已通过</Tag>,
                        4: <Tag color="error">未通过</Tag>,
                        5: <Tag color="rgba(0, 0, 0, 0.45)">无效</Tag>,
                        6: <Tag color="rgba(0, 0, 0, 0.45)">撤销</Tag>,
                      }[record.status]
                    }
                    <span>{record.happen_time}</span>
                  </Space>
                  <div>{record.remark}</div>
                  {record.file.map((file) => (
                    <Space key={file.id}>
                      <Typography.Link
                        key={file.id}
                        onClick={() => {
                          window.preload.previewFile(file.full_path);
                        }}
                      >
                        {file.name}
                      </Typography.Link>
                      <Typography.Link
                        onClick={() => {
                          window.preload.downloadFile(file.full_path);
                        }}
                      >
                        下载
                      </Typography.Link>
                    </Space>
                  ))}
                </>
              ),
            }))}
          />
        ),
      }))}
    />
  );
}
