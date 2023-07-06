import colors from '@utils/colors';
import {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  delay: number;
  height: number;
}

const AnimatedStroke = ({delay, height}: Props) => {
  const sharedValue = useSharedValue(5);

  const heightStyle = useAnimatedStyle(() => ({
    height: sharedValue.value,
  }));

  useEffect(() => {
    sharedValue.value = withDelay(
      delay,
      withRepeat(withTiming(height), -1, true),
    );
  }, []);

  return <Animated.View style={[styles.stroke, heightStyle]} />;
};

export default AnimatedStroke;

const styles = StyleSheet.create({
  stroke: {
    width: 4,
    backgroundColor: colors.CONTRAST,
    marginLeft: 7,
  },
});
