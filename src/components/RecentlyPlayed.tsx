import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useFetchRecentlyPlayed} from 'src/hooks/query';
import colors from '@utils/colors';
import RecentlyPlayedCard from '@ui/RecentlyPlayedCard';
import EmptyRecords from './profile/EmptyRecords';
import PulseAnimationContainer from '@ui/PulseAnimationContainer';
import GridView from '@ui/GridView';
import {useAudioController} from 'src/hooks/useAudioController';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/playerSlice';

const dummyData = new Array(4).fill('');

const RecentlyPlayed = () => {
  const {data = [], isLoading} = useFetchRecentlyPlayed();
  const {onAudioPress} = useAudioController();
  const {onGoingAudio} = useSelector(getPlayerState);

  if (isLoading)
    return (
      <PulseAnimationContainer>
        <View style={styles.dummyTitleView} />

        <GridView
          data={dummyData}
          renderItem={() => (
            <View
              style={{
                height: 50,
                backgroundColor: colors.INACTIVE_CONTRAST,
                borderRadius: 5,
                marginBottom: 10,
              }}
            />
          )}
        />
      </PulseAnimationContainer>
    );

  if (!data.length) return;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recently Played</Text>
      <GridView
        data={data}
        renderItem={item => (
          <View key={item.id} style={styles.listStyle}>
            <RecentlyPlayedCard
              title={item.title}
              poster={item.poster}
              onPress={() => onAudioPress(item, data)}
              isPlaying={onGoingAudio?.id === item.id}
            />
          </View>
        )}
      />
    </View>
  );
};

export default RecentlyPlayed;

const styles = StyleSheet.create({
  container: {},
  title: {
    color: colors.CONTRAST,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  dummyTitleView: {
    height: 20,
    width: 150,
    backgroundColor: colors.INACTIVE_CONTRAST,
    marginBottom: 15,
    borderRadius: 5,
  },
  listStyle: {
    marginBottom: 10,
  },
});
