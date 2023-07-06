import AudioCard from '@ui/AudioCard';
import PulseAnimationContainer from '@ui/PulseAnimationContainer';
import colors from '@utils/colors';
import {View, Text, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {AudioData} from 'src/@types/audio';
import {useFetchLatestAudios} from 'src/hooks/query';
import {getPlayerState} from 'src/store/playerSlice';

interface Props {
  onAudioPress: (item: AudioData, data: AudioData[]) => void;
  onAudioLongPress: (item: AudioData, data: AudioData[]) => void;
}

const dummyData = new Array(4).fill('');

const LatestUploads = ({onAudioPress, onAudioLongPress}: Props) => {
  const {data, isLoading} = useFetchLatestAudios();
  const {onGoingAudio} = useSelector(getPlayerState);

  if (isLoading)
    return (
      <PulseAnimationContainer>
        <View>
          <View
            style={{
              height: 20,
              width: 150,
              backgroundColor: colors.INACTIVE_CONTRAST,
              marginBottom: 15,
              borderRadius: 5,
            }}
          />
          <View style={{flexDirection: 'row'}}>
            {dummyData.map((_, i) => (
              <View
                key={i}
                style={{
                  height: 100,
                  width: 100,
                  backgroundColor: colors.INACTIVE_CONTRAST,
                  marginRight: 15,
                  borderRadius: 5,
                }}
              />
            ))}
          </View>
        </View>
      </PulseAnimationContainer>
    );

  return (
    <View>
      <Text
        style={{
          color: colors.CONTRAST,
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 15,
        }}>
        Latest Uploads
      </Text>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal>
        {data?.map((item, i) => (
          <AudioCard
            key={i}
            title={item.title}
            poster={item.poster!}
            playing={onGoingAudio?.id === item.id}
            onPress={() => onAudioPress(item, data)}
            onLongPress={() => onAudioLongPress(item, data)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default LatestUploads;
