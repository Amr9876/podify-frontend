import {Keys, getFromAsyncStorage} from '@utils/asyncStorage';
import TrackPlayer, {Event} from 'react-native-track-player';
import {getClient} from 'src/api/client';

interface StaleAudio {
  audio: string;
  progress: number;
  date: Date;
}

let timeoutId: number;

const debounce = (func: Function, delay: number) => {
  return (...args: any) => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

const sendHistory = async (staleAudio: StaleAudio) => {
  const client = await getClient();

  await client.post('/history', {...staleAudio}).catch(err => console.log(err));
};

export const playbackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    await TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, async () => {
    await TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    await TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    await TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, async e => {
    const historyDisabled = await getFromAsyncStorage(Keys.DISABLE_HISTORY);

    if (historyDisabled === 'true') return;

    const lists = await TrackPlayer.getQueue();
    const audio = lists[e.track];

    if (audio) {
      const debounceHistory = debounce(sendHistory, 60_000);
      debounceHistory({
        audio: audio.id,
        progress: e.position,
        date: new Date(Date.now()),
      });
    }
  });
};
