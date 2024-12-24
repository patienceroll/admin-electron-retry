import { Carousel, Modal, Image } from "antd";
import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import styled from "styled-components";
import useWather from "src/hooks/use-wather";
import { getProjectDetail } from "src/apps/admin/api/project";

type Ref = {
    show: (item?: any) => void;
};

export function createRef() {
    return useRef<Ref>(null);
}

const ProjectDetail = forwardRef<Ref, StyledWrapComponents>(function (props, ref) {
    const { className } = props;
    const [open] = useWather();
    const [loading] = useWather();
    const [detail, setDetail] = useState<any>()
    useImperativeHandle(ref, () => ({
        show(item) {
            if (item) {
                setDetail(item);
                return
            }
            getDetail();

        },
    }));
    const getDetail = async () => {
        await getProjectDetail({ id: 21, _fetchId: '64_1734918627666' }).then((res) => {
            console.log(res, 'res');
            setDetail(res.data);
            open.setTrue();
        })
    }
    return (
        <Modal
            width={800}
            open={open.whether}
            className={className}
            onClose={open.setFalse}
            title="项目简介"
            onCancel={open.setFalse}
            onOk={() => { }}
            confirmLoading={loading.whether}
        >
            <div className="detail">
                <div className="carousel">
                    <Carousel autoplay arrows dots={false} draggable={true} speed={1000}>
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
                <div className="detail-list">
                    <div className="detail-list-item"><div>项目:</div><div>{detail?.name}</div></div>
                    <div className="detail-list-item"><div>编码:</div><div>{detail?.code}</div></div>
                    <div className="detail-list-item"><div>简称:</div><div>{detail?.short_name}</div></div>
                    <div className="detail-list-item"><div>地址:</div><div>{detail?.address}</div></div>
                    <div className="detail-list-item"><div>业务员:</div><div>{detail?.staff?.name}</div></div>
                </div>
            </div>
            <div className="content">
                建筑内容：{detail?.name}
            </div>
        </Modal>
    );
});

export default styled(ProjectDetail)`
  .detail {
    display: flex;
    justify-content:space-between;
    flex-wrap: nowrap;
  }
  .carousel{
    width: 49%;
    border-radius: 10px;
    overflow: hidden;
    .Image{
      width: 100%;
      height: 160;
    }
  }
  .detail-list {
    width: 50%;
      display: flex;
      flex-direction: column;
  }
  .detail-list-item{
      display: flex;
      flex-wrap: nowrap;
      margin-bottom: 10px;
      >div:nth-child(1){
        width: 60px;
      }
      >div:nth-child(2){
        flex: 1;
      }
  }
  .content{
        padding: 20px 0;
  }
`;
