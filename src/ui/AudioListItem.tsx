import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import colors from '@utils/colors';
import {AudioData} from 'src/@types/audio';
import PlayAnimation from './PlayAnimation';

interface Props {
  audio: AudioData;
  isPlaying?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
}

const AudioListItem = ({
  audio,
  isPlaying = false,
  onPress,
  onLongPress,
}: Props) => {
  const getSource = (uri?: string) =>
    uri ? {uri} : require('../assets/music_small.png');

  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={onPress}
      onLongPress={onLongPress}>
      <View>
        <Image source={getSource(audio.poster)} style={styles.poster} />
        <PlayAnimation visible={isPlaying} />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {audio.title}
        </Text>
        <Text style={styles.owner} numberOfLines={1}>
          {audio.owner.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AudioListItem;

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    padding: 5,
  },
  poster: {
    width: 50,
    height: 50,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: '700',
  },
  owner: {
    color: colors.SECONDARY,
    fontWeight: '700',
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderBottomColor: '#111',
    marginBottom: 15,
    borderRadius: 5,
    overflow: 'hidden',
  },
});
