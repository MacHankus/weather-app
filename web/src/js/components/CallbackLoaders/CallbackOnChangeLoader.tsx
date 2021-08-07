import React, { ChangeEvent, useRef, useState } from 'react'
import { CallbackLoaderInputProps, CallbackLoaderInputState } from './types'

export const CallbackOnChangeLoader = ({ children, afterTyping, callback, failureCallback }: CallbackLoaderInputProps): React.ReactElement => {

    const [resolve, setResolve] = useState<CallbackLoaderInputState>({ error: false, helperText: "" })
    const [inputValue, setInputValue] = useState("")
    const inputValueRef = useRef(inputValue);
    inputValueRef.current = inputValue;

    const runCallbacks = async () => {
        try {
            const data = await callback(inputValueRef.current)
            setResolve(data)
        } catch (err) {
            failureCallback()
        }
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value
        setInputValue(value)
        if (afterTyping) {
            let timeToCheck = 500
            setTimeout(() => {
                if (value === inputValueRef.current) {
                    runCallbacks()
                }
            }, timeToCheck)
        }else{
            runCallbacks()
        }
    }

    return <>
        {
            React.cloneElement(
                React.Children.only(
                    children
                ),
                {
                    onChange,
                    value:inputValue,
                    ...resolve
                    
                }
            )
        }
    </>
}