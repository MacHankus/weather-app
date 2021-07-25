import {combineReducers} from 'redux';
import loadingReducer from './loadingReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
    loading:loadingReducer,
    auth:authReducer
});

export default rootReducer;