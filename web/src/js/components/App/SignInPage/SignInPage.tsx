import { Box, Button, Grid, TextField, Typography } from '@material-ui/core'
import React, { MouseEventHandler, useEffect, useState } from 'react'
import { FullGrid } from '../../Common/FullGrid'
import { startLoading, stopLoading } from '../../../redux/actions/loadingActions'
import { useSelector, useDispatch } from 'react-redux'
import { axiosSignIn, signin } from '../../../requests/auth'
import { CallbackOnChangeLoader } from '../../CallbackLoaders/CallbackOnChangeLoader'
import {validateEmailWithRequest} from '../../../utils/validates'
import { SignInPanel } from './SignInPanel'


const El:React.FC<{onClick:MouseEventHandler<HTMLDivElement>}> = ({children, onClick})=>{
    const [state, setState] = useState(0)
    return <div onClick={onClick}>
        {children}
    </div>
}

export const SignInPage = () => {

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(stopLoading())
    }, [])

    return (<Box height="100%" width="100%">
        <FullGrid container justifyContent="center" alignItems="center">
            <Grid item>
                <SignInPanel/> 
            </Grid>
        </FullGrid>
    </Box>)
}