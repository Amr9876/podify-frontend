import {RefreshControl, ScrollView, StyleSheet} from 'react-native';
import {useFetchFavorite} from 'src/hooks/query';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from './EmptyRecords';
import AudioListItem from '@ui/AudioListItem';
import {useAudioController} from 'src/hooks/useAudioController';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/playerSlice';
import colors from '@utils/colors';
import {useQueryClient} from 'react-query';

const FavoriteTab = () => {
  const {onAudioPress} = useAudioController();
  const {onGoingAudio} = useSelector(getPlayerState);
  const {data, isLoading, isFetching} = useFetchFavorite();
  const queryClient = useQueryClient();

  if (isLoading) return <AudioListLoadingUI />;

  const handleOnRefresh = async () => {
    await queryClient.invalidateQueries({queryKey: ['favorite']});
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={handleOnRefresh}
          tintColor={colors.CONTRAST}
        />
      }
      style={styles.container}>
      {!data?.length && <EmptyRecords title="There is no audio!" />}

      {data &&
        data.map((item, i) => (
          <AudioListItem
            key={i}
            isPlaying={onGoingAudio?.id === item.id}
            onPress={() => onAudioPress(item, data)}
            audio={item}
          />
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default FavoriteTab;
