import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AppModal from '@ui/AppModal';
import {
  getPlaylistState,
  updatePlaylistVisibility,
} from 'src/store/playlistModalSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useFetchPlaylistAudios} from 'src/hooks/query';
import AudioListItem from '@ui/AudioListItem';
import colors from '@utils/colors';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import {getPlayerState} from 'src/store/playerSlice';
import {useAudioController} from 'src/hooks/useAudioController';

const PlaylistAudioModal = () => {
  const {visible, selectedListId} = useSelector(getPlaylistState);
  const {onGoingAudio} = useSelector(getPlayerState);
  const {onAudioPress} = useAudioController();
  const {data, isLoading} = useFetchPlaylistAudios(selectedListId || '');
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(updatePlaylistVisibility(false));
  };

  if (isLoading)
    return (
      <View style={styles.container}>
        <AudioListLoadingUI />
      </View>
    );

  return (
    <AppModal visible={visible} onRequestClose={handleClose}>
      <Text style={styles.title}>{data?.title}</Text>
      <FlatList
        contentContainerStyle={styles.container}
        data={data?.audios}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <AudioListItem
            isPlaying={onGoingAudio?.id === item.id}
            onPress={() => onAudioPress(item, data!.audios)}
            audio={item}
          />
        )}
      />
    </AppModal>
  );
};

export default PlaylistAudioModal;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
  },
});
