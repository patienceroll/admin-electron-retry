import styled, { useTheme } from "styled-components";
import React, { useEffect } from "react";
import { Button, Card, Col, FloatButton, Row, Space } from "antd";
import { ProFormText, ProTable } from "@ant-design/pro-components";

import Search from "src/framework/component/search";
import PageWrapper from "src/framework/component/page-wrapper";
import SearchAction from "src/framework/component/search/search-action";

import useSearchTable from "src/hooks/use-search-table";
import useColumnState from "src/hooks/use-column-state";
import contextedMessage from "src/framework/component/contexted-message";
import contextedModal from "src/framework/component/contexted-modal";
import Icon from "src/framework/component/icon";
import AddSvg from "src/assets/svg/add.svg";
import { deleteApproval, getApprovals } from "src/apps/admin/api/approval";
import usePageTableHeight from "src/hooks/use-page-table-height";
import Permission from "src/util/permission";
