import {StyleSheet} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import colors from '@utils/colors';
import {useEffect} from 'react';

interface Props {
  color?: string;
}

const Loader = ({color = colors.CONTRAST}: Props) => {
  const initialRotation = useSharedValue(0);

  const transform = useAnimatedStyle(
    () =>
      ({
        transform: [{rotate: `${initialRotation.value}deg`}],
      } as any),
  );

  useEffect(() => {
    initialRotation.value = withRepeat(withTiming(360), -1);
  });

  return (
    <Animated.View style={transform}>
      <AntDesign name="loading1" size={24} color={color} />
    </Animated.View>
  );
};

export default Loader;

const styles = StyleSheet.create({});
