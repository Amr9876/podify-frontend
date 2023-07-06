import {
  combineReducers,
  configureStore,
  createImmutableStateInvariantMiddleware,
} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import notificationReducer from './notificationSlice';
import playerReducer from './playerSlice';
import playlistModalReducer from './playlistModalSlice';

const immutableStateInvariantMiddleware =
  createImmutableStateInvariantMiddleware();

const reducer = combineReducers({
  auth: authReducer,
  notification: notificationReducer,
  player: playerReducer,
  playlistModal: playlistModalReducer,
});

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(immutableStateInvariantMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
