import colors from '@utils/colors';
import {Pressable, StyleSheet} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
  color?: string;
  playing?: boolean;
  onPress?: () => void;
}

const PlayPauseBtn = ({color = colors.CONTRAST, playing, onPress}: Props) => {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      {playing ? (
        <AntDesign size={16} color={color} name="pause" />
      ) : (
        <AntDesign size={16} color={color} name="caretright" />
      )}
    </Pressable>
  );
};

export default PlayPauseBtn;

const styles = StyleSheet.create({
  button: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
