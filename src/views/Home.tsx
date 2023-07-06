import {useState} from 'react';
import LatestUploads from '@components/LatestUploads';
import RecommendedAudios from '@components/RecommendedAudios';
import {Pressable, Text, ScrollView, StyleSheet, View} from 'react-native';
import {AudioData, Playlist} from 'src/@types/audio';
import OptionsModal from '@components/OptionsModal';
import MaterialComIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '@utils/colors';
import {getClient} from 'src/api/client';
import {catchAsyncError} from 'src/api/catchError';
import {useDispatch} from 'react-redux';
import {updateNotification} from 'src/store/notificationSlice';
import PlaylistModal from '@components/PlaylistModal';
import PlaylistForm, {PlaylistInfo} from '@components/PlaylistForm';
import {useFetchPlaylist} from 'src/hooks/query';
import {useAudioController} from 'src/hooks/useAudioController';
import AppView from '@components/AppView';
import RecentlyPlayed from '@components/RecentlyPlayed';
import RecommendedPlaylist from '@components/RecommendedPlaylist';
import {
  updatePlaylistVisibility,
  updateSelectedListId,
} from 'src/store/playlistModalSlice';

const Home = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioData>();
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const {onAudioPress} = useAudioController();

  const {data} = useFetchPlaylist();

  const dispatch = useDispatch();

  const handleOnFavPress = async () => {
    if (!selectedAudio) return;

    try {
      const client = await getClient();

      const {data} = await client.post(`/favorite?audioId=${selectedAudio.id}`);
    } catch (error) {
      const errorMessage = catchAsyncError(error);

      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    } finally {
      setSelectedAudio(undefined);
      setShowOptions(false);
    }
  };

  const handleOnAddToPlaylist = async () => {
    setShowOptions(false);
    setShowPlaylistModal(true);
  };

  const handleOnLongPress = (audio: AudioData) => {
    setSelectedAudio(audio);

    setShowOptions(true);
  };

  const handlePlaylistSubmit = async (playlist: PlaylistInfo) => {
    if (!playlist.title.trim()) return;

    try {
      const client = await getClient();

      const {data} = await client.post('/playlist/create', {
        resId: selectedAudio?.id,
        title: playlist.title,
        visibility: playlist.private ? 'private' : 'public',
      });
    } catch (error) {
      const errorMessage = catchAsyncError(error);

      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    }
  };

  const updatePlaylist = async (item: Playlist) => {
    try {
      const client = await getClient();

      const {data} = await client.patch('/playlist', {
        id: item.id,
        item: selectedAudio?.id,
        title: item.title,
        visibility: item.visibility,
      });

      setSelectedAudio(undefined);
      setShowPlaylistModal(false);
      dispatch(
        updateNotification({message: 'New audio added.', type: 'success'}),
      );
    } catch (error) {
      const errorMessage = catchAsyncError(error);

      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    }
  };

  const handleOnListPress = (playlist: Playlist) => {
    dispatch(updateSelectedListId(playlist.id));
    dispatch(updatePlaylistVisibility(true));
  };

  return (
    <AppView>
      <ScrollView contentContainerStyle={{padding: 10}}>
        <View style={styles.space}>
          <RecentlyPlayed />
        </View>

        <View style={styles.space}>
          <LatestUploads
            onAudioPress={onAudioPress}
            onAudioLongPress={handleOnLongPress}
          />
        </View>

        <View style={styles.space}>
          <RecommendedAudios
            onAudioPress={onAudioPress}
            onAudioLongPress={handleOnLongPress}
          />
        </View>

        <View style={styles.space}>
          <RecommendedPlaylist onListPress={handleOnListPress} />
        </View>

        <OptionsModal
          options={[
            {
              title: 'Add to playlist',
              icon: 'playlist-music',
              onPress: handleOnAddToPlaylist,
            },
            {
              title: 'Add to favorites',
              icon: 'cards-heart',
              onPress: handleOnFavPress,
            },
          ]}
          renderItem={item => (
            <Pressable
              onPress={item.onPress}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <MaterialComIcons
                color={colors.PRIMARY}
                name={item.icon}
                size={24}
              />
              <Text
                style={{color: colors.PRIMARY, fontSize: 16, marginLeft: 5}}>
                {item.title}
              </Text>
            </Pressable>
          )}
          visible={showOptions}
          onRequestClose={() => setShowOptions(false)}
        />

        <PlaylistForm
          visible={showPlaylistForm}
          onRequestClose={() => setShowPlaylistForm(false)}
          onSubmit={handlePlaylistSubmit}
        />

        <PlaylistModal
          visible={showPlaylistModal}
          onRequestClose={() => setShowPlaylistModal(false)}
          list={data || []}
          onCreateNewPress={() => {
            setShowPlaylistModal(false);
            setShowPlaylistForm(true);
          }}
          onPlaylistPress={updatePlaylist}
        />
      </ScrollView>
    </AppView>
  );
};

const styles = StyleSheet.create({
  space: {
    marginBottom: 15,
  },
});

export default Home;
