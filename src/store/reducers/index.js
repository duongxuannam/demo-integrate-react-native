import { combineReducers } from 'redux';
import auth from './authReducer';
import app from './appReducer';
import listing from './listingReducer';
import progress from './progressReducer';
import notification from './notificationReducer';
import payment from './paymentReducer';
import communication from './communicationReducer';

export default combineReducers({
  auth,
  app,
  listing,
  progress,
  notification,
  payment,
  communication
});
