import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useFetchRecommendedAudios} from 'src/hooks/query';
import colors from '@utils/colors';
import GridView from '@ui/GridView';
import PulseAnimationContainer from '@ui/PulseAnimationContainer';
import {AudioData} from 'src/@types/audio';
import AudioCard from '@ui/AudioCard';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/playerSlice';

interface Props {
  onAudioPress: (item: AudioData, data: AudioData[]) => void;
  onAudioLongPress: (item: AudioData, data: AudioData[]) => void;
}

const dummyData = new Array(6).fill('');

const RecommendedAudios = ({onAudioPress, onAudioLongPress}: Props) => {
  const {data, isLoading} = useFetchRecommendedAudios();
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

          <GridView
            data={dummyData || []}
            col={3}
            renderItem={_ => (
              <View
                style={{
                  width: '100%',
                  aspectRatio: 1,
                  backgroundColor: colors.INACTIVE_CONTRAST,
                  borderRadius: 5,
                }}
              />
            )}
          />
        </View>
      </PulseAnimationContainer>
    );

  return (
    <View>
      <Text style={styles.title}>You may like this</Text>
      <GridView
        data={data || []}
        col={3}
        renderItem={item => (
          <AudioCard
            title={item.title}
            poster={item.poster}
            containerStyle={{width: '100%'}}
            playing={onGoingAudio?.id === item.id}
            onPress={() => onAudioPress(item, data!)}
            onLongPress={() => onAudioLongPress(item, data!)}
          />
        )}
      />
    </View>
  );
};

export default RecommendedAudios;

const styles = StyleSheet.create({
  title: {
    color: colors.CONTRAST,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});
