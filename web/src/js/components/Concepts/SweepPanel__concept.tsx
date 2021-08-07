import React, { PropsWithChildren, useState } from 'react'

import posed, { PoseGroup } from 'react-pose';

const transitions = {
    preEnter:{
        x:-500,
        opacity:0
    },
    enter:{
        x:0,
        opacity: 1
    },
    exit:{
        x:100,
        opacity:0
    }
}

const SweepBox = posed.div(transitions)

type state = {
    index: number, 
    direction: "left" | "right"
}

export const SignInPanel: React.FC = function ({ children }) {

    const [{direction, index}, setState] = useState<state>({index:0, direction: "left"})

    console.log(direction, index)

    return (<PoseGroup preEnterPose={direction==='left' ? 'preEnter' : 'exit'}>
        {
            React.Children.map(children, (child, idx) => {
                const item = child as React.ReactElement<PropsWithChildren<any>>
                if (idx === index ) {
                    console.log(item)
                    return <SweepBox key={idx}>
                    {React.cloneElement(item, {
                        onClick: ()=>{
                            if (idx+1 === React.Children.count(children)) setState({index:0, direction:"right"})
                            else setState((prevstate)=>({index: prevstate.index + 1, direction:"left" }))
                        }
                    })}
                </SweepBox>
                }
             }) as React.ReactElement[]
        }
    </PoseGroup>)

}



