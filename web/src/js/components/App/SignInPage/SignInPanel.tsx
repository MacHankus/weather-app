import React, { ChangeEvent, useState } from "react"
import posed, { PoseGroup } from "react-pose"
import { SignInConfirmToken } from "./SignInConfirmToken"
import { SignInForm } from "./SignInForm"
import { SignInSuccess } from './SignInSuccess'

interface SignInPanelProps { }

type SignInPanelReturns = React.ReactElement


export interface SignInFormState {
    [k: string]: BasicInfo | null,
}

export interface BasicInfo {
    error?: boolean,
    text?: string,
    value?: string,
    lastChange?: Date,
    disabled?: boolean
}

const SweepElement = posed.div({
    preEnter: {
        x: -100,
        opacity: 0
    },
    enter: {
        x: 0,
        opacity: 1
    },
    exit: {
        x: 100,
        opacity: 0
    }
})

export const SignInPanel: () => SignInPanelReturns = function () {

    const [formState, setFormState] = useState<SignInFormState>({})
    const [confirmState, setConfirmState] = useState<BasicInfo>({})
    const [visibility, setVisibility] = useState<number>(0)

    const changeFormState = (name: string, formPart: SignInFormState) => {
        setFormState((prevState) => ({
            ...prevState,
            [name]: { ...prevState[name], ...formPart }
        }))
    }
    const checkFormEmptyness = () => {
        let newState: SignInFormState = {}
        let somethingEmpty = false
        for (let key in formState) {
            if (!formState[key]?.value) {
                somethingEmpty = true
                newState[key] = {
                    ...formState[key],
                    error: true,
                    text: "Field required."
                }
            }
        }
        if (somethingEmpty) { 
            setFormState(newState)
            return true 
        }
        return false
    }
    const changeConfirmState = (confirmPart: BasicInfo) => {
        setConfirmState((prevState) => ({
            ...prevState, ...confirmPart
        }))
    }

    const changeVisibility = () => setVisibility((vis) => vis + 1)

    return (<>
        <PoseGroup preEnterPose="preEnter">
            {
                visibility === 0 && <SweepElement key={0}>
                    <SignInForm formState={formState} changeFormState={changeFormState} changeVisibility={changeVisibility} checkFormEmptyness={checkFormEmptyness} />
                </SweepElement> ||
                visibility === 1 && <SweepElement key={1}>
                    <SignInConfirmToken changeConfirmState={changeConfirmState} formState={formState} confirmState={confirmState} changeVisibility={changeVisibility}/>
                </SweepElement> ||
                visibility === 2 && <SweepElement key={2}>
                    <SignInSuccess/>
                </SweepElement>
            }
        </PoseGroup>

    </>
    )
}