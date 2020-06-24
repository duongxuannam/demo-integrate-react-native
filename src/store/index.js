import {
  createStore,
  applyMiddleware,
  compose
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer, createMigrate } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/es/storage';
import logger from 'redux-logger';
import rootSaga from './sagas';

import rootReducer from './reducers';

const migration = {
  0: (state) => ({
    // migration clear out device state
    ...state,
  }),
  // 1: (state) => ({
  //   // migration to keep only device state
  //   device: state.device
  // })
};

const persistConfig = {
  key: 'root',
  version: 0,
  storage,
  blacklist: ['driver', 'shipment', 'app', 'progress'],
  stateReconciler: autoMergeLevel2,
  migrate: createMigrate(migration, { debug: false })
  // blacklist: ['driver', 'shipment', 'app', 'progress']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();

export const store = createStore(persistedReducer,
  composeEnhancer(applyMiddleware(sagaMiddleware, logger)));

export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);
export default () => ({ store, persistor });
