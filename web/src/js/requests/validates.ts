import axios, { AxiosRequestConfig } from 'axios'
import { FetchFailResponse, FetchNoResponse , FetchError} from './exceptions'
import  urls  from './urls'


const simpleHeadValidation:(url: string, config: AxiosRequestConfig)=>Promise<any> = function(url, config){
    return axios.head(url, config).then((response)=>{
        return true
    }).catch((error)=>{
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
            if (error.response.status === 404) return false
            throw new FetchFailResponse(error.response)
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
            throw new FetchNoResponse()
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message)
            throw new FetchError()
        }
    })
}



const signInValidates:(variant: string, value:string)=>{} = function(variant, value){

    const d:{[k: string]:string} = {
        email:'emailExistsUrl',
        username: 'usernameExistsUrl'
    }
    if (!d[variant]) throw TypeError(`There is no '${variant}' allowed in signInValidates.`)
    const url = urls[d[variant]](value)
    return simpleHeadValidation(url, {})
    
}

export  { 
    signInValidates,
    simpleHeadValidation
}