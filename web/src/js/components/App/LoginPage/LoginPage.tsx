import { Box, Paper, TextField, Grid, Button, Typography } from '@material-ui/core'
import React, { MouseEventHandler, useEffect } from 'react'
import { useState } from 'react'
import { FormEvent } from 'react'
import styled from 'styled-components'
import { authenticate } from '../../../requests/auth'
import { propagateSignIn } from '../../../utils/auth'
import { Redirect, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { StateType } from '../../../redux/store/initialState'
import { checkIsUserLogged } from '../../../utils/auth'
import { startLoading, stopLoading } from '../../../redux/actions/loadingActions'
import { FetchAuthenticationError } from '../../../requests/exceptions'
import { FullGrid } from '../../Common/FullGrid'



export const LoginPage = () => {

    const [errors, setErrors] = useState<string>()
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => {
        redirectWhenLogged()
        dispatch(stopLoading())
    }, [])

    const redirectWhenLogged = async () => {
        const isLogged = await checkIsUserLogged()
        if (isLogged) {
            history.push('/')
        }
    }

    const sendCredentials = async () => {

        dispatch(startLoading())

        const username = document.getElementById("id-username") as HTMLInputElement
        const password = document.getElementById("id-password") as HTMLInputElement
        const uvalue = username.value
        const pvalue = password.value

        try {

            const data = await authenticate({ username: uvalue, password: pvalue })
            console.log('LoginPage: propagateSignIn()')
            propagateSignIn()
            history.push("/")

        } catch (err) {

            if (err instanceof FetchAuthenticationError) {
                setErrors("Invalid credentials.")
            }
            console.log(err)

        }
    }

    const onSubmitHandle = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        sendCredentials()
    }

    const goToSignIn = () => {
        history.push('/signin')
    }

    return (<Box height="100%" width="100%">
        <FullGrid container justifyContent="center" alignItems="center">
            <Grid item>
                <Paper elevation={2}>
                    <Box p={2}>
                        <form id="id-login-form" onSubmit={onSubmitHandle}>
                            <Grid container direction="column">
                                <Grid item>
                                    <TextField required id="id-username" name="username" label="Username" placeholder="" />
                                </Grid>
                                <br />
                                <Grid item>
                                    <TextField required id="id-password" name="password" label="Password" type="password" />
                                </Grid>
                                <br />
                                <Grid item justifyContent="center">
                                    <Typography variant="body2" color="error">
                                        {errors}
                                    </Typography>
                                </Grid>
                                <Grid container alignItems="center" justifyContent="flex-end">
                                    <Button color="primary" variant="contained" type="submit">
                                        submit
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item justifyContent="flex-start">
                                    <Button color="primary" onClick={goToSignIn}>
                                        signin
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Paper>
            </Grid>
        </FullGrid>
    </Box>)
}