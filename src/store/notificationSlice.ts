import {PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit';
import {RootState} from '.';

type notificationType = 'error' | 'success';

interface Notification {
  message: string;
  type: notificationType;
}

const initialState: Notification = {
  message: '',
  type: 'error',
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    updateNotification: (state, {payload}: PayloadAction<Notification>) => {
      state.message = payload.message;
      state.type = payload.type;
    },
  },
});

export const {updateNotification} = notificationSlice.actions;

export const getNotificationState = createSelector(
  (state: RootState) => state,
  state => state.notification,
);

export default notificationSlice.reducer;
