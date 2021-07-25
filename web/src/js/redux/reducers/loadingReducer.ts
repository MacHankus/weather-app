import {loading} from '../constants/constants';
import initialState from '../store/initialState';

export default function loadingReducer(state = initialState.loading, action) {
    switch (action.type) {
      case loading.LOADING_START:
        return true 
      case loading.LOADING_STOP:
        return false
      default:
        return state
    }
  }