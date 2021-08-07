import store from "../redux/store/store";
import {logIn} from '../redux/actions/authActions'
import { getObject, setObject } from "./localStorage";
import { refresh as refreshAuth} from '../requests/auth'
import {FetchAuthenticationError} from '../requests/exceptions'
import Cookie from 'js-cookie'

type UserAuthState = {
  logged: boolean;
  exp: number;
};

const checkByReduxStore: () => boolean = function () {
  console.log('checkByReduxStore()')
  const state = store.getState();

  const authState: UserAuthState = state.auth;
  console.log(authState)
  if (!authState.exp) return false;

  let unix_timestamp = authState.exp;
  const date = new Date(unix_timestamp * 1000);
  const now = new Date();

  if (date > now) {
    return true;
  }

  return false;
};

const checkByLocalStorage: () => boolean = function () {
  console.log('checkByLocalStorage()')
  const authState = getObject<UserAuthState>("auth") as UserAuthState
  console.log(authState)
  if (!authState.exp) return false;

  let unix_timestamp = authState.exp;
  const date = new Date(unix_timestamp * 1000);
  const now = new Date();

  if (date > now) {
    return true;
  }

  return false;
};

export const propagateSignIn: ()=>void = function(){
  const exptime = Cookie.get('access_time')
  console.log(`Cookie[access_time]: ${exptime}`)
  if ( exptime ){
    const auth = {logged:true, exp:exptime}
    console.log(`setObject('auth',auth)`)
    setObject('auth',auth)
    console.log(`store.dispatch(logIn(auth))`)
    store.dispatch(logIn(auth))
  }
  console.log('propagateSignIn finished.')
}

export const checkIsUserLogged: () => Promise<boolean> = async function () {
    console.log("Checking is user logged.")
    const checks = [
        checkByReduxStore,
        checkByLocalStorage
    ]
    for (let check of checks){
        console.log(`Checking is user logged in by [${check.name}]`)
        if ( check() ){ 
          console.log(`[${check.name}] returned true.`)
          return true
        }
        console.log(`[${check.name}] returned false.`)
    }
    // console.log(`Checking is user logged in by [refreshAuth}]`)
    // try{
    //     const data = await refreshAuth()
    //     if(data.success){
    //       console.log(`[refreshAuth] returned true.`)
    //       return true
    //     }
    // }catch(err){
    //     console.log(`User is not logged.`)
    //     return false
    // }
    console.log(`User is not logged.`)
    return false
};
