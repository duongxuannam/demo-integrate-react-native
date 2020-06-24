import { AUTH_ACTION } from '../actionTypes';
import authState from '../states/authState';
import FirebaseHelper from '../../helpers/firebaseHelper';

const authReducer = (state = authState.initState, action) => {
  switch (action.type) {
    case AUTH_ACTION.DRIVER_LOGIN_SUCCESS:
      return {
        ...state,
        account: { ...action.result.object },
        resLogin: action.result,
        token: action.result.access_token,
      };
    case AUTH_ACTION.DRIVER_LOGIN_FAILURE:
      return {
        ...state,
        resLogin: action.error,
      };

    case AUTH_ACTION.LOG_OUT:
      FirebaseHelper().logout();
      return {
        ...authState.initState
      };
    default:
      return state;
  }
};

export default authReducer;
