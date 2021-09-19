import React, { PropsWithChildren } from 'react'

export interface CallbackLoaderRequiredProps {
    callback : ()=>Promise<{}>,
    failureCallback: Function,
    children : React.ReactElement
}
export type CallbackLoaderInputState = {error: boolean, helperText: string}

export interface CallbackLoaderInputProps extends CallbackLoaderRequiredProps {
    afterTyping?: boolean ,
    callback: (...args: any[])=>Promise<CallbackLoaderInputState>
}