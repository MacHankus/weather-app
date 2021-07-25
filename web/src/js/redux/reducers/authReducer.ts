import {auth} from '../constants/constants';
import initialState from '../store/initialState';


export default function authReducer(state = initialState.auth, action) {
    switch (action.type) {
      case auth.LOG_IN:
        return Object.assign({}, state,action.payload)
        case auth.LOG_OUT:
        return Object.assign({}, state, action.payload)
      default:
        return state
    }
  }