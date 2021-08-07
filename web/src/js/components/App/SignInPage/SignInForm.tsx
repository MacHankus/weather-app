import React, { ChangeEvent, MouseEventHandler, useRef, useState } from 'react'

import { Box, Button, createStyles, Grid, makeStyles, Paper, TextField } from '@material-ui/core'
import { useHistory } from 'react-router'
import { signin } from '../../../requests/auth'

import { FetchIncorrectDataError } from '../../../requests/exceptions'
import { validateEmailWithRequest, validateUsernameWithRequest, validatePassword } from '../../../utils/validates'
import { SignInFormState } from './SignInPanel'

const useStyles = makeStyles({
    formRoot: {
        width: '200px'
    }
})
interface SignInFormProps {
    formState: SignInFormState,
    changeFormState: Function,
    changeVisibility: Function,
    checkFormEmptyness: Function
}
export const SignInForm: React.FC<SignInFormProps> = ({ formState, changeFormState, changeVisibility, checkFormEmptyness }) => {

    const formId = 'id-sign-in-form'
    const history = useHistory()

    const stateRef = useRef<SignInFormState>(formState)

    const classes = useStyles()

    stateRef.current = formState;
    console.log(formState)
    const validateDict: { [k: string]: (...args: any[]) => Promise<any> } = {
        email: validateEmailWithRequest,
        username: validateUsernameWithRequest,
        password: validatePassword
    }

    const onSubmitHandle = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        const empty = checkFormEmptyness()
        if (empty) return
        try {
            const data = await signin({ password: formState.password?.value || "", username: formState.username?.value || "", email: formState.email?.value || "" })

            changeVisibility()
        } catch (err) {
            if (err instanceof FetchIncorrectDataError) {

            }
        }


    }

    const onChangeHandle = async (e: ChangeEvent<HTMLInputElement>) => {
        const elem = e.currentTarget
        const value = elem.value
        const name = elem.name as string
        const now = new Date()

        changeFormState(name, { value: value, lastChange: now })

        const validFunc = validateDict[name]

        setTimeout(async () => {
            if (stateRef?.current[name]?.lastChange?.getTime() === now.getTime()) {
                try {
                    console.log('await')
                    const data = await validFunc(value)
                    const statePart: SignInFormState = Object.assign(data)
                    changeFormState(name, data)
                } catch (err) {
                    history.push('/error')
                    return
                }

            }

        }, 500)



    }
    return <Paper elevation={2} >
        <Box p={3}>
            <form id={formId} className={classes.formRoot} onSubmit={onSubmitHandle} >
                <Grid container direction="column">
                    <Grid item justifyContent="center">
                        <TextField required id="id-email" name="email" label="Email" inputProps={{ "data-validate": "email" }} onChange={onChangeHandle} {...formState.email} />
                    </Grid>
                    <br />
                    <Grid item justifyContent="center">
                        <TextField required id="id-username" name="username" label="Username" inputProps={{ "data-validate": "username" }} onChange={onChangeHandle} {...formState.username} />
                    </Grid>
                    <br />
                    <Grid item justifyContent="center">
                        <TextField required id="id-password" name="password" label="Password" type="password" inputProps={{ "data-validate": "password" }} onChange={onChangeHandle} {...formState.password} />
                    </Grid>
                    <br />
                    <br />
                    <Grid container alignItems="center" justifyContent="flex-end">
                        <Button color="primary" variant="contained" type="submit" >
                            Sign In
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    </Paper>
}

