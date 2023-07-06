import {StyleSheet} from 'react-native';
import {PropsWithChildren, useEffect} from 'react';
import {Modal} from 'react-native';
import colors from '@utils/colors';
import {Pressable} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {Dimensions} from 'react-native';

interface Props extends PropsWithChildren {
  visible: boolean;
  animation?: boolean;
  onRequestClose: () => void;
}

const {height} = Dimensions.get('window');
const modalHeight = height - 150;

const AppModal = ({
  children,
  visible = false,
  animation,
  onRequestClose,
}: Props) => {
  const translateY = useSharedValue(modalHeight);

  const translateYStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}] as any,
  }));

  const handleClose = () => {
    translateY.value = modalHeight;
    onRequestClose();
  };

  const gesture = Gesture.Pan()
    .onUpdate(e => {
      if (e.translationY <= 0) return;

      translateY.value = e.translationY;
    })
    .onFinalize(e => {
      if (e.translationY <= modalHeight / 2) translateY.value = 0;
      else {
        translateY.value = modalHeight;
        runOnJS(handleClose)();
      }
    });

  useEffect(() => {
    if (visible)
      translateY.value = withTiming(0, {duration: animation ? 200 : 0});
  }, [visible, animation]);

  return (
    <Modal visible={visible} onRequestClose={handleClose} transparent>
      <GestureHandlerRootView style={{flex: 1}}>
        <Pressable onResponderEnd={handleClose} style={styles.backdrop} />

        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.modal, translateYStyle]}>
            {children}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default AppModal;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.INACTIVE_CONTRAST,
  },
  modal: {
    backgroundColor: colors.PRIMARY,
    height: modalHeight,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    overflow: 'hidden',
  },
});
