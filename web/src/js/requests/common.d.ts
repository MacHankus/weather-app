
export interface AuthUser {
    username: string,
    password: string 
}

export interface AxiosAdditionalProps {
    url: string,
    headers: Record<string, string> | undefined
} 
export interface StandardSuccessResponse{
    success: boolean,
    message: string,
    details?:Array<string>,
    code: integer | string
}
export interface UserAuthSuccessResponse extends StandardSuccessResponse {

}

export type SignInUser ={
    username: string,
    password: string ,
    email: string
}

export type ConfirmationData ={
    username: string,
    confirmation_key: string
}
