import { Button, Checkbox, Col, Modal, Row, Space, Tag } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { ProTable } from "@ant-design/pro-components";

import useWather from "src/hooks/use-wather";
import { getRoleMenu, postRolePermissions } from "src/apps/admin/api/role";
import {
  tableColumn,
  tableMeasureColumnWidth,
} from "src/hooks/use-search-table";
import useUpdate from "src/hooks/use-update";
import contextedMessage from "src/framework/component/contexted-message";
import * as PermissionDataEdit from "../permission-data-edit";

type Data = Omit<RoleMenu, "child"> & { children?: Data[] };

type Ref = {
  edit: (item: RoleListItem) => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

const Permission = forwardRef<Ref, StyledWrapComponents>(function (props, ref) {
  const [open] = useWather();
  const [getting] = useWather();
  const [loading] = useWather();
  const [update] = useUpdate();
  const promiseResolver = useRef<{
    resolve: () => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const permissionDataEdit = PermissionDataEdit.createRef();

  const store = useRef(
    new Map<
      RoleMenu["id"],
      RoleMenu["permission"][number]["role_permission"][number]["permission_id"][]
    >()
  );

  const [item, setItem] = useState<RoleListItem>();
  const [dataSource, setDataSource] = useState<RoleMenu[]>([]);

  function getPermission(params: Parameters<typeof getRoleMenu>[0]) {
    function deep(item: RoleMenu[]): Data[] {
      return item.map((i) => ({
        ...i,
        children: i.child && i.child.length !== 0 ? deep(i.child) : undefined,
      }));
    }

    getting.setTrue();
    getRoleMenu(params)
      .then((res) => {
        const data = deep(res.data);

        store.current.clear();
        function setChoosed(menu: RoleMenu[]) {
          return menu.forEach((m) => {
            if (m.permission instanceof Array) {
              const ids: Permission["id"][] = [];
              m.permission.forEach((p) => {
                p.role_permission.forEach((g) => ids.push(g.permission_id));
              });
              store.current.set(m.id, ids);
            }
            if (m.child instanceof Array) {
              setChoosed(m.child);
            }
          });
        }

        setChoosed(data);
        setDataSource(data);
      })
      .finally(getting.setFalse);
  }

  useImperativeHandle(ref, () => ({
    edit(item) {
      return new Promise((resolve, reject) => {
        promiseResolver.current = {
          reject,
          resolve,
        };
        setItem(item);
        open.setTrue();
        getPermission({ role_id: item.id });
      });
    },
  }));

  const column = tableColumn<RoleMenu>([
    {
      title: "菜单",
      dataIndex: "name",
      width: 150,
    },
    {
      title: "数据权限",
      dataIndex: "data_permission",
      width: 150,
      render(_, row) {
        return (
          <div className="permission">
            <div className="tag">
              {row.data_permission.map((i) => (
                <Tag key={i.id}>{i.department_name}</Tag>
              ))}
            </div>
            {row.level !== 1 && (
              <div className="button">
                <Button
                  type="text"
                  onClick={function () {
                    permissionDataEdit.current
                      ?.edit({
                        role: item!,
                        roleMenu: row,
                      })
                      .then(() => {
                        contextedMessage.message?.success("成功修改");
                        getPermission({ role_id: item!.id });
                      });
                  }}
                >
                  修改
                </Button>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "功能",
      dataIndex: "id",
      width: 200,
      render(_, row) {
        const checked = store.current.get(row.id) || [];
        return (
          <Row>
            {row.permission.map((p) => {
              return (
                <Col key={p.id} flex="100px" style={{ textAlign: "left" }}>
                  <Checkbox
                    onChange={() => {
                      if (checked.includes(p.id)) {
                        store.current.set(
                          row.id,
                          checked.filter((i) => i !== p.id)
                        );
                      } else {
                        store.current.set(row.id, checked.concat(p.id));
                      }
                      update();
                    }}
                    checked={checked.includes(p.id)}
                  >
                    {p.name}
                  </Checkbox>
                </Col>
              );
            })}
          </Row>
        );
      },
    },
  ]);

  function submit() {
    if (item) {
      const ids = Array.from(store.current.values()).flat();
      loading.setTrue();
      postRolePermissions({
        role_id: item.id,
        permission_ids: ids,
      })
        .then(() => {
          promiseResolver.current.resolve();
          open.setFalse();
          loading.setFalse();
          contextedMessage.message?.success("成功保存");
        })
        .catch(loading.setFalse);
    }
  }

  return (
    <Modal
      className={props.className}
      title={`${item?.name}权限`}
      open={open.whether}
      maskClosable={!loading.whether}
      closeIcon={loading.whether}
      onCancel={open.setFalse}
      width={700}
      onOk={submit}
    >
      <ProTable
        search={false}
        scroll={{ y: "55vh", x: tableMeasureColumnWidth(column) }}
        rowKey="id"
        dataSource={dataSource}
        loading={getting.whether}
        pagination={false}
        options={false}
        columns={column}
      />
      <PermissionDataEdit.default ref={permissionDataEdit} />
    </Modal>
  );
});

export default styled(Permission)`
  .permission {
    display: flex;
  }

  .tag {
    flex: 1;
  }

  .button {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }
`;
