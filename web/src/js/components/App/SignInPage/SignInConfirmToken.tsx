import React, { ChangeEvent, useRef } from "react"
import { Paper, Box, TextField, Button, Grid, makeStyles } from '@material-ui/core'
import { SignInFormState , BasicInfo} from './SignInPanel'
import { useHistory } from "react-router"
import { confirmation } from '../../../requests/auth'
import { FetchIncorrectDataError } from "../../../requests/exceptions"

const useStyle = makeStyles({
    confirmInput: {
        width: '200px'
    }
})

interface SignInConfirmTokenProps {
    changeConfirmState: Function,
    confirmState: BasicInfo,
    changeVisibility: Function,
    formState: SignInFormState
}

export const SignInConfirmToken = ({ changeConfirmState, formState, confirmState, changeVisibility }: SignInConfirmTokenProps) => {

    const history = useHistory()

    const classes = useStyle()

    const stateRef = useRef<BasicInfo>()
    stateRef.current = confirmState

    const onSubmit = async (e: React.SyntheticEvent)=>{
        e.preventDefault()
        try {
            console.log('await')
            const data = await confirmation({username:formState?.username?.value as string, confirmation_key: confirmState?.value as string})
            history.push('/signin/success')
            return
        } catch (err) {
            if(err instanceof FetchIncorrectDataError){
                changeConfirmState({ error: true, text: "Incorrect token." })
                return
            }
            history.push('/error')
            return
        }
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value
        const now = new Date()
        changeConfirmState({ value, lastChange: now })

        setTimeout(async () => {
            if (stateRef?.current?.lastChange?.getTime() === now.getTime()) {
                if (value.length === 7) {
                    changeConfirmState({
                        error: false,
                        text: "",
                    })
                    return
                } else if(value.length > 7){
                    changeConfirmState({ error: true, text: "Token is too long." })
                }else {
                    changeConfirmState({ error: true, text: "Token is too short." })
                }
            }

        }, 500)

    }
    console.log(confirmState)
    return (
        <Paper>
            <Box p={2}>
                <form onSubmit={onSubmit}>
                    <Grid container justifyContent="space-between" alignItems="center" direction="column">
                        <Grid item>
                            <TextField id="id-confirmation-token" name="confirmation_token" label="Confirmation token" onChange={onChange} {...confirmState} helperText={confirmState.text} className={classes.confirmInput} />
                        </Grid>
                        <br />
                        <br />
                        <Grid item>
                            <Button color="primary" variant="contained" type="submit">
                                Confirm
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Paper>

    )
}

function makeStyle(arg0: {}) {
    throw new Error("Function not implemented.")
}
