import AudioListItem from '@ui/AudioListItem';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useFetchPublicUploads} from 'src/hooks/query';
import {useAudioController} from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/playerSlice';
import EmptyRecords from './EmptyRecords';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PublicProfileTabParamList} from 'src/@types/navigation';

type Props = NativeStackScreenProps<PublicProfileTabParamList, 'PublicUploads'>;

const PublicUploadsTab = ({route}: Props) => {
  const {data, isLoading} = useFetchPublicUploads(route.params.profileId);
  const {onGoingAudio} = useSelector(getPlayerState);
  const {onAudioPress} = useAudioController();

  if (isLoading) return <AudioListLoadingUI />;

  if (!data?.length) return <EmptyRecords title="There is no audio!" />;

  return (
    <ScrollView>
      {data &&
        data.map((item, i) => (
          <AudioListItem
            key={i}
            onPress={() => onAudioPress(item, data)}
            audio={item}
            isPlaying={onGoingAudio?.id === item.id}
          />
        ))}
    </ScrollView>
  );
};

export default PublicUploadsTab;

const styles = StyleSheet.create({});
