import { Carousel, Col, Popover, Row, Image } from "antd";
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
  props: StyledWrapComponents<PropsWithChildren<{ id: Project["id"] }>>
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
        <div style={{ width: 800 }}>
          <Row gutter={theme.padding} wrap={false}>
            <Col flex="250px">
              <Carousel
                autoplay
                arrows
                dots={false}
                draggable={true}
                speed={1000}
                style={{width:'100%',}}
              >
                <Image
                  height={150}
                  width="100%"
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
       
              </Carousel>
            </Col>
            <Col flex={1}>
              <InfoItem label="项目">{intro?.name}</InfoItem>
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
            <InfoItem label="建筑内容">{intro?.build_content}</InfoItem>
          </div>
        </div>
      }
    >
      {children}
    </Popover>
  );
}

export default styled(ProjectIntroduction)``;

// function ProjectIntroduction(props: StyledWrapComponents) {
//   const { className } = props;
//   const [open] = useWather();
//   const [loading] = useWather();
//   const [info, setInfo] = useState<any>();

//   const getInfo = async (id: Company["id"]) => {
//     await getProjectIntroduction({ id }).then((res) => {
//       setInfo(res.data);
//       open.setTrue();
//     });
//   };

//   return (
//     <Modal
//       width={800}
//       open={open.whether}
//       className={className}
//       onClose={open.setFalse}
//       title="项目简介"
//       onCancel={open.setFalse}
//       footer={null}
//       confirmLoading={loading.whether}
//     >
//       <div className="introduction">
//         <div className="carousel">
//           <Carousel autoplay arrows dots={false} draggable={true} speed={1000}>
//             <Image
//               className="image"
//               src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
//             />
//             <Image
//               className="image"
//               src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
//             />
//             <Image
//               className="image"
//               src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
//             />
//             <Image
//               className="image"
//               src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
//             />
//           </Carousel>
//         </div>
//         <div className="introduction-list">
//           <div className="introduction-list-item">
//             <div>项目:</div>
//             <div>{info?.name}</div>
//           </div>
//           <div className="introduction-list-item">
//             <div>编码:</div>
//             <div>{info?.code}</div>
//           </div>
//           <div className="introduction-list-item">
//             <div>简称:</div>
//             <div>{info?.short_name}</div>
//           </div>
//           <div className="introduction-list-item">
//             <div>地址:</div>
//             <div>{info?.address}</div>
//           </div>
//           <div className="introduction-list-item">
//             <div>负责部门:</div>
//             <div>{info?.staff?.department?.name}</div>
//           </div>
//           <div className="introduction-list-item">
//             <div>业务员:</div>
//             <div>
//               {info?.staff?.name} {info?.staff?.phone}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="content">建筑内容：{info?.build_content}</div>
//     </Modal>
//   );
// }

// export default styled(ProjectIntroduction)`
//   .introduction {
//     display: flex;
//     justify-content: space-between;
//     flex-wrap: nowrap;
//   }

//   .carousel {
//     width: 49%;
//     border-radius: 10px;
//     overflow: hidden;

//     .Image {
//       width: 100%;
//       height: 160;
//     }
//   }

//   .introduction-list {
//     width: 50%;
//     display: flex;
//     /* justify-content: space-between; */
//     flex-direction: column;
//   }

//   .introduction-list-item {
//     display: flex;
//     flex-wrap: nowrap;
//     margin-bottom: 10px;

//     > div:nth-child(1) {
//       width: 60px;
//     }

//     > div:nth-child(2) {
//       flex: 1;
//     }
//   }

//   .content {
//     padding: 20px 0;
//   }
// `;
