import React from "react"
import styled from "styled-components"


function Content(props:StyledWrapComponents) {
    return  <div className={props.className}>

    </div>
}

export default styled(Content)`
    height: calc(100vh - 30px);
`