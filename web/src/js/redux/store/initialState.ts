
export type authType = {
    logged: boolean,
    exp: number
}

export type StateType = {
    loading: boolean,
    auth: authType
}


const initialState: StateType = {
    loading:true,
    auth:{
        logged:false,
        exp: 0
    }
}

export default initialState;