import colors from '@utils/colors';
import {useState} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  activeRate: string;
  onPress: (rate: number) => void;
}

interface SelectorProps {
  value: string;
  active: boolean;
  onPress?: () => void;
}

const speedRates = ['0.25', '0.5', '0.75', '1', '1.25', '1.5', '1.75', '2'];
const selectorSize = 40;

const Selector = ({value, active, onPress}: SelectorProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.selectorContainer,
        active && {backgroundColor: colors.SECONDARY},
      ]}>
      <Text style={styles.selectorText}>{value}</Text>
    </Pressable>
  );
};

const PlaybackRateSelector = ({containerStyle, onPress, activeRate}: Props) => {
  const [showButton, setShowButton] = useState(true);
  const width = useSharedValue(0);

  const widthStyle = useAnimatedStyle(() => ({width: width.value}));

  const handlePress = () => {
    setShowButton(false);
    width.value = withTiming(selectorSize * speedRates.length, {
      duration: 70,
    });
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {showButton && (
        <Pressable onPress={handlePress}>
          <FontAwesome5 name="running" color={colors.CONTRAST} size={24} />
        </Pressable>
      )}

      <Animated.View style={[styles.buttons, widthStyle]}>
        {speedRates.map(item => (
          <Selector
            key={item}
            active={item === activeRate}
            onPress={() => onPress && onPress(+item)}
            value={item}
          />
        ))}
      </Animated.View>
    </View>
  );
};

export default PlaybackRateSelector;

const styles = StyleSheet.create({
  container: {},
  buttons: {
    flexDirection: 'row',
    backgroundColor: colors.OVERLAY,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  selectorContainer: {
    width: selectorSize,
    height: selectorSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorText: {
    color: colors.CONTRAST,
  },
});
