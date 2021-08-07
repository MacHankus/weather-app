import { Grid, makeStyles, Paper, Typography, Box } from "@material-ui/core";
import React from "react";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { classes } from "istanbul-lib-coverage";


const useStyles = makeStyles({
    icon: {
        fontSize: '50px',
        color: 'green'
    }
})

export const SignInSuccess = () => {

    const classes = useStyles()

    return (
        <Paper elevation={2}>
            <Box p={2} >
                <Grid container justifyContent="center" direction="column" alignItems="center">
                    <Grid item>
                        <Typography align="center">
                            Success!

                        </Typography>
                    </Grid>
                    <br/>
                    <Grid item>
                        <CheckCircleOutlineIcon className={classes.icon} />
                    </Grid>
                    <br/>
                    <Grid item>
                        <Typography align="center">
                            Time to log in.
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    )
}