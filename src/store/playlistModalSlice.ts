import {PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit';
import {RootState} from '.';
import {AudioData} from 'src/@types/audio';

interface PlaylistModal {
  visible: boolean;
  selectedListId?: string;
}

const initialState: PlaylistModal = {
  visible: false,
};

const playlistModalSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    updatePlaylistVisibility: (state, {payload}: PayloadAction<boolean>) => {
      state.visible = payload;
    },
    updateSelectedListId: (state, {payload}: PayloadAction<string>) => {
      state.selectedListId = payload;
    },
  },
});

export const {updatePlaylistVisibility, updateSelectedListId} =
  playlistModalSlice.actions;

export const getPlaylistState = createSelector(
  (state: RootState) => state,
  state => state.playlistModal,
);

export default playlistModalSlice.reducer;
