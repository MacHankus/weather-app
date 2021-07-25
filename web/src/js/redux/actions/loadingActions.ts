import {loading} from '../constants/constants';

export function startLoading(){
    return {
        type:loading.LOADING_START,
        payload:true
    }
}
export function stopLoading(){
    return {
        type:loading.LOADING_STOP,
        payload:false
    }
}