import colors from '@utils/colors';
import {FC, useState} from 'react';
import {View, StyleSheet, Image, Text, Pressable} from 'react-native';
import {useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PlayPauseBtn from '@ui/PlayPauseBtn';
import Loader from '@ui/Loader';
import {mapRange} from '@utils/math';
import {useProgress} from 'react-native-track-player';
import AudioPlayer from './AudioPlayer';
import CurrentAudioList from './CurrentAudioList';
import {getPlayerState} from 'src/store/playerSlice';
import {useAudioController} from 'src/hooks/useAudioController';
import {useFetchIsFavorite} from 'src/hooks/query';
import {useMutation, useQueryClient} from 'react-query';
import {getClient} from 'src/api/client';
import {catchAsyncError} from 'src/api/catchError';
import {updateNotification} from 'src/store/notificationSlice';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {HomeNavigatorStackParamList} from 'src/@types/navigation';
import {getAuthState} from 'src/store/authSlice';

interface Props {}

export const MiniPlayerHeight = 60;

const MiniAudioPlayer: FC<Props> = props => {
  const [playerVisibility, setPlayerVisibility] = useState(false);
  const [showCurrentList, setShowCurrentList] = useState(false);

  const {onGoingAudio} = useSelector(getPlayerState);
  const {profile} = useSelector(getAuthState);
  const {isPlaying, isBusy, togglePlayPause} = useAudioController();
  const {data: isFav} = useFetchIsFavorite(onGoingAudio?.id || '');
  const {navigate} =
    useNavigation<NavigationProp<HomeNavigatorStackParamList>>();
  const progress = useProgress();
  const queryClient = useQueryClient();

  const poster = onGoingAudio?.poster;
  const source = poster ? {uri: poster} : require('../assets/music.png');

  const toggleIsFav = async (id: string) => {
    if (!id) return;

    const client = await getClient();

    await client.post('/favorite?audioId=' + id);
  };

  const favoriteMutate = useMutation({
    mutationFn: async id => await toggleIsFav(id),
    onMutate: (id: string) => {
      queryClient.setQueryData<boolean>(
        ['favorite', onGoingAudio?.id],
        prev => !prev,
      );
    },
  });

  const showPlayerModal = () => {
    setPlayerVisibility(true);
  };

  const closePlayerModal = () => {
    setPlayerVisibility(false);
  };

  const handleOnCurrentListClose = () => {
    setShowCurrentList(false);
  };

  const handleOnListOptionPress = () => {
    closePlayerModal();
    setShowCurrentList(true);
  };

  const handleOnProfileLinkPress = () => {
    closePlayerModal();

    if (profile?.id === onGoingAudio?.owner.id) {
      navigate('Profile');
    } else {
      navigate('PublicProfile', {profileId: onGoingAudio?.owner.id || ''});
    }
  };

  return (
    <>
      <View
        style={{
          height: 2,
          backgroundColor: colors.SECONDARY,
          width: `${mapRange({
            outputMin: 0,
            outputMax: 100,
            inputMin: 0,
            inputMax: progress.duration,
            inputValue: progress.position,
          })}%`,
        }}
      />
      <View style={styles.container}>
        <Image source={source} style={styles.poster} />

        <Pressable onPress={showPlayerModal} style={styles.contentContainer}>
          <Text style={styles.title}>{onGoingAudio?.title}</Text>
          <Text style={styles.name}>{onGoingAudio?.owner.name}</Text>
        </Pressable>

        <Pressable
          onPress={() => favoriteMutate.mutate(onGoingAudio?.id || '')}
          style={{paddingHorizontal: 10}}>
          <AntDesign
            name={isFav ? 'heart' : 'hearto'}
            size={24}
            color={colors.CONTRAST}
          />
        </Pressable>

        {isBusy ? (
          <Loader />
        ) : (
          <PlayPauseBtn playing={isPlaying} onPress={togglePlayPause} />
        )}
      </View>

      <AudioPlayer
        visible={playerVisibility}
        onRequestClose={closePlayerModal}
        onListOptionPress={handleOnListOptionPress}
        onProfileLinkPress={handleOnProfileLinkPress}
      />
      <CurrentAudioList
        visible={showCurrentList}
        onRequestClose={handleOnCurrentListClose}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: MiniPlayerHeight,
    backgroundColor: colors.PRIMARY,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    height: '100%',
    padding: 5,
  },
  poster: {
    height: MiniPlayerHeight - 10,
    width: MiniPlayerHeight - 10,
    borderRadius: 5,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: '700',
    paddingHorizontal: 5,
  },
  name: {
    color: colors.SECONDARY,
    fontWeight: '700',
    paddingHorizontal: 5,
  },
});

export default MiniAudioPlayer;
