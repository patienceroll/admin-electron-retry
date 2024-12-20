import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Descriptions, Drawer, Radio } from "antd";
import styled from "styled-components";

import useWather from "src/hooks/use-wather";


type Ref = {
    open: () => void
}

export function createRef() {
    return useRef<Ref>(null);
}

const SystemConfig = forwardRef<Ref>(function (props, ref) {
    const [open] = useWather()
    const [theme, setTheme] = useState(() => window.preload.getTheme())

    useEffect(() => {
        return window.preload.onThemeChange(setTheme);
    }, []);

    useImperativeHandle(ref, () => ({
        open() {
            open.setTrue()
        }
    }))

    return <Drawer open={open.whether} onClose={open.setFalse} title="系统设置">
        <Descriptions>
            <Descriptions.Item label="系统布局">
                <Radio.Group value={theme.layout} onChange={e => {
                    window.preload.setTheme({ layout: e.target.value });
                }}>
                    <Radio value="normal">默认</Radio>
                    <Radio value="compact">紧凑</Radio>
                </Radio.Group>
            </Descriptions.Item>

        </Descriptions>
    </Drawer>

})



export default styled(SystemConfig)``