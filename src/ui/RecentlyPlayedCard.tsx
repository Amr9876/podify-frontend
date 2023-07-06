import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Pressable} from 'react-native';
import colors from '@utils/colors';
import PlayAnimation from './PlayAnimation';
import {useAudioController} from 'src/hooks/useAudioController';

interface Props {
  title: string;
  poster?: string;
  isPlaying?: boolean;
  onPress: () => void;
}

const RecentlyPlayedCard = ({
  title,
  isPlaying = false,
  poster,
  onPress,
}: Props) => {
  const {isPlaying: playing} = useAudioController();

  const source = poster ? {uri: poster} : require('../assets/music.png');

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View>
        <Image source={source} style={styles.poster} />
        {playing && <PlayAnimation visible={isPlaying} />}
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

export default RecentlyPlayedCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.OVERLAY,
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  poster: {
    width: 50,
    height: 50,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: '500',
  },
  titleContainer: {
    flex: 1,
    padding: 5,
  },
});
