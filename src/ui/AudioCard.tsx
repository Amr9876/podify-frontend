import colors from '@utils/colors';
import {
  TouchableOpacity,
  Image,
  Text,
  View,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import PlayAnimation from './PlayAnimation';
import {StyleProp} from 'react-native';
import {useAudioController} from 'src/hooks/useAudioController';

interface Props {
  title: string;
  poster?: string;
  playing?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  onLongPress?: () => void;
}

const AudioCard = ({
  title,
  poster,
  playing = false,
  containerStyle,
  onPress,
  onLongPress,
}: Props) => {
  const {isPlaying} = useAudioController();

  const source = poster ? {uri: poster} : require('../assets/music.png');

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.container, containerStyle]}>
      <View style={styles.posterContainer}>
        <Image source={source} style={styles.poster} />
        {isPlaying && <PlayAnimation visible={playing} />}
      </View>
      <Text numberOfLines={2} style={styles.title}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {width: 100, marginRight: 15},
  poster: {width: '100%', height: '100%'},
  posterContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 7,
    overflow: 'hidden',
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: '500',
    fontSize: 16,
    marginTop: 5,
  },
});

export default AudioCard;
