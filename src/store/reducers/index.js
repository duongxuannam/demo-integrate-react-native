import { combineReducers } from 'redux';
import shipment from './shipmentReducer';
import app from './appReducer';
import driver from './driverReducer';
import auth from './authReducer';
import config from './configReducer';
import progress from './progressReducer';
import notification from './notificationReducer';
import payment from './paymentReducer';
import chat from './chatReducer';

export default combineReducers({
  auth,
  app,
  shipment,
  driver,
  config,
  progress,
  notification,
  payment,
  chat
});
