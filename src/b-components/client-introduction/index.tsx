import { Carousel, Col, Image, Popover, Row, Typography } from "antd";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import styled, { useTheme } from "styled-components";

import useWather from "src/hooks/use-wather";

import { getClientIntroduction } from "src/apps/admin/api/client";
import InfoItem from "src/framework/component/info-item";

function ClientIntroduction(
  props: StyledWrapComponents<PropsWithChildren<{ id: Client["id"] }>>,
) {
  const { children, id } = props;
  const theme = useTheme();

  const [open] = useWather();

  const [intro, setIntro] = useState<Client>();

  const getIntro = useCallback(() => {
    getClientIntroduction({ id }).then((res) => {
      setIntro(res.data);
    });
  }, [id]);

  useEffect(() => {
    if (open.whether && !intro) {
      getIntro();
    }
  }, [getIntro, intro, open.whether]);

  return (
    <Popover
      autoAdjustOverflow
      open={open.whether}
      onOpenChange={open.setValue}
      content={
        <div style={{ width: 600 }}>
          <Row gutter={theme.padding} wrap={false}>
            <Col flex="280px">
              <Carousel
                autoplay
                arrows
                dots={false}
                draggable={true}
                speed={1000}
                style={{ width: "100%" }}
              >
                <Image
                  height={200}
                  width="100%"
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
              </Carousel>
            </Col>
            <Col flex={1}>
              <h2>{intro?.name}</h2>
              <Row>
                <Col span={24}>
                  <InfoItem label="编号">
                    &nbsp;
                    <Typography.Text copyable>{intro?.code}</Typography.Text>
                  </InfoItem>
                </Col>
                <Col span={24}>
                  <InfoItem label="简称">{intro?.short_name}</InfoItem>
                </Col>
                <Col span={12}>
                  <InfoItem label="类别">{intro?.type_show}</InfoItem>
                </Col>
                <Col span={12}>
                  <InfoItem label="性质">{intro?.nature}</InfoItem>
                </Col>
                <Col span={24}>
                  <InfoItem label="地址">
                    {intro?.province}
                    {intro?.city}
                    {intro?.county}
                    {intro?.address}
                  </InfoItem>
                </Col>
                <Col span={24}>
                  <InfoItem label="负责部门">
                    {intro?.staff?.department?.name}
                  </InfoItem>
                </Col>
                <Col span={24}>
                  <InfoItem label="业务员">
                    {intro?.staff?.name} {intro?.staff?.phone}
                  </InfoItem>
                </Col>
              </Row>
            </Col>
          </Row>
          <div style={{ marginTop: theme.padding }}>
            <span style={{ color: "rgba(0, 0, 0, 0.45)" }}>简介: </span>
            <span>{intro?.introduction}</span>
          </div>
        </div>
      }
    >
      {children}
    </Popover>
  );
}

export default styled(ClientIntroduction)``;
