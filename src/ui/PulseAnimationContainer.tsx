import {PropsWithChildren, useEffect} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface Props extends PropsWithChildren {}

const PulseAnimationContainer = ({children}: Props) => {
  const opacitySharedValue = useSharedValue(1);

  const opacity = useAnimatedStyle(() => ({
    opacity: opacitySharedValue.value,
  }));

  useEffect(() => {
    opacitySharedValue.value = withRepeat(
      withTiming(0.3, {duration: 1000}),
      -1,
      true,
    );
  }, []);

  return <Animated.View style={opacity}>{children}</Animated.View>;
};

export default PulseAnimationContainer;
