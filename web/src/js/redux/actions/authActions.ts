import {auth} from '../constants/constants';

export function logIn(object: object){
    return {
        type:auth.LOG_IN,
        payload:object
    }
}
export function logOut(){
    return {
        type:auth.LOG_OUT,
        payload:{
            logged:false,
        }
    }
}