import { Carousel, Col, Image, Popover, Row } from "antd";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import styled, { useTheme } from "styled-components";

import useWather from "src/hooks/use-wather";

import { getProjectIntroduction } from "src/apps/admin/api/project";
import InfoItem from "src/framework/component/info-item";

function ProjectIntroduction(
  props: StyledWrapComponents<PropsWithChildren<{ id: Project["id"] }>>,
) {
  const { children, id } = props;
  const theme = useTheme();

  const [open] = useWather();

  const [intro, setIntro] = useState<Project>();

  const getIntro = useCallback(() => {
    getProjectIntroduction({ id }).then((res) => {
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
              <InfoItem label="编码">{intro?.code}</InfoItem>
              <InfoItem label="简称">{intro?.short_name}</InfoItem>
              <InfoItem label="地址">{intro?.address}</InfoItem>
              <InfoItem label="负责部门">
                {intro?.staff?.department?.name}
              </InfoItem>
              <InfoItem label="业务员">
                {intro?.staff?.name} {intro?.staff?.phone}
              </InfoItem>
            </Col>
          </Row>
          <div style={{ marginTop: theme.padding }}>
            <span style={{ color: "rgba(0, 0, 0, 0.45)" }}>建筑内容: </span>
            <span>{intro?.build_content}</span>
          </div>
        </div>
      }
    >
      {children}
    </Popover>
  );
}

export default styled(ProjectIntroduction)``;
