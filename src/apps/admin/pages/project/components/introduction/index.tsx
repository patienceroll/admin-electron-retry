import { Carousel, Image, Modal } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import useWather from "src/hooks/use-wather";
import { getProjectIntroduction } from "src/apps/admin/api/project";

type Ref = {
  show: (id: Company["id"]) => void;
};

export function createRef() {
  return useRef<Ref>(null);
}

const ProjectIntroduction = forwardRef<Ref, StyledWrapComponents>(
  function (props, ref) {
    const { className } = props;
    const [open] = useWather();
    const [loading] = useWather();
    const [info, setInfo] = useState<any>();
    useImperativeHandle(ref, () => ({
      show(id) {
        getInfo(id);
      },
    }));
    const getInfo = async (id: Company["id"]) => {
      await getProjectIntroduction({ id }).then((res) => {
        setInfo(res.data);
        open.setTrue();
      });
    };
    return (
      <Modal
        width={800}
        open={open.whether}
        className={className}
        onClose={open.setFalse}
        title="项目简介"
        onCancel={open.setFalse}
        onOk={() => {}}
        confirmLoading={loading.whether}
      >
        <div className="introduction">
          <div className="carousel">
            <Carousel
              autoplay
              arrows
              dots={false}
              draggable={true}
              speed={1000}
            >
              <Image
                className="image"
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
              <Image
                className="image"
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
              <Image
                className="image"
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
              <Image
                className="image"
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
            </Carousel>
          </div>
          <div className="introduction-list">
            <div className="introduction-list-item">
              <div>项目:</div>
              <div>{info?.name}</div>
            </div>
            <div className="introduction-list-item">
              <div>编码:</div>
              <div>{info?.code}</div>
            </div>
            <div className="introduction-list-item">
              <div>简称:</div>
              <div>{info?.short_name}</div>
            </div>
            <div className="introduction-list-item">
              <div>地址:</div>
              <div>{info?.address}</div>
            </div>
            <div className="introduction-list-item">
              <div>业务员:</div>
              <div>{info?.staff?.name}</div>
            </div>
          </div>
        </div>
        <div className="content">建筑内容：{info?.name}</div>
      </Modal>
    );
  },
);

export default styled(ProjectIntroduction)`
  .introduction {
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
  }

  .carousel {
    width: 49%;
    border-radius: 10px;
    overflow: hidden;

    .Image {
      width: 100%;
      height: 160;
    }
  }

  .introduction-list {
    width: 50%;
    display: flex;
    /* justify-content: space-between; */
    flex-direction: column;
  }

  .introduction-list-item {
    display: flex;
    flex-wrap: nowrap;
    margin-bottom: 10px;

    > div:nth-child(1) {
      width: 60px;
    }

    > div:nth-child(2) {
      flex: 1;
    }
  }

  .content {
    padding: 20px 0;
  }
`;
