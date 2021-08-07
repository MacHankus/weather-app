import axios, { AxiosRequestConfig } from 'axios'
import constants from './requestConstants'
import { AuthUser, AxiosAdditionalProps, ConfirmationData, SignInUser, UserAuthSuccessResponse } from './common'
import { FetchError, FetchNoResponse, FetchFailResponse, FetchAuthenticationError, FetchIncorrectDataError } from './exceptions'
import urls from './urls'
import Cookies from 'js-cookie'


export function axiosAuthenticate({ username, password }: AuthUser, url: string, config: AxiosRequestConfig): Promise<UserAuthSuccessResponse> {
    return axios.post<UserAuthSuccessResponse>(url, { username, password }, config)
        .then((response) => {
            if (response.data.success) {
                console.log(response.data)
                return response.data
            } else {
                throw { response: response }
            }
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data)
                console.log(error.response.status)
                console.log(error.response.headers)
                if (error.response.status === 401) throw new FetchAuthenticationError(error.response, "Authentication failed.")
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



export function authenticate(user: AuthUser, headers: object = {}) {
    const url = urls.authUrl()
    return axiosAuthenticate(user, url, { headers })
}

export function axiosRefresh(url: string, config: AxiosRequestConfig) {
    return axios.post(url, {}, config)
        .then((response) => {
            if (response.data.success) {
                console.log(response.data)
                return response.data
            } else {
                throw { response: response }
            }
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data)
                console.log(error.response.status)
                console.log(error.response.headers)
                if (error.response.statusCode === 401) throw new FetchAuthenticationError(error.response, "Can't refresh token. Please sign in again.")
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

export function refresh(headers: object = {}) {
    const url = urls.refreshUrl()
    const csrfToken = Cookies.get('csrf_refresh_token')
    console.log('Got refresh csrf token : ' + csrfToken)
    headers = Object.assign({ 'X-CSRF-TOKEN': csrfToken }, headers)
    return axiosRefresh(url, { headers })
}


export function axiosSignIn({ username, password, email }: SignInUser, url: string, config: AxiosRequestConfig) {
    return axios.post(url, { username, password, email }, config)
        .then((response) => {
            if (response.data.success) {
                console.log(response.data)
                return response.data
            } else {
                throw { response: response }
            }
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data)
                console.log(error.response.status)
                console.log(error.response.headers)
                if (error.response.statusCode === 400) throw new FetchIncorrectDataError(error.response, "Incorrect data provided.")
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

export function signin(user: SignInUser) {
    const url = urls.signInUrl()
    return axiosSignIn(user, url, { headers: { 'Content-Type': 'application/json' } })
}


export function axiosSignInConfirmation({ username, confirmation_key }: ConfirmationData, url: string, config: AxiosRequestConfig) {
    return axios.post(url, { username, confirmation_key }, config)
        .then((response) => {
            if (response.data.success) {
                console.log(response.data)
                return response.data
            } else {
                throw { response: response }
            }
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data)
                console.log(error.response.status)
                console.log(error.response.headers)
                if (error.response.statusCode === 422) throw new FetchIncorrectDataError(error.response, "Incorrect token.")
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

export function confirmation(confirmation: ConfirmationData) {
    const url = urls.signInConfirmationUrl()
    return axiosSignInConfirmation(confirmation, url, { headers: { 'Content-Type': 'application/json' } })
}