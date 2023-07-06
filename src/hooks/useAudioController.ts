import TrackPlayer, {
  Track,
  usePlaybackState,
  State,
  AppKilledPlaybackBehavior,
  Capability,
} from 'react-native-track-player';
import {useDispatch, useSelector} from 'react-redux';
import {AudioData} from 'src/@types/audio';
import {
  getPlayerState,
  updateOnGoingAudio,
  updateOnGoingList,
  updatePlaybackRate,
} from 'src/store/playerSlice';
import deepEqual from 'deep-equal';
import {useEffect} from 'react';

let isReady = false;

const updateQueue = async (data: AudioData[]) => {
  const lists: Track[] = data.map(item => ({
    id: item.id,
    url: item.file,
    title: item.title,
    artist: item.owner.name,
    artwork: item.poster || require('../assets/music.png'),
    genre: item.category,
    isLiveStream: true,
  }));

  await TrackPlayer.add([...lists]);
};

export const useAudioController = () => {
  const playbackState = usePlaybackState();
  const dispatch = useDispatch();
  const {onGoingAudio, onGoingList} = useSelector(getPlayerState);

  const isPlayerReady = playbackState !== State.None;
  const isPlaying = playbackState === State.Playing;
  const isPaused = playbackState === State.Paused;
  const isBusy =
    playbackState === State.Buffering || playbackState === State.Connecting;

  const onAudioPress = async (item: AudioData, data: AudioData[]) => {
    if (!isPlayerReady) {
      await updateQueue(data);
      dispatch(updateOnGoingAudio(item));

      const index = data.findIndex(audio => audio.id === item.id);

      await TrackPlayer.skip(index);
      await TrackPlayer.play();

      dispatch(updateOnGoingList(data));
    }

    if (playbackState === State.Playing && onGoingAudio?.id === item.id) {
      await TrackPlayer.pause();
      return;
    }

    if (playbackState === State.Paused && onGoingAudio?.id === item.id) {
      await TrackPlayer.play();
      return;
    }

    if (onGoingAudio?.id !== item.id) {
      const fromSameList = deepEqual(onGoingList, data);

      await TrackPlayer.pause();
      const index = data.findIndex(audio => audio.id === item.id);

      if (!fromSameList) {
        await TrackPlayer.reset();
        await updateQueue(data);
        dispatch(updateOnGoingList(data));
      }

      await TrackPlayer.skip(index);
      await TrackPlayer.play();

      dispatch(updateOnGoingAudio(item));
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) await TrackPlayer.pause();
    if (isPaused) await TrackPlayer.play();
  };

  const seekTo = async (position: number) => {
    await TrackPlayer.seekTo(position);
  };

  const skipTo = async (seconds: number) => {
    const currentPosition = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(currentPosition + seconds);
  };

  const onNextPress = async () => {
    const currentList = await TrackPlayer.getQueue();
    const currentIndex = await TrackPlayer.getCurrentTrack();

    if (currentIndex === null) return;

    const nextIndex = currentIndex + 1;

    const nextAudio = currentList[nextIndex];

    if (nextAudio) {
      await TrackPlayer.skipToNext();
      dispatch(updateOnGoingAudio(onGoingList[nextIndex]));
    }
  };

  const onPreviousPress = async () => {
    const currentList = await TrackPlayer.getQueue();
    const currentIndex = await TrackPlayer.getCurrentTrack();

    if (currentIndex === null) return;

    const preIndex = currentIndex - 1;

    const nextAudio = currentList[preIndex];

    if (nextAudio) {
      await TrackPlayer.skipToPrevious();
      dispatch(updateOnGoingAudio(onGoingList[preIndex]));
    }
  };

  const setPlaybackRate = async (rate: number) => {
    await TrackPlayer.setRate(rate);
    dispatch(updatePlaybackRate(rate));
  };

  useEffect(() => {
    (async () => {
      if (isReady) return;

      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        progressUpdateEventInterval: 10,
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
      });

      isReady = true;
    })();
  }, []);

  return {
    onAudioPress,
    onNextPress,
    onPreviousPress,
    togglePlayPause,
    seekTo,
    skipTo,
    setPlaybackRate,
    isPlayerReady,
    isPlaying,
    isBusy,
  };
};
