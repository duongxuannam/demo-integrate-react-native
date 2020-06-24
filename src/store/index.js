import {
  createStore,
  applyMiddleware,
  compose
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import logger from 'redux-logger';
import rootSaga from './sagas';

import rootReducer from './reducers';

const persistConfig = {
  key: 'root',
  storage,
  // blacklist: ['auth', 'app', 'listing']
  blacklist: ['listing', 'communication']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();

export const store = createStore(persistedReducer,
  composeEnhancer(applyMiddleware(sagaMiddleware, logger)));

export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);
export default () => ({ store, persistor });
