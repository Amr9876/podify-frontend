import {StyleSheet} from 'react-native';
import React from 'react';
import {useFetchPublicPlaylist} from 'src/hooks/query';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from './EmptyRecords';
import {ScrollView} from 'react-native';
import PlaylistItem from '@ui/PlaylistItem';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PublicProfileTabParamList} from 'src/@types/navigation';
import {useDispatch} from 'react-redux';
import {Playlist} from 'src/@types/audio';
import {
  updatePlaylistVisibility,
  updateSelectedListId,
} from 'src/store/playlistModalSlice';

type Props = NativeStackScreenProps<
  PublicProfileTabParamList,
  'PublicPlaylist'
>;

const PublicPlaylistTab = ({route}: Props) => {
  const {data, isLoading} = useFetchPublicPlaylist(route.params.profileId);
  const dispatch = useDispatch();

  if (isLoading) return <AudioListLoadingUI />;

  const handleOnListPress = (playlist: Playlist) => {
    dispatch(updateSelectedListId(playlist.id));
    dispatch(updatePlaylistVisibility(true));
  };

  return (
    <ScrollView>
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

export default PublicPlaylistTab;

const styles = StyleSheet.create({});
