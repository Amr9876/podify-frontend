import {ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import {useFetchPlaylist} from 'src/hooks/query';
import PlaylistItem from '@ui/PlaylistItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from './EmptyRecords';
import {useDispatch} from 'react-redux';
import {Playlist} from 'src/@types/audio';
import {
  updatePlaylistVisibility,
  updateSelectedListId,
} from 'src/store/playlistModalSlice';

const PlaylistTab = () => {
  const {data, isLoading} = useFetchPlaylist();
  const dispatch = useDispatch();

  if (isLoading) return <AudioListLoadingUI />;

  const handleOnListPress = (playlist: Playlist) => {
    dispatch(updateSelectedListId(playlist.id));
    dispatch(updatePlaylistVisibility(true));
  };

  return (
    <ScrollView style={styles.container}>
      {!data?.length && <EmptyRecords title="There is no playlist!" />}
      {data &&
        data.map((item, index) => (
          <PlaylistItem
            key={index}
            onPress={() => handleOnListPress(item)}
            playlist={item}
          />
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default PlaylistTab;
