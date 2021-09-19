import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom"
import { checkIsUserLogged, propagateSignIn } from '../../utils/auth'
import { connect, ConnectedProps } from 'react-redux'
import { logIn, logOut } from '../../redux/actions/authActions'

const mapStateToProps = (state, ownProps) => ({
    auth: state.auth,
    loading: state.loading
})

const mapDispatchToProps = {
    logIn,
    logOut
}
const connector = connect(mapStateToProps, mapDispatchToProps)

// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>
interface ProtectedRoutePropsType extends PropsFromRedux { }
class ProtectedRoute extends Route<ProtectedRoutePropsType> {
    state = {
        permissionGiven: null
    }
    async componentDidMount() {
        await this.checkLogged()

    }
    async componentDidUpdate() {
        if (this.state.permissionGiven === null) await this.checkLogged()
    }
    async checkLogged() {
        const isLogged = await checkIsUserLogged()
        console.log(`isLogged: ${isLogged}`)

        if (isLogged) {
            console.log("User is logged in - running propagateSignIn.")
            propagateSignIn()
            this.setState({permissionGiven:true})
            return
        }
        console.log("User is not logged in - running logOut.")
        this.setState({permissionGiven:false},this.props.logOut)
        console.log('Finish checkLogged.')
    }
    render() {
        return <Route {...this.props}>
            {this.state.permissionGiven === false ? <Redirect to="/login" /> : this.state.permissionGiven === true ? this.props.component : <div></div>}
        </Route>
    }
}

const ConnectedProtectedRoute = connect(mapStateToProps, mapDispatchToProps)(ProtectedRoute)

export default ConnectedProtectedRoute