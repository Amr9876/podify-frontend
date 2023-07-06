import {PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit';
import {RootState} from '.';
import {AudioData} from 'src/@types/audio';

interface Player {
  onGoingAudio: AudioData | null;
  onGoingList: AudioData[];
  playbackRate: number;
}

const initialState: Player = {
  onGoingAudio: null,
  onGoingList: [],
  playbackRate: 1,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    updateOnGoingAudio: (state, {payload}: PayloadAction<AudioData>) => {
      state.onGoingAudio = payload;
    },
    updateOnGoingList: (state, {payload}: PayloadAction<AudioData[]>) => {
      state.onGoingList = payload;
    },
    updatePlaybackRate: (state, {payload}: PayloadAction<number>) => {
      state.playbackRate = payload;
    },
  },
});

export const {updateOnGoingAudio, updateOnGoingList, updatePlaybackRate} =
  playerSlice.actions;

export const getPlayerState = createSelector(
  (state: RootState) => state,
  state => state.player,
);

export default playerSlice.reducer;
