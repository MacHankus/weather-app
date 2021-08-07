import React from "react"
import { useSelector } from "react-redux"
import { StateType } from "../../redux/store/initialState"
import PageLoader from '../Loaders/PageLoader'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import ProtectedRoute from '../Route/ProtectedRoute'
import { LoginPage } from '../App/LoginPage/LoginPage'
import { Main } from "./MainPage/Main"
import { useDispatch } from 'react-redux'
import {stopLoading} from '../../redux/actions/loadingActions'
import { Box } from "@material-ui/core";
import {SignInPage} from './SignInPage/SignInPage'


const App = () => {
    const loading = useSelector(
        (state: StateType) => state.loading,
    )
    const dispatch = useDispatch()
    // React.useEffect(() => {
    //     const jssStyles = document.querySelector('#jss-server-side');
    //     if (jssStyles) {
    //       //jssStyles?.parentElement?.removeChild(jssStyles);
    //     }
    //   }, []);
    return <>
        <Box height="100%" width="100%">
            <Switch>
                <Route exact path="/login">
                    <LoginPage/>
                </Route>
                <Route exact path="/error">
                    <div>error</div>
                </Route>
                <Route exact path="/signin">
                    <SignInPage/>
                </Route>
                <ProtectedRoute path="/" component={<Main/>}/>
            </Switch>
        </Box>
        
        {
            loading && <PageLoader />
        }
    </>
}


export default App
